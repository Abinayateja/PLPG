import pandas as pd
import random

skills = [
    "Python","Numpy","Pandas","Data Analysis",
    "Machine Learning","Deep Learning",
    "Statistics","Linear Algebra",
    "Data Visualization","SQL","TensorFlow","PyTorch"
]

courses = [
    "Python Basics","Advanced Python","Numpy Fundamentals",
    "Pandas for Data Analysis","Statistics for Data Science",
    "Machine Learning Intro","Deep Learning Fundamentals",
    "Neural Networks","Data Visualization with Python",
    "SQL for Data Science","TensorFlow Crash Course",
    "PyTorch for Deep Learning"
]

data = []

for i in range(1200):
    data.append({
        "course_id": i,
        "course_name": random.choice(courses),
        "skill": random.choice(skills),
        "difficulty": random.choice(["Beginner","Intermediate","Advanced"])
    })

df = pd.DataFrame(data)

df.to_csv("courses_large.csv",index=False)

print("Dataset generated")