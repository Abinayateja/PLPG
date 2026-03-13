def schedule_review(interval, ease, quality):

    if quality < 3:
        interval = 1

    else:

        interval = interval * ease

        ease = ease + (0.1 - (5-quality)*(0.08+(5-quality)*0.02))

    return round(interval), round(ease,2)