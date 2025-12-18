class AlertData {
  final String id;
  final DateTime timestamp;
  final double latitude;
  final double longitude;
  final String? audioPath;
  final AlertType type;
  final AlertStatus status;
  final bool isFalsePositive;

  AlertData({
    required this.id,
    required this.timestamp,
    required this.latitude,
    required this.longitude,
    this.audioPath,
    required this.type,
    this.status = AlertStatus.triggered,
    this.isFalsePositive = false,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'timestamp': timestamp.toIso8601String(),
      'latitude': latitude,
      'longitude': longitude,
      'audioPath': audioPath,
      'type': type.toString(),
      'status': status.toString(),
      'isFalsePositive': isFalsePositive ? 1 : 0,
    };
  }

  factory AlertData.fromMap(Map<String, dynamic> map) {
    return AlertData(
      id: map['id'],
      timestamp: DateTime.parse(map['timestamp']),
      latitude: map['latitude'],
      longitude: map['longitude'],
      audioPath: map['audioPath'],
      type: AlertType.values.firstWhere(
        (e) => e.toString() == map['type'],
        orElse: () => AlertType.automatic,
      ),
      status: AlertStatus.values.firstWhere(
        (e) => e.toString() == map['status'],
        orElse: () => AlertStatus.triggered,
      ),
      isFalsePositive: map['isFalsePositive'] == 1,
    );
  }

  AlertData copyWith({
    String? id,
    DateTime? timestamp,
    double? latitude,
    double? longitude,
    String? audioPath,
    AlertType? type,
    AlertStatus? status,
    bool? isFalsePositive,
  }) {
    return AlertData(
      id: id ?? this.id,
      timestamp: timestamp ?? this.timestamp,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      audioPath: audioPath ?? this.audioPath,
      type: type ?? this.type,
      status: status ?? this.status,
      isFalsePositive: isFalsePositive ?? this.isFalsePositive,
    );
  }
}

enum AlertType {
  automatic,
  manual,
}

enum AlertStatus {
  triggered,
  sent,
  cancelled,
}
