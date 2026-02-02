import 'dart:math';
import 'package:flutter/material.dart';
import '../theme/mission_colors.dart';

class StarfieldBackground extends StatefulWidget {
  final bool animate;
  final double intensity; // 0.0 to 1.0 (default 1.0 = full splash, 0.3 = subtle operational)

  const StarfieldBackground({
    super.key,
    this.animate = true,
    this.intensity = 1.0,
  });

  @override
  State<StarfieldBackground> createState() => _StarfieldBackgroundState();
}

class _StarfieldBackgroundState extends State<StarfieldBackground>
    with SingleTickerProviderStateMixin, WidgetsBindingObserver {
  late AnimationController _controller;
  late List<StarLayer> layers;

  @override
  void initState() {
    super.initState();

    // Enhanced star layers with more variety
    layers = [
      StarLayer(
        speed: 0.15,
        count: (100 * widget.intensity).round(),
        sizeRange: 0.6,
        brightness: 0.5,
      ),
      StarLayer(
        speed: 0.4,
        count: (70 * widget.intensity).round(),
        sizeRange: 1.0,
        brightness: 0.7,
      ),
      StarLayer(
        speed: 0.8,
        count: (50 * widget.intensity).round(),
        sizeRange: 1.4,
        brightness: 0.9,
      ),
      StarLayer(
        speed: 1.2,
        count: (30 * widget.intensity).round(),
        sizeRange: 2.0,
        brightness: 1.0,
      ),
    ];

    _controller = AnimationController(
      vsync: this,
      duration: const Duration(minutes: 20),
    )..repeat();

    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.paused ||
        state == AppLifecycleState.inactive) {
      _controller.stop();
    } else if (state == AppLifecycleState.resumed && widget.animate) {
      _controller.repeat();
    }
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Deep space gradient background
        Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Color(0xFF000814),
                Color(0xFF001D3D),
                Color(0xFF000814),
              ],
              stops: [0.0, 0.5, 1.0],
            ),
          ),
        ),

        // Subtle nebula glow (only if intensity is high enough)
        if (widget.intensity > 0.5)
          Positioned.fill(
            child: CustomPaint(
              painter: NebulaPainter(intensity: widget.intensity),
            ),
          ),

        // Main starfield
        AnimatedBuilder(
          animation: _controller,
          builder: (context, child) {
            return CustomPaint(
              painter: StarfieldPainter(
                layers: layers,
                progress: _controller.value,
              ),
              child: child,
            );
          },
          child: const SizedBox.expand(),
        ),
      ],
    );
  }
}

class StarLayer {
  final double speed;
  final int count;
  final double sizeRange;
  final double brightness;
  late final List<Star> stars;

  StarLayer({
    required this.speed,
    required this.count,
    required this.sizeRange,
    required this.brightness,
  }) {
    stars = List.generate(
      count,
          (_) => Star.random(sizeRange: sizeRange, brightness: brightness),
    );
  }
}

class Star {
  final double x;
  final double y;
  final double baseSize;
  final double twinkleSpeed;
  final double twinklePhase;
  final double brightness;
  final Color color;
  final bool hasGlow;

  Star.random({required double sizeRange, required double brightness})
      : x = Random().nextDouble(),
        y = Random().nextDouble(),
        baseSize = Random().nextDouble() * sizeRange + 0.5,
        twinkleSpeed = Random().nextDouble() * 2 + 1,
        twinklePhase = Random().nextDouble() * pi * 2,
        brightness = brightness,
        color = _randomStarColor(),
        hasGlow = Random().nextDouble() > 0.65; // 35% of stars have glow

  static Color _randomStarColor() {
    final random = Random().nextDouble();
    if (random < 0.4) {
      return const Color(0xFFFFFFFF); // Pure white - 40%
    } else if (random < 0.65) {
      return const Color(0xFFE0F7FF); // Cool white/blue - 25%
    } else if (random < 0.85) {
      return const Color(0xFFFFF4E0); // Warm white - 20%
    } else if (random < 0.95) {
      return const Color(0xFFE0E6FF); // Lavender white - 10%
    } else {
      return const Color(0xFF00D9FF); // Bright cyan accent - 5%
    }
  }

  double getOpacity(double progress) {
    final value = 0.3 + 0.7 * sin(progress * twinkleSpeed * pi * 2 + twinklePhase);
    return (value * brightness).clamp(0.0, 1.0);
  }
}

class NebulaPainter extends CustomPainter {
  final double intensity;

  NebulaPainter({required this.intensity});

  @override
  void paint(Canvas canvas, Size size) {
    if (size.width <= 0 || size.height <= 0 || !size.width.isFinite || !size.height.isFinite) {
      return;
    }

    final paint = Paint()..style = PaintingStyle.fill;

    // Subtle nebula clouds in background
    final nebulae = [
      _NebulaCloud(
        center: Offset(size.width * 0.25, size.height * 0.35),
        radius: size.width * 0.4,
        color: const Color(0xFF00B4D8).withOpacity(0.04 * intensity),
      ),
      _NebulaCloud(
        center: Offset(size.width * 0.7, size.height * 0.65),
        radius: size.width * 0.35,
        color: const Color(0xFF0077B6).withOpacity(0.03 * intensity),
      ),
      _NebulaCloud(
        center: Offset(size.width * 0.5, size.height * 0.85),
        radius: size.width * 0.3,
        color: const Color(0xFF023E8A).withOpacity(0.025 * intensity),
      ),
    ];

    for (var nebula in nebulae) {
      paint.shader = RadialGradient(
        colors: [
          nebula.color,
          nebula.color.withOpacity(0),
        ],
      ).createShader(Rect.fromCircle(
        center: nebula.center,
        radius: nebula.radius,
      ));

      canvas.drawCircle(nebula.center, nebula.radius, paint);
    }
  }

  @override
  bool shouldRepaint(covariant NebulaPainter oldDelegate) => false;
}

class _NebulaCloud {
  final Offset center;
  final double radius;
  final Color color;

  _NebulaCloud({
    required this.center,
    required this.radius,
    required this.color,
  });
}

class StarfieldPainter extends CustomPainter {
  final List<StarLayer> layers;
  final double progress;

  StarfieldPainter({required this.layers, required this.progress});

  @override
  void paint(Canvas canvas, Size size) {
    // Validate canvas size before painting
    if (size.width <= 0 || size.height <= 0 || !size.width.isFinite || !size.height.isFinite) {
      return; // Skip painting if size is invalid
    }

    for (var layer in layers) {
      for (var star in layer.stars) {
        final dyRaw = star.y + progress * layer.speed * 0.3;
        final dy = dyRaw.isFinite ? dyRaw % 1.0 : star.y;
        final opacity = star.getOpacity(progress);

        // Calculate offset and validate before drawing
        final offset = Offset(star.x * size.width, dy * size.height);
        if (!offset.dx.isFinite || !offset.dy.isFinite) continue;

        // Draw glow effect for special stars
        if (star.hasGlow) {
          final glowPaint = Paint()
            ..color = star.color.withOpacity(opacity * 0.2)
            ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 3);
          canvas.drawCircle(offset, star.baseSize * 2.5, glowPaint);
        }

        // Draw main star with color
        final starPaint = Paint()
          ..color = star.color.withOpacity(opacity * 0.9);
        canvas.drawCircle(offset, star.baseSize, starPaint);

        // Draw bright core for larger stars
        if (star.baseSize > 1.2) {
          final corePaint = Paint()
            ..color = Colors.white.withOpacity(opacity * 0.6);
          canvas.drawCircle(offset, star.baseSize * 0.5, corePaint);
        }
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}