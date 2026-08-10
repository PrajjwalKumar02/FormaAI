import os

#  Use os.getenv directly
class AIConfig:
    # Provider
    AI_PROVIDER = os.getenv("AI_PROVIDER", "gemini")
    
    # Gemini Config
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "your_gemini_api_key_here")
    GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-pro")
    GEMINI_MODEL_FAST = os.getenv("GEMINI_MODEL_FAST", "gemini-1.5-flash")
    
    # Generation Config
    GEMINI_GENERATION_CONFIG = {
        "temperature": float(os.getenv("TEMPERATURE", 0.3)),
        "top_p": float(os.getenv("TOP_P", 0.95)),
        "top_k": int(os.getenv("TOP_K", 40)),
        "max_output_tokens": int(os.getenv("MAX_TOKENS", 1024)),
    }
    
    # Safety Settings
    GEMINI_SAFETY_SETTINGS = [
        {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    ]
    
    # OpenAI Config (Fallback)
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
    
    # Common
    TIMEOUT = int(os.getenv("TIMEOUT", 30))
    EXTRACTION_CONFIDENCE_THRESHOLD = float(os.getenv("EXTRACTION_CONFIDENCE_THRESHOLD", 0.7))

config = AIConfig()
