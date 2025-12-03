import pymysql
pymysql.install_as_MySQLdb()

"""
Django settings additions for file upload configuration.
Add these settings to your main settings.py file.
This increases upload limits and adds support for multiple image formats.
"""
DEBUG = True
SECRET_KEY = 'thisisthesecretkey'
ALLOWED_HOSTS = ['kasparkoenig.com', 'www.kasparkoenig.com', '188.166.39.149', 'localhost', '127.0.0.1']

# Ensure the artworks app is registered for management commands
INSTALLED_APPS = [
    'corsheaders',
    'artworks',
    'django.contrib.staticfiles',
    'django.contrib.admin',
    'django.contrib.contenttypes',
    'django.contrib.auth',
    'django.contrib.sessions',
    'django.contrib.messages',
    # add other apps as needed
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


ROOT_URLCONF = 'urls'

# Database configuration (PostgreSQL example)


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'dc1ig_bitrauschen',
        'USER': 'dc1ig_kultkat',
        'PASSWORD': 'Infokult_bitrauschen2',
        'HOST': 'dc1ig.myd.infomaniak.com',
        'PORT': '3306',
    },
    'local_artworks': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'bitrauschen',
        'USER': 'django_user',
        'PASSWORD': 'django_bitrauschen_2025',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}

# File Upload Settings
# ====================

# Maximum file upload size: 10MB (in bytes)
# This allows for high-quality images up to 10MB
FILE_UPLOAD_MAX_MEMORY_SIZE = 10485760  # 10MB in bytes
DATA_UPLOAD_MAX_MEMORY_SIZE = 10485760  # 10MB in bytes

# For very large files, increase this to 50MB or more
# FILE_UPLOAD_MAX_MEMORY_SIZE = 52428800  # 50MB
# DATA_UPLOAD_MAX_MEMORY_SIZE = 52428800  # 50MB

# Maximum number of fields in a POST request
DATA_UPLOAD_MAX_NUMBER_FIELDS = 1000

# Allowed file extensions for uploads
ALLOWED_IMAGE_EXTENSIONS = [
    'jpg', 'jpeg', 'JPG', 'JPEG',
    'png', 'PNG',
    'gif', 'GIF',
    'webp', 'WEBP',
    'svg', 'SVG',
    'mp3', 'MP3',
    'mp4', 'MP4',

]

# --- Content Types (add audio/video) ---
CONTENT_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'audio/mpeg',
    'video/mp4',
]

# Media files configuration for Infomaniak FTP
MEDIA_URL = '/media/cms_archive/'
DEFAULT_FILE_STORAGE = 'ftp_storage.FTPStorage'
FTP_STORAGE_HOST = 'dc1ig.ftp.infomaniak.com'
FTP_STORAGE_USER = 'dc1ig_kultkat'
FTP_STORAGE_PASS = 'Infokult_bitrauschen2'
FTP_STORAGE_DIR = '/sites/kasparkoenig.com/data/'

# --- Static and Media Files ---
STATIC_URL = '/static/'
STATIC_ROOT = '/opt/bitrauschen/static/'

MEDIA_URL = '/media/'
MEDIA_ROOT = '/opt/bitrauschen/media/'


# Static files configuration
# STATIC_URL = '/static/'
# STATIC_ROOT = BASE_DIR / 'staticfiles'

# Image processing settings (optional - requires Pillow)
# Maximum image dimensions (to prevent memory issues)
IMAGE_MAX_WIDTH = 4000   # pixels
IMAGE_MAX_HEIGHT = 4000  # pixels

# Thumbnail settings (if using thumbnail generation)
THUMBNAIL_SIZES = {
    'small': (150, 150),
    'medium': (400, 400),
    'large': (800, 800),
}

# Content types to accept for image uploads
CONTENT_TYPES = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
]

# Maximum content length (for nginx/apache configuration reference)
# In nginx.conf, add: client_max_body_size 10M;
# In apache2.conf, add: LimitRequestBody 10485760

# Django Admin settings
# Show more items per page in admin
# ADMIN_LIST_PER_PAGE = 50

# Enable admin file browser (if django-filebrowser is installed)
# FILEBROWSER_DIRECTORY = 'uploads/'

print("""
================================================================================
📁 FILE UPLOAD CONFIGURATION
================================================================================
Max upload size: 10MB (10,485,760 bytes)
Accepted formats: jpg, jpeg, JPG, JPEG, png, PNG, gif, webp, svg

To apply these settings:
1. Add this configuration to your settings.py
2. Update nginx/apache to allow 10MB uploads
3. Restart your Django application

For nginx, add to your server block:
    client_max_body_size 10M;

For Apache, add to your VirtualHost:
    LimitRequestBody 10485760
================================================================================
""")


# CORS settings
CORS_ALLOWED_ORIGINS = [
    "https://kasparkoenig.com",
    "https://www.kasparkoenig.com",
]
CORS_ALLOW_CREDENTIALS = True
DATABASE_ROUTERS = ['bitrauschen.db_router.BitrauscheDatabaseRouter']
