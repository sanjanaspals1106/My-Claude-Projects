#!/usr/bin/env python3
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # Suppress TF warnings

try:
    import tensorflow as tf
    import numpy as np

    print("Creating simple TensorFlow Lite model...")

    # Create a very simple model
    model = tf.keras.Sequential([
        tf.keras.layers.Input(shape=(50, 7)),
        tf.keras.layers.LSTM(32),
        tf.keras.layers.Dense(5, activation='softmax')
    ])

    # Compile
    model.compile(optimizer='adam', loss='categorical_crossentropy')

    print("Model created, converting to TFLite...")

    # Convert to TFLite
    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    tflite_model = converter.convert()

    # Save
    os.makedirs('assets/models', exist_ok=True)
    with open('assets/models/walking_anomaly_model.tflite', 'wb') as f:
        f.write(tflite_model)

    size_kb = len(tflite_model) / 1024
    print(f"✓ Model saved: assets/models/walking_anomaly_model.tflite ({size_kb:.1f} KB)")

except Exception as e:
    print(f"Error: {e}")
    print("Model creation failed - app will use statistical detection instead")
