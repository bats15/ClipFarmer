from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import subprocess
import uuid
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TMP_DIR = os.path.join(BASE_DIR, "tmp")

LOUD_SCRIPT = os.path.join(BASE_DIR, "loudest.py")
PROC_SCRIPT = os.path.join(BASE_DIR, "process.py")

os.makedirs(TMP_DIR, exist_ok=True)


@app.post("/process")
async def process_video(video: UploadFile = File(...)):
    uid = str(uuid.uuid4())

    input_path = os.path.join(TMP_DIR, f"{uid}_input.mp4")
    clip_path = os.path.join(TMP_DIR, f"{uid}_clip.mp4")
    output_path = os.path.join(TMP_DIR, f"{uid}_final.mp4")

    # 1. save input
    with open(input_path, "wb") as f:
        f.write(await video.read())

    # 2. run loudest.py
    subprocess.run(
        ["python3", LOUD_SCRIPT, input_path, clip_path],
        check=True,
    )

    # 3. run process.py on clip.mp4
    subprocess.run(
        ["python3", PROC_SCRIPT, clip_path, output_path],
        check=True,
    )

    # 4. return final video
    return FileResponse(
        output_path,
        media_type="video/mp4",
        filename="output.mp4",
    )
