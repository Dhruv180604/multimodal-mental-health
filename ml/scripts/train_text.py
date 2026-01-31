import torch
from torch.utils.data import DataLoader
from transformers import AutoModelForSequenceClassification, AdamW
from models.dataset import MultimodalDataset
from tqdm import tqdm
import os


# ---------------- CONFIG ----------------

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

BATCH_SIZE = 8        # Smaller for CPU
EPOCHS = 3
LR = 2e-5
NUM_LABELS = 16       # From label mapping

DEBUG_SAMPLES = 5000  # Use small set first (set None later)


# ---------------- MAIN ----------------

def main():

    print("Loading dataset...")

    dataset = MultimodalDataset(
        csv_path="data/metadata/unified_index.csv",
        mode="text"
    )

    # Keep only text samples
    dataset.df = dataset.df[dataset.df["modality"] == "text"]

    # Debug mode (faster training)
    if DEBUG_SAMPLES is not None:
        dataset.df = dataset.df.sample(DEBUG_SAMPLES).reset_index(drop=True)
        print(f"DEBUG MODE: Using {len(dataset)} samples")

    print("Dataset ready:", len(dataset))


    loader = DataLoader(
        dataset,
        batch_size=BATCH_SIZE,
        shuffle=True,
        num_workers=0
    )


    print("Loading model...")

    model = AutoModelForSequenceClassification.from_pretrained(
        "distilbert-base-uncased",
        num_labels=NUM_LABELS
    ).to(DEVICE)


    optimizer = AdamW(model.parameters(), lr=LR)

    os.makedirs("experiments", exist_ok=True)

    model.train()

    print("Training started...\n")


    # ---------------- TRAIN LOOP ----------------

    for epoch in range(EPOCHS):

        total_loss = 0

        progress = tqdm(loader, desc=f"Epoch {epoch+1}")

        for batch in progress:

            input_ids = batch["input_ids"].to(DEVICE)
            mask = batch["attention_mask"].to(DEVICE)
            labels = batch["label"].to(DEVICE)

            outputs = model(
                input_ids=input_ids,
                attention_mask=mask,
                labels=labels
            )

            loss = outputs.loss

            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

            total_loss += loss.item()

            progress.set_postfix(loss=loss.item())


        avg_loss = total_loss / len(loader)

        print(f"\nEpoch {epoch+1} | Avg Loss: {avg_loss:.4f}\n")

        # Save checkpoint every epoch
        torch.save(
            model.state_dict(),
            f"experiments/text_epoch_{epoch+1}.pt"
        )


    # ---------------- FINAL SAVE ----------------

    torch.save(model.state_dict(), "experiments/text_baseline.pt")

    print("Training Complete.")
    print("Final model saved: experiments/text_baseline.pt")


# ---------------- RUN ----------------

if __name__ == "__main__":
    main()
