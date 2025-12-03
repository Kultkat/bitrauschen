from django.db import models

class MenuItem(models.Model):
    """Menu items for the hamburger menu"""
    title = models.CharField(max_length=100)
    url = models.CharField(max_length=500, help_text="URL or anchor like #contact")
    order = models.IntegerField(default=0, help_text="Display order (lower numbers first)")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'title']
        db_table = 'menu_item'
    
    def __str__(self):
        return f"{self.order}. {self.title}"


class SiteSetting(models.Model):
    """General site settings"""
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField()
    description = models.TextField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'site_setting'
    
    def __str__(self):
        return f"{self.key}: {self.value[:50]}"

class MenuContent(models.Model):
    """
    Editable content for menu sections (Contact, Impressum, etc.)
    """
    section_key = models.CharField(max_length=50, unique=True, help_text="Unique identifier (e.g., 'contact', 'impressum')")
    title = models.CharField(max_length=200, help_text="Section title")
    content_html = models.TextField(help_text="HTML content for this section")
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0, help_text="Display order")
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'menu_content'
        ordering = ['order', 'title']
    
    def __str__(self):
        return f"{self.title} ({self.section_key})"
