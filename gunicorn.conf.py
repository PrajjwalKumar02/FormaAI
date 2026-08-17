import multiprocessing
import os

# Gunicorn configuration
bind = "0.0.0.0:" + os.getenv("PORT", "10000")
workers = int(os.getenv("WEB_CONCURRENCY", multiprocessing.cpu_count() * 2 + 1))
threads = int(os.getenv("PYTHON_MAX_THREADS", 4))
worker_class = "sync"
worker_connections = 1000
timeout = 120
graceful_timeout = 30
keepalive = 5
max_requests = 1000
max_requests_jitter = 100

# Logging
accesslog = "-"
errorlog = "-"
loglevel = os.getenv("LOG_LEVEL", "info")

# Preload app for better performance
preload_app = True