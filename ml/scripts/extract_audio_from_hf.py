from datasets import load_from_disk
import os
import soundfile as sf

# Load HF dataset
ds = load_from_disk("data/raw/audio/ravdess_emotion")

OUT_DIR = "data/processed/audio/ravdess_wav"
os.makedirs(OUT_DIR, exist_ok=True)

count = 0

for split in ds.keys():
    for i, sample in enumerate(ds[split]):

        audio = sample["audio"]

        # audio contains array + sr in cached format
        array = audio["array"]
        sr = audio["sampling_rate"]

        fname = f"{split}_{i}.wav"
        path = os.path.join(OUT_DIR, fname)

        sf.write(path, array, sr)

        count += 1

print("Extracted", count, "audio files")
