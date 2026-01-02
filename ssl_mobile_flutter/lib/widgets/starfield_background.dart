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
    layers = [
      StarLayer(
          speed: 0.2, count: (80 * widget.intensity).round(), sizeRange: 0.8),
      StarLayer(
          speed: 0.5, count: (60 * widget.intensity).round(), sizeRange: 1.2),
      StarLayer(
          speed: 1.0, count: (40 * widget.intensity).round(), sizeRange: 1.8),
    ];

    _controller =
    AnimationController(vsync: this, duration: const Duration(minutes: 20))
      ..repeat();

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
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return CustomPaint(
          painter:
          StarfieldPainter(layers: layers, progress: _controller.value),
          child: child,
        );
      },
      child: const SizedBox.expand(),
    );
  }
}

class StarLayer {
  final double speed;
  final int count;
  final double sizeRange;
  late final List<Star> stars;

  StarLayer(
      {required this.speed, required this.count, required this.sizeRange}) {
    stars = List.generate(count, (_) => Star.random(sizeRange: sizeRange));
  }
}

class Star {
  final double x;
  final double y;
  final double baseSize;
  final double twinkleSpeed;
  final double twinklePhase;

  Star.random({required double sizeRange})
      : x = Random().nextDouble(),
        y = Random().nextDouble(),
        baseSize = Random().nextDouble() * sizeRange + 0.5,
        twinkleSpeed = Random().nextDouble() * 2 + 1,
        twinklePhase = Random().nextDouble() * pi * 2;

  double getOpacity(double progress) {
    final value = 0.4 + 0.6 * sin(progress * twinkleSpeed * pi * 2 + twinklePhase);
    return value.clamp(0.0, 1.0);
  }
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
      final paint = Paint()..color = MissionColors.starfieldStars;

      for (var star in layer.stars) {
        final dyRaw = star.y + progress * layer.speed * 0.3;
        final dy = dyRaw.isFinite ? dyRaw % 1.0 : star.y;
        double opacity = star.getOpacity(progress);

        paint.color = MissionColors.starfieldStars.withOpacity(opacity * 0.8);

        // Calculate offset and validate before drawing
        final offset = Offset(star.x * size.width, dy * size.height);
        if (offset.dx.isFinite && offset.dy.isFinite) {
          canvas.drawCircle(offset, star.baseSize, paint);
        }
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}