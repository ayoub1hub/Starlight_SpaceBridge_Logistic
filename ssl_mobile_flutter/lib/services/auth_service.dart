import 'package:flutter_appauth/flutter_appauth.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthService {
  static final FlutterAppAuth _appAuth = FlutterAppAuth();
  static const FlutterSecureStorage _storage = FlutterSecureStorage();

  static const String clientId = 'ssl-mobile';                    // ton client Keycloak
  static const String redirectUri = 'com.ssl.app://callback';     // doit matcher Keycloak
  static const String issuer = 'http://localhost:8079/realms/ssl-realm'; // emulator

  static Future<bool> login() async {
    try {
      final result = await _appAuth.authorizeAndExchangeCode(
        AuthorizationTokenRequest(
          clientId,
          redirectUri,
          issuer: issuer,
          scopes: ['openid', 'profile', 'email'],
          promptValues: ['login'], // force l'écran login
        ),
      );

      if (result?.accessToken != null) {
        await _storage.write(key: 'access_token', value: result!.accessToken!);
        await _storage.write(key: 'refresh_token', value: result.refreshToken);
        return true;
      }
    } catch (e) {
      print('Erreur auth: $e');
    }
    return false;
  }

  static Future<String?> getToken() async {
    return await _storage.read(key: 'access_token');
  }

  static Future<void> logout() async {
    await _storage.deleteAll();
  }
}