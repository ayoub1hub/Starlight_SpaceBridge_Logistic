import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'dart:math' as math;

class MissionStatusScreen extends StatefulWidget {
  final String id;
  const MissionStatusScreen({super.key, required this.id});

  @override
  State<MissionStatusScreen> createState() => _MissionStatusScreenState();
}

class _MissionStatusScreenState extends State<MissionStatusScreen> with TickerProviderStateMixin {
  late AnimationController _starsController;
  late AnimationController _particlesController;
  late AnimationController _buttonController;

  @override
  void initState() {
    super.initState();
    _starsController = AnimationController(
      duration: const Duration(seconds: 120),
      vsync: this,
    )..repeat();

    _particlesController = AnimationController(
      duration: const Duration(seconds: 30),
      vsync: this,
    )..repeat();

    _buttonController = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    )..forward();
  }

  @override
  void dispose() {
    _starsController.dispose();
    _particlesController.dispose();
    _buttonController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          _buildGalaxyBackground(),
          _buildAmbientParticles(),
          SafeArea(
            child: Column(
              children: [
                _buildHeader(context),
                Expanded(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      children: [
                        const SizedBox(height: 20),
                        _buildInfoCard(),
                        const SizedBox(height: 32),
                        _buildStatusButtons(context),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGalaxyBackground() {
    return AnimatedBuilder(
      animation: Listenable.merge([_starsController, _particlesController]),
      builder: (context, child) {
        return Container(
          decoration: const BoxDecoration(
            gradient: RadialGradient(
              center: Alignment(-0.3, -0.7),
              radius: 1.8,
              colors: [
                Color(0xFF1E1B4B),
                Color(0xFF0F172A),
                Color(0xFF020617),
                Color(0xFF000000),
              ],
              stops: [0.0, 0.3, 0.7, 1.0],
            ),
          ),
          child: Stack(
            children: [
              CustomPaint(
                painter: NebulaPainter(animationValue: _starsController.value),
                size: Size.infinite,
              ),
              CustomPaint(
                painter: EnhancedStarsPainter(animationValue: _starsController.value),
                size: Size.infinite,
              ),
              CustomPaint(
                painter: CosmicEffectsPainter(animationValue: _particlesController.value),
                size: Size.infinite,
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildAmbientParticles() {
    return AnimatedBuilder(
      animation: _particlesController,
      builder: (context, child) {
        return CustomPaint(
          painter: AmbientParticlesPainter(animationValue: _particlesController.value),
          size: Size.infinite,
        );
      },
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(20),
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
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF06B6D4).withOpacity(0.1),
            blurRadius: 30,
            spreadRadius: -5,
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  const Color(0xFF06B6D4).withOpacity(0.2),
                  const Color(0xFF3B82F6).withOpacity(0.2),
                ],
              ),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(
                color: const Color(0xFF06B6D4).withOpacity(0.3),
              ),
            ),
            child: IconButton(
              icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Color(0xFF06B6D4), size: 20),
              onPressed: () => context.pop(),
              padding: EdgeInsets.zero,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: ShaderMask(
              shaderCallback: (bounds) => const LinearGradient(
                colors: [
                  Color(0xFF06B6D4),
                  Color(0xFF3B82F6),
                  Color(0xFF8B5CF6),
                ],
              ).createShader(bounds),
              child: const Text(
                'UPDATE STATUS',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.w900,
                  color: Colors.white,
                  letterSpacing: 1.2,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoCard() {
    return Container(
      padding: const EdgeInsets.all(24),
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
          color: const Color(0xFF06B6D4).withOpacity(0.3),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF06B6D4).withOpacity(0.1),
            blurRadius: 30,
            spreadRadius: -5,
          ),
        ],
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: const LinearGradient(
                colors: [Color(0xFF06B6D4), Color(0xFF3B82F6)],
              ),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF06B6D4).withOpacity(0.5),
                  blurRadius: 20,
                  spreadRadius: 2,
                ),
              ],
            ),
            child: const Icon(
              Icons.rocket_launch_rounded,
              size: 48,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 20),
          Text(
            'Mission ${widget.id}',
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w700,
              color: Colors.white,
              letterSpacing: 0.5,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Select a new status for this mission',
            style: TextStyle(
              fontSize: 14,
              color: Colors.white.withOpacity(0.6),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusButtons(BuildContext context) {
    return AnimatedBuilder(
      animation: _buttonController,
      builder: (context, child) {
        return Column(
          children: [
            _buildStatusButton(
              context,
              0,
              'Ready for Departure',
              'Mission is ready to begin',
              const Color(0xFF06B6D4),
              const Color(0xFF3B82F6),
              Icons.flight_takeoff_rounded,
            ),
            const SizedBox(height: 16),
            _buildStatusButton(
              context,
              1,
              'En Route',
              'Mission in progress',
              const Color(0xFFF59E0B),
              const Color(0xFFEF4444),
              Icons.near_me_rounded,
            ),
            const SizedBox(height: 16),
            _buildStatusButton(
              context,
              2,
              'Arrived on Site',
              'Reached destination',
              const Color(0xFF8B5CF6),
              const Color(0xFF6366F1),
              Icons.location_on_rounded,
            ),
            const SizedBox(height: 16),
            _buildStatusButton(
              context,
              3,
              'Delivered',
              'Mission completed successfully',
              const Color(0xFF10B981),
              const Color(0xFF059669),
              Icons.check_circle_rounded,
            ),
            const SizedBox(height: 32),
            _buildStatusButton(
              context,
              4,
              'Failed / Incident',
              'Report an issue',
              const Color(0xFFEF4444),
              const Color(0xFFDC2626),
              Icons.warning_rounded,
            ),
          ],
        );
      },
    );
  }

  Widget _buildStatusButton(
      BuildContext context,
      int index,
      String label,
      String subtitle,
      Color color1,
      Color color2,
      IconData icon,
      ) {
    final delay = index * 0.1;
    final curvedValue = Curves.easeOutBack.transform(
      math.max(0.0, math.min(1.0, (_buttonController.value - delay) / (1.0 - delay))),
    );

    return Transform.scale(
      scale: curvedValue,
      child: Opacity(
        opacity: curvedValue,
        child: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [color1, color2],
            ),
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: color1.withOpacity(0.4),
                blurRadius: 20,
                spreadRadius: 0,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: () {
                _handleStatusUpdate(context, label, color1);
              },
              borderRadius: BorderRadius.circular(20),
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Icon(
                        icon,
                        color: Colors.white,
                        size: 32,
                      ),
                    ),
                    const SizedBox(width: 20),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            label,
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w700,
                              color: Colors.white,
                              letterSpacing: 0.3,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            subtitle,
                            style: TextStyle(
                              fontSize: 13,
                              color: Colors.white.withOpacity(0.8),
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Icon(
                      Icons.arrow_forward_ios_rounded,
                      color: Colors.white.withOpacity(0.8),
                      size: 20,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  void _handleStatusUpdate(BuildContext context, String status, Color color) {
    // TODO: Call API to update status
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.2),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(
                Icons.check_circle_rounded,
                color: Colors.white,
                size: 20,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text(
                    'Status Updated',
                    style: TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 15,
                    ),
                  ),
                  Text(
                    status,
                    style: TextStyle(
                      fontSize: 13,
                      color: Colors.white.withOpacity(0.9),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        backgroundColor: color,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        margin: const EdgeInsets.all(16),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        duration: const Duration(seconds: 3),
      ),
    );

    Future.delayed(const Duration(milliseconds: 500), () {
      if (context.mounted) {
        context.pop();
      }
    });
  }
}

// Reusing painters from previous screens
class NebulaPainter extends CustomPainter {
  final double animationValue;

  NebulaPainter({required this.animationValue});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..maskFilter = const MaskFilter.blur(BlurStyle.normal, 100);

    paint.color = const Color(0xFF5B21B6).withOpacity(0.12);
    canvas.drawCircle(Offset(size.width * 0.2, size.height * 0.3), 200, paint);

    paint.color = const Color(0xFF0891B2).withOpacity(0.15);
    canvas.drawCircle(Offset(size.width * 0.75, size.height * 0.25), 180, paint);

    paint.color = const Color(0xFFDB2777).withOpacity(0.08);
    canvas.drawCircle(Offset(size.width * 0.6, size.height * 0.7), 160, paint);

    paint.color = const Color(0xFF1D4ED8).withOpacity(0.1);
    canvas.drawCircle(Offset(size.width * 0.3, size.height * 0.8), 140, paint);
  }

  @override
  bool shouldRepaint(NebulaPainter oldDelegate) => false;
}

class EnhancedStarsPainter extends CustomPainter {
  final double animationValue;
  final math.Random _random = math.Random(42);

  EnhancedStarsPainter({required this.animationValue});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint();

    for (int i = 0; i < 200; i++) {
      final x = _random.nextDouble() * size.width;
      final y = _random.nextDouble() * size.height;
      final starSize = _random.nextDouble() * 1.5 + 0.3;

      final twinkle = (math.sin((animationValue * math.pi * 2) + i * 0.1) + 1) / 2;
      paint.color = Colors.white.withOpacity(0.2 + (twinkle * 0.5));

      canvas.drawCircle(Offset(x, y), starSize, paint);
    }

    for (int i = 0; i < 50; i++) {
      final x = _random.nextDouble() * size.width;
      final y = _random.nextDouble() * size.height;
      final starSize = _random.nextDouble() * 2 + 0.8;

      final twinkle = (math.sin((animationValue * math.pi * 2) + i * 0.3) + 1) / 2;

      paint.color = const Color(0xFF06B6D4).withOpacity(0.3 + (twinkle * 0.4));
      paint.maskFilter = const MaskFilter.blur(BlurStyle.normal, 4);
      canvas.drawCircle(Offset(x, y), starSize * 3, paint);

      paint.color = Colors.white.withOpacity(0.7 + (twinkle * 0.3));
      paint.maskFilter = null;
      canvas.drawCircle(Offset(x, y), starSize, paint);
    }

    for (int i = 0; i < 15; i++) {
      final x = _random.nextDouble() * size.width;
      final y = _random.nextDouble() * size.height;
      final starSize = _random.nextDouble() * 2.5 + 1.5;

      final twinkle = (math.sin((animationValue * math.pi * 2) + i * 0.5) + 1) / 2;

      paint.color = const Color(0xFF3B82F6).withOpacity(0.4 + (twinkle * 0.3));
      paint.maskFilter = const MaskFilter.blur(BlurStyle.normal, 8);
      canvas.drawCircle(Offset(x, y), starSize * 4, paint);

      paint.color = const Color(0xFF06B6D4).withOpacity(0.6 + (twinkle * 0.4));
      paint.maskFilter = const MaskFilter.blur(BlurStyle.normal, 3);
      canvas.drawCircle(Offset(x, y), starSize * 2, paint);

      paint.color = Colors.white;
      paint.maskFilter = null;
      canvas.drawCircle(Offset(x, y), starSize, paint);
    }
  }

  @override
  bool shouldRepaint(EnhancedStarsPainter oldDelegate) {
    return oldDelegate.animationValue != animationValue;
  }
}

class CosmicEffectsPainter extends CustomPainter {
  final double animationValue;

  CosmicEffectsPainter({required this.animationValue});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..strokeWidth = 2.5
      ..strokeCap = StrokeCap.round;

    for (int i = 0; i < 3; i++) {
      final progress = (animationValue + (i * 0.33)) % 1.0;

      if (progress < 0.15) {
        final startX = size.width * (0.3 + i * 0.25);
        final startY = size.height * (0.15 + i * 0.2);
        final length = 80.0 * (progress / 0.15);

        final gradient = LinearGradient(
          colors: [
            Colors.white,
            const Color(0xFF06B6D4).withOpacity(0.8),
            const Color(0xFF3B82F6).withOpacity(0.4),
            Colors.transparent,
          ],
        );

        paint.shader = gradient.createShader(
          Rect.fromPoints(
            Offset(startX, startY),
            Offset(startX + length * 1.5, startY + length),
          ),
        );

        paint.strokeWidth = 3 * (1 - progress / 0.15);

        canvas.drawLine(
          Offset(startX, startY),
          Offset(startX + length * 1.5, startY + length),
          paint,
        );
      }
    }
  }

  @override
  bool shouldRepaint(CosmicEffectsPainter oldDelegate) {
    return oldDelegate.animationValue != animationValue;
  }
}

class AmbientParticlesPainter extends CustomPainter {
  final double animationValue;
  final math.Random _random = math.Random(123);

  AmbientParticlesPainter({required this.animationValue});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint();

    for (int i = 0; i < 30; i++) {
      final baseX = _random.nextDouble() * size.width;
      final baseY = _random.nextDouble() * size.height;

      final floatOffset = math.sin((animationValue * math.pi * 2) + i) * 20;
      final x = baseX + floatOffset;
      final y = baseY + (animationValue * size.height * 0.1) % size.height;

      final opacity = (math.sin((animationValue * math.pi * 2) + i * 0.5) + 1) / 2;

      paint.color = const Color(0xFF06B6D4).withOpacity(opacity * 0.15);
      paint.maskFilter = const MaskFilter.blur(BlurStyle.normal, 15);

      canvas.drawCircle(Offset(x, y), 3, paint);
    }
  }

  @override
  bool shouldRepaint(AmbientParticlesPainter oldDelegate) {
    return oldDelegate.animationValue != animationValue;
  }
}