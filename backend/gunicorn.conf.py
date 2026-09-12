# backend/gunicorn.conf.py
import os

bind = f"0.0.0.0:{os.getenv('PORT', '5000')}"
workers = int(os.getenv('WEB_CONCURRENCY', 1))
worker_class = 'sync'
timeout = 120

accesslog = '-'
errorlog = '-'
loglevel = 'info'

proc_name = 'forma-ai'

# ✅ Point to root app.py
wsgi_app = 'app:app'
