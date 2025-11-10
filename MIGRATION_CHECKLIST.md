# Migration Checklist: Digital Ocean → Infomaniak

This checklist will help you migrate the bitrauschen application from Digital Ocean (134.209.194.2) to Infomaniak hosting.

## Pre-Migration (Digital Ocean)

- [ ] **Backup current database**
  ```bash
  python manage.py dumpdata > backup.json
  ```
  Or for SQLite:
  ```bash
  cp db.sqlite3 db.sqlite3.backup
  ```

- [ ] **Export media files**
  ```bash
  tar -czf media_backup.tar.gz media/
  ```

- [ ] **Document current configuration**
  - Note current domain/IP
  - Note any cron jobs or scheduled tasks
  - Note environment variables

## Infomaniak Setup

- [ ] **Prepare Infomaniak hosting**
  - [ ] Verify Python 3.10+ is available
  - [ ] Check if Passenger WSGI is available
  - [ ] Create MySQL database (recommended) or verify SQLite support
  - [ ] Note database credentials

- [ ] **Upload application files**
  - [ ] Upload all project files via FTP/SSH
  - [ ] Ensure proper directory structure
  - [ ] Set file permissions (755 for directories, 644 for files)

- [ ] **Set up virtual environment**
  ```bash
  cd ~/yourdomain.com
  python3 -m venv venv
  source venv/bin/activate
  pip install -r requirements.txt
  ```

- [ ] **Configure environment variables**
  - [ ] Create `.env` file from `.env.example`
  - [ ] Generate new SECRET_KEY:
    ```python
    python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
    ```
  - [ ] Set `DEBUG=False`
  - [ ] Set `ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com`
  - [ ] Configure database credentials (if using MySQL)

- [ ] **Update deployment files**
  - [ ] Edit `.htaccess` with correct paths
  - [ ] Update `passenger_wsgi.py` with correct virtual environment path
  - [ ] Verify Apache/Passenger configuration

## Database Migration

Choose one:

### Option A: SQLite (Simple, good for small sites)
- [ ] Upload `db.sqlite3` file
- [ ] Ensure write permissions: `chmod 664 db.sqlite3`

### Option B: MySQL (Recommended for production)
- [ ] Install MySQL client: `pip install mysqlclient`
- [ ] Update `.env` with MySQL credentials
- [ ] Run migrations: `python manage.py migrate`
- [ ] Load data: `python manage.py loaddata backup.json`

## Static and Media Files

- [ ] **Collect static files**
  ```bash
  python manage.py collectstatic --noinput
  ```

- [ ] **Upload media files**
  ```bash
  tar -xzf media_backup.tar.gz
  ```

- [ ] **Set permissions**
  ```bash
  chmod -R 755 media/
  chmod -R 755 staticfiles/
  ```

## Post-Migration Testing

- [ ] **Test application**
  - [ ] Visit homepage
  - [ ] Test admin interface: `/admin/`
  - [ ] Verify static files are loading (CSS, JS, images)
  - [ ] Test user-uploaded media files
  - [ ] Check all major functionality

- [ ] **Verify security settings**
  - [ ] Confirm DEBUG=False
  - [ ] Check ALLOWED_HOSTS is set correctly
  - [ ] Verify SECRET_KEY is different from default
  - [ ] Test HTTPS (if configured)

- [ ] **Monitor error logs**
  - Check Infomaniak control panel for errors
  - Monitor application logs
  - Test error pages (404, 500)

## DNS Update

- [ ] **Update DNS records**
  - [ ] Point domain A record to Infomaniak IP
  - [ ] Update www CNAME if needed
  - [ ] Wait for DNS propagation (can take up to 48 hours)

- [ ] **Verify DNS**
  ```bash
  nslookup yourdomain.com
  ```

## Final Steps

- [ ] **Create admin user** (if starting fresh database)
  ```bash
  python manage.py createsuperuser
  ```

- [ ] **Set up backups**
  - Configure automatic database backups
  - Configure media file backups
  - Document backup restore procedure

- [ ] **Update documentation**
  - [ ] Update README with new hosting info
  - [ ] Document any Infomaniak-specific configurations
  - [ ] Share access credentials with team (securely)

- [ ] **Decommission Digital Ocean** (after confirming everything works)
  - [ ] Keep for 1-2 weeks as backup
  - [ ] Cancel or destroy droplet
  - [ ] Update billing

## Rollback Plan (if needed)

If something goes wrong, you can rollback to Digital Ocean:

1. Keep Digital Ocean droplet running for 1-2 weeks
2. Point DNS back to Digital Ocean IP: 134.209.194.2
3. Restore from backup if needed

## Support Resources

- **Infomaniak Support**: https://www.infomaniak.com/en/support
- **Django Docs**: https://docs.djangoproject.com/
- **Project Documentation**: See [DEPLOYMENT.md](DEPLOYMENT.md)

## Environment Variables Reference

Create `.env` file with these variables:

```ini
# Required
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Database (MySQL example)
DATABASE_ENGINE=django.db.backends.mysql
DATABASE_NAME=bitrauschen_db
DATABASE_USER=db_user
DATABASE_PASSWORD=secure_password
DATABASE_HOST=localhost
DATABASE_PORT=3306
```

## Estimated Timeline

- Preparation: 30 minutes
- File upload: 15-30 minutes
- Configuration: 30-45 minutes
- Testing: 30 minutes
- DNS propagation: Up to 48 hours
- **Total**: ~2-3 hours + DNS wait time

---

**Note**: This migration guide assumes you're migrating from the Digital Ocean setup (IP: 134.209.194.2) to Infomaniak hosting. The application has been updated to use environment-based configuration for easier deployment.
