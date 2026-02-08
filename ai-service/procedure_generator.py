import os
from google import genai

client = genai.Client(
    api_key=os.getenv("GOOGLE_API_KEY")
)

def generate_procedure(fault: str, appliance: str = "home appliance"):
    try:
        prompt = f"""
You are a home repair assistant.

Detected fault: {fault}
Appliance: {appliance}

Generate a safe, step-by-step repair procedure for a normal home user.
Avoid professional-only or dangerous steps.
Return the steps as a numbered list.
"""

        response = client.models.generate_content(
          model="models/gemini-pro-latest",
            contents=prompt
        )

        return response.text or "No procedure generated."

    except Exception as e:
        return f"Procedure generation failed: {str(e)}"
