import pandas as pd
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPClassifier
import joblib

# Load dataset
df = pd.read_csv("data/learning_dataset.csv")

# Convert skills string → list
df["skills"] = df["skills"].apply(lambda x: x.split(","))

# Encode skills
mlb = MultiLabelBinarizer()
skills_encoded = pd.DataFrame(
    mlb.fit_transform(df["skills"]),
    columns=mlb.classes_
)

# Encode goal
goal_encoded = pd.get_dummies(df["goal"])

# Encode course
course_encoded = pd.get_dummies(df["course"])

# Combine all features
X = pd.concat([skills_encoded, goal_encoded, course_encoded], axis=1)

# Target
y = df["completion"]

# Train test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Build model
model = MLPClassifier(hidden_layer_sizes=(64,32), max_iter=200)

# Train model
model.fit(X_train, y_train)

# Accuracy
accuracy = model.score(X_test, y_test)

print("Model Accuracy:", accuracy)

# Save model
joblib.dump(model, "ml/recommender_model.pkl")

print("Model saved successfully!")