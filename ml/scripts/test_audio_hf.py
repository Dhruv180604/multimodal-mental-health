from datasets import load_from_disk
import librosa
import numpy as np
import os

# Load dataset
ds = load_from_disk("data/raw/audio/ravdess_emotion")

print(ds)

split = list(ds.keys())[0]
sample = ds[split][0]

audio = sample["audio"]

# Get cached path
path = audio.get("path", None)

print("Raw path:", path)

if path is None or not os.path.exists(path):
    raise FileNotFoundError("Audio file path not found in cache")

# Load with librosa
y, sr = librosa.load(path, sr=16000)

print("Sample rate:", sr)
print("Duration:", len(y)/sr)

mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)

print("MFCC shape:", mfcc.shape)
print("✅ Audio pipeline working")
