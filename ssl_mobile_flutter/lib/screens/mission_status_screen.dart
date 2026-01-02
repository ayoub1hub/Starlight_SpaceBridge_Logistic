import 'package:flutter/material.dart';
import '../theme/mission_colors.dart';
import 'package:go_router/go_router.dart';

class MissionStatusScreen extends StatelessWidget {
  final String id;
  const MissionStatusScreen({super.key, required this.id});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Update Status')),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            _statusButton(
                context, 'READY FOR DEPARTURE', MissionColors.accentPrimary),
            const SizedBox(height: 16),
            _statusButton(context, 'EN ROUTE', MissionColors.warning),
            const SizedBox(height: 16),
            _statusButton(
                context, 'ARRIVED ON SITE', MissionColors.accentSecondary),
            const SizedBox(height: 16),
            _statusButton(context, 'DELIVERED', MissionColors.success),
            const SizedBox(height: 32),
            _statusButton(context, 'FAILED / INCIDENT', MissionColors.critical),
          ],
        ),
      ),
    );
  }

  Widget _statusButton(BuildContext context, String label, Color color) {
    return SizedBox(
      width: double.infinity,
      height: 72,
      child: ElevatedButton(
        onPressed: () {
          // TODO: Call API / local sync
          ScaffoldMessenger.of(context)
              .showSnackBar(SnackBar(content: Text('Status updated: $label')));
          context.pop();
        },
        style: ElevatedButton.styleFrom(backgroundColor: color),
        child: Text(label,
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600)),
      ),
    );
  }
}
