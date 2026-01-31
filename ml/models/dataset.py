import pandas as pd
import torch
from torch.utils.data import Dataset
import librosa
import cv2
import numpy as np
from transformers import AutoTokenizer


class MultimodalDataset(Dataset):

    def __init__(
        self,
        csv_path,
        mode="all",
        text_model="distilbert-base-uncased",
        max_length=128,
        audio_sr=16000
    ):

        # Load CSV
        self.df = pd.read_csv(csv_path)
        self.mode = mode

        # ---------------- LABEL ENCODING ----------------
        self.label_map = {}

        unique_labels = sorted(self.df["label"].astype(str).unique())

        for i, lab in enumerate(unique_labels):
            self.label_map[lab] = i

        print("Label mapping:", self.label_map)

        # Create numeric labels
        self.df["label_id"] = self.df["label"].map(self.label_map)
        # ------------------------------------------------

        self.tokenizer = AutoTokenizer.from_pretrained(text_model)

        self.max_length = max_length
        self.audio_sr = audio_sr


    def __len__(self):
        return len(self.df)


    def load_text(self, text):

        enc = self.tokenizer(
            str(text),
            truncation=True,
            padding="max_length",
            max_length=self.max_length,
            return_tensors="pt"
        )

        return {
            "input_ids": enc["input_ids"].squeeze(0),
            "attention_mask": enc["attention_mask"].squeeze(0)
        }


    def load_audio(self, path):

        y, sr = librosa.load(path, sr=self.audio_sr)

        mfcc = librosa.feature.mfcc(
            y=y,
            sr=sr,
            n_mfcc=40
        )

        return torch.tensor(mfcc, dtype=torch.float)


    def load_video(self, path):

        cap = cv2.VideoCapture(path)

        frames = []

        while len(frames) < 16:
            ret, frame = cap.read()

            if not ret:
                break

            frame = cv2.resize(frame, (224, 224))
            frame = frame / 255.0

            frames.append(frame)

        cap.release()

        if len(frames) == 0:
            return torch.zeros((16, 224, 224, 3))

        while len(frames) < 16:
            frames.append(frames[-1])

        return torch.tensor(frames, dtype=torch.float)
    def __getitem__(self, idx):

        row = self.df.iloc[idx]

        label = torch.tensor(row["label_id"], dtype=torch.long)

        # ===== TEXT MODE =====
        if self.mode == "text":

            text_data = self.load_text(row["text"])

            return {
                "input_ids": text_data["input_ids"],
                "attention_mask": text_data["attention_mask"],
                "label": label
            }


        # ===== AUDIO MODE =====
        if self.mode == "audio":

            return {
                "audio": self.load_audio(row["audio_path"]),
                "label": label
            }


        # ===== VIDEO MODE =====
        if self.mode == "video":

            return {
                "video": self.load_video(row["video_path"]),
                "label": label
            }


        # ===== MULTIMODAL MODE =====
        item = {
            "modality": row["modality"],
            "label": label,
            "text": None,
            "audio": None,
            "video": None
        }

        if row["modality"] == "text":
            item["text"] = self.load_text(row["text"])

        elif row["modality"] == "audio":
            item["audio"] = self.load_audio(row["audio_path"])

        elif row["modality"] == "video":
            item["video"] = self.load_video(row["video_path"])

        return item

    
    
    
    
    
    
    


