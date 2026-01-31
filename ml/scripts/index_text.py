from datasets import load_from_disk
import pandas as pd

# Load saved HF dataset
ds = load_from_disk("data/raw/text/mental_health_text")

rows = []

split = list(ds.keys())[0]  # usually "train"

for i, sample in enumerate(ds[split]):

    rows.append({
        "sample_id": f"text_{i}",
        "text": sample["text"],
        "label": sample["status"]
    })

df = pd.DataFrame(rows)

df.to_csv("data/metadata/text_index.csv", index=False)

print("Indexed", len(df), "text samples")
