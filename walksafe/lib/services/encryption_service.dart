import 'dart:convert';
import 'dart:typed_data';
import 'package:encrypt/encrypt.dart' as encrypt;
import 'package:crypto/crypto.dart';

class EncryptionService {
  static final EncryptionService instance = EncryptionService._init();
  EncryptionService._init();

  late final encrypt.Key _key;
  late final encrypt.IV _iv;
  late final encrypt.Encrypter _encrypter;

  void initialize(String secretKey) {
    final keyBytes = utf8.encode(secretKey);
    final hash = sha256.convert(keyBytes);

    _key = encrypt.Key(Uint8List.fromList(hash.bytes.sublist(0, 32)));
    _iv = encrypt.IV.fromLength(16);
    _encrypter = encrypt.Encrypter(encrypt.AES(_key));
  }

  String encryptData(String plainText) {
    try {
      final encrypted = _encrypter.encrypt(plainText, iv: _iv);
      return encrypted.base64;
    } catch (e) {
      return plainText;
    }
  }

  String decryptData(String encryptedText) {
    try {
      final encrypted = encrypt.Encrypted.fromBase64(encryptedText);
      return _encrypter.decrypt(encrypted, iv: _iv);
    } catch (e) {
      return encryptedText;
    }
  }

  Map<String, String> encryptAlertData({
    required double latitude,
    required double longitude,
    String? audioPath,
  }) {
    return {
      'latitude': encryptData(latitude.toString()),
      'longitude': encryptData(longitude.toString()),
      if (audioPath != null) 'audioPath': encryptData(audioPath),
    };
  }

  Map<String, dynamic> decryptAlertData(Map<String, String> encryptedData) {
    return {
      'latitude': double.tryParse(
            decryptData(encryptedData['latitude'] ?? ''),
          ) ??
          0.0,
      'longitude': double.tryParse(
            decryptData(encryptedData['longitude'] ?? ''),
          ) ??
          0.0,
      if (encryptedData['audioPath'] != null)
        'audioPath': decryptData(encryptedData['audioPath']!),
    };
  }

  String hashPhoneNumber(String phoneNumber) {
    final bytes = utf8.encode(phoneNumber);
    final hash = sha256.convert(bytes);
    return hash.toString();
  }
}
