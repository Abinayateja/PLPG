import os
import json
import re
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


fallback_questions = {
    "python": [
        {
            "question": "What does list comprehension return?",
            "options": ["List", "Tuple", "Dictionary", "Set"],
            "answer": "List",
            "level": "beginner"
        }
    ],
    "machine learning": [
        {
            "question": "What is supervised learning?",
            "options": [
                "Learning with labeled data",
                "Learning without data",
                "Learning without labels",
                "Random learning"
            ],
            "answer": "Learning with labeled data",
            "level": "beginner"
        }
    ]
}


def generate_ai_question(skill, level):

    prompt = f"""
You are a technical interviewer.

Generate ONE multiple choice question STRICTLY for:

Skill: {skill}
Level: {level}

Rules:
- Must match the skill
- Must match the level
- Beginner = basic concept
- Intermediate = usage
- Advanced = problem solving

Return ONLY JSON:

{{
 "question": "...",
 "options": ["A","B","C","D"],
 "answer": "..."
}}
"""

    try:

        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3
        )

        content = completion.choices[0].message.content

        json_match = re.search(r'\{.*\}', content, re.DOTALL)

        if not json_match:
            raise Exception("No JSON returned")

        data = json.loads(json_match.group())

        options = []
        for opt in data["options"]:
            options.append({
                "label": opt,
                "correct": opt == data["answer"]
            })

        return {
            "question": data["question"],
            "options": options,
            "answer": data["answer"],   # ✅ REQUIRED
            "level": level              # ✅ REQUIRED
        }

    except Exception as e:

        print("Groq failed:", e)

        fallback = fallback_questions.get(
            skill.lower(),
            fallback_questions["python"]
        )[0]

        options = []
        for opt in fallback["options"]:
            options.append({
                "label": opt,
                "correct": opt == fallback["answer"]
            })

        return {
            "question": fallback["question"],
            "options": options,
            "answer": fallback["answer"],
            "level": fallback["level"]
        }