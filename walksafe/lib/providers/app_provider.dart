import 'package:flutter/material.dart';
import '../models/emergency_contact.dart';
import '../models/alert_data.dart';
import '../models/sensor_data.dart';
import '../services/database_service.dart';
import '../services/sensor_service.dart';
import '../services/alert_service.dart';

class AppProvider with ChangeNotifier {
  final _databaseService = DatabaseService.instance;
  final _sensorService = SensorService.instance;
  final _alertService = AlertService.instance;

  List<EmergencyContact> _contacts = [];
  List<AlertData> _alerts = [];
  bool _isMonitoring = false;
  AnomalyType _lastAnomaly = AnomalyType.none;

  List<EmergencyContact> get contacts => _contacts;
  List<AlertData> get alerts => _alerts;
  bool get isMonitoring => _isMonitoring;
  AnomalyType get lastAnomaly => _lastAnomaly;

  Future<void> loadContacts() async {
    _contacts = await _databaseService.getAllContacts();
    notifyListeners();
  }

  Future<void> addContact(EmergencyContact contact) async {
    await _databaseService.insertContact(contact);
    await loadContacts();
  }

  Future<void> updateContact(EmergencyContact contact) async {
    await _databaseService.updateContact(contact);
    await loadContacts();
  }

  Future<void> deleteContact(String id) async {
    await _databaseService.deleteContact(id);
    await loadContacts();
  }

  Future<void> loadAlerts() async {
    _alerts = await _databaseService.getAllAlerts();
    notifyListeners();
  }

  void startMonitoring() {
    if (_isMonitoring) return;

    _sensorService.startMonitoring();
    _isMonitoring = true;
    notifyListeners();

    _sensorService.anomalyStream.listen((anomaly) {
      _lastAnomaly = anomaly;
      notifyListeners();

      if (anomaly != AnomalyType.none) {
        _alertService.triggerAlert(
          type: AlertType.automatic,
          anomalyType: anomaly,
        );
      }
    });

    _alertService.alertStream.listen((alert) {
      loadAlerts();
    });
  }

  void stopMonitoring() {
    _sensorService.stopMonitoring();
    _isMonitoring = false;
    notifyListeners();
  }

  Future<void> triggerManualAlert() async {
    await _alertService.triggerAlert(type: AlertType.manual);
    await loadAlerts();
  }

  Future<void> cancelAlert() async {
    await _alertService.cancelPendingAlert();
  }

  Future<void> markAlertAsFalsePositive(String alertId) async {
    await _alertService.markAsFalsePositive(alertId);
    await loadAlerts();
  }
}
