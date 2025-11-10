# Deployment Guide: Infomaniak Hosting

This guide explains how to deploy the bitrauschen Django application to Infomaniak webspace/server.

## Prerequisites

- An Infomaniak hosting account with SSH access
- Python 3.10+ support on your hosting plan
- Database access (MySQL/PostgreSQL recommended for production, SQLite works for testing)

## Step 1: Prepare Your Local Environment

1. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your production values:
   - Generate a new SECRET_KEY (use Django's `get_random_secret_key()`)
   - Set `DEBUG=False` for production
   - Add your domain to `ALLOWED_HOSTS` (e.g., `yourdomain.com,www.yourdomain.com`)
   - Configure database settings if using MySQL/PostgreSQL

## Step 2: Upload Files to Infomaniak

1. Connect to your Infomaniak hosting via SSH or FTP
2. Upload the entire project to your web directory (typically `/httpdocs/` or similar)
3. Make sure to upload:
   - All Python files
   - `.htaccess`
   - `passenger_wsgi.py`
   - `requirements.txt`
   - `.env` file (with production values)
   - `media/` and `staticfiles/` directories

## Step 3: Set Up Python Virtual Environment

On your Infomaniak server:

```bash
# Navigate to your project directory
cd ~/yourdomain.com

# Create a virtual environment
python3 -m venv venv

# Activate the virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## Step 4: Configure Database

If using MySQL (recommended for Infomaniak):

1. Create a MySQL database in your Infomaniak control panel
2. Update your `.env` file with database credentials:
   ```
   DATABASE_ENGINE=django.db.backends.mysql
   DATABASE_NAME=your_db_name
   DATABASE_USER=your_db_user
   DATABASE_PASSWORD=your_db_password
   DATABASE_HOST=localhost
   DATABASE_PORT=3306
   ```

3. Install MySQL client:
   ```bash
   pip install mysqlclient
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

## Step 5: Collect Static Files

```bash
python manage.py collectstatic --noinput
```

## Step 6: Update .htaccess

Edit `.htaccess` and update the paths:
- Replace `/path/to/your/app` with your actual application path
- Verify the Python interpreter path matches your setup

## Step 7: Configure Passenger

If your Infomaniak hosting uses Passenger:

1. Verify `passenger_wsgi.py` has correct paths
2. Update the virtual environment path in `passenger_wsgi.py`:
   ```python
   INTERP = os.path.expanduser("~/yourdomain.com/venv/bin/python")
   ```

## Step 8: Test Your Deployment

1. Visit your domain in a web browser
2. Check that the site loads correctly
3. Test admin interface at `/admin/`
4. Monitor error logs in your Infomaniak control panel

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| SECRET_KEY | Django secret key (keep secret!) | `your-secret-key-here` |
| DEBUG | Debug mode (False for production) | `False` |
| ALLOWED_HOSTS | Comma-separated list of allowed hosts | `example.com,www.example.com` |
| DATABASE_ENGINE | Database backend | `django.db.backends.mysql` |
| DATABASE_NAME | Database name | `bitrauschen_db` |
| DATABASE_USER | Database username | `db_user` |
| DATABASE_PASSWORD | Database password | `secure_password` |
| DATABASE_HOST | Database host | `localhost` |
| DATABASE_PORT | Database port | `3306` |

## Troubleshooting

### Application not loading
- Check `.htaccess` paths are correct
- Verify virtual environment is created and has all dependencies
- Check Passenger logs in Infomaniak control panel

### Static files not loading
- Run `python manage.py collectstatic` again
- Verify `STATIC_ROOT` and `STATIC_URL` in settings.py
- Check `.htaccess` static file rules

### Database connection errors
- Verify database credentials in `.env`
- Ensure database exists in Infomaniak control panel
- Check that `mysqlclient` is installed

### Permission errors
- Ensure proper file permissions: `chmod 755` for directories, `chmod 644` for files
- Make sure `db.sqlite3` (if using SQLite) has write permissions

## Migration from Digital Ocean

This deployment replaces the previous Digital Ocean setup (IP: 134.209.194.2). 

Key differences:
- Environment-based configuration instead of hardcoded values
- Support for both development and production environments
- Flexible database configuration (SQLite for dev, MySQL/PostgreSQL for production)
- Apache/Passenger deployment instead of standalone server

## Security Checklist

- [ ] `DEBUG=False` in production `.env`
- [ ] Generated new `SECRET_KEY` for production
- [ ] Configured proper `ALLOWED_HOSTS`
- [ ] Database credentials are in `.env` (not in settings.py)
- [ ] `.env` file is not in version control (add to `.gitignore`)
- [ ] HTTPS is enabled (recommended)
- [ ] File permissions are properly set
- [ ] Regular backups are configured

## Support

For Infomaniak-specific issues, consult:
- [Infomaniak Documentation](https://www.infomaniak.com/en/support)
- [Django Deployment Checklist](https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/)
