import pandas as pd

# Load modality indices
text_df = pd.read_csv("data/metadata/text_index.csv")
audio_df = pd.read_csv("data/metadata/audio_index.csv")
video_df = pd.read_csv("data/metadata/video_index.csv")

rows = []

# ========== TEXT ==========
for _, r in text_df.iterrows():
    rows.append({
        "id": r["sample_id"],
        "modality": "text",
        "text": r["text"],
        "audio_path": None,
        "video_path": None,
        "label": r["label"]
    })

# ========== AUDIO ==========
for i, r in audio_df.iterrows():
    rows.append({
        "id": f"audio_{i}",
        "modality": "audio",
        "text": None,
        "audio_path": r["audio_path"],
        "video_path": None,
        "label": r["emotion_id"]
    })

# ========== VIDEO (UNLABELED) ==========
for i, r in video_df.iterrows():
    rows.append({
        "id": f"video_{i}",
        "modality": "video",
        "text": None,
        "audio_path": None,
        "video_path": r["video_path"],
        "label": -1   # unknown
    })

# ========== SAVE ==========
df = pd.DataFrame(rows)

df.to_csv("data/metadata/unified_index.csv", index=False)

print("Unified samples:", len(df))
print("Video samples (unlabeled):", len(video_df))
