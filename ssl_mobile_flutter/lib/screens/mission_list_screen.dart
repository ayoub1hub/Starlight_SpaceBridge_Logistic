import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../widgets/starfield_background.dart';
import '../widgets/glass_card.dart';
import '../theme/mission_colors.dart';

class MissionListScreen extends StatefulWidget {
  const MissionListScreen({super.key});

  @override
  State<MissionListScreen> createState() => MissionListScreenState();
}

class MissionListScreenState extends State<MissionListScreen> {
  String statusFilter = 'all';
  String searchQuery = '';

  // Mock missions — replace with real API data later
  final List<Map<String, dynamic>> missions = List.generate(20, (index) {
    final statuses = [
      'pending',
      'in_transit',
      'delivered',
      'failed',
      'pending'
    ];
    final status = statuses[index % 5];
    return {
      'id': 'MSN-2025-${100 + index}',
      'mission_code': 'MSN-2025-${100 + index}',
      'status': status,
      'priority': index % 6 == 0
          ? 'critical'
          : index % 3 == 0
          ? 'priority'
          : 'standard',
      'recipient_name': 'Client ${index + 1}',
      'delivery_address':
      '${index + 100} Rue de la Paix, 7500${index % 10} Paris',
    };
  });

  List<Map<String, dynamic>> get filteredMissions {
    return missions.where((mission) {
      final matchesStatus =
          statusFilter == 'all' || mission['status'] == statusFilter;
      final matchesSearch = searchQuery.isEmpty ||
          mission['mission_code']
              .toLowerCase()
              .contains(searchQuery.toLowerCase()) ||
          mission['recipient_name']
              .toLowerCase()
              .contains(searchQuery.toLowerCase()) ||
          mission['delivery_address']
              .toLowerCase()
              .contains(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Deep space background
          const StarfieldBackground(intensity: 0.7),

          // Subtle planets
          Positioned(
            top: -100,
            left: -100,
            child:
            Opacity(opacity: 0.15, child: _buildPlanet(400, Colors.purple)),
          ),
          Positioned(
            bottom: -150,
            right: -100,
            child: Opacity(opacity: 0.2, child: _buildPlanet(500, Colors.blue)),
          ),

          SafeArea(
            child: Column(
              children: [
                // Sticky Header
                Container(
                  decoration: BoxDecoration(
                    border: Border(
                        bottom:
                        BorderSide(color: Colors.white.withOpacity(0.1))),
                    color: Colors.black.withOpacity(0.4),
                  ),
                  child: Column(
                    children: [
                      // Top bar with back + title
                      Padding(
                        padding: const EdgeInsets.all(16),
                        child: Row(
                          children: [
                            IconButton(
                              icon: const Icon(Icons.arrow_back_ios_new,
                                  color: Colors.white70),
                              onPressed: () => context.pop(),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'Mission List',
                                    style: TextStyle(
                                      fontSize: 20,
                                      fontWeight: FontWeight.w300,
                                      color: Colors.white,
                                      letterSpacing: 1,
                                    ),
                                  ),
                                  Text(
                                    '${filteredMissions.length} MISSIONS',
                                    style: const TextStyle(
                                      fontSize: 10,
                                      fontFamily: 'monospace',
                                      color: Color(0xFF64748B),
                                      letterSpacing: 2,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Search Bar
                      Padding(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 16, vertical: 8),
                        child: TextField(
                          onChanged: (value) =>
                              setState(() => searchQuery = value),
                          style: const TextStyle(color: Colors.white),
                          decoration: InputDecoration(
                            hintText: 'Search missions...',
                            hintStyle:
                            TextStyle(color: Colors.white.withOpacity(0.5)),
                            prefixIcon: Icon(Icons.search,
                                color: Colors.white.withOpacity(0.6)),
                            filled: true,
                            fillColor: Colors.white.withOpacity(0.08),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide(
                                  color: Colors.white.withOpacity(0.2)),
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide(
                                  color: Colors.white.withOpacity(0.2)),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide:
                              const BorderSide(color: Colors.white54),
                            ),
                          ),
                        ),
                      ),

                      // Status Filters (horizontal scroll)
                      SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
                        child: Row(
                          children: [
                            {'value': 'all', 'label': 'All'},
                            {'value': 'pending', 'label': 'Pending'},
                            {'value': 'in_transit', 'label': 'In Transit'},
                            {'value': 'delivered', 'label': 'Delivered'},
                            {'value': 'failed', 'label': 'Failed'},
                          ].map((filter) {
                            final isSelected = statusFilter == filter['value'];
                            return Padding(
                              padding: const EdgeInsets.only(right: 8),
                              child: ElevatedButton(
                                onPressed: () => setState(() =>
                                statusFilter = filter['value'] as String),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: isSelected
                                      ? Colors.white
                                      : Colors.transparent,
                                  foregroundColor: isSelected
                                      ? Colors.black87
                                      : Colors.white70,
                                  side: BorderSide(
                                      color: Colors.white.withOpacity(0.3)),
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 16, vertical: 8),
                                  shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(8)),
                                ),
                                child: Text(
                                  filter['label'] as String,
                                  style: const TextStyle(
                                      fontSize: 11, letterSpacing: 1.5),
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                      ),
                    ],
                  ),
                ),

                // Missions List
                Expanded(
                  child: filteredMissions.isEmpty
                      ? Center(
                    child: GlassCard(
                      padding: const EdgeInsets.all(40),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.filter_list,
                              size: 64,
                              color: Colors.white.withOpacity(0.4)),
                          const SizedBox(height: 16),
                          const Text(
                            'No missions found',
                            style: TextStyle(
                                color: Colors.white70, fontSize: 16),
                          ),
                          const Text(
                            'Try adjusting your filters',
                            style: TextStyle(
                                color: Color(0xFF64748B), fontSize: 12),
                          ),
                        ],
                      ),
                    ),
                  )
                      : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: filteredMissions.length,
                    itemBuilder: (context, index) {
                      final mission = filteredMissions[index];
                      return _buildMissionCard(mission)
                          .animate()
                          .fadeIn(duration: 600.ms)
                          .slideY(
                          begin: 0.2,
                          end: 0,
                          delay: (index * 100).ms);
                    },
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
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.3),
            blurRadius: 100,
            spreadRadius: 30,
          ),
        ],
      ),
    );
  }

  Widget _buildMissionCard(Map<String, dynamic> mission) {
    return GlassCard(
      child: ListTile(
        onTap: () => context.go('/mission/${mission['id']}'),
        contentPadding: const EdgeInsets.all(20),
        title: Text(
          mission['mission_code'],
          style: const TextStyle(
            fontFamily: 'monospace',
            fontSize: 15,
            color: Colors.white,
            letterSpacing: 1,
          ),
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                mission['delivery_address'],
                style: const TextStyle(color: Colors.white70),
              ),
              const SizedBox(height: 12),
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
        trailing:
        const Icon(Icons.chevron_right, color: Colors.white60, size: 28),
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
        style: TextStyle(
          fontSize: 10,
          color: config.$1,
          letterSpacing: 1.5,
          fontWeight: FontWeight.w600,
        ),
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
        child: const Text(
          'CRT',
          style: TextStyle(
              fontSize: 10,
              color: Colors.red,
              letterSpacing: 1.5,
              fontWeight: FontWeight.w600),
        ),
      );
    } else if (priority == 'priority') {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: Colors.orange.withOpacity(0.2),
          border: Border.all(color: Colors.orange.withOpacity(0.6)),
          borderRadius: BorderRadius.circular(8),
        ),
        child: const Text(
          'PRI',
          style: TextStyle(
              fontSize: 10,
              color: Colors.orange,
              letterSpacing: 1.5,
              fontWeight: FontWeight.w600),
        ),
      );
    }
    return const SizedBox.shrink();
  }
}
