class SensorData {
  final DateTime timestamp;
  final double accelerometerX;
  final double accelerometerY;
  final double accelerometerZ;
  final double gyroscopeX;
  final double gyroscopeY;
  final double gyroscopeZ;
  final double magnitude;

  SensorData({
    required this.timestamp,
    required this.accelerometerX,
    required this.accelerometerY,
    required this.accelerometerZ,
    required this.gyroscopeX,
    required this.gyroscopeY,
    required this.gyroscopeZ,
  }) : magnitude = _calculateMagnitude(
          accelerometerX,
          accelerometerY,
          accelerometerZ,
        );

  static double _calculateMagnitude(double x, double y, double z) {
    return (x * x + y * y + z * z);
  }

  List<double> toFeatureVector() {
    return [
      accelerometerX,
      accelerometerY,
      accelerometerZ,
      gyroscopeX,
      gyroscopeY,
      gyroscopeZ,
      magnitude,
    ];
  }

  Map<String, dynamic> toMap() {
    return {
      'timestamp': timestamp.toIso8601String(),
      'accelerometerX': accelerometerX,
      'accelerometerY': accelerometerY,
      'accelerometerZ': accelerometerZ,
      'gyroscopeX': gyroscopeX,
      'gyroscopeY': gyroscopeY,
      'gyroscopeZ': gyroscopeZ,
      'magnitude': magnitude,
    };
  }
}

enum AnomalyType {
  suddenRunning,
  abruptStop,
  irregularMotion,
  fall,
  none,
}
