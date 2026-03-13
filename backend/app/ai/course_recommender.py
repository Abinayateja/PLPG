import json

with open("app/data/courses.json") as f:
    COURSES = json.load(f)

def recommend_course(skill):

    results = []

    for course in COURSES:
        if course["skill"] == skill:
            results.append(course)

    return results[:1]