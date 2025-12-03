# Bitrauschen - Interactive Art Portfolio

A Django-powered interactive art portfolio featuring a force-directed graph visualization of curated artworks. Built with D3.js v3, Mapbox GL, and a fully editable admin interface.

## 🎨 Features

- **Interactive Visualization**: Force-directed graph with dynamic connecting lines between artworks
- **60 Curated Artworks**: Managed through Django admin with multi-language support (EN/DE/NL)
- **Fully Editable via Admin**: No code changes needed for content updates
  - Menu items and structure
  - Menu content sections (Contact, Websites, CO2 Compensation, Impressum)
  - Categories and item relationships
  - Artwork metadata and media files
- **Multi-Language Support**: English, German, Dutch
- **Responsive UI**: Search, zoom controls, and language switcher
- **RESTful API**: Tastypie-compatible endpoints for items, categories, and menu

## 🛠 Tech Stack

### Backend
- **Django 5.2.8**: Web framework
- **MySQL 8.0**: Dual database setup (local + remote)
- **Gunicorn**: WSGI HTTP server
- **Nginx**: Reverse proxy with CORS support

### Frontend
- **D3.js v3**: Force-directed graph visualization
- **Mapbox GL JS v3.0.1**: Map rendering
- **jQuery 3.7.1**: DOM manipulation
- **Lodash 4.17.21**: Utility functions
- **Slick Carousel 1.9.0**: Media gallery
- **History.js**: Browser history management

## 📁 Project Structure

```
/opt/bitrauschen/
├── app/
│   └── index.html              # Main frontend HTML
├── artworks/
│   ├── admin.py               # Django admin configuration
│   ├── api_views.py           # REST API endpoints
│   ├── cms_models.py          # CmsItem model (60 artworks)
│   ├── menu_models.py         # MenuItem, MenuContent, Category models
│   ├── home_views.py          # Home page view
│   └── templates/             # Django templates
├── bitrauschen/
│   ├── settings.py            # Django settings
│   ├── db_router.py           # Database routing logic
│   └── wsgi.py                # WSGI configuration
├── static/app/
│   ├── script.js              # Main visualization logic
│   ├── settings.js            # Frontend configuration
│   ├── style.css              # Styles
│   ├── mapboxutil.js          # Mapbox utilities
│   └── atlas_*.{json,png}     # Sprite atlases
└── urls.py                     # URL routing
```

## 🚀 Setup

### Prerequisites
- Python 3.10+
- MySQL 8.0
- Nginx
- Virtual environment

### Installation

1. **Clone the repository**
   ```bash
   cd /opt
   git clone <your-repo-url> bitrauschen
   cd bitrauschen
   ```

2. **Create virtual environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install django gunicorn mysqlclient django-cors-headers pillow
   ```

4. **Configure databases**
   Edit `bitrauschen/settings.py` with your database credentials:
   - `default`: Remote WordPress database (Infomaniak)
   - `local_artworks`: Local MySQL for artworks, auth, admin

5. **Run migrations**
   ```bash
   python manage.py migrate --database=local_artworks
   ```

6. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

7. **Collect static files**
   ```bash
   python manage.py collectstatic --noinput
   ```

8. **Start Gunicorn**
   ```bash
   gunicorn --bind 127.0.0.1:8000 --workers 3 --timeout 120 bitrauschen.wsgi:application
   ```

9. **Configure Nginx**
   - Proxy to `http://127.0.0.1:8000`
   - Add CORS headers for `/static/` and `/api/`
   - Set `client_max_body_size 10M` for uploads

## 📊 Database Schema

### Key Tables

**cms_item** (60 artworks)
- `id`, `title_en/de/nl`, `content_en/de/nl`
- `mediafile1-10`: Media file paths
- `link_website`, `link_youtube`, etc.
- `latitude`, `longitude`: For map positioning
- `created`, `updated_at`

**menu_item** (Hamburger menu structure)
- `title`, `url`, `order`, `is_active`

**menu_content** (Menu section content)
- `section_key`, `title`, `content_html`, `order`

**category** (Art categories)
- `name_en/de/nl`, `slug`, `color`

**item_category** (Many-to-many relationships)
- `item_id`, `category_id`

## 🔌 API Endpoints

All endpoints return JSON:

- `GET /api/v1/item/` - List all artworks
- `GET /api/v1/item/<id>/` - Get single artwork
- `GET /api/v1/category/` - List categories
- `GET /api/v1/atlas/` - Get sprite atlas metadata
- `GET /api/v1/menu/` - Get menu items
- `GET /api/v1/menu-content/` - Get menu content sections

## 🎛 Admin Panel

Access at `https://yourdomain.com/admin/`

**Available sections:**
- **CMS Items**: Manage 60 artworks with thumbnails
- **Menu Items**: Edit menu structure (title, URL, order)
- **Menu Content**: Edit section content (Contact, Impressum, etc.)
- **Categories**: Manage art categories
- **Item Categories**: Link artworks to categories

## 🎨 Visualization Features

- **Force-Directed Graph**: Items push/pull based on relationships
- **Dynamic Lines**: Beautiful connecting lines between related items
- **Search**: Real-time filtering by title, category, year
- **Language Switching**: Toggle between EN/DE/NL
- **Media Gallery**: Slick carousel for multiple images per item
- **Map Integration**: Mapbox GL for geographic context

## 🔧 Configuration

### Frontend Settings
Edit `static/app/settings.js`:
- `base_url`: API endpoint base
- Map configuration
- Visualization parameters

### Django Settings
Key settings in `bitrauschen/settings.py`:
- `ALLOWED_HOSTS`
- `CORS_ALLOWED_ORIGINS`
- `DATABASES` (dual database setup)
- `MEDIA_ROOT`, `MEDIA_URL`
- `STATIC_ROOT`, `STATIC_URL`

## 🗂 Database Router

Custom router in `bitrauschen/db_router.py` directs:
- `artworks`, `auth`, `admin`, `contenttypes`, `sessions` → `local_artworks`
- Everything else → `default` (WordPress database)

## 📝 Content Management

All content editable via admin panel - no code changes needed!

1. **Add/Edit Artworks**: `/admin/artworks/cmsitem/`
2. **Manage Menu**: `/admin/artworks/menuitem/`
3. **Edit Content Sections**: `/admin/artworks/menucontent/`
4. **Categories**: `/admin/artworks/category/`
5. **Link Items to Categories**: `/admin/artworks/itemcategory/`

## 🚧 Development Notes

- Console debug statements commented out in `script.js`
- Thumbnails use original files from `/media/cms_archive/`
- CORS enabled for API and static file endpoints
- Database writes go to local MySQL via custom router

## 📦 Dependencies

Core Python packages:
- `Django==5.2.8`
- `gunicorn`
- `mysqlclient`
- `django-cors-headers`
- `pillow`

Frontend libraries (CDN):
- D3.js v3
- Mapbox GL JS v3.0.1
- jQuery 3.7.1
- Lodash 4.17.21
- Slick Carousel 1.9.0
- History.js 1.8

## 🎯 Future Enhancements

- Automatic thumbnail generation (60px, 120px)
- Populate categories dynamically
- Enhanced search with fuzzy matching
- Export/import functionality
- Real-time collaboration features

## 📄 License

[Specify your license here]

## 👤 Author

Kaspar Koenig
- Website: https://kasparkoenig.com
- Email: studio@kasparkoenig.com

---

**Last Updated**: December 3, 2025  
**Version**: 1.0.0 - Initial stable release with fully editable admin system
