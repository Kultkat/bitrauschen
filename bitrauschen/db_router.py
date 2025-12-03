class BitrauscheDatabaseRouter:
    """
    A router to control all database operations on models in the
    auth, admin, and artworks applications.
    """
    
    def db_for_read(self, model, **hints):
        """
        Attempts to read auth, admin, and artworks models go to local_artworks.
        """
        if model._meta.app_label in ['auth', 'admin', 'contenttypes', 'sessions', 'artworks']:
            return 'local_artworks'
        return 'default'

    def db_for_write(self, model, **hints):
        """
        Attempts to write auth, admin, and artworks models go to local_artworks.
        """
        if model._meta.app_label in ['auth', 'admin', 'contenttypes', 'sessions', 'artworks']:
            return 'local_artworks'
        return 'default'

    def allow_relation(self, obj1, obj2, **hints):
        """
        Allow relations if both models are in the same database.
        """
        return True

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        Make sure auth/admin/artworks apps only appear in the 'local_artworks' database.
        """
        if app_label in ['auth', 'admin', 'contenttypes', 'sessions', 'artworks']:
            return db == 'local_artworks'
        return db == 'default'
