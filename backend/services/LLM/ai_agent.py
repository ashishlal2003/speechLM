import re

def remove_markdown(text):
    return re.sub(r'[*_`~#>-]', '', text)

def ai_response(model, user_input, history_db, agent_id):
    message_payload = {
        "messages": [
            {
                "role": "user",
                "content": f"History: {history_db.get_conversation(agent_id)}\nUser Input: {user_input}"
            }
        ]
    }

    result = model.invoke(message_payload)
    assistant_reply = result["messages"][-1].content

    history_db.save_message(agent_id, user_input, assistant_reply)

    return remove_markdown(assistant_reply)