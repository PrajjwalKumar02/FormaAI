# backend/app.py
"""
Root entry point for Gunicorn on Render
Finds and exposes the Flask app as 'app' at module level
"""

import os
import sys

# Get absolute backend directory
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))

# Add possible app locations to Python path
possible_paths = [
    os.path.join(BACKEND_DIR, 'ai', 'api'),   # backend/ai/api/
    os.path.join(BACKEND_DIR, 'ai'),          # backend/ai/
    os.path.join(BACKEND_DIR, 'src'),         # backend/src/
    BACKEND_DIR,                              # backend/
]

for path in possible_paths:
    if os.path.exists(path) and path not in sys.path:
        sys.path.insert(0, path)
        print(f"✅ Added to path: {path}")

print("=" * 60)
print("🔍 Loading Flask app...")
print("=" * 60)

# ============================================================
# FIND THE FLASK APP
# ============================================================
app = None

# Try 1: ai/api/app.py
try:
    from ai.api.app import app
    print("✅ Loaded app from 'ai.api.app'")
except ImportError as e:
    print(f"⚠️  Failed 'ai.api.app': {e}")

# Try 2: ai/app.py
if app is None:
    try:
        from ai.app import app
        print("✅ Loaded app from 'ai.app'")
    except ImportError as e:
        print(f"⚠️  Failed 'ai.app': {e}")

# Try 3: src/app.py
if app is None:
    try:
        from src.app import app
        print("✅ Loaded app from 'src.app'")
    except ImportError as e:
        print(f"⚠️  Failed 'src.app': {e}")

# Try 4: src/main.py (common pattern)
if app is None:
    try:
        from src.main import app
        print("✅ Loaded app from 'src.main'")
    except ImportError as e:
        print(f"⚠️  Failed 'src.main': {e}")

# Try 5: src/server.py
if app is None:
    try:
        from src.server import app
        print("✅ Loaded app from 'src.server'")
    except ImportError as e:
        print(f"⚠️  Failed 'src.server': {e}")

# Try 6: src/index.py
if app is None:
    try:
        from src.index import app
        print("✅ Loaded app from 'src.index'")
    except ImportError as e:
        print(f"⚠️  Failed 'src.index': {e}")

# Try 7: Look for 'flask_app' or 'application' variable names
if app is None:
    for module_name in ['src.app', 'src.main', 'src.server', 'ai.api.app', 'ai.app']:
        try:
            mod = __import__(module_name, fromlist=['*'])
            for var_name in ['flask_app', 'application', 'server']:
                if hasattr(mod, var_name):
                    app = getattr(mod, var_name)
                    print(f"✅ Loaded '{var_name}' as app from '{module_name}'")
                    break
            if app is not None:
                break
        except ImportError:
            pass

# Try 8: Factory pattern (create_app)
if app is None:
    for module_name in ['src.app', 'src.main', 'ai.api.app', 'ai.app']:
        try:
            mod = __import__(module_name, fromlist=['*'])
            if hasattr(mod, 'create_app'):
                app = mod.create_app()
                print(f"✅ Called create_app() from '{module_name}'")
                break
        except ImportError:
            pass

# ============================================================
# FINAL CHECK
# ============================================================
if app is None:
    print("=" * 60)
    print("❌ COULD NOT FIND FLASK APP!")
    print("=" * 60)
    print(f"📁 Files in {BACKEND_DIR}:")
    for f in sorted(os.listdir(BACKEND_DIR)):
        if not f.startswith('.'):
            print(f"   - {f}")
    
    src_dir = os.path.join(BACKEND_DIR, 'src')
    if os.path.exists(src_dir):
        print(f"\n📁 Files in {src_dir}:")
        for f in sorted(os.listdir(src_dir)):
            if not f.startswith('.'):
                print(f"   - {f}")
    
    raise ImportError(
        "Could not find Flask app.\n"
        "Make sure one of these files has a Flask instance:\n"
        "  - Variable named 'app' at module level\n"
        "  - Function named 'create_app()' that returns a Flask app\n"
        "  - Variable named 'flask_app' or 'application'"
    )
else:
    print("=" * 60)
    print(f"✅ SUCCESS: Flask app loaded: {type(app).__name__}")
    print("=" * 60)

# ============================================================
# EXPOSE 'app' FOR GUNICORN
# ============================================================
# Gunicorn looks for this exact variable name
__all__ = ['app']

# For local development
if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
