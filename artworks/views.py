from django.shortcuts import render
from django.http import JsonResponse
from django.db import connections

def map_view(request):
    """Render the artwork map page"""
    return render(request, 'artworks/map.html')

def geojson_api(request):
    """Generate GeoJSON from local MySQL database"""
    try:
        # Use local_artworks database connection
        with connections['local_artworks'].cursor() as cursor:
            cursor.execute("""
                SELECT 
                    id,
                    title_en,
                    title_nl,
                    title_de,
                    content_en,
                    mediafile1,
                    mediafile_caption_en1,
                    link_website,
                    created,
                    min_zoom_level,
                    max_zoom_level
                FROM cms_item
                WHERE title_en IS NOT NULL
                ORDER BY id
            """)
            
            rows = cursor.fetchall()
            
            # Build GeoJSON FeatureCollection
            features = []
            
            for row in rows:
                artwork_id, title_en, title_nl, title_de, content_en, mediafile1, caption, website, created, min_zoom, max_zoom = row
                
                # Use artwork ID for coordinate spreading (matches PHP logic)
                col = (artwork_id % 10) * 0.01
                row_offset = (artwork_id // 10) * 0.01
                
                lon = 6.0 + col
                lat = 50.8 + row_offset
                
                # Build image URL if mediafile exists
                image_url = None
                if mediafile1:
                    image_url = f"https://kasparkoenig.com/media/cms_archive/image/{mediafile1}"
                
                feature = {
                    "type": "Feature",
                    "id": artwork_id,
                    "geometry": {
                        "type": "Point",
                        "coordinates": [lon, lat]
                    },
                    "properties": {
                        "id": artwork_id,
                        "title": title_en or title_nl or title_de or "Untitled",
                        "title_en": title_en or "",
                        "title_de": title_de or "",
                        "title_nl": title_nl or "",
                        "content": content_en or "",
                        "image": image_url,
                        "caption": caption or "",
                        "link": website or "",
                        "created": str(created) if created else "",
                        "zoom_min": float(min_zoom) if min_zoom else 0,
                        "zoom_max": float(max_zoom) if max_zoom else 0
                    }
                }
                
                features.append(feature)
            
            geojson = {
                "type": "FeatureCollection",
                "metadata": {
                    "count": len(features),
                    "source": "Bitrauschen Local Database"
                },
                "features": features
            }
            
            return JsonResponse(geojson, safe=False)
            
    except Exception as e:
        return JsonResponse({
            "error": str(e),
            "type": "FeatureCollection",
            "features": []
        }, status=500)
