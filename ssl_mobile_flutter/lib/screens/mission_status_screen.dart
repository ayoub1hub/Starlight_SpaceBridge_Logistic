import 'package:flutter/material.dart'; import 'package:go_router/go_router.dart'; import '../widgets/starfield_background.dart';  class MissionStatusScreen extends StatelessWidget {   final String id;   const MissionStatusScreen({super.key, required this.id});

@override
Widget build(BuildContext context) {
  return Scaffold(
    body: Stack(
      children: [
        const StarfieldBackground(intensity: 0.3),
        SafeArea(
          child: Column(
            children: [
              _buildHeader(context),
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      _statusButton(context, 'Ready for Departure', Colors.blueAccent),
                      const SizedBox(height: 16),
                      _statusButton(context, 'En Route', Colors.amber),
                      const SizedBox(height: 16),
                      _statusButton(context, 'Arrived on Site', Colors.teal),
                      const SizedBox(height: 16),
                      _statusButton(context, 'Delivered', Colors.greenAccent),
                      const SizedBox(height: 32),
                      _statusButton(context, 'Failed / Incident', Colors.redAccent),
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

Widget _buildHeader(BuildContext context) {
  return Container(
    padding: const EdgeInsets.all(16),
    decoration: BoxDecoration(
      color: Colors.black.withOpacity(0.7),
      border: Border(bottom: BorderSide(color: Colors.white.withOpacity(0.1))),
    ),
    child: Row(
      children: [
        IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white70),
          onPressed: () => context.pop(),
        ),
        const SizedBox(width: 12),
        const Text(
          'Update Status',
          style: TextStyle(fontSize: 20, fontWeight: FontWeight.w300, color: Colors.white),
        ),
      ],
    ),
  );
}

Widget _statusButton(BuildContext context, String label, Color color) {
  return SizedBox(
    width: double.infinity,
    height: 64,
    child: ElevatedButton(
      onPressed: () {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Status updated: $label'),
            backgroundColor: color,
            behavior: SnackBarBehavior.floating,
          ),
        );
        context.pop();
      },
      style: ElevatedButton.styleFrom(
        backgroundColor: color,
        foregroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
      child: Text(
        label,
        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
      ),
    ),
  );
}
}