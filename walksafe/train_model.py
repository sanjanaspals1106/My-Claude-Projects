"""
TensorFlow Lite Model Training Script for WalkSafe
This script trains a model to detect abnormal walking patterns

Requirements:
    pip install tensorflow numpy pandas scikit-learn

Usage:
    1. Collect sensor data (accelerometer + gyroscope)
    2. Label the data (0=normal, 1=running, 2=stop, 3=irregular, 4=fall)
    3. Save as CSV with columns: accel_x, accel_y, accel_z, gyro_x, gyro_y, gyro_z, label
    4. Run: python train_model.py
"""

import tensorflow as tf
import numpy as np
from tensorflow import keras
from tensorflow.keras import layers
import os

# Model Configuration
WINDOW_SIZE = 50  # Number of sensor readings in sequence
FEATURE_SIZE = 7  # accel_x, accel_y, accel_z, gyro_x, gyro_y, gyro_z, magnitude
NUM_CLASSES = 5   # normal, running, stop, irregular, fall

def create_sample_data():
    """
    Creates sample data for demonstration.
    Replace this with your actual sensor data collection.
    """
    print("Creating sample training data...")

    # Generate synthetic data (replace with real data)
    num_samples = 1000
    X = np.random.randn(num_samples, WINDOW_SIZE, FEATURE_SIZE).astype(np.float32)
    y = np.random.randint(0, NUM_CLASSES, num_samples)

    # Convert labels to one-hot encoding
    y = keras.utils.to_categorical(y, NUM_CLASSES)

    # Split into train and test
    split = int(0.8 * num_samples)
    X_train, X_test = X[:split], X[split:]
    y_train, y_test = y[:split], y[split:]

    return X_train, X_test, y_train, y_test

def create_model():
    """
    Creates a CNN-LSTM model for walking pattern classification.
    Architecture: Conv1D -> LSTM -> Dense
    """
    model = keras.Sequential([
        # Input layer
        layers.Input(shape=(WINDOW_SIZE, FEATURE_SIZE)),

        # Convolutional layer for feature extraction
        layers.Conv1D(filters=64, kernel_size=3, activation='relu', padding='same'),
        layers.MaxPooling1D(pool_size=2),
        layers.Dropout(0.3),

        # LSTM layer for temporal patterns
        layers.LSTM(64, return_sequences=False),
        layers.Dropout(0.3),

        # Dense layers for classification
        layers.Dense(32, activation='relu'),
        layers.Dropout(0.2),
        layers.Dense(NUM_CLASSES, activation='softmax')
    ])

    return model

def train_model(X_train, y_train, X_test, y_test):
    """
    Trains the model and returns the trained model.
    """
    print("Creating model architecture...")
    model = create_model()

    print("\nModel Summary:")
    model.summary()

    # Compile model
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=0.001),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )

    # Callbacks
    callbacks = [
        keras.callbacks.EarlyStopping(
            monitor='val_loss',
            patience=10,
            restore_best_weights=True
        ),
        keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=5
        )
    ]

    # Train model
    print("\nTraining model...")
    history = model.fit(
        X_train, y_train,
        epochs=50,
        batch_size=32,
        validation_data=(X_test, y_test),
        callbacks=callbacks,
        verbose=1
    )

    # Evaluate
    print("\nEvaluating model...")
    test_loss, test_accuracy = model.evaluate(X_test, y_test)
    print(f"Test Accuracy: {test_accuracy:.4f}")

    return model

def convert_to_tflite(model, output_path='assets/models/walking_anomaly_model.tflite'):
    """
    Converts the Keras model to TensorFlow Lite format.
    """
    print("\nConverting to TensorFlow Lite...")

    # Convert to TFLite
    converter = tf.lite.TFLiteConverter.from_keras_model(model)

    # Optimization options (optional)
    converter.optimizations = [tf.lite.Optimize.DEFAULT]

    # Convert
    tflite_model = converter.convert()

    # Save the model
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'wb') as f:
        f.write(tflite_model)

    print(f"TFLite model saved to: {output_path}")
    print(f"Model size: {len(tflite_model) / 1024:.2f} KB")

    return tflite_model

def test_tflite_model(tflite_model_path, X_test):
    """
    Tests the TFLite model to verify it works correctly.
    """
    print("\nTesting TFLite model...")

    # Load TFLite model
    interpreter = tf.lite.Interpreter(model_path=tflite_model_path)
    interpreter.allocate_tensors()

    # Get input and output details
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()

    print(f"Input shape: {input_details[0]['shape']}")
    print(f"Output shape: {output_details[0]['shape']}")

    # Test with one sample
    test_sample = X_test[0:1].astype(np.float32)
    interpreter.set_tensor(input_details[0]['index'], test_sample)
    interpreter.invoke()
    output = interpreter.get_tensor(output_details[0]['index'])

    print(f"Sample prediction: {output}")
    print(f"Predicted class: {np.argmax(output)}")

    return True

def main():
    """
    Main training pipeline.
    """
    print("=" * 60)
    print("WalkSafe - Walking Anomaly Detection Model Training")
    print("=" * 60)

    # Step 1: Load or create data
    print("\n[Step 1/5] Loading data...")
    X_train, X_test, y_train, y_test = create_sample_data()
    print(f"Training samples: {len(X_train)}")
    print(f"Test samples: {len(X_test)}")

    # Step 2: Create and train model
    print("\n[Step 2/5] Creating and training model...")
    model = train_model(X_train, y_train, X_test, y_test)

    # Step 3: Save Keras model
    print("\n[Step 3/5] Saving Keras model...")
    model.save('walking_anomaly_model.h5')
    print("Keras model saved as: walking_anomaly_model.h5")

    # Step 4: Convert to TFLite
    print("\n[Step 4/5] Converting to TensorFlow Lite...")
    tflite_path = 'assets/models/walking_anomaly_model.tflite'
    convert_to_tflite(model, tflite_path)

    # Step 5: Test TFLite model
    print("\n[Step 5/5] Testing TFLite model...")
    test_tflite_model(tflite_path, X_test)

    print("\n" + "=" * 60)
    print("Training Complete!")
    print("=" * 60)
    print(f"\nYour TFLite model is ready at: {tflite_path}")
    print("Copy this file to your Flutter project's assets/models/ folder")
    print("\nNext steps:")
    print("1. Run 'flutter pub get' in your Flutter project")
    print("2. The app will automatically load and use the ML model")
    print("3. If model is not found, app falls back to statistical detection")

if __name__ == "__main__":
    main()
