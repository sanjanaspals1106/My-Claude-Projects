# WalkSafe - Complete Setup Guide

This guide will help you set up and run the WalkSafe app on both iOS and Android.

## Prerequisites

- ✅ Flutter SDK 3.38.5 (installed)
- ✅ Xcode (installed)
- 🔧 CocoaPods (needed for iOS)
- 🔧 Android Studio (optional, for Android)

## Quick Setup (5 minutes)

### Step 1: Install CocoaPods

CocoaPods is required for iOS development. Install it using:

```bash
sudo gem install cocoapods
```

### Step 2: Navigate to Project

```bash
cd /Users/sanjana1106/Desktop/WalkSafe/walksafe
```

### Step 3: Install iOS Dependencies

```bash
cd ios
pod install
cd ..
```

### Step 4: Open iOS Simulator

```bash
open -a Simulator
```

### Step 5: Run the App

```bash
/Users/sanjana1106/development/flutter/bin/flutter run
```

The app will launch on the iOS simulator!

## Detailed Setup Instructions

### For iOS Development

1. **Install CocoaPods** (if not done yet)
   ```bash
   sudo gem install cocoapods
   ```

2. **Install Pods**
   ```bash
   cd ios
   pod install
   cd ..
   ```

3. **Open in Xcode** (optional, for more control)
   ```bash
   open ios/Runner.xcworkspace
   ```

4. **Run on iOS Simulator**
   ```bash
   flutter run -d ios
   ```

5. **Run on Physical iPhone**
   - Connect iPhone via USB
   - Trust the computer on iPhone
   - Run: `flutter run`
   - Select your device when prompted

### For Android Development

1. **Install Android Studio** (if not installed)
   Download from: https://developer.android.com/studio

2. **Create Android Emulator**
   - Open Android Studio
   - Tools → Device Manager
   - Create Virtual Device
   - Select a phone model
   - Download a system image (API 30+)
   - Finish setup

3. **Run on Android Emulator**
   ```bash
   flutter run -d android
   ```

4. **Run on Physical Android Device**
   - Enable Developer Options on Android
   - Enable USB Debugging
   - Connect via USB
   - Run: `flutter run`

## Building for Release

### iOS Release Build

```bash
# For App Store
flutter build ios --release

# For TestFlight
flutter build ipa --release
```

### Android Release Build

```bash
# APK
flutter build apk --release

# App Bundle (for Play Store)
flutter build appbundle --release
```

## TensorFlow Lite Model Setup (Optional)

The app works without a custom ML model (uses statistical detection). To add ML:

### Option 1: Quick Dummy Model (for testing)

```bash
# Install TensorFlow
pip3 install tensorflow numpy

# Generate model
python3 create_dummy_model.py
```

This creates a basic working model at `assets/models/walking_anomaly_model.tflite`.

### Option 2: Train Custom Model (advanced)

```bash
# Install requirements
pip3 install tensorflow numpy pandas scikit-learn

# Train model with your data
python3 train_model.py
```

## Testing the App

### Unit Tests
```bash
flutter test
```

### Integration Tests
```bash
flutter drive --target=test_driver/app.dart
```

### Code Analysis
```bash
flutter analyze
```

## Common Issues & Solutions

### Issue: "CocoaPods not found"
**Solution:**
```bash
sudo gem install cocoapods
```

### Issue: "Xcode not found"
**Solution:**
Install Xcode from App Store, then run:
```bash
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -runFirstLaunch
```

### Issue: "Pod install fails"
**Solution:**
```bash
cd ios
pod repo update
pod install
cd ..
```

### Issue: "Permission denied" errors
**Solution:**
```bash
sudo chown -R $(whoami) /Users/$(whoami)/Desktop/WalkSafe
```

### Issue: "Module not found" in iOS
**Solution:**
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
flutter clean
flutter pub get
```

## Development Workflow

1. **Start Simulator**
   ```bash
   open -a Simulator
   ```

2. **Enable Hot Reload**
   ```bash
   flutter run
   ```
   - Press `r` for hot reload
   - Press `R` for hot restart
   - Press `q` to quit

3. **View Logs**
   ```bash
   flutter logs
   ```

4. **Clear Build Cache**
   ```bash
   flutter clean
   flutter pub get
   ```

## App Features Setup

### Emergency Contacts
1. Launch app
2. Navigate to Contacts screen
3. Add emergency contacts with names and phone numbers
4. Toggle contacts on/off as needed

### Start Monitoring
1. Tap "Start Monitoring" on home screen
2. Grant permissions when prompted:
   - Location (Always)
   - Microphone
   - Notifications
3. App will continuously monitor walking patterns

### Test Emergency Alert
1. Press the red emergency button
2. Confirm alert in dialog
3. Check that SMS is sent to contacts

## Permissions Checklist

Make sure to grant these permissions when prompted:

- ✅ Location Services (Always)
- ✅ Microphone Access
- ✅ Notifications
- ✅ Motion & Fitness (iOS)
- ✅ SMS (for sending alerts)

## Production Deployment

### iOS App Store

1. Set up App Store Connect account
2. Create app in App Store Connect
3. Update `ios/Runner/Info.plist` with bundle ID
4. Build: `flutter build ipa --release`
5. Upload via Xcode or Transporter app
6. Submit for review

### Google Play Store

1. Create Google Play Console account
2. Create new app in console
3. Update `android/app/build.gradle` with signing config
4. Build: `flutter build appbundle --release`
5. Upload AAB file to Play Console
6. Complete store listing
7. Submit for review

## Performance Tips

- **Battery Optimization**: Adjust sensor sampling rate if needed
- **Background Usage**: App uses minimal battery in background
- **Data Storage**: Alerts are stored locally, clear old alerts periodically
- **Network**: App works offline, SMS sent when network available

## Support

For issues:
1. Check this guide
2. Run `flutter doctor` to diagnose issues
3. Check GitHub Issues
4. Contact team at: sanjanaspals1106@gmail.com

## Next Steps

1. ✅ Run the app on simulator/emulator
2. ✅ Add emergency contacts
3. ✅ Test the emergency button
4. ✅ Test automatic detection (shake phone)
5. ✅ Review alert history
6. 🔧 Train custom ML model (optional)
7. 🔧 Customize UI colors/themes (optional)
8. 🚀 Deploy to stores

---

**You're ready to go! Run `flutter run` to start WalkSafe.**
