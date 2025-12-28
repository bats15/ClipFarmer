import subprocess
import re
import sys

INPUT = sys.argv[1]
OUTPUT = sys.argv[2]
WINDOW = 30

cmd = [
    "ffmpeg", "-i", INPUT,
    "-af", "astats=metadata=1:reset=1",
    "-f", "null", "-"
]

proc = subprocess.Popen(cmd, stderr=subprocess.PIPE, text=True)

times, levels = [], []
time_re = re.compile(r"pts_time:(\d+\.\d+)")
rms_re = re.compile(r"RMS level dB:\s*(-?\d+\.\d+)")

current_time = None

for line in proc.stderr:
    t = time_re.search(line)
    r = rms_re.search(line)
    if t:
        current_time = float(t.group(1))
    if r and current_time is not None:
        times.append(current_time)
        levels.append(float(r.group(1)))

best_avg = -1e9
best_start = 0

for i in range(len(times)):
    start = times[i]
    end = start + WINDOW
    vals = [
        levels[j]
        for j in range(i, len(times))
        if times[j] <= end
    ]
    if vals:
        avg = sum(vals) / len(vals)
        if avg > best_avg:
            best_avg = avg
            best_start = start

subprocess.run([
    "ffmpeg", "-y",
    "-ss", str(best_start),
    "-i", INPUT,
    "-t", str(WINDOW),
    "-c", "copy",
    OUTPUT
], check=True)

print("Loudest clip saved:", OUTPUT)
