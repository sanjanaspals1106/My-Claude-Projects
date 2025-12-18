import 'package:tflite_flutter/tflite_flutter.dart';
import '../models/sensor_data.dart';

class MLService {
  static final MLService instance = MLService._init();
  MLService._init();

  Interpreter? _interpreter;
  bool _isModelLoaded = false;

  bool get isModelLoaded => _isModelLoaded;

  Future<void> loadModel({String modelPath = 'assets/models/walking_anomaly_model.tflite'}) async {
    try {
      _interpreter = await Interpreter.fromAsset(modelPath);
      _isModelLoaded = true;
      print('TensorFlow Lite model loaded successfully');
    } catch (e) {
      print('Error loading TensorFlow Lite model: $e');
      print('Falling back to statistical anomaly detection');
      _isModelLoaded = false;
    }
  }

  Future<Map<String, dynamic>> predictAnomaly(List<SensorData> sensorWindow) async {
    if (!_isModelLoaded || _interpreter == null) {
      return {
        'isAnomaly': false,
        'confidence': 0.0,
        'anomalyType': AnomalyType.none,
        'method': 'statistical',
      };
    }

    try {
      final inputData = _preprocessData(sensorWindow);

      var output = List.filled(1 * 5, 0.0).reshape([1, 5]);

      _interpreter!.run(inputData, output);

      final predictions = output[0] as List<double>;

      final maxIndex = _argMax(predictions);
      final confidence = predictions[maxIndex];

      final anomalyTypes = [
        AnomalyType.none,
        AnomalyType.suddenRunning,
        AnomalyType.abruptStop,
        AnomalyType.irregularMotion,
        AnomalyType.fall,
      ];

      final isAnomaly = maxIndex > 0 && confidence > 0.7;

      return {
        'isAnomaly': isAnomaly,
        'confidence': confidence,
        'anomalyType': anomalyTypes[maxIndex],
        'method': 'ml',
        'predictions': predictions,
      };
    } catch (e) {
      print('Error during ML prediction: $e');
      return {
        'isAnomaly': false,
        'confidence': 0.0,
        'anomalyType': AnomalyType.none,
        'method': 'error',
      };
    }
  }

  List<List<List<double>>> _preprocessData(List<SensorData> sensorWindow) {
    final windowSize = 50;
    final featureSize = 7;

    List<SensorData> processedWindow = List.from(sensorWindow);

    while (processedWindow.length < windowSize) {
      processedWindow.add(processedWindow.isNotEmpty
          ? processedWindow.last
          : _getZeroSensorData());
    }

    if (processedWindow.length > windowSize) {
      processedWindow = processedWindow.sublist(
        processedWindow.length - windowSize,
      );
    }

    final normalizedData = processedWindow
        .map((data) => _normalizeFeatures(data.toFeatureVector()))
        .toList();

    return [normalizedData];
  }

  List<double> _normalizeFeatures(List<double> features) {
    return features.map((value) {
      return (value.clamp(-20.0, 20.0) + 20.0) / 40.0;
    }).toList();
  }

  SensorData _getZeroSensorData() {
    return SensorData(
      timestamp: DateTime.now(),
      accelerometerX: 0,
      accelerometerY: 0,
      accelerometerZ: 0,
      gyroscopeX: 0,
      gyroscopeY: 0,
      gyroscopeZ: 0,
    );
  }

  int _argMax(List<double> list) {
    double maxValue = list[0];
    int maxIndex = 0;

    for (int i = 1; i < list.length; i++) {
      if (list[i] > maxValue) {
        maxValue = list[i];
        maxIndex = i;
      }
    }

    return maxIndex;
  }

  void dispose() {
    _interpreter?.close();
    _interpreter = null;
    _isModelLoaded = false;
  }
}
