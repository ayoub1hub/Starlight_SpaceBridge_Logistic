import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';
import '../widgets/starfield_background.dart';
import '../widgets/glass_card.dart';
import '../theme/mission_colors.dart';
import 'package:intl/intl.dart';

class MissionDetailScreen extends StatefulWidget {
  final String id;
  const MissionDetailScreen({super.key, required this.id});

  @override
  State<MissionDetailScreen> createState() => _MissionDetailScreenState();
}

class _MissionDetailScreenState extends State<MissionDetailScreen> {
  // Mock mission data — replace with real API later
  late Map<String, dynamic> mission;

  @override
  void initState() {
    super.initState();
    // Simulate loading
    Future.delayed(const Duration(milliseconds: 300), () {
      setState(() {
        mission = {
          'id': widget.id,
          'mission_code': widget.id,
          'status': [
            'pending',
            'in_transit',
            'delivered'
          ][widget.id.hashCode % 3],
          'priority': widget.id.hashCode % 5 == 0
              ? 'critical'
              : widget.id.hashCode % 3 == 0
              ? 'priority'
              : 'standard',
          'pickup_address': '42 Galactic Way, Orbit City',
          'delivery_address': '15 Rue de la Paix, 75002 Paris',
          'recipient_name': 'Jean Dupont',
          'recipient_phone': '+33 6 12 34 56 78',
          'package_description': 'Fragile electronics - Handle with care',
          'estimated_delivery': DateTime.now().add(const Duration(hours: 3)),
          'notes': 'Leave at concierge if no answer. Signature required.',
        };
      });
    });
  }

  Color getPriorityGlow() {
    switch (mission['priority']) {
      case 'critical':
        return Colors.red;
      case 'priority':
        return Colors.orange;
      default:
        return MissionColors.accentPrimary;
    }
  }

