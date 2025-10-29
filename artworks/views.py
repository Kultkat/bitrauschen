from django.shortcuts import render
from .models import Artwork
from django.core.serializers import serialize

def artwork_map(request):
    """
    View to render the artwork map page.
    Serializes all artworks to JSON and passes them to the template.
    """
    # Query all artworks
    artworks = Artwork.objects.all()

    # Serialize queryset to JSON, including only specific fields
    artworks_json = serialize('json', artworks, fields=('title', 'latitude', 'longitude', 'description'))

    # Render the template with artworks JSON
    return render(request, 'artworks/artwork_map.html', {
        'artworks': artworks_json
    })
