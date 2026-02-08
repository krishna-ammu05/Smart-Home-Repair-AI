from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import uuid

from detect import detect_fault
from procedure_generator import generate_procedure

app = FastAPI()

# Allow Expo / mobile app requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "temp"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.post("/detect")
async def detect_image(file: UploadFile = File(...)):
    # Save uploaded image
    filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 🔹 YOLO detects fault/object
    detection_result = detect_fault(file_path)
    """
    Expected detection_result example:
    {
        "label": "toilet",
        "confidence": 0.84
    }
    OR
    {
        "label": "leak",
        "confidence": 0.87
    }
    """

    fault_label = detection_result.get("label", "unknown")
    confidence = detection_result.get("confidence", 0.0)

    # 🔹 Gemini generates procedure automatically
    procedure_text = generate_procedure(
        fault=fault_label,
        appliance="home appliance"
    )

    # Cleanup image (optional but recommended)
    try:
        os.remove(file_path)
    except:
        pass

    return {
        "status": "success",
        "fault": fault_label,
        "confidence": confidence,
        "procedure": procedure_text
    }


@app.get("/")
def root():
    return {"message": "AI Service is running"}
