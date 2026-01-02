import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../widgets/starfield_background.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  double progress = 0.0;

  @override
  void initState() {
    super.initState();

    // Start progress after a tiny delay to ensure UI is ready
    Future.delayed(const Duration(milliseconds: 100), () {
      _startProgress();
    });
  }

  void _startProgress() {
    const totalDuration = Duration(seconds: 4);
    const interval = Duration(milliseconds: 40);

    int steps = totalDuration.inMilliseconds ~/ interval.inMilliseconds;
    double increment = 100.0 / steps;

    final timer = Stream.periodic(interval, (i) => (i + 1) * increment)
        .takeWhile((value) => value <= 100)
        .listen((value) {
      if (mounted) {
        setState(() => progress = value);
      }
    });

    timer.onDone(() {
      Future.delayed(const Duration(milliseconds: 300), () {
        if (mounted) {
          context.go('/login');
        }
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A0E14),
      body: Stack(
        children: [
          // Full-screen starfield
          const StarfieldBackground(intensity: 1.0),

          Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Logo with nested borders
                Container(
                  width: 96,
                  height: 96,
                  decoration: BoxDecoration(
                    border: Border.all(
                        color: Colors.white.withOpacity(0.2), width: 2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Center(
                    child: Container(
                      width: 80,
                      height: 80,
                      decoration: BoxDecoration(
                        border:
                        Border.all(color: Colors.white.withOpacity(0.4)),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: const Icon(
                        Icons.public,
                        color: Colors.white,
                        size: 40,
                      ),
                    ),
                  ),
                ).animate().fadeIn(duration: 800.ms).scale(
                  begin: const Offset(0.8, 0.8),
                  end: const Offset(1.0, 1.0),
                  alignment: Alignment.center,
                  curve: Curves.easeOut,
                ),

                const SizedBox(height: 48),

                // Main Title
                const Text(
                  'COURIER',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.w300,
                    letterSpacing: 12,
                    color: Colors.white,
                  ),
                )
                    .animate(delay: 300.ms)
                    .fadeIn(duration: 600.ms)
                    .slideY(begin: 0.3, end: 0.0),

                const SizedBox(height: 8),

                // Subtitle
                const Text(
                  'MISSION CONTROL',
                  style: TextStyle(
                    fontSize: 10,
                    letterSpacing: 10,
                    color: Color(0xFF64748B),
                  ),
                )
                    .animate(delay: 300.ms)
                    .fadeIn(duration: 600.ms)
                    .slideY(begin: 0.3, end: 0.0),

                const SizedBox(height: 64),

                // Progress Section
                SizedBox(
                  width: 256,
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'INITIALIZING',
                            style: TextStyle(
                              fontSize: 10,
                              fontFamily: 'monospace',
                              color: Color(0xFF475569),
                            ),
                          ),
                          Text(
                            '${progress.toInt()}%',
                            style: const TextStyle(
                              fontSize: 10,
                              fontFamily: 'monospace',
                              color: Color(0xFF475569),
                            ),
                          ),
                        ],
                      ).animate(delay: 600.ms).fadeIn(duration: 400.ms),
                      const SizedBox(height: 8),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(1),
                        child: Container(
                          height: 2,
                          color: const Color(0xFF1E293B),
                          child: Stack(
                            children: [
                              AnimatedAlign(
                                alignment: Alignment.centerLeft,
                                duration: const Duration(milliseconds: 100),
                                child: FractionallySizedBox(
                                  widthFactor: progress / 100,
                                  child: Container(color: Colors.white),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ).animate(delay: 600.ms).fadeIn(duration: 400.ms),
                    ],
                  ),
                ),

                const SizedBox(height: 32),

                // Version Footer
                const Text(
                  'v2.4.1 / BUILD 2024.06',
                  style: TextStyle(
                    fontSize: 10,
                    fontFamily: 'monospace',
                    letterSpacing: 2,
                    color: Color(0xFF475569),
                  ),
                ).animate(delay: 1000.ms).fadeIn(duration: 400.ms),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
