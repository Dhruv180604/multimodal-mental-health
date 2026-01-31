import os
import pandas as pd

BASE = "data/raw/video/video_dataset"

rows = []

for root, _, files in os.walk(BASE):
    for f in files:
        if f.lower().endswith((".mp4", ".avi", ".mov", ".mkv")):
            rows.append({
                "video_path": os.path.join(root, f)
            })

df = pd.DataFrame(rows)

df.to_csv("data/metadata/video_index.csv", index=False)

print("Indexed", len(df), "videos")
