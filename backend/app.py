from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification


# -----------------------------
# CONFIG
# -----------------------------

MODEL_PATH = "model/text_model.pt"
MODEL_NAME = "distilbert-base-uncased"
NUM_LABELS = 16

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")


# -----------------------------
# LOAD TOKENIZER
# -----------------------------

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)


# -----------------------------
# LOAD MODEL
# -----------------------------

print("Loading model...")

# Rebuild architecture
model = AutoModelForSequenceClassification.from_pretrained(
    MODEL_NAME,
    num_labels=NUM_LABELS
)

# Load trained weights
state_dict = torch.load(MODEL_PATH, map_location=DEVICE)
model.load_state_dict(state_dict,strict=False)

# Move to CPU / GPU
model.to(DEVICE)

# Evaluation mode
model.eval()

print("Model loaded successfully.")


# -----------------------------
# FASTAPI APP
# -----------------------------

app = FastAPI(
    title="Mental Health Text Analysis API",
    description="Predict emotional state from journal text",
    version="1.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# INPUT FORMAT
# -----------------------------

class TextInput(BaseModel):
    text: str


# -----------------------------
# PREDICTION FUNCTION
# -----------------------------

def predict_text(text: str):

    # Tokenize input (same as training)
    inputs = tokenizer(
        text,
        padding="max_length",
        truncation=True,
        max_length=128,
        return_tensors="pt"
    )

    # Move tensors to device
    inputs = {k: v.to(DEVICE) for k, v in inputs.items()}

    # Inference
    with torch.no_grad():
        outputs = model(**inputs)

        logits = outputs.logits

        prediction = torch.argmax(logits, dim=1)


    return int(prediction.item())


# -----------------------------
# API ENDPOINT
# -----------------------------

@app.post("/predict-text")
def predict(data: TextInput):

    result = predict_text(data.text)

    return {
        "input_text": data.text,
        "predicted_label": result
    }


# -----------------------------
# HEALTH CHECK
# -----------------------------

@app.get("/")
def home():
    return {
        "status": "API is running",
        "model": "DistilBERT Mental Health Classifier"
    }
