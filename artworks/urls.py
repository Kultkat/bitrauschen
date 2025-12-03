# artworks/urls.py
from django.urls import path
from . import views

from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('artworks/', include('artworks.urls')),
]

urlpatterns = [
    path('', views.artwork_map, name='artwork_map'),
]

