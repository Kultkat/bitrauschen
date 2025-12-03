from django.db import models

class CmsItem(models.Model):
    title_en = models.CharField(max_length=200, blank=True, null=True)
    title_nl = models.CharField(max_length=200, blank=True, null=True)
    title_de = models.CharField(max_length=200, blank=True, null=True)
    
    slug_en = models.CharField(max_length=150, blank=True, null=True)
    slug_nl = models.CharField(max_length=150, blank=True, null=True)
    slug_de = models.CharField(max_length=150, blank=True, null=True)
    
    created = models.DateTimeField()
    updated_at = models.DateTimeField()
    
    # Media files (up to 10)
    mediafile1 = models.CharField(max_length=100, blank=True, null=True)
    mediafile2 = models.CharField(max_length=100, blank=True, null=True)
    mediafile3 = models.CharField(max_length=100, blank=True, null=True)
    mediafile4 = models.CharField(max_length=100, blank=True, null=True)
    mediafile5 = models.CharField(max_length=100, blank=True, null=True)
    mediafile6 = models.CharField(max_length=100, blank=True, null=True)
    mediafile7 = models.CharField(max_length=100, blank=True, null=True)
    mediafile8 = models.CharField(max_length=100, blank=True, null=True)
    mediafile9 = models.CharField(max_length=100, blank=True, null=True)
    mediafile10 = models.CharField(max_length=100, blank=True, null=True)
    
    # Links
    link_website = models.TextField(blank=True, null=True)
    link_youtube = models.TextField(blank=True, null=True)
    link_website1 = models.TextField(blank=True, null=True)
    link_website2 = models.TextField(blank=True, null=True)
    link_website3 = models.TextField(blank=True, null=True)
    link_website4 = models.TextField(blank=True, null=True)
    link_website5 = models.TextField(blank=True, null=True)
    link_website6 = models.TextField(blank=True, null=True)
    link_website7 = models.TextField(blank=True, null=True)
    link_website8 = models.TextField(blank=True, null=True)
    link_website9 = models.TextField(blank=True, null=True)
    link_website10 = models.TextField(blank=True, null=True)
    
    # Content in 3 languages
    content_de = models.TextField(blank=True, null=True)
    content_en = models.TextField(blank=True, null=True)
    content_nl = models.TextField(blank=True, null=True)
    
    # Media captions (German)
    mediafile_caption_de1 = models.TextField(blank=True, null=True)
    mediafile_caption_de2 = models.TextField(blank=True, null=True)
    mediafile_caption_de3 = models.TextField(blank=True, null=True)
    mediafile_caption_de4 = models.TextField(blank=True, null=True)
    mediafile_caption_de5 = models.TextField(blank=True, null=True)
    mediafile_caption_de6 = models.TextField(blank=True, null=True)
    mediafile_caption_de7 = models.TextField(blank=True, null=True)
    mediafile_caption_de8 = models.TextField(blank=True, null=True)
    mediafile_caption_de9 = models.TextField(blank=True, null=True)
    mediafile_caption_de10 = models.TextField(blank=True, null=True)
    
    # Media captions (English)
    mediafile_caption_en1 = models.TextField(blank=True, null=True)
    mediafile_caption_en2 = models.TextField(blank=True, null=True)
    mediafile_caption_en3 = models.TextField(blank=True, null=True)
    mediafile_caption_en4 = models.TextField(blank=True, null=True)
    mediafile_caption_en5 = models.TextField(blank=True, null=True)
    mediafile_caption_en6 = models.TextField(blank=True, null=True)
    mediafile_caption_en7 = models.TextField(blank=True, null=True)
    mediafile_caption_en8 = models.TextField(blank=True, null=True)
    mediafile_caption_en9 = models.TextField(blank=True, null=True)
    mediafile_caption_en10 = models.TextField(blank=True, null=True)
    
    # Media captions (Dutch)
    mediafile_caption_nl1 = models.TextField(blank=True, null=True)
    mediafile_caption_nl2 = models.TextField(blank=True, null=True)
    mediafile_caption_nl3 = models.TextField(blank=True, null=True)
    mediafile_caption_nl4 = models.TextField(blank=True, null=True)
    mediafile_caption_nl5 = models.TextField(blank=True, null=True)
    mediafile_caption_nl6 = models.TextField(blank=True, null=True)
    mediafile_caption_nl7 = models.TextField(blank=True, null=True)
    mediafile_caption_nl8 = models.TextField(blank=True, null=True)
    mediafile_caption_nl9 = models.TextField(blank=True, null=True)
    mediafile_caption_nl10 = models.TextField(blank=True, null=True)
    
    # Aspect ratios
    mediafile_aspect_ratio1 = models.FloatField(default=0, blank=True, null=True)
    mediafile_aspect_ratio2 = models.FloatField(default=0, blank=True, null=True)
    mediafile_aspect_ratio3 = models.FloatField(default=0, blank=True, null=True)
    mediafile_aspect_ratio4 = models.FloatField(default=0, blank=True, null=True)
    mediafile_aspect_ratio5 = models.FloatField(default=0, blank=True, null=True)
    mediafile_aspect_ratio6 = models.FloatField(default=0, blank=True, null=True)
    mediafile_aspect_ratio7 = models.FloatField(default=0, blank=True, null=True)
    mediafile_aspect_ratio8 = models.FloatField(default=0, blank=True, null=True)
    mediafile_aspect_ratio9 = models.FloatField(default=0, blank=True, null=True)
    mediafile_aspect_ratio10 = models.FloatField(default=0, blank=True, null=True)
    
    # Zoom levels
    max_zoom_level = models.FloatField(default=0, blank=True, null=True)
    min_zoom_level = models.FloatField(default=0, blank=True, null=True)
    
    class Meta:
        db_table = 'cms_item'
        managed = False  # Don't let Django manage this table
    
    def __str__(self):
        return self.title_en or self.title_de or self.title_nl or f"Item {self.id}"
    
    def get_thumbnail(self):
        """Get the first available media file as thumbnail"""
        for i in range(1, 11):
            media = getattr(self, f'mediafile{i}', None)
            if media:
                return media
        return None

class CmsCategory(models.Model):
    name_en = models.CharField(max_length=100)
    name_de = models.CharField(max_length=100, blank=True, null=True)
    name_nl = models.CharField(max_length=100, blank=True, null=True)
    slug = models.CharField(max_length=100, unique=True)
    is_active = models.BooleanField(default=True)
    order_position = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'cms_category'
        ordering = ['order_position', 'name_en']
    
    def __str__(self):
        return self.name_en

class CmsItemCategory(models.Model):
    item = models.ForeignKey(CmsItem, on_delete=models.CASCADE, db_column='item_id')
    category = models.ForeignKey(CmsCategory, on_delete=models.CASCADE, db_column='category_id')
    
    class Meta:
        db_table = 'cms_item_category'
        unique_together = ['item', 'category']
    
    def __str__(self):
        return f"{self.item.title_en} - {self.category.name_en}"
