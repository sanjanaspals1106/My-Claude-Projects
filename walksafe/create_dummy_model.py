"""
Quick TensorFlow Lite Model Generator for WalkSafe
Generates a simple working model so the app can run immediately.

Requirements:
    pip install tensorflow numpy

Usage:
    python create_dummy_model.py
"""

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np
import os

def create_simple_model():
    """Creates a simple model for walking anomaly detection."""
    WINDOW_SIZE = 50
    FEATURE_SIZE = 7
    NUM_CLASSES = 5

    model = keras.Sequential([
        layers.Input(shape=(WINDOW_SIZE, FEATURE_SIZE)),
        layers.LSTM(32, return_sequences=False),
        layers.Dense(16, activation='relu'),
        layers.Dense(NUM_CLASSES, activation='softmax')
    ])

    return model

def main():
    print("Creating simple TensorFlow Lite model for WalkSafe...")
    print("=" * 60)

    # Create model
    model = create_simple_model()
    print("\nModel created successfully!")
    model.summary()

    # Compile (required for TFLite conversion)
    model.compile(
        optimizer='adam',
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )

    # Create dummy data to set weights
    X_dummy = np.random.randn(10, 50, 7).astype(np.float32)
    y_dummy = keras.utils.to_categorical(np.random.randint(0, 5, 10), 5)
    model.fit(X_dummy, y_dummy, epochs=1, verbose=0)

    print("\nConverting to TensorFlow Lite...")
    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    tflite_model = converter.convert()

    # Save model
    output_path = 'assets/models/walking_anomaly_model.tflite'
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    with open(output_path, 'wb') as f:
        f.write(tflite_model)

    print(f"\n✓ Model saved to: {output_path}")
    print(f"✓ Model size: {len(tflite_model) / 1024:.2f} KB")
    print("\n" + "=" * 60)
    print("Done! Your app is ready to run with ML support.")
    print("=" * 60)

if __name__ == "__main__":
    main()
