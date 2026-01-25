import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../widgets/starfield_background.dart';
import '../widgets/orbital_glass_card.dart';
import 'dart:math';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  final _storage = const FlutterSecureStorage();

  bool _loading = false;
  String? _errorMessage;

  Future<void> _performLogin() async {
    print('=== DÉBUT LOGIN ===');
    final username = _usernameController.text.trim();
    final password = _passwordController.text;

    print('Username: $username');
    print('Password : ${password}');

    if (username.isEmpty || password.isEmpty) {
      print('ERREUR: Champs vides');
      setState(() => _errorMessage = 'Veuillez remplir tous les champs');
      return;
    }

    setState(() {
      _loading = true;
      _errorMessage= null;
    });

    try {
      final response = await http.post(
        Uri.parse('http://localhost:8079/realms/ssl-realm/protocol/openid-connect/token'),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: {
          'grant_type': 'password',
          'client_id': 'ssl-mobile',
          'username': username,
          'password': password,
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final accessToken = data['access_token'];
        final refreshToken = data['refresh_token'];

        // DEBUG : Afficher le token reçu
        print('✅ Token reçu de Keycloak:');
        print('   Length: ${accessToken?.length ?? 0}');
        // Stocker les tokens
        await _storage.write(key: 'access_token', value: accessToken);
        await _storage.write(key: 'refresh_token', value: refreshToken);

        // VÉRIFICATION : Relire immédiatement pour confirmer
        final verifyToken = await _storage.read(key: 'access_token');
        print('✅ Token stocké et vérifié:');
        print('   Length: ${verifyToken?.length ?? 0}');
        print('   Match: ${verifyToken == accessToken}');

        if (mounted) {
          print('✅ go to Dashboard:');
          context.go('/dashboard');
        }
      } else {
        final errorData = jsonDecode(response.body);
        setState(() => _errorMessage = errorData['error_description'] ?? 'Identifiants invalides');
      }
    } catch (e) {
      print('❌ LOGIN EXCEPTION: $e');

      setState(() {
        _errorMessage = e.toString().contains('XMLHttpRequest') ||
            e.toString().contains('CORS')
            ? 'Erreur CORS (Keycloak / navigateur)'
            : 'Erreur technique: $e';
      });
    }


    setState(() => _loading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          const StarfieldBackground(intensity: 0.9),
          Center(
            child: OrbitalGlassCard(
              child: Padding(
                padding: const EdgeInsets.all(40),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      'SSL SPACE DELIVERY OPS',
                      style: Theme.of(context).textTheme.headlineLarge,
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 12),
                    Text(
                      'Courier Astronaut Authentication',
                      style: TextStyle(color: Colors.blueAccent, letterSpacing: 4, fontSize: 18),
                    ),
                    const SizedBox(height: 60),

                    TextField(
                      controller: _usernameController,
                      style: const TextStyle(color: Colors.white),
                      decoration: InputDecoration(
                        labelText: 'Username',
                        labelStyle: const TextStyle(color: Colors.white70),
                        enabledBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.white.withOpacity(0.3))),
                        focusedBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.blueAccent)),
                      ),
                    ),
                    const SizedBox(height: 20),
                    TextField(
                      controller: _passwordController,
                      obscureText: true,
                      style: const TextStyle(color: Colors.white),
                      decoration: InputDecoration(
                        labelText: 'Password',
                        labelStyle: const TextStyle(color: Colors.white70),
                        enabledBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.white.withOpacity(0.3))),
                        focusedBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.blueAccent)),
                      ),
                    ),

                    if (_errorMessage != null)
                      Padding(
                        padding: const EdgeInsets.only(top: 20),
                        child: Text(
                          _errorMessage!,
                          style: const TextStyle(color: Colors.redAccent, fontSize: 16),
                          textAlign: TextAlign.center,
                        ),
                      ),

                    const SizedBox(height: 40),
                    ElevatedButton(
                      onPressed: _loading ? null : _performLogin,
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 60, vertical: 20),
                        backgroundColor: const Color(0xFF005288),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                      ),
                      child: _loading
                          ? Row(
                        mainAxisSize: MainAxisSize.min,
                        children: const [
                          SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)),
                          SizedBox(width: 16),
                          Text('LAUNCHING...', style: TextStyle(fontSize: 18, letterSpacing: 2)),
                        ],
                      )
                          : const Text('INITIATE ORBITAL AUTH', style: TextStyle(fontSize: 18, letterSpacing: 2)),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}