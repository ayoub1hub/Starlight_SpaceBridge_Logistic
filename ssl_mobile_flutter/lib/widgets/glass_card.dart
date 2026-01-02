import 'package:flutter/material.dart';
import 'dart:ui';

class GlassCard extends StatelessWidget {
  final Widget child;
  final EdgeInsets padding;
  final Color? glowColor;

  const GlassCard(
      {super.key,
        required this.child,
        this.padding = const EdgeInsets.all(24),
        this.glowColor});

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(20),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
        child: Container(
          padding: padding,
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.08),
            borderRadius: BorderRadius.circular(20),
            border:
            Border.all(color: Colors.white.withOpacity(0.15), width: 1.5),
            boxShadow: glowColor != null
                ? [
              BoxShadow(
                  color: glowColor!.withOpacity(0.4),
                  blurRadius: 30,
                  spreadRadius: 10)
            ]
                : null,
          ),
          child: child,
        ),
      ),
    );
  }
}
