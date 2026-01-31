import pandas as pd
import librosa

df = pd.read_csv("data/metadata/audio_index.csv")

path = df.iloc[0]["audio_path"]

y, sr = librosa.load(path, sr=16000)

print("Loaded:", path)
print("Sample rate:", sr)
print("Duration:", len(y)/sr)
