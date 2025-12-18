import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/app_provider.dart';
import 'screens/home_screen.dart';
import 'services/encryption_service.dart';
import 'services/notification_service.dart';
import 'services/ml_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final encryptionService = EncryptionService.instance;
  encryptionService.initialize('walksafe_secret_key_2024');

  final notificationService = NotificationService.instance;
  await notificationService.initialize();

  final mlService = MLService.instance;
  await mlService.loadModel();

  runApp(const WalkSafeApp());
}

class WalkSafeApp extends StatelessWidget {
  const WalkSafeApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => AppProvider(),
      child: MaterialApp(
        title: 'WalkSafe',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(
            seedColor: const Color(0xFF6B5CE5),
            primary: const Color(0xFF6B5CE5),
          ),
          useMaterial3: true,
          fontFamily: 'Roboto',
        ),
        home: const HomeScreen(),
      ),
    );
  }
}
