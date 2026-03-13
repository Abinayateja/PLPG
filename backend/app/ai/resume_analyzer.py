import pdfplumber
import spacy

nlp = spacy.load("en_core_web_sm")

skills_database = [
    "python",
    "machine learning",
    "deep learning",
    "sql",
    "pandas",
    "numpy",
    "tensorflow",
    "pytorch",
    "data analysis",
    "statistics"
]


def extract_text_from_pdf(file):

    text = ""

    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text

    return text.lower()


def extract_skills(text):

    found_skills = []

    for skill in skills_database:
        if skill in text:
            found_skills.append(skill)

    return list(set(found_skills))