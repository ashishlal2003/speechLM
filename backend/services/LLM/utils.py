import google.generativeai as genai
from services.DB_Actions.user_history import UserHistory

history_db = UserHistory()

def setup_genai(api_key):
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
    return model

def ai_response(model, user_input, user_id="default_user"):
    past_messages = history_db.get_conversation(user_id)
    history_prompt = ""

    for message in past_messages:
        history_prompt += f"User: {message['user_input']}\nAI: {message['ai_response']}\n"

    final_prompt = f"{history_prompt}User: {user_input}\nAI:"

    response = model.generate_content(final_prompt)
    response_text = response.text

    history_db.save_message(user_id, user_input, response_text)
    
    print("AI Response:", response_text)
    return response_text