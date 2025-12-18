import 'dart:async';
import 'package:url_launcher/url_launcher.dart';
import '../models/alert_data.dart';
import '../models/emergency_contact.dart';
import '../models/sensor_data.dart';
import 'location_service.dart';
import 'audio_service.dart';
import 'database_service.dart';
import 'encryption_service.dart';
import 'notification_service.dart';

class AlertService {
  static final AlertService instance = AlertService._init();
  AlertService._init();

  final _locationService = LocationService.instance;
  final _audioService = AudioService.instance;
  final _databaseService = DatabaseService.instance;
  final _encryptionService = EncryptionService.instance;
  final _notificationService = NotificationService.instance;

  bool _isAlertActive = false;
  Timer? _confirmationTimer;
  AlertData? _pendingAlert;

  final StreamController<AlertData> _alertController =
      StreamController<AlertData>.broadcast();

  Stream<AlertData> get alertStream => _alertController.stream;
  bool get isAlertActive => _isAlertActive;

  Future<void> triggerAlert({
    required AlertType type,
    AnomalyType? anomalyType,
  }) async {
    if (_isAlertActive) return;

    _isAlertActive = true;

    try {
      final position = await _locationService.getCurrentLocation();
      if (position == null) {
        _isAlertActive = false;
        return;
      }

      final audioPath = await _audioService.startRecording();

      final alert = AlertData(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        timestamp: DateTime.now(),
        latitude: position.latitude,
        longitude: position.longitude,
        audioPath: audioPath,
        type: type,
        status: AlertStatus.triggered,
      );

      _pendingAlert = alert;

      if (type == AlertType.automatic) {
        await _showConfirmationDialog(alert);
      } else {
        await _sendAlert(alert);
      }
    } catch (e) {
      _isAlertActive = false;
    }
  }

  Future<void> _showConfirmationDialog(AlertData alert) async {
    await _notificationService.showAlertConfirmation(
      'Abnormal Activity Detected',
      'Tap to cancel the alert within 10 seconds',
    );

    _confirmationTimer = Timer(const Duration(seconds: 10), () {
      _sendAlert(alert);
    });
  }

  Future<void> cancelPendingAlert() async {
    _confirmationTimer?.cancel();
    _confirmationTimer = null;

    if (_pendingAlert != null) {
      _pendingAlert = _pendingAlert!.copyWith(
        status: AlertStatus.cancelled,
      );
      await _databaseService.insertAlert(_pendingAlert!);
      _pendingAlert = null;
    }

    await _audioService.stopRecording();
    _isAlertActive = false;

    await _notificationService.cancelAll();
  }

  Future<void> _sendAlert(AlertData alert) async {
    try {
      final contacts = await _databaseService.getActiveContacts();

      if (contacts.isEmpty) {
        _isAlertActive = false;
        return;
      }

      final encryptedData = _encryptionService.encryptAlertData(
        latitude: alert.latitude,
        longitude: alert.longitude,
        audioPath: alert.audioPath,
      );

      final locationUrl = _locationService.getGoogleMapsUrl(
        alert.latitude,
        alert.longitude,
      );

      for (final contact in contacts) {
        await _sendSMSToContact(contact, locationUrl, alert);
      }

      final sentAlert = alert.copyWith(status: AlertStatus.sent);
      await _databaseService.insertAlert(sentAlert);
      _alertController.add(sentAlert);

      await Future.delayed(const Duration(seconds: 30));
      await _audioService.stopRecording();

      _isAlertActive = false;
      _pendingAlert = null;

      await _notificationService.showNotification(
        'Alert Sent',
        'Emergency contacts have been notified',
      );
    } catch (e) {
      _isAlertActive = false;
    }
  }

  Future<void> _sendSMSToContact(
    EmergencyContact contact,
    String locationUrl,
    AlertData alert,
  ) async {
    final message = Uri.encodeComponent(
      'EMERGENCY ALERT from WalkSafe!\n\n'
      'An abnormal activity has been detected.\n\n'
      'Live Location: $locationUrl\n\n'
      'Timestamp: ${alert.timestamp.toString()}\n\n'
      'Please check on me immediately!',
    );

    final smsUrl = 'sms:${contact.phoneNumber}?body=$message';

    try {
      final uri = Uri.parse(smsUrl);
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri);
      }
    } catch (e) {
      // Continue with other contacts even if one fails
    }
  }

  Future<void> markAsFalsePositive(String alertId) async {
    final alerts = await _databaseService.getAllAlerts();
    final alert = alerts.firstWhere((a) => a.id == alertId);

    final updatedAlert = alert.copyWith(isFalsePositive: true);
    await _databaseService.updateAlert(updatedAlert);
  }

  void dispose() {
    _confirmationTimer?.cancel();
    _alertController.close();
  }
}
