# ai/gunicorn.conf.py
import os

# Server socket
bind = f"0.0.0.0:{os.getenv('PORT', '10000')}"
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
proc_name = 'forma-ai-ai-service'

# ✅ Point to your actual Flask app
# Format: <module>:<variable>
# Your Flask app: ai/api/app.py has variable 'app'
wsgi_app = 'api.app:app'
