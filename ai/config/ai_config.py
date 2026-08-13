import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class AIConfig:
    # Server Configuration
    AI_SERVICE_PORT = int(os.getenv("AI_SERVICE_PORT", 5001))
    DEBUG = os.getenv("DEBUG", "True").lower() == "true"
    
    # AI Provider
    AI_PROVIDER = os.getenv("AI_PROVIDER", "gemini")
    
    # Gemini Configuration
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    
    # Generation Configuration
    GENERATION_CONFIG = {
        "temperature": float(os.getenv("TEMPERATURE", 0.3)),
        "max_output_tokens": int(os.getenv("MAX_TOKENS", 2048)),
    }
    
    # Extraction Configuration
    EXTRACTION_CONFIDENCE_THRESHOLD = float(os.getenv("EXTRACTION_CONFIDENCE_THRESHOLD", 0.7))
    TIMEOUT = int(os.getenv("TIMEOUT", 30))

# Create config instance
config = AIConfig()

# Debug output
print("=" * 50)
print("🔍 CONFIGURATION LOADED")
print("=" * 50)
print(f"AI_SERVICE_PORT: {config.AI_SERVICE_PORT}")
print(f"AI_PROVIDER: {config.AI_PROVIDER}")
print(f"GEMINI_API_KEY: {config.GEMINI_API_KEY[:15] if config.GEMINI_API_KEY else 'MISSING'}...")
print(f"GEMINI_MODEL: {config.GEMINI_MODEL}")
print("=" * 50)
