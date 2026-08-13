# ai/test_gemini.py
import os
from dotenv import load_dotenv

load_dotenv()

def test_gemini_connection():
    print("🔍 Testing Gemini API Key...")
    
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("❌ GEMINI_API_KEY not found in .env file")
        return False
    
    print(f"✅ API Key found: {api_key[:10]}...")
    
    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        
        # ✅ Update to correct model name
        model = genai.GenerativeModel('gemini-2.0-flash-exp')
        response = model.generate_content("Say 'Hello, API key is working!'")
        
        print("✅ Gemini API key is VALID and WORKING!")
        print(f"Response: {response.text}")
        return True
        
    except Exception as e:
        print(f"❌ Gemini API key error: {e}")
        return False

if __name__ == "__main__":
    test_gemini_connection()
