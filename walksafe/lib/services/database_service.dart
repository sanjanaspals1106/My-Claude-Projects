import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import '../models/emergency_contact.dart';
import '../models/alert_data.dart';

class DatabaseService {
  static final DatabaseService instance = DatabaseService._init();
  static Database? _database;

  DatabaseService._init();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDB('walksafe.db');
    return _database!;
  }

  Future<Database> _initDB(String filePath) async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, filePath);

    return await openDatabase(
      path,
      version: 1,
      onCreate: _createDB,
    );
  }

  Future _createDB(Database db, int version) async {
    const idType = 'TEXT PRIMARY KEY';
    const textType = 'TEXT NOT NULL';
    const intType = 'INTEGER NOT NULL';
    const realType = 'REAL NOT NULL';

    await db.execute('''
      CREATE TABLE emergency_contacts (
        id $idType,
        name $textType,
        phoneNumber $textType,
        isActive $intType
      )
    ''');

    await db.execute('''
      CREATE TABLE alerts (
        id $idType,
        timestamp $textType,
        latitude $realType,
        longitude $realType,
        audioPath TEXT,
        type $textType,
        status $textType,
        isFalsePositive $intType
      )
    ''');
  }

  Future<void> insertContact(EmergencyContact contact) async {
    final db = await database;
    await db.insert(
      'emergency_contacts',
      contact.toMap(),
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  Future<List<EmergencyContact>> getAllContacts() async {
    final db = await database;
    final result = await db.query('emergency_contacts');
    return result.map((map) => EmergencyContact.fromMap(map)).toList();
  }

  Future<List<EmergencyContact>> getActiveContacts() async {
    final db = await database;
    final result = await db.query(
      'emergency_contacts',
      where: 'isActive = ?',
      whereArgs: [1],
    );
    return result.map((map) => EmergencyContact.fromMap(map)).toList();
  }

  Future<void> updateContact(EmergencyContact contact) async {
    final db = await database;
    await db.update(
      'emergency_contacts',
      contact.toMap(),
      where: 'id = ?',
      whereArgs: [contact.id],
    );
  }

  Future<void> deleteContact(String id) async {
    final db = await database;
    await db.delete(
      'emergency_contacts',
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  Future<void> insertAlert(AlertData alert) async {
    final db = await database;
    await db.insert(
      'alerts',
      alert.toMap(),
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  Future<List<AlertData>> getAllAlerts() async {
    final db = await database;
    final result = await db.query(
      'alerts',
      orderBy: 'timestamp DESC',
    );
    return result.map((map) => AlertData.fromMap(map)).toList();
  }

  Future<void> updateAlert(AlertData alert) async {
    final db = await database;
    await db.update(
      'alerts',
      alert.toMap(),
      where: 'id = ?',
      whereArgs: [alert.id],
    );
  }

  Future<void> close() async {
    final db = await database;
    await db.close();
  }
}
