from ultralytics import YOLO

# Load YOLO model once (on server start)
model = YOLO("models/yolov8n.pt")


def detect_fault(image_path: str):
    """
    Runs YOLO detection on the given image.
    Returns the top detected label and confidence only.
    YOLO does NOT generate procedures or logic.
    """

    results = model(image_path)

    best_detection = None
    highest_confidence = 0.0

    for r in results:
        for box in r.boxes:
            confidence = float(box.conf)
            if confidence > highest_confidence:
                highest_confidence = confidence
                best_detection = {
                    "label": model.names[int(box.cls)],
                    "confidence": round(confidence, 2)
                }

    # If nothing detected
    if best_detection is None:
        return {
            "label": "unknown",
            "confidence": 0.0
        }

    return best_detection
