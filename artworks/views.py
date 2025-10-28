# artworks/views.py
from django.shortcuts import render
from .models import Artwork

def artwork_map(request):
    artworks = list(Artwork.objects.values('title', 'latitude', 'longitude'))
    return render(request, 'artworks/artwork_map.html', {'artworks': artworks})
# Create your views here.
