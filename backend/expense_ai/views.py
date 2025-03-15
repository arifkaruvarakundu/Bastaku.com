from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ExpenseSerializer
from .models import ExpenseData
from langchain.prompts import PromptTemplate
import requests
import os
from dotenv import load_dotenv
from pathlib import Path
import json

# Load environment variables
BASE_DIR = Path(__file__).resolve().parent.parent
dotenv_path = BASE_DIR / '.env'
load_dotenv(dotenv_path=dotenv_path)

# Set your Mistral API Key
MISTRAL_API_KEY = os.getenv('MISTRAL_API_KEY')
MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions"  # Check Mistral's official docs for this URL

from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ExpenseSerializer
from .models import ExpenseData
import requests
import os
import json
from dotenv import load_dotenv
from pathlib import Path
from langchain.prompts import PromptTemplate

# Load environment variables
BASE_DIR = Path(__file__).resolve().parent.parent
dotenv_path = BASE_DIR / ".env"
load_dotenv(dotenv_path=dotenv_path)

# Set Mistral API Key
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions"

# Define LangChain Prompt Template (FORCES JSON RESPONSE)
prompt_template = PromptTemplate(
    input_variables=[
        "family_members", "members_more_than_15", "members_less_than_15",
        "members_more_than_60", "members_less_than_5", "meals_per_day",
        "eating_out_frequency", "dietary_preferences"
    ],
    template="""
You are an AI that calculates estimated monthly food expenses. 

### Household Details:
- Family Members: {family_members}
- Members > 15: {members_more_than_15}
- Members < 15: {members_less_than_15}
- Members > 60: {members_more_than_60}
- Members < 5: {members_less_than_5}

### Food Consumption & Expenses:
- Meals Per Day: {meals_per_day}
- Eating Out Frequency: {eating_out_frequency}
- Dietary Preferences: {dietary_preferences}

### Instructions:
1. **Calculate the total estimated monthly food expense** based on the provided details.
2. **Provide a detailed breakdown** of the food expenses into two categories:
    - Meals at home (e.g., grocery shopping, cooking at home).
    - Meals eaten out (e.g., dining at restaurants, fast food).
3. **Use the following assumptions** to perform the calculation:
    - Each family member consumes the same average number of meals per day.
    - The cost of eating out depends on the frequency of dining out.
    - Dietary preferences might affect the cost, but assume average costs based on the mentioned preferences.
    - Provide a clear and reasonable estimation.
4. **Give me the result in valid JSON format**, with the following structure:
    - `total_monthly_expense`: The total estimated monthly expense.
    - `breakdown_of_expenses`: A dictionary with the percentages of meals at home and meals eaten out.

### Expected Output:


  "total_monthly_expense": XXX,
  "breakdown_of_expenses": {{
    "meals_at_home": "XX.XX%",
    "meals_eating_out": "X.XX%"
  }},


    """
)

import re
import json

def extract_json(text):
    """
    Extracts and parses JSON from a text response, removing Markdown-style code blocks if present.

    Args:
        text (str): The response text from Mistral API.

    Returns:
        dict: Parsed JSON data as a Python dictionary.

    Raises:
        Exception: If valid JSON is not found or cannot be parsed.
    """
    try:
        # Remove markdown code block markers (```json ... ```)
        clean_text = re.sub(r"```json\n|\n```", "", text).strip()

        # Convert to Python dictionary
        return json.loads(clean_text)

    except json.JSONDecodeError:
        raise Exception("Failed to parse AI response as JSON.")

# Function to call Mistral API
def call_mistral_api(prompt):
    headers = {
        "Authorization": f"Bearer {MISTRAL_API_KEY}",
        "Content-Type": "application/json"
    }

    data = {
        "model": "mistral-large-latest",
        "messages": [
            {"role": "system", "content": "You are a helpful AI that only returns valid JSON responses."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0,
        "max_tokens": 500
    }

    response = requests.post(MISTRAL_API_URL, json=data, headers=headers)

    if response.status_code == 200:
        try:
            response_content = response.json()["choices"][0]["message"]["content"].strip()
            # print("Mistral AI Raw Response:", response_content)

            # Extract and validate JSON response
            return extract_json(response_content)

        except Exception as e:
            raise Exception(f"Mistral response parsing failed: {str(e)}")
    
    else:
        raise Exception(f"Error from Mistral API: {response.status_code}, {response.text}")

from authentication.models import User
# Create your class-based view here
class CalculateExpenseView(APIView):
    permission_classes = [AllowAny]  # Allow access to all users

    def post(self, request, *args, **kwargs):
        email=request.data.get('user_email')
        
        serializer = ExpenseSerializer(data=request.data)
        
        if serializer.is_valid():
            prompt = prompt_template.format(**serializer.validated_data)

            try:
                ai_response = call_mistral_api(prompt)  # Call API
                
                # Fetch user with email 'hari@gmail.com'
                user = User.objects.filter(email=email).first()

                if not user:
                    return Response({"error": "User with email 'hari@gmail.com' not found."}, status=status.HTTP_400_BAD_REQUEST)

                # Save the data with the fetched user
                serializer.save(user=user, total_monthly_expense=ai_response["total_monthly_expense"])

                return Response(ai_response, status=status.HTTP_200_OK)

            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
