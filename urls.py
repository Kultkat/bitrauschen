from django.contrib import admin
from django.urls import path, re_path, include
from artworks import views as artworks_views
from artworks.home_views import home_view
from artworks import api_views
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve

urlpatterns = [
    # Homepage - main Bitrauschen site
    path('', home_view, name='home'),
    
    # Django admin panel
    path('admin/', admin.site.urls),

    # Map view for displaying artworks on the map
    path('map/', artworks_views.map_view, name='map'),
    path('api/artworks.geojson', artworks_views.geojson_api, name='geojson_api'),
    
    # Tastypie-compatible REST API for frontend
    path('api/v1/item/', api_views.item_api, name='item_api'),
    path('api/v1/item/<int:item_id>/', api_views.item_detail_api, name='item_detail_api'),
    path('api/v1/category/', api_views.category_api, name='category_api'),
    path('api/v1/atlas/', api_views.atlas_api, name='atlas_api'),
    path('api/v1/menu/', api_views.menu_api, name='menu_api'),
    path('api/v1/menu-content/', api_views.menu_content_api, name='menu_content_api'),
    path('api/v1/menu-content/<str:section_key>/', api_views.menu_content_api, name='menu_content_detail'),
    
    # Serve media files via FTP proxy for cms_archive
    re_path(r'^media/cms_archive/(?P<path>.*)$', serve, {'document_root': '/opt/bitrauschen/media/cms_archive/'}),
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': '/opt/bitrauschen/media/'}),
    re_path(r'^static/(?P<path>.*)$', serve, {'document_root': '/opt/bitrauschen/static/'}),
]

# Serve media & static files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
