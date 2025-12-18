import 'dart:async';
import 'dart:math';
import 'package:sensors_plus/sensors_plus.dart';
import '../models/sensor_data.dart';

class SensorService {
  static final SensorService instance = SensorService._init();
  SensorService._init();

  StreamSubscription? _accelerometerSubscription;
  StreamSubscription? _gyroscopeSubscription;

  double _accelX = 0, _accelY = 0, _accelZ = 0;
  double _gyroX = 0, _gyroY = 0, _gyroZ = 0;

  final List<double> _magnitudeHistory = [];
  static const int _historySize = 50;
  static const int _anomalyWindowSize = 20;

  final StreamController<SensorData> _sensorDataController =
      StreamController<SensorData>.broadcast();
  final StreamController<AnomalyType> _anomalyController =
      StreamController<AnomalyType>.broadcast();

  Stream<SensorData> get sensorDataStream => _sensorDataController.stream;
  Stream<AnomalyType> get anomalyStream => _anomalyController.stream;

  void startMonitoring() {
    _accelerometerSubscription = accelerometerEventStream().listen(
      (AccelerometerEvent event) {
        _accelX = event.x;
        _accelY = event.y;
        _accelZ = event.z;
        _processSensorData();
      },
    );

    _gyroscopeSubscription = gyroscopeEventStream().listen(
      (GyroscopeEvent event) {
        _gyroX = event.x;
        _gyroY = event.y;
        _gyroZ = event.z;
      },
    );
  }

  void _processSensorData() {
    final sensorData = SensorData(
      timestamp: DateTime.now(),
      accelerometerX: _accelX,
      accelerometerY: _accelY,
      accelerometerZ: _accelZ,
      gyroscopeX: _gyroX,
      gyroscopeY: _gyroY,
      gyroscopeZ: _gyroZ,
    );

    _sensorDataController.add(sensorData);

    _magnitudeHistory.add(sensorData.magnitude);
    if (_magnitudeHistory.length > _historySize) {
      _magnitudeHistory.removeAt(0);
    }

    if (_magnitudeHistory.length >= _anomalyWindowSize) {
      final anomaly = _detectAnomaly();
      if (anomaly != AnomalyType.none) {
        _anomalyController.add(anomaly);
      }
    }
  }

  AnomalyType _detectAnomaly() {
    if (_magnitudeHistory.length < _anomalyWindowSize) {
      return AnomalyType.none;
    }

    final recent = _magnitudeHistory.sublist(
      _magnitudeHistory.length - _anomalyWindowSize,
    );

    final avg = recent.reduce((a, b) => a + b) / recent.length;
    final stdDev = _calculateStdDev(recent, avg);

    final suddenIncrease = recent.last > avg + (3 * stdDev);
    final suddenDecrease = recent.last < avg - (3 * stdDev);

    final gyroMagnitude = sqrt(_gyroX * _gyroX + _gyroY * _gyroY + _gyroZ * _gyroZ);

    if (_accelZ < -15 && gyroMagnitude > 5) {
      return AnomalyType.fall;
    }

    if (suddenIncrease && avg > 20) {
      return AnomalyType.suddenRunning;
    }

    if (suddenDecrease && stdDev > 5) {
      return AnomalyType.abruptStop;
    }

    if (stdDev > 10) {
      return AnomalyType.irregularMotion;
    }

    return AnomalyType.none;
  }

  double _calculateStdDev(List<double> values, double mean) {
    final variance = values
            .map((x) => pow(x - mean, 2))
            .reduce((a, b) => a + b) /
        values.length;
    return sqrt(variance);
  }

  void stopMonitoring() {
    _accelerometerSubscription?.cancel();
    _gyroscopeSubscription?.cancel();
    _accelerometerSubscription = null;
    _gyroscopeSubscription = null;
  }

  void dispose() {
    stopMonitoring();
    _sensorDataController.close();
    _anomalyController.close();
  }
}
