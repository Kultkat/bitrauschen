from django.db import models

class Article(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    main_image = models.CharField(max_length=300, blank=True)
    extra_images = models.JSONField(blank=True, null=True)  # list of images
    video_url = models.URLField(blank=True, null=True)
    external_link = models.URLField(blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)

    def __str__(self):
        return self.title
from django.db import models
