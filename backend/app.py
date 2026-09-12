# backend/app.py
"""
Root entry point for Gunicorn
This finds and imports your actual Flask app
"""

import os
import sys

# Add possible app locations to Python path
possible_paths = [
    os.path.join(os.path.dirname(__file__), 'ai', 'api'),
    os.path.join(os.path.dirname(__file__), 'ai'),
    os.path.join(os.path.dirname(__file__), 'src'),
    os.path.dirname(__file__),
]

for path in possible_paths:
    if os.path.exists(path) and path not in sys.path:
        sys.path.insert(0, path)
        print(f"✅ Added to path: {path}")

# Try to import the Flask app from different locations
app = None

try:
    # Try ai/api/app.py
    from ai.api.app import app
    print("✅ Loaded app from ai.api.app")
except ImportError as e:
    print(f"⚠️ Could not import from ai.api.app: {e}")
    
    try:
        # Try ai/app.py
        from ai.app import app
        print("✅ Loaded app from ai.app")
    except ImportError as e2:
        print(f"⚠️ Could not import from ai.app: {e2}")
        
        try:
            # Try src/app.py
            from src.app import app
            print("✅ Loaded app from src.app")
        except ImportError as e3:
            print(f"⚠️ Could not import from src.app: {e3}")
            
            try:
                # Try app.py in current dir
                from app import app as app_module
                app = app_module
                print("✅ Loaded app from current directory")
            except ImportError as e4:
                print(f"❌ Could not find Flask app anywhere!")
                print(f"   Errors: {e}, {e2}, {e3}, {e4}")
                raise ImportError("Could not find Flask app. Check your file structure.")

# Export app for Gunicorn
if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)