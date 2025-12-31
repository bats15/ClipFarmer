import cv2
import mediapipe as mp
import subprocess
import sys
import os
import numpy as np

INPUT_VIDEO = sys.argv[1]
OUTPUT_VIDEO = sys.argv[2]

cap = cv2.VideoCapture(INPUT_VIDEO)

fps = cap.get(cv2.CAP_PROP_FPS)
W = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
H = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

crop_w = min(int(H * 9 / 16), W)

fourcc = cv2.VideoWriter_fourcc(*"mp4v")
TEMP_VIDEO = OUTPUT_VIDEO + "_temp.mp4"
out = cv2.VideoWriter(TEMP_VIDEO, fourcc, fps, (crop_w, H))

mp_face = mp.solutions.face_detection
face_detector = mp_face.FaceDetection(
    model_selection=0,
    min_detection_confidence=0.6
)

prev_center_x = W // 2
SMOOTHING = 0.85

while True:
    ret, frame = cap.read()
    if not ret:
        break

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_detector.process(rgb)

    center_x = prev_center_x

    if results.detections is not None:
        best = max(
            results.detections,
            key=lambda d: d.location_data.relative_bounding_box.width
        )
        box = best.location_data.relative_bounding_box
        center_x = int((box.xmin + box.width / 2) * W)

    center_x = int(
        SMOOTHING * prev_center_x +
        (1 - SMOOTHING) * center_x
    )
    prev_center_x = center_x

    x1 = max(0, min(W - crop_w, center_x - crop_w // 2))
    cropped = frame[:, x1:x1 + crop_w]
    out.write(cropped)

cap.release()
out.release()
face_detector.close()

subprocess.run([
    "ffmpeg", "-y",
    "-i", TEMP_VIDEO,
    "-i", INPUT_VIDEO,
    "-map", "0:v",
    "-map", "1:a?",
    "-c:v", "libx264",
    "-c:a", "aac",
    "-shortest",
    OUTPUT_VIDEO
], check=True)

os.remove(TEMP_VIDEO)
print("Final output:", OUTPUT_VIDEO)
