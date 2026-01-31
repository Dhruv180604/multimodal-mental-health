import torch
import pandas as pd
import numpy as np

from torch.utils.data import DataLoader, Subset
from transformers import AutoModelForSequenceClassification
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix

from models.dataset import MultimodalDataset


# ---------------- CONFIG ----------------

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

BATCH_SIZE = 16

MODEL_PATH = "experiments/text_baseline.pt"


# ---------------- MAIN ----------------

def main():

    print("Loading dataset...")

    dataset = MultimodalDataset(
        csv_path="data/metadata/unified_index.csv",
        mode="text"
    )

    # Keep only text samples
    dataset.df = dataset.df[dataset.df["modality"] == "text"].reset_index(drop=True)

    print("Total text samples:", len(dataset))


    # ---------------- SPLIT ----------------

    indices = list(range(len(dataset)))

    train_idx, test_idx = train_test_split(
        indices,
        test_size=0.2,
        random_state=42,
        stratify=dataset.df["label_id"]
    )


    test_dataset = Subset(dataset, test_idx)


    test_loader = DataLoader(
        test_dataset,
        batch_size=BATCH_SIZE,
        shuffle=False,
        num_workers=0
    )


    # ---------------- LOAD MODEL ----------------

    print("Loading trained model...")

    model = AutoModelForSequenceClassification.from_pretrained(
        "distilbert-base-uncased",
        num_labels=len(dataset.label_map)
    )

    model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))

    model.to(DEVICE)

    model.eval()


    # ---------------- EVALUATION ----------------

    print("Running evaluation...\n")

    all_preds = []
    all_labels = []


    with torch.no_grad():

        for batch in test_loader:

            input_ids = batch["input_ids"].to(DEVICE)
            mask = batch["attention_mask"].to(DEVICE)
            labels = batch["label"].to(DEVICE)


            outputs = model(
                input_ids=input_ids,
                attention_mask=mask
            )


            logits = outputs.logits

            preds = torch.argmax(logits, dim=1)


            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())


    all_preds = np.array(all_preds)
    all_labels = np.array(all_labels)


    # ---------------- METRICS ----------------

    print("Classification Report:\n")

    print(
        classification_report(
            all_labels,
            all_preds,
            digits=4
        )
    )


    print("Confusion Matrix:\n")

    print(confusion_matrix(all_labels, all_preds))


    print("\nEvaluation Complete.")


# ---------------- RUN ----------------

if __name__ == "__main__":
    main()
