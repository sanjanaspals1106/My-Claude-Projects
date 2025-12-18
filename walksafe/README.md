# WalkSafe

**AI-powered safety app that detects abnormal walking patterns and alerts emergency contacts with live location and audio.**

## Features

### Core Safety Features
- **AI Motion Detection**: Continuously monitors walking behavior using accelerometer and gyroscope sensors
- **Automatic Alerts**: Detects abnormal patterns (sudden running, abrupt stops, irregular motion, falls)
- **Manual Panic Button**: Emergency button for instant alert triggering
- **Live Location Sharing**: Real-time GPS tracking sent to emergency contacts
- **Ambient Audio Recording**: Secure audio capture during emergencies
- **End-to-End Encryption**: All alert data is encrypted for privacy

### User Features
- **Emergency Contacts Management**: Add, edit, and manage trusted contacts
- **Alert History**: View past alerts and mark false positives
- **Background Monitoring**: Continuous protection even when app is in background
- **False Positive Feedback**: Machine learning improves accuracy over time

## Technology Stack

- **Framework**: Flutter 3.38.5
- **Language**: Dart 3.10.4
- **State Management**: Provider
- **Local Database**: SQLite (sqflite)
- **Sensors**: sensors_plus
- **Location**: geolocator
- **Audio**: record package
- **Encryption**: encrypt + crypto
- **Notifications**: flutter_local_notifications

## Installation

### Prerequisites
- Flutter SDK 3.38.5 or higher
- Dart SDK 3.10.4 or higher
- Android Studio / Xcode for mobile development

### Setup

1. **Install dependencies**:
```bash
cd walksafe
flutter pub get
```

2. **Run the app**:
```bash
# For Android
flutter run

# For iOS
flutter run
```

3. **Build for release**:
```bash
# Android APK
flutter build apk --release

# Android App Bundle
flutter build appbundle --release

# iOS
flutter build ios --release
```

## Project Structure

```
lib/
├── models/          # Data models (EmergencyContact, AlertData, SensorData)
├── services/        # Business logic services
│   ├── database_service.dart
│   ├── location_service.dart
│   ├── audio_service.dart
│   ├── sensor_service.dart
│   ├── encryption_service.dart
│   ├── alert_service.dart
│   └── notification_service.dart
├── providers/       # State management
│   └── app_provider.dart
├── screens/         # UI screens
│   ├── home_screen.dart
│   ├── contacts_screen.dart
│   ├── alerts_screen.dart
│   └── settings_screen.dart
├── widgets/         # Reusable widgets
└── utils/           # Utility functions
```

## Permissions

### Android
The app requires the following permissions:
- Location (Fine, Coarse, Background)
- Microphone
- Storage
- SMS
- Internet
- Foreground Service
- Notifications

### iOS
- Location (When In Use, Always)
- Microphone
- Motion Sensors
- Background Modes (location, audio)

## How It Works

1. **Launch the App**: Open WalkSafe and add emergency contacts
2. **Start Monitoring**: Tap "Start Monitoring" to enable AI detection
3. **Automatic Protection**: The app continuously monitors your walking patterns
4. **Alert Detection**: If abnormal behavior is detected, you have 10 seconds to cancel
5. **Emergency Notification**: If not cancelled, your contacts receive:
   - Live location link (Google Maps)
   - Audio recording
   - Timestamp of the alert

## Usage

### Adding Emergency Contacts
1. Go to Contacts screen
2. Tap the + button
3. Enter name and phone number
4. Contact will receive SMS alerts during emergencies

### Starting Monitoring
1. Tap "Start Monitoring" on home screen
2. Grant required permissions
3. The app will run in the background

### Manual Alert
1. Press the red emergency button
2. Confirm the alert
3. Contacts are immediately notified

### Managing False Positives
1. Go to Alert History
2. Select an alert
3. Tap "Mark as false positive"
4. This helps improve detection accuracy

## Security & Privacy

- **On-Device Processing**: All sensor data is processed locally
- **Encrypted Storage**: Alert data is encrypted using AES-256
- **No Cloud Storage**: Your data stays on your device
- **Secure Transmission**: Location and audio are encrypted before sending

## Development Team

**Team CodeStormers**
- Rama Sanjana (Team Captain)
- Boppidi Vinay Kumar Reddy
- Kalva Sreemaanya Reddy

**Institution**: Chaitanya Bharathi Institute of Technology

## Domain

Industry 4.0 - Smart Safety Solution

## License

This project is developed as part of an academic initiative.

## Support

For issues and feature requests, please contact the development team.

---

**Built with care for safer communities**
