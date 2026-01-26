import 'package:flutter/material.dart';

class OrbitalGlassCard extends StatelessWidget {
  final Widget child;
  final Color? glowColor;      // ← nouveau
  final EdgeInsets? margin;
  const OrbitalGlassCard({super.key, required this.child, this.glowColor, this.margin});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: margin ?? EdgeInsets.zero,  // utilise margin si fourni
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.08),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white.withOpacity(0.2)),
        boxShadow: [
          BoxShadow(
            color: Colors.blueAccent.withOpacity(0.3),
            blurRadius: 20,
            spreadRadius: 5,
          ),
        ],
      ),
      child: child,
    );
  }
}