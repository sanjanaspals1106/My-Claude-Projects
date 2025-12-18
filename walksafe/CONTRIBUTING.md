# Contributing to WalkSafe

Thank you for your interest in contributing to WalkSafe! This document provides guidelines for contributing to the project.

## Getting Started

### Prerequisites

- Flutter SDK 3.38.5 or higher
- Dart SDK 3.10.4 or higher
- Xcode (for iOS development)
- Android Studio (for Android development)
- Python 3.8+ (for ML model training - optional)

### Setting Up Development Environment

1. **Clone the repository**
```bash
git clone <repository-url>
cd walksafe
```

2. **Install dependencies**
```bash
flutter pub get
```

3. **Run the app**
```bash
# iOS
flutter run -d ios

# Android
flutter run -d android
```

## Project Structure

```
lib/
├── models/          # Data models
├── services/        # Business logic services
├── providers/       # State management
├── screens/         # UI screens
├── widgets/         # Reusable widgets
└── utils/           # Utility functions
```

## Development Guidelines

### Code Style

- Follow the [Dart Style Guide](https://dart.dev/guides/language/effective-dart/style)
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Commit Messages

Use clear and descriptive commit messages:

```
feat: add ML-based anomaly detection
fix: resolve location permission crash
docs: update README installation steps
refactor: simplify sensor data processing
```

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Testing

Before submitting a PR:

1. Run tests
```bash
flutter test
```

2. Check for lint errors
```bash
flutter analyze
```

3. Test on both iOS and Android if possible

## ML Model Development

### Training Custom Models

1. **Collect sensor data** with proper labels
2. **Train the model** using the provided script:
```bash
python train_model.py
```

3. **Test the model** before deployment:
```bash
python create_dummy_model.py
```

### Model Requirements

- Input shape: `[1, 50, 7]` (batch, window_size, features)
- Output shape: `[1, 5]` (batch, classes)
- Classes: `[normal, running, stop, irregular, fall]`
- Format: TensorFlow Lite (.tflite)

## Feature Requests

We welcome feature requests! Please:

1. Check if the feature already exists
2. Create an issue describing the feature
3. Explain why it would be useful
4. Provide examples if possible

## Bug Reports

When reporting bugs, please include:

- Device and OS version
- Flutter version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Error logs

## Areas for Contribution

### High Priority

- [ ] Background service for continuous monitoring
- [ ] Battery optimization
- [ ] Improved ML model accuracy
- [ ] Integration with wearables
- [ ] Voice activation

### Medium Priority

- [ ] Multi-language support
- [ ] Dark theme
- [ ] Statistics dashboard
- [ ] Export alert history
- [ ] Custom alert sound/vibration

### Documentation

- [ ] Video tutorials
- [ ] API documentation
- [ ] Architecture diagrams
- [ ] Deployment guides

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Provide constructive feedback
- Focus on the issue, not the person

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## Questions?

Feel free to reach out to the team or create an issue for any questions.

---

**Thank you for contributing to WalkSafe and making communities safer!**
