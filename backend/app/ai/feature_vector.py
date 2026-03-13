import numpy as np
from sklearn.preprocessing import MinMaxScaler

def build_feature_vector(profile):

    features = [
        profile.get("education_level",0),
        profile.get("learning_goal",0),
        profile.get("available_time",0),
        profile.get("experience",0)
    ]

    features = np.array(features).reshape(-1,1)

    scaler = MinMaxScaler()

    normalized = scaler.fit_transform(features)

    return normalized.flatten().tolist()