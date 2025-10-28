from django.db import models

class Artwork(models.Model):
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='artworks/')  # store uploaded images
    description = models.TextField(blank=True)
    latitude = models.FloatField(null=True, blank=True)  # optional, for map positions
    longitude = models.FloatField(null=True, blank=True)

    def __str__(self):
        return self.title
