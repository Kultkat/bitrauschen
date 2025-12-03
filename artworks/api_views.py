from django.http import JsonResponse
from django.db import connections

def item_api(request):
    """API endpoint for items/artworks in Tastypie format"""
    try:
        with connections['local_artworks'].cursor() as cursor:
            cursor.execute("""
                SELECT 
                    id,
                    title_en,
                    title_nl,
                    title_de,
                    slug_en,
                    content_en,
                    content_de,
                    content_nl,
                    mediafile1,
                    created,
                    link_website,
                    max_zoom_level,
                    min_zoom_level
                FROM cms_item
                ORDER BY created DESC
                LIMIT 5000
            """)
            
            rows = cursor.fetchall()
            objects = []
            
            for row in rows:
                (id, title_en, title_nl, title_de, slug_en, content_en, content_de, 
                 content_nl, mediafile1, created, link_website, max_zoom, min_zoom) = row
                
                # Use grid coordinates like we did for GeoJSON
                col = (id % 10) * 0.01
                row_offset = (id // 10) * 0.01
                lng = 6.0 + col
                lat = 50.8 + row_offset
                
                # Build full media URL
                media_url = ""
                if mediafile1:
                    media_url = f"https://kasparkoenig.com/media/cms_archive/{mediafile1}"
                
                obj = {
                    "id": id,
                    "resource_uri": f"/api/v1/item/{id}/",
                    "title_en": title_en or "",
                    "title_nl": title_nl or "",
                    "title_de": title_de or "",
                    "slug_en": slug_en or "",
                    "slug_nl": slug_en or "",
                    "slug_de": slug_en or "",
                    "content_en": content_en or "",
                    "content_de": content_de or "",
                    "content_nl": content_nl or "",
                    "image": media_url,
                    "mediafile1": mediafile1 or "",
                    "media_url": media_url,
                    "created": str(created) if created else "",
                    "link_website": link_website or "",
                    "latitude": lat,
                    "longitude": lng,
                    "x": lng,
                    "y": lat,
                    "zoom_min": float(min_zoom) if min_zoom else 0,
                    "zoom_max": float(max_zoom) if max_zoom else 22,
                    "categories": []  # Will be populated when we add categories
                }
                objects.append(obj)
            
            response = {
                "meta": {
                    "limit": 5000,
                    "offset": 0,
                    "total_count": len(objects)
                },
                "objects": objects
            }
            
            return JsonResponse(response, safe=False)
            
    except Exception as e:
        return JsonResponse({
            "error": str(e),
            "meta": {"limit": 5000, "offset": 0, "total_count": 0},
            "objects": []
        }, status=500)


def category_api(request):
    """API endpoint for categories in Tastypie format"""
    with connections['local_artworks'].cursor() as cursor:
        cursor.execute("""
            SELECT id, name_en, name_de, name_nl, slug
            FROM cms_category
            WHERE is_active = 1
            ORDER BY order_position, name_en
        """)
        rows = cursor.fetchall()
        categories = [{
            "id": row[0],
            "resource_uri": f"/api/v1/category/{row[0]}/",
            "name_en": row[1],
            "name_de": row[2],
            "name_nl": row[3],
            "slug": row[4]
        } for row in rows]
    
    response = {
        "meta": {
            "limit": 5000,
            "offset": 0,
            "total_count": len(categories)
        },
        "objects": categories
    }
    
    return JsonResponse(response, safe=False)


def atlas_api(request):
    """API endpoint for atlas/sprite configuration"""
    objects = [
        {
            "id": 1,
            "resource_uri": "/api/v1/atlas/1/",
            "pixel_ratio": 1,
            "sprite_width": 30,
            "atlas_map_url": "/static/app/atlas_30_1.json"
        },
        {
            "id": 2,
            "resource_uri": "/api/v1/atlas/2/",
            "pixel_ratio": 1,
            "sprite_width": 60,
            "atlas_map_url": "/static/app/atlas_60_1.json"
        }
    ]
    
    response = {
        "meta": {
            "limit": 5000,
            "offset": 0,
            "total_count": len(objects)
        },
        "objects": objects
    }
    
    return JsonResponse(response, safe=False)


def item_detail_api(request, item_id):
    """API endpoint for single item detail"""
    try:
        with connections['local_artworks'].cursor() as cursor:
            cursor.execute("""
                SELECT 
                    id, title_en, title_nl, title_de, slug_en,
                    content_en, content_de, content_nl,
                    mediafile1, mediafile2, mediafile3, mediafile4, mediafile5,
                    created, link_website, max_zoom_level, min_zoom_level
                FROM cms_item
                WHERE id = %s
            """, [item_id])
            
            row = cursor.fetchone()
            if not row:
                return JsonResponse({"error": "Item not found"}, status=404)
            
            (id, title_en, title_nl, title_de, slug_en, content_en, content_de, content_nl,
             media1, media2, media3, media4, media5,
             created, link_website, max_zoom, min_zoom) = row
            
            col = (id % 10) * 0.01
            row_offset = (id // 10) * 0.01
            lng = 6.0 + col
            lat = 50.8 + row_offset
            
            obj = {
                "id": id,
                "resource_uri": f"/api/v1/item/{id}/",
                "title_en": title_en or "",
                "title_nl": title_nl or "",
                "title_de": title_de or "",
                "slug_en": slug_en or "",
                "content_en": content_en or "",
                "content_de": content_de or "",
                "content_nl": content_nl or "",
                "mediafile1": media1 or "",
                "mediafile2": media2 or "",
                "mediafile3": media3 or "",
                "mediafile4": media4 or "",
                "mediafile5": media5 or "",
                "created": str(created) if created else "",
                "link_website": link_website or "",
                "latitude": lat,
                "longitude": lng,
                "x": lng,
                "y": lat,
                "zoom_min": float(min_zoom) if min_zoom else 0,
                "zoom_max": float(max_zoom) if max_zoom else 22,
                "categories": []
            }
            
            return JsonResponse(obj, safe=False)
            
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

def menu_api(request):
    """API endpoint for menu items"""
    try:
        from django.db import connections
        with connections['local_artworks'].cursor() as cursor:
            cursor.execute("""
                SELECT id, title, url, `order`
                FROM menu_item
                WHERE is_active = 1
                ORDER BY `order`, title
            """)
            
            rows = cursor.fetchall()
            items = []
            for row in rows:
                items.append({
                    "id": row[0],
                    "title": row[1],
                    "url": row[2],
                    "order": row[3]
                })
            
            return JsonResponse({"items": items})
            
    except Exception as e:
        return JsonResponse({"error": str(e), "items": []}, status=500)

def menu_content_api(request, section_key=None):
    """
    API endpoint for menu content sections
    """
    with connections['local_artworks'].cursor() as cursor:
        if section_key:
            # Get specific section
            cursor.execute("""
                SELECT section_key, title, content_html, `order`
                FROM menu_content 
                WHERE section_key = %s AND is_active = 1
            """, [section_key])
            row = cursor.fetchone()
            if row:
                return JsonResponse({
                    "section_key": row[0],
                    "title": row[1],
                    "content_html": row[2],
                    "order": row[3]
                })
            else:
                return JsonResponse({"error": "Section not found"}, status=404)
        else:
            # Get all active sections
            cursor.execute("""
                SELECT section_key, title, content_html, `order`
                FROM menu_content 
                WHERE is_active = 1 
                ORDER BY `order`, title
            """)
            rows = cursor.fetchall()
            sections = [{
                "section_key": row[0],
                "title": row[1],
                "content_html": row[2],
                "order": row[3]
            } for row in rows]
            return JsonResponse({"sections": sections})
