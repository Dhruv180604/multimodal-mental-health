import cv2
import pandas as pd

# Load video index
df = pd.read_csv("data/metadata/video_index.csv")

# Pick first video
video_path = df.iloc[0]["video_path"]

print("Testing:", video_path)

cap = cv2.VideoCapture(video_path)

ret, frame = cap.read()

cap.release()

if ret:
    print("✅ Video read successful")
    print("Frame shape:", frame.shape)
else:
    print("❌ Failed to read video")
