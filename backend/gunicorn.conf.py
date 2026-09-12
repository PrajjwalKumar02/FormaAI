# backend/gunicorn.conf.py
import os

# Server socket
bind = f"0.0.0.0:{os.getenv('PORT', '5000')}"
backlog = 2048

# Worker processes
workers = int(os.getenv('WEB_CONCURRENCY', 1))
worker_class = 'sync'
worker_connections = 1000
timeout = 120
keepalive = 5

# Logging
accesslog = '-'
errorlog = '-'
loglevel = 'info'

# Process naming
proc_name = 'forma-ai'

# ✅ CRITICAL FIX: Point to your Flask app
# If app.py is at ai/api/app.py:
wsgi_app = 'ai.api.app:app'

# If app.py is at ai/app.py:
# wsgi_app = 'ai.app:app'

# If app.py is at root:
# wsgi_app = 'app:app'