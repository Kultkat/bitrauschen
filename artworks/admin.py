from django.contrib import admin
from django.utils.html import format_html
from .cms_models import CmsItem
from .menu_models import MenuItem, SiteSetting

@admin.register(CmsItem)
class CmsItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'thumbnail_preview', 'title_en', 'title_de', 'title_nl', 'created', 'media_count')
    list_display_links = ('id', 'thumbnail_preview', 'title_en')
    search_fields = ('title_en', 'title_de', 'title_nl', 'content_en', 'content_de', 'content_nl')
    list_filter = ()
    # date_hierarchy disabled due to MySQL timezone issues
    
    fieldsets = (
        ('Titles', {
            'fields': ('title_en', 'title_de', 'title_nl')
        }),
        ('Slugs', {
            'fields': ('slug_en', 'slug_de', 'slug_nl'),
            'classes': ('collapse',)
        }),
        ('Content', {
            'fields': ('content_en', 'content_de', 'content_nl')
        }),
        ('Media Files', {
            'fields': tuple(f'mediafile{i}' for i in range(1, 11)),
            'classes': ('collapse',)
        }),
        ('Links', {
            'fields': ('link_website', 'link_youtube') + tuple(f'link_website{i}' for i in range(1, 11)),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created', 'updated_at', 'max_zoom_level', 'min_zoom_level'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('created', 'updated_at')
    
    def thumbnail_preview(self, obj):
        """Display thumbnail in admin list"""
        thumb = obj.get_thumbnail()
        if thumb:
            # Handle both relative and absolute paths
            if thumb.startswith('http'):
                url = thumb
            else:
                url = f'/media/cms_archive/{thumb}'
            return format_html('<img src="{}" style="max-height: 50px; max-width: 100px;" />', url)
        return '-'
    thumbnail_preview.short_description = 'Thumbnail'
    
    def media_count(self, obj):
        """Count how many media files this item has"""
        count = sum(1 for i in range(1, 11) if getattr(obj, f'mediafile{i}', None))
        return f"{count} files"
    media_count.short_description = 'Media'
    
    def get_queryset(self, request):
        """Use the local_artworks database"""
        return super().get_queryset(request).using('local_artworks')

@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'title', 'url', 'is_active', 'updated_at')
    list_display_links = ('title',)
    list_editable = ('order', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('title', 'url')
    ordering = ('order', 'title')

@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
    list_display = ('key', 'value_preview', 'updated_at')
    search_fields = ('key', 'value', 'description')
    
    def value_preview(self, obj):
        return obj.value[:100] + '...' if len(obj.value) > 100 else obj.value
    value_preview.short_description = 'Value'

# Import MenuContent
from .menu_models import MenuContent

@admin.register(MenuContent)
class MenuContentAdmin(admin.ModelAdmin):
    list_display = ('section_key', 'title', 'is_active', 'order', 'updated_at')
    list_editable = ('is_active', 'order')
    search_fields = ('section_key', 'title', 'content_html')
    list_filter = ('is_active',)
    fieldsets = (
        ('Section Information', {
            'fields': ('section_key', 'title', 'order', 'is_active')
        }),
        ('Content', {
            'fields': ('content_html',),
            'description': 'You can use HTML tags for formatting'
        }),
    )

# Import category models
from .cms_models import CmsCategory, CmsItemCategory

class CmsItemCategoryInline(admin.TabularInline):
    model = CmsItemCategory
    extra = 1
    verbose_name = "Category"
    verbose_name_plural = "Categories"

@admin.register(CmsCategory)
class CmsCategoryAdmin(admin.ModelAdmin):
    list_display = ('name_en', 'name_de', 'name_nl', 'slug', 'is_active', 'order_position')
    list_editable = ('is_active', 'order_position')
    search_fields = ('name_en', 'name_de', 'name_nl', 'slug')
    list_filter = ('is_active',)
    prepopulated_fields = {'slug': ('name_en',)}

# Add category inline to CmsItemAdmin
CmsItemAdmin.inlines = [CmsItemCategoryInline]
