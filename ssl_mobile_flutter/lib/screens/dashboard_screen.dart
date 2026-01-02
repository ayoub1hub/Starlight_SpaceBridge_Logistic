import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../widgets/starfield_background.dart';
import '../widgets/glass_card.dart';
import '../theme/mission_colors.dart';
import 'package:intl/intl.dart'; // For date formatting

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  // Mock data - replace with real API later
  final List<Map<String, dynamic>> missions = List.generate(10, (index) {
    final statuses = ['in_transit', 'pending', 'delivered'];
    final status = statuses[index % 3];
    return {
      'id': 'MSN-2025-${index + 1}',
      'mission_code': 'MSN-2025-${index + 1}',
      'status': status,
      'priority': index % 4 == 0 ? 'critical' : 'standard',
      'recipient_name': 'Client ${index + 1}',
      'delivery_address': '123 Rue Example, Paris',
      'estimated_delivery': DateTime.now().add(Duration(hours: index + 1)),
    };
  });

  late final Map<String, int> stats;
  late final List<Map<String, dynamic>> activeMissions;

  @override
  void initState() {
    super.initState();
    stats = {
      'active': missions.where((m) => m['status'] == 'in_transit').length,
      'pending': missions.where((m) => m['status'] == 'pending').length,
      'completed': missions.where((m) => m['status'] == 'delivered').length,
      'total': missions.length,
    };
    activeMissions = missions
        .where((m) => m['status'] == 'in_transit' || m['status'] == 'pending')
        .take(5)
        .toList();
  }

  @override
  Widget build(BuildContext context) {
    final dateFormat = DateFormat('yyyy.MM.dd');
    final timeFormat = DateFormat('HH:mm');

    return Scaffold(
      body: Stack(
        children: [
          // Cosmic background with planet
          const StarfieldBackground(intensity: 0.6),
          Positioned(
            bottom: -150,
            right: -150,
            child: Opacity(
              opacity: 0.2,
              child: _buildPlanet(500, Colors.blue),
            ),
          ),

          // Sync indicator placeholder (you can add real one later)
          // Positioned(top: 0, left: 0, right: 0, child: SyncIndicator(syncing: false)),

          SafeArea(
            child: Column(
              children: [
                // Header
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    border: Border(
                        bottom:
                        BorderSide(color: Colors.white.withOpacity(0.1))),
                    color: Colors.black.withOpacity(0.3),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            dateFormat.format(DateTime.now()),
                            style: const TextStyle(
                              fontSize: 10,
                              fontFamily: 'monospace',
                              color: Color(0xFF64748B),
                              letterSpacing: 2,
                            ),
                          ),
                          const SizedBox(height: 4),
                          const Text(
                            'Mission Control',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.w300,
                              color: Colors.white,
                              letterSpacing: 1,
                            ),
                          ),
                        ],
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          const Text(
                            'COURIER',
                            style: TextStyle(
                              fontSize: 10,
                              color: Color(0xFF64748B),
                              letterSpacing: 2,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'John Doe', // Replace with real user name
                            style: const TextStyle(
                              fontSize: 14,
                              color: Color(0xFF94A3B8),
                              fontFamily: 'monospace',
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                Expanded(
                  child: ListView(
                    padding: const EdgeInsets.all(16),
                    children: [
                      // Stats Grid
                      GridView.count(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        crossAxisCount: 2,
                        mainAxisSpacing: 12,
                        crossAxisSpacing: 12,
                        childAspectRatio: 1.8,
                        children: [
                          _buildStatCard(
                            icon: Icons.local_shipping,
                            label: 'Active',
                            value: stats['active']!,
                            highlight: true,
                          ),
                          _buildStatCard(
                            icon: Icons.access_time,
                            label: 'Pending',
                            value: stats['pending']!,
                          ),
                          _buildStatCard(
                            icon: Icons.check_circle,
                            label: 'Completed',
                            value: stats['completed']!,
                          ),
                          _buildStatCard(
                            icon: Icons.inventory,
                            label: 'Total',
                            value: stats['total']!,
                          ),
                        ],
                      ),

                      const SizedBox(height: 32),

                      // Active Missions Section
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'ACTIVE MISSIONS',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w500,
                              color: Color(0xFF64748B),
                              letterSpacing: 2,
                            ),
                          ),
                          TextButton(
                            onPressed: () => context.go('/missions'),
                            child: const Row(
                              children: [
                                Text(
                                  'View All',
                                  style: TextStyle(
                                      fontSize: 12, color: Color(0xFF64748B)),
                                ),
                                Icon(Icons.chevron_right,
                                    size: 16, color: Color(0xFF64748B)),
                              ],
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 12),

                      if (activeMissions.isEmpty)
                        GlassCard(
                          child: Padding(
                            padding: const EdgeInsets.all(32),
                            child: Column(
                              children: [
                                Icon(Icons.inventory,
                                    size: 64,
                                    color: Colors.white.withOpacity(0.3)),
                                const SizedBox(height: 16),
                                const Text(
                                  'No active missions',
                                  style: TextStyle(
                                      color: Colors.white70, fontSize: 16),
                                ),
                                const Text(
                                  'All deliveries completed',
                                  style: TextStyle(
                                      color: Color(0xFF64748B), fontSize: 12),
                                ),
                              ],
                            ),
                          ),
                        )
                      else
                        ...activeMissions
                            .map((mission) => _buildMissionCard(mission)),

                      const SizedBox(height: 32),

                      // Quick Actions
                      const Text(
                        'QUICK ACTIONS',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                          color: Color(0xFF64748B),
                          letterSpacing: 2,
                        ),
                      ),

                      const SizedBox(height: 12),

                      GridView.count(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        crossAxisCount: 2,
                        mainAxisSpacing: 12,
                        crossAxisSpacing: 12,
                        childAspectRatio: 1.4,
                        children: [
                          _buildQuickAction(
                            icon: Icons.inventory,
                            title: 'All Missions',
                            subtitle: 'View complete list',
                            onTap: () => context.go('/missions'),
                          ),
                          _buildQuickAction(
                            icon: Icons.message,
                            title: 'Secure Messages',
                            subtitle: 'Contact dispatch',
                            color: Colors.blue,
                            onTap: () => context.go('/messages'),
                          ),
                          _buildQuickAction(
                            icon: Icons.warning,
                            title: 'Report Incident',
                            subtitle: 'Log an issue',
                            color: Colors.amber,
                            onTap: () => context.go('/incident_report'),
                          ),
                          _buildQuickAction(
                            icon: Icons.design_services,
                            title: 'Design System',
                            subtitle: 'View components',
                            onTap: () => context.go('/design_system'),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
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
            color.withOpacity(0.4),
            color.withOpacity(0.1),
            Colors.transparent,
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard({
    required IconData icon,
    required String label,
    required int value,
    bool highlight = false,
  }) {
    return GlassCard(
      glowColor: highlight ? Colors.white.withOpacity(0.2) : null,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon,
                size: 20,
                color: highlight ? Colors.white : const Color(0xFF64748B)),
            const SizedBox(height: 12),
            Text(
              '$value',
              style: TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.w300,
                color: highlight ? Colors.white : const Color(0xFF94A3B8),
              ),
            ),
            Text(
              label.toUpperCase(),
              style: const TextStyle(
                fontSize: 10,
                color: Color(0xFF64748B),
                letterSpacing: 1.5,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMissionCard(Map<String, dynamic> mission) {
    return GlassCard(
      child: ListTile(
        onTap: () => context.go('/mission/${mission['id']}'),
        contentPadding: const EdgeInsets.all(16),
        title: Text(
          mission['mission_code'],
          style: const TextStyle(
              fontFamily: 'monospace', fontSize: 14, color: Colors.white70),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 8),
            Text(mission['delivery_address'],
                style: const TextStyle(color: Colors.white)),
            const SizedBox(height: 8),
            Row(
              children: [
                _buildStatusBadge(mission['status']),
                const SizedBox(width: 8),
                _buildPriorityBadge(mission['priority']),
              ],
            ),
          ],
        ),
        trailing: const Icon(Icons.chevron_right, color: Colors.white60),
      ),
    ).animate().fadeIn(duration: 600.ms).slideY(begin: 0.2, end: 0);
  }

  Widget _buildStatusBadge(String status) {
    Color color;
    String label;
    switch (status) {
      case 'in_transit':
        color = Colors.blue;
        label = 'IN TRANSIT';
        break;
      case 'pending':
        color = Colors.amber;
        label = 'PENDING';
        break;
      case 'delivered':
        color = Colors.green;
        label = 'DELIVERED';
        break;
      default:
        color = Colors.grey;
        label = status.toUpperCase();
    }
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.2),
        border: Border.all(color: color.withOpacity(0.6)),
        borderRadius: BorderRadius.circular(4),
      ),
      child: Text(label,
          style: TextStyle(fontSize: 10, color: color, letterSpacing: 1)),
    );
  }

  Widget _buildPriorityBadge(String priority) {
    if (priority == 'critical') {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: Colors.red.withOpacity(0.2),
          border: Border.all(color: Colors.red.withOpacity(0.6)),
          borderRadius: BorderRadius.circular(4),
        ),
        child: const Text('CRT',
            style:
            TextStyle(fontSize: 10, color: Colors.red, letterSpacing: 1)),
      );
    }
    return const SizedBox.shrink();
  }

  Widget _buildQuickAction({
    required IconData icon,
    required String title,
    required String subtitle,
    Color? color,
    required VoidCallback onTap,
  }) {
    return GlassCard(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(20),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Icon(icon, size: 32, color: color ?? Colors.white60),
              const SizedBox(height: 12),
              Text(title,
                  style: const TextStyle(fontSize: 14, color: Colors.white)),
              Text(subtitle,
                  style:
                  const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
            ],
          ),
        ),
      ),
    );
  }
}
