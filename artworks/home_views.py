from django.shortcuts import render
from django.http import HttpResponse
import os

def home_view(request):
    """Serve the main Bitrauschen frontend"""
    index_path = '/opt/bitrauschen/app/index.html'
    with open(index_path, 'r') as f:
        return HttpResponse(f.read(), content_type='text/html')
