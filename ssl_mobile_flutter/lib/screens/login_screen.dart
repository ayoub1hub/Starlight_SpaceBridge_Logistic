import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:math' as math;
import 'dart:ui';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> with TickerProviderStateMixin {
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  final _storage = const FlutterSecureStorage();

  bool _isLoading = false;
  String? _errorMessage;

  late AnimationController _orbitController;
  late AnimationController _glowController;
  late AnimationController _cardController;

  @override
  void initState() {
    super.initState();
    _orbitController = AnimationController(
      duration: const Duration(seconds: 20),
      vsync: this,
    )..repeat();

    _glowController = AnimationController(
      duration: const Duration(seconds: 3),
      vsync: this,
    )..repeat(reverse: true);

    _cardController = AnimationController(
      duration: const Duration(milliseconds: 1200),
      vsync: this,
    );

    _cardController.forward();
  }

  @override
  void dispose() {
    _orbitController.dispose();
    _glowController.dispose();
    _cardController.dispose();
    _usernameController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    final username = _usernameController.text.trim();
    final password = _passwordController.text;

    if (username.isEmpty || password.isEmpty) {
      setState(() => _errorMessage = 'Enter credentials to proceed');
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
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
        await _storage.write(key: 'access_token', value: data['access_token']);
        await _storage.write(key: 'refresh_token', value: data['refresh_token']);

        if (mounted) context.go('/dashboard');
      } else {
        final errorData = jsonDecode(response.body);
        setState(() => _errorMessage = errorData['error_description'] ?? 'Authentication failed');
      }
    } catch (e) {
      setState(() => _errorMessage = 'Network error occurred');
    }

    setState(() => _isLoading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: RadialGradient(
            center: Alignment.topRight,
            radius: 1.5,
            colors: [
              Color(0xFF0A1929),
              Color(0xFF001E3C),
              Color(0xFF000000),
            ],
          ),
        ),
        child: Stack(
          children: [
            // Orbital rings
            AnimatedBuilder(
              animation: _orbitController,
              builder: (context, child) {
                return CustomPaint(
                  painter: OrbitPainter(_orbitController.value),
                  size: Size.infinite,
                );
              },
            ),

            // Blur overlay for depth
            BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 0.5, sigmaY: 0.5),
              child: Container(color: Colors.transparent),
            ),

            // Main content
            SafeArea(
              child: Center(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      // Animated logo
                      AnimatedBuilder(
                        animation: _glowController,
                        builder: (context, child) {
                          return Container(
                            width: 120,
                            height: 120,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              gradient: RadialGradient(
                                colors: [
                                  Color.lerp(
                                    const Color(0xFF0A84FF),
                                    const Color(0xFF00D4FF),
                                    _glowController.value,
                                  )!.withOpacity(0.3),
                                  Colors.transparent,
                                ],
                              ),
                            ),
                            child: Center(
                              child: Container(
                                width: 70,
                                height: 70,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  gradient: LinearGradient(
                                    begin: Alignment.topLeft,
                                    end: Alignment.bottomRight,
                                    colors: [
                                      Color.lerp(
                                        const Color(0xFF0A84FF),
                                        const Color(0xFF00D4FF),
                                        _glowController.value,
                                      )!,
                                      const Color(0xFF0055FF),
                                    ],
                                  ),
                                  boxShadow: [
                                    BoxShadow(
                                      color: const Color(0xFF0A84FF).withOpacity(0.6),
                                      blurRadius: 30,
                                      spreadRadius: 10,
                                    ),
                                  ],
                                ),
                                child: const Icon(
                                  Icons.rocket_launch_outlined,
                                  color: Colors.white,
                                  size: 36,
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                      const SizedBox(height: 48),

                      // Title
                      const Text(
                        'SSL',
                        style: TextStyle(
                          fontSize: 48,
                          fontWeight: FontWeight.w900,
                          color: Colors.white,
                          letterSpacing: 12,
                          height: 1,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Container(
                        height: 1,
                        width: 200,
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              Colors.transparent,
                              const Color(0xFF0A84FF),
                              Colors.transparent,
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'DELIVERY OPERATIONS',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: Colors.white.withOpacity(0.5),
                          letterSpacing: 4,
                        ),
                      ),
                      const SizedBox(height: 64),

                      // Login card
                      FadeTransition(
                        opacity: _cardController,
                        child: SlideTransition(
                          position: Tween<Offset>(
                            begin: const Offset(0, 0.1),
                            end: Offset.zero,
                          ).animate(CurvedAnimation(
                            parent: _cardController,
                            curve: Curves.easeOutCubic,
                          )),
                          child: Container(
                            constraints: const BoxConstraints(maxWidth: 440),
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(24),
                              child: BackdropFilter(
                                filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
                                child: Container(
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      begin: Alignment.topLeft,
                                      end: Alignment.bottomRight,
                                      colors: [
                                        Colors.white.withOpacity(0.08),
                                        Colors.white.withOpacity(0.03),
                                      ],
                                    ),
                                    borderRadius: BorderRadius.circular(24),
                                    border: Border.all(
                                      color: Colors.white.withOpacity(0.1),
                                      width: 1.5,
                                    ),
                                  ),
                                  padding: const EdgeInsets.all(40),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        'Driver Authentication',
                                        style: TextStyle(
                                          fontSize: 13,
                                          fontWeight: FontWeight.w600,
                                          color: Colors.white.withOpacity(0.6),
                                          letterSpacing: 2,
                                        ),
                                      ),
                                      const SizedBox(height: 32),
                                      _buildTextField(
                                        controller: _usernameController,
                                        label: 'Username',
                                        icon: Icons.person_outline,
                                      ),
                                      const SizedBox(height: 24),
                                      _buildTextField(
                                        controller: _passwordController,
                                        label: 'Password',
                                        icon: Icons.lock_outline,
                                        isPassword: true,
                                        onSubmitted: (_) => _login(),
                                      ),
                                      if (_errorMessage != null) ...[
                                        const SizedBox(height: 24),
                                        Container(
                                          padding: const EdgeInsets.all(16),
                                          decoration: BoxDecoration(
                                            color: const Color(0xFFFF453A).withOpacity(0.1),
                                            borderRadius: BorderRadius.circular(12),
                                            border: Border.all(
                                              color: const Color(0xFFFF453A).withOpacity(0.3),
                                            ),
                                          ),
                                          child: Row(
                                            children: [
                                              const Icon(
                                                Icons.error_outline,
                                                color: Color(0xFFFF453A),
                                                size: 20,
                                              ),
                                              const SizedBox(width: 12),
                                              Expanded(
                                                child: Text(
                                                  _errorMessage!,
                                                  style: const TextStyle(
                                                    color: Color(0xFFFF453A),
                                                    fontSize: 13,
                                                    fontWeight: FontWeight.w500,
                                                  ),
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                      const SizedBox(height: 40),
                                      _buildLoginButton(),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    bool isPassword = false,
    Function(String)? onSubmitted,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label.toUpperCase(),
          style: TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.w700,
            color: Colors.white.withOpacity(0.5),
            letterSpacing: 1.5,
          ),
        ),
        const SizedBox(height: 12),
        Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.2),
                blurRadius: 20,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: TextField(
            controller: controller,
            obscureText: isPassword,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.w500,
            ),
            onSubmitted: onSubmitted,
            decoration: InputDecoration(
              prefixIcon: Icon(
                icon,
                color: const Color(0xFF0A84FF),
                size: 20,
              ),
              filled: true,
              fillColor: Colors.white.withOpacity(0.05),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(color: Colors.white.withOpacity(0.1)),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(color: Colors.white.withOpacity(0.1)),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(color: Color(0xFF0A84FF), width: 2),
              ),
              contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildLoginButton() {
    return Container(
      width: double.infinity,
      height: 56,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF0A84FF), Color(0xFF0055FF)],
        ),
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF0A84FF).withOpacity(0.4),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: ElevatedButton(
        onPressed: _isLoading ? null : _login,
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.transparent,
          shadowColor: Colors.transparent,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
        child: _isLoading
            ? const SizedBox(
          height: 24,
          width: 24,
          child: CircularProgressIndicator(
            color: Colors.white,
            strokeWidth: 2.5,
          ),
        )
            : const Text(
          'AUTHENTICATE',
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w700,
            color: Colors.white,
            letterSpacing: 2,
          ),
        ),
      ),
    );
  }
}

class OrbitPainter extends CustomPainter {
  final double progress;

  OrbitPainter(this.progress);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5;

    final center = Offset(size.width * 0.5, size.height * 0.4);

    // Draw multiple orbital rings
    for (int i = 0; i < 3; i++) {
      final radius = 150.0 + (i * 80);
      final opacity = 0.15 - (i * 0.04);

      paint.color = Colors.white.withOpacity(opacity);
      canvas.drawCircle(center, radius, paint);

      // Draw orbiting point
      final angle = (progress * 2 * math.pi) + (i * math.pi / 3);
      final x = center.dx + radius * math.cos(angle);
      final y = center.dy + radius * math.sin(angle);

      final pointPaint = Paint()
        ..color = const Color(0xFF0A84FF).withOpacity(0.6)
        ..style = PaintingStyle.fill;

      canvas.drawCircle(Offset(x, y), 3, pointPaint);

      // Draw glow
      final glowPaint = Paint()
        ..color = const Color(0xFF0A84FF).withOpacity(0.2)
        ..style = PaintingStyle.fill
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 10);

      canvas.drawCircle(Offset(x, y), 8, glowPaint);
    }
  }

  @override
  bool shouldRepaint(OrbitPainter oldDelegate) => progress != oldDelegate.progress;
}