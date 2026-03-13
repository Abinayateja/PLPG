import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.neighbors import NearestNeighbors
import pickle

# load dataset
data = pd.read_csv("../datasets/courses.csv")

# encode skills
encoder = LabelEncoder()
data["skill_encoded"] = encoder.fit_transform(data["skill"])

# training data
X = data[["skill_encoded"]]

# train model
model = NearestNeighbors(n_neighbors=3)
model.fit(X)

# save model
pickle.dump(model, open("course_model.pkl", "wb"))
pickle.dump(encoder, open("encoder.pkl", "wb"))

print("Model trained successfully")