from models.dataset import MultimodalDataset

ds = MultimodalDataset("data/metadata/unified_index.csv")

print("Dataset size:", len(ds))

sample = ds[0]

print("Keys:", sample.keys())
print("Modality:", sample["modality"])
print("Label:", sample["label"])