  void _copyToClipboard(String text) {
    // In real app: use clipboard package
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('Copied to clipboard'),
        backgroundColor: MissionColors.accentPrimary,
        duration: const Duration(seconds: 1),
      ),
    );
  }

  void _openMaps(String address) async {
    final url =
    Uri.parse('https://maps.google.com/?q=${Uri.encodeComponent(address)}');
    if (await canLaunchUrl(url)) {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    }
  }

  void _callPhone(String phone) async {
    final url = Uri.parse('tel:$phone');
    if (await canLaunchUrl(url)) {
      await launchUrl(url);
    }
  }

  @override
  Widget build(BuildContext context) {
    final dateFormat = DateFormat('HH:mm - MMM d, yyyy');

    if (mission == null) {
      return Scaffold(
        backgroundColor: MissionColors.backgroundPrimary,
        body: Center(
          child: Text(
            'LOADING MISSION DATA...',
            style: TextStyle(
                color: Colors.white.withOpacity(0.6), fontFamily: 'monospace'),
          ),
        ),
      );
    }

    final isActive =
        mission['status'] == 'pending' || mission['status'] == 'in_transit';

    return Scaffold(
      body: Stack(
        children: [
          // Deep space background
          const StarfieldBackground(intensity: 0.7),

          // Ambient planets
          Positioned(
            top: -120,
            right: -80,
            child: Opacity(
                opacity: 0.15, child: _buildPlanet(450, Colors.deepPurple)),
          ),
          Positioned(
            bottom: -100,
            left: -120,
            child: Opacity(
                opacity: 0.2, child: _buildPlanet(400, getPriorityGlow())),
          ),

          SafeArea(
            child: Column(
              children: [
                // Sticky Header
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    border: Border(
                        bottom:
                        BorderSide(color: Colors.white.withOpacity(0.1))),
                    color: Colors.black.withOpacity(0.4),
                  ),
                  child: Row(
                    children: [
                      IconButton(
                        icon: const Icon(Icons.arrow_back_ios_new,
                            color: Colors.white70),
                        onPressed: () => context.pop(),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Text(
                                  mission['mission_code'],
                                  style: const TextStyle(
                                    fontFamily: 'monospace',
                                    fontSize: 18,
                                    color: Colors.white,
                                    letterSpacing: 2,
                                  ),
                                ),
                                const SizedBox(width: 8),
                                IconButton(
                                  icon: const Icon(Icons.copy,
                                      size: 18, color: Colors.white60),
                                  onPressed: () =>
                                      _copyToClipboard(mission['mission_code']),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                _buildStatusBadge(mission['status']),
                                const SizedBox(width: 12),
                                _buildPriorityBadge(mission['priority']),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),

                // Scrollable Content
                Expanded(
                  child: ListView(
                    padding: const EdgeInsets.all(16),
                    children: [
                      // Delivery Information
                      GlassCard(
                        glowColor: getPriorityGlow().withOpacity(0.2),
                        child: Padding(
                          padding: const EdgeInsets.all(20),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'DELIVERY INFORMATION',
                                style: TextStyle(
                                    fontSize: 11,
                                    color: Color(0xFF64748B),
                                    letterSpacing: 2),
                              ),
                              const SizedBox(height: 20),
                              _buildInfoRow(
                                icon: Icons.location_on,
                                label: 'PICKUP',
                                value: mission['pickup_address'],
                                onTap: () =>
                                    _openMaps(mission['pickup_address']),
                              ),
                              const SizedBox(height: 16),
                              Center(
                                child: Container(
                                  width: 2,
                                  height: 20,
                                  color: Colors.white.withOpacity(0.3),
                                ),
                              ),
                              const SizedBox(height: 16),
                              _buildInfoRow(
                                icon: Icons.location_on,
                                label: 'DELIVERY',
                                value: mission['delivery_address'],
                                onTap: () =>
                                    _openMaps(mission['delivery_address']),
                                highlight: true,
                              ),
                            ],
                          ),
                        ),
                      ),

                      const SizedBox(height: 20),

                      // Recipient
                      GlassCard(
                        child: Padding(
                          padding: const EdgeInsets.all(20),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'RECIPIENT',
                                style: TextStyle(
                                    fontSize: 11,
                                    color: Color(0xFF64748B),
                                    letterSpacing: 2),
                              ),
                              const SizedBox(height: 20),
                              _buildInfoRow(
                                  icon: Icons.person,
                                  label: 'NAME',
                                  value: mission['recipient_name']),
                              if (mission['recipient_phone'] != null)
                                _buildInfoRow(
                                  icon: Icons.phone,
                                  label: 'PHONE',
                                  value: mission['recipient_phone'],
                                  onTap: () =>
                                      _callPhone(mission['recipient_phone']),
                                ),
                            ],
                          ),
                        ),
                      ),

                      const SizedBox(height: 20),

                      // Package Details
                      GlassCard(
                        child: Padding(
                          padding: const EdgeInsets.all(20),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'PACKAGE DETAILS',
                                style: TextStyle(
                                    fontSize: 11,
                                    color: Color(0xFF64748B),
                                    letterSpacing: 2),
                              ),
                              const SizedBox(height: 20),
                              if (mission['package_description'] != null)
                                _buildInfoRow(
                                    icon: Icons.inventory,
                                    label: 'DESCRIPTION',
                                    value: mission['package_description']),
                              if (mission['estimated_delivery'] != null)
                                _buildInfoRow(
                                  icon: Icons.access_time,
                                  label: 'ETA',
                                  value: dateFormat
                                      .format(mission['estimated_delivery']),
                                ),
                            ],
                          ),
                        ),
                      ),

                      if (mission['notes'] != null) ...[
                        const SizedBox(height: 20),
                        GlassCard(
                          child: Padding(
                            padding: const EdgeInsets.all(20),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'NOTES',
                                  style: TextStyle(
                                      fontSize: 11,
                                      color: Color(0xFF64748B),
                                      letterSpacing: 2),
                                ),
                                const SizedBox(height: 16),
                                Text(
                                  mission['notes'],
                                  style: const TextStyle(
                                      color: Colors.white70, fontSize: 14),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],

                      const SizedBox(height: 120), // Space for fixed action bar
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Fixed Action Bar
          if (isActive)
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: MissionColors.backgroundPrimary.withOpacity(0.9),
                  border: Border(
                      top: BorderSide(color: Colors.white.withOpacity(0.1))),
                ),
                child: SafeArea(
                  top: false,
                  child: Column(
                    children: [
                      if (mission['status'] == 'pending')
                        SizedBox(
                          height: 64,
                          child: ElevatedButton(
                            onPressed: () {
                              // Simulate status update
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                    content: Text('Mission started')),
                              );
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.white,
                              foregroundColor: Colors.black87,
                              elevation: 20,
                              shadowColor: Colors.white.withOpacity(0.4),
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(16)),
                            ),
                            child: const Text('START MISSION',
                                style: TextStyle(
                                    fontSize: 16, fontWeight: FontWeight.w600)),
                          ),
                        ),
                      if (mission['status'] == 'in_transit') ...[
                        SizedBox(
                          height: 64,
                          child: ElevatedButton.icon(
                            icon: const Icon(Icons.check_circle, size: 24),
                            label: const Text('UPDATE STATUS'),
                            onPressed: () => context
                                .go('/status_update?id=${mission['id']}'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: MissionColors.accentPrimary,
                              foregroundColor: Colors.white,
                              elevation: 20,
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(16)),
                            ),
                          ),
                        ),
                        const SizedBox(height: 12),
                        SizedBox(
                          height: 64,
                          child: ElevatedButton.icon(
                            icon: const Icon(Icons.warning_amber, size: 24),
                            label: const Text('REPORT INCIDENT'),
                            onPressed: () => context.go(
                                '/incident_report?mission=${mission['id']}'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.orange.withOpacity(0.2),
                              foregroundColor: Colors.orange,
                              side: const BorderSide(color: Colors.orange),
                              elevation: 20,
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(16)),
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildPlanet(double size, Color color) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: RadialGradient(
          colors: [
            color.withOpacity(0.5),
            color.withOpacity(0.2),
            Colors.transparent,
          ],
        ),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.4),
            blurRadius: 100,
            spreadRadius: 40,
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow({
    required IconData icon,
    required String label,
    required String value,
    VoidCallback? onTap,
    bool highlight = false,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 12),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon,
                size: 24,
                color: highlight ? Colors.white : const Color(0xFF64748B)),
            const SizedBox(width: 20),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    label,
                    style: const TextStyle(
                        fontSize: 10,
                        color: Color(0xFF64748B),
                        letterSpacing: 2),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    value,
                    style: TextStyle(
                      fontSize: 15,
                      color: highlight ? Colors.white : Colors.white70,
                    ),
                  ),
                ],
              ),
            ),
            if (onTap != null)
              const Icon(Icons.navigation, size: 24, color: Colors.white60),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusBadge(String status) {
    final config = {
      'pending': (Colors.amber, 'PENDING'),
      'in_transit': (Colors.blue, 'IN TRANSIT'),
      'delivered': (Colors.green, 'DELIVERED'),
      'failed': (Colors.red, 'FAILED'),
    }[status] ??
        (Colors.grey, status.toUpperCase());

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: config.$1.withOpacity(0.2),
        border: Border.all(color: config.$1.withOpacity(0.6)),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        config.$2,
        style: TextStyle(fontSize: 10, color: config.$1, letterSpacing: 1.5),
      ),
    );
  }

  Widget _buildPriorityBadge(String priority) {
    if (priority == 'critical') {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: Colors.red.withOpacity(0.2),
          border: Border.all(color: Colors.red.withOpacity(0.6)),
          borderRadius: BorderRadius.circular(8),
        ),
        child: const Text('CRT',
            style:
            TextStyle(fontSize: 10, color: Colors.red, letterSpacing: 1.5)),
      );
    } else if (priority == 'priority') {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: Colors.orange.withOpacity(0.2),
          border: Border.all(color: Colors.orange.withOpacity(0.6)),
          borderRadius: BorderRadius.circular(8),
        ),
        child: const Text('PRI',
            style: TextStyle(
                fontSize: 10, color: Colors.orange, letterSpacing: 1.5)),
      );
    }
    return const SizedBox.shrink();
  }
}
