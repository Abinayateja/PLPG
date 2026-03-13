def optimize_pace(performance_history):

    avg = sum(performance_history)/len(performance_history)

    if avg < 0.4:
        return "slow pace"

    elif avg < 0.7:
        return "moderate pace"

    else:
        return "fast pace"