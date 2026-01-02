import 'package:flutter_appauth/flutter_appauth.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class KeycloakService {
  static final FlutterAppAuth _appAuth = FlutterAppAuth();
  static const FlutterSecureStorage _storage = FlutterSecureStorage();

  static const String clientId = 'ssl-mobile';
  static const String redirectUri = 'com.ssl.app://callback';
  static const String issuer = 'http://localhost:8079/realms/ssl-realm'; // web
  // Pour vrai téléphone : 'http://TON_IP_PC:8079/realms/ssl-realm'

  static Future<bool> login() async {
    try {
      final result = await _appAuth.authorizeAndExchangeCode(
        AuthorizationTokenRequest(
          clientId,
          redirectUri,
          issuer: issuer,
          scopes: ['openid', 'profile', 'email'],
          promptValues: ['login'],
          additionalParameters: {'prompt': 'login'},
          preferEphemeralSession: true, // ouvre navigateur complet
        ),
      );

      if (result?.accessToken != null) {
        await _storage.write(key: 'access_token', value: result!.accessToken!);
        await _storage.write(key: 'refresh_token', value: result.refreshToken ?? '');
        return true;
      }
    } catch (e) {
      print('Erreur login: $e');
    }
    return false;
  }

  static Future<String?> getToken() async => await _storage.read(key: 'access_token');
}