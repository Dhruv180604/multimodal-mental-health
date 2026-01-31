import os
import pandas as pd

BASE = "data/raw/audio/ravdess_raw"

rows = []

for root, _, files in os.walk(BASE):
    for f in files:
        if f.lower().endswith(".wav"):

            parts = f.split("-")

            # RAVDESS naming: modality-channel-emotion-...
            emotion = parts[2]

            rows.append({
                "audio_path": os.path.join(root, f),
                "emotion_id": int(emotion)
            })

df = pd.DataFrame(rows)

df.to_csv("data/metadata/audio_index.csv", index=False)

print("Indexed", len(df), "audio files")
