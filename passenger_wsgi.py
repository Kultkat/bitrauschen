"""
WSGI config for bitrauschen project - Passenger/Infomaniak deployment.

This file is used by Passenger WSGI on Infomaniak hosting.
It sets up the Django application for serving via Passenger.

For more information on Passenger WSGI, see:
https://www.phusionpassenger.com/docs/
"""

import os
import sys

# Add the project directory to the sys.path
INTERP = os.path.expanduser("~/bitrauschen/venv/bin/python")
if sys.executable != INTERP:
    os.execl(INTERP, INTERP, *sys.argv)

# Add your project directory to the sys.path
cwd = os.getcwd()
sys.path.insert(0, cwd)

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bitrauschen.settings')

# Import Django's WSGI application
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
