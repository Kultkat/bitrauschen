# bitrauschen

A mindmap and archive of artistic achievements - a Django-based web application for mapping and documenting artworks geographically.

## Features

- Interactive map visualization of artworks
- Geographic tagging of artistic projects
- Admin interface for managing content
- City-based organization

## Technology Stack

- Python 3.10+
- Django 5.2.7
- SQLite (development) / MySQL/PostgreSQL (production)
- Mapbox GL JS for map visualization

## Getting Started

### Prerequisites

- Python 3.10 or higher
- pip (Python package manager)
- Virtual environment (recommended)

### Local Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Kultkat/bitrauschen.git
   cd bitrauschen
   ```

2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set:
   ```
   DEBUG=True
   SECRET_KEY=your-development-secret-key
   ALLOWED_HOSTS=localhost,127.0.0.1
   ```

5. Run migrations:
   ```bash
   python manage.py migrate
   ```

6. Create a superuser (for admin access):
   ```bash
   python manage.py createsuperuser
   ```

7. Run the development server:
   ```bash
   python manage.py runserver
   ```

8. Visit http://localhost:8000 in your browser

### Admin Interface

Access the admin interface at http://localhost:8000/admin/ using your superuser credentials.

## Project Structure

```
bitrauschen/
├── artworks/          # Artwork management app
├── cities/            # Cities app
├── citymap/           # City mapping functionality
├── bitrauschen/       # Main project settings
│   ├── settings.py    # Django settings
│   ├── urls.py        # URL configuration
│   └── wsgi.py        # WSGI configuration
├── media/             # User-uploaded files
├── staticfiles/       # Collected static files
├── manage.py          # Django management script
├── requirements.txt   # Python dependencies
└── .env.example       # Environment variables template
```

## Deployment

For production deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

The application is configured for deployment on Infomaniak hosting with Apache/Passenger.

## Environment Variables

See `.env.example` for all available configuration options.

Key variables:
- `SECRET_KEY`: Django secret key (required)
- `DEBUG`: Debug mode (default: False)
- `ALLOWED_HOSTS`: Comma-separated list of allowed hosts
- `DATABASE_*`: Database configuration options

## Contributing

This is a personal project, but suggestions and issues are welcome.

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Contact

Studio: studio@kasparkoenig.com

## Migration Notes

This application was migrated from Digital Ocean (IP: 134.209.194.2) to Infomaniak hosting.
The configuration now uses environment variables for flexible deployment across different environments.
