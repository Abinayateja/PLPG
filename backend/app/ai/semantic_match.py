from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import json

model = SentenceTransformer("all-MiniLM-L6-v2")

courses = json.load(open("app/data/courses.json"))

def semantic_recommend(skill_gap):

    skill_vec = model.encode(" ".join(skill_gap))

    scored = []

    for course in courses:

        course_vec = model.encode(course["description"])

        sim = cosine_similarity([skill_vec],[course_vec])[0][0]

        scored.append((course,sim))

    scored.sort(key=lambda x:x[1],reverse=True)

    return [c[0] for c in scored[:5]]