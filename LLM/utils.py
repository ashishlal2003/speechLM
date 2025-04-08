import google.generativeai as genai

def setup_genai(api_key):
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
    return model

def ai_response(model, user_input):
    response = model.generate_content(user_input)
    response_text = response.text
    print("AI Response:", response_text)
    return response_text