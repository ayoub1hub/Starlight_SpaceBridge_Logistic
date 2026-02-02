import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:intl/intl.dart';
import 'dart:math' as math;

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> with TickerProviderStateMixin {
  final _storage = const FlutterSecureStorage();

  String driverName = 'Loading...';
  String driverPhone = '';
  String driverStatus = 'offline';
  String vehiclePlate = '';
  bool isLoadingDriver = true;

  List<dynamic> missions = [];
  Map<String, int> stats = {'active': 0, 'pending': 0, 'completed': 0};
  bool isLoadingMissions = true;
  String? errorMessage;

  late AnimationController _pulseController;
  late AnimationController _statsController;
  late Animation<double> _pulseAnimation;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    )..repeat(reverse: true);

    _statsController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );

    _pulseAnimation = Tween<double>(begin: 1.0, end: 1.2).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );

    _loadData();
  }

  @override
  void dispose() {
    _pulseController.dispose();
    _statsController.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    await Future.wait([
      _loadDriverProfile(),
      _loadMissions(),
    ]);
    _statsController.forward();
  }

  Future<String?> _getToken() async {
    return await _storage.read(key: 'access_token');
  }

  Future<void> _loadDriverProfile() async {
    setState(() => isLoadingDriver = true);

    try {
      final token = await _getToken();
      if (token == null) {
        if (mounted) context.go('/login');
        return;
      }

      final response = await http.get(
        Uri.parse('http://localhost:8080/api/drivers/me'),
        headers: {
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
        },
      ).timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          driverName = data['name']?.toString() ?? 'Driver';
          driverPhone = data['phone']?.toString() ?? '';
          driverStatus = data['status']?.toString().toLowerCase() ?? 'offline';
          vehiclePlate = data['vehiclePlateNumber']?.toString() ?? '';
          isLoadingDriver = false;
        });
      } else if (response.statusCode == 401) {
        await _storage.deleteAll();
        if (mounted) context.go('/login');
      }
    } catch (e) {
      setState(() {
        driverName = 'Error loading profile';
        isLoadingDriver = false;
      });
    }
  }

  Future<void> _loadMissions() async {
    setState(() {
      isLoadingMissions = true;
      errorMessage = null;
    });

    try {
      final token = await _getToken();
      if (token == null) return;

      final response = await http.get(
        Uri.parse('http://localhost:8080/api/deliveries/my-deliveries'),
        headers: {
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
        },
      ).timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          missions = data is List ? data : [];
          _calculateStats();
          isLoadingMissions = false;
        });
      } else if (response.statusCode == 401) {
        await _storage.deleteAll();
        if (mounted) context.go('/login');
      }
    } catch (e) {
      setState(() {
        errorMessage = 'Failed to load missions';
        isLoadingMissions = false;
      });
    }
  }

  void _calculateStats() {
    int active = 0, pending = 0, completed = 0;
    for (var m in missions) {
      final status = (m['status'] as String? ?? '').toUpperCase();
      if (status == 'IN_TRANSIT') active++;
      if (status == 'SCHEDULED' || status == 'PENDING') pending++;
      if (status == 'DELIVERED' || status == 'COMPLETED') completed++;
    }
    stats = {'active': active, 'pending': pending, 'completed': completed};
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'available':
        return Colors.green;
      case 'busy':
      case 'in_transit':
        return Colors.orange;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF000814), Color(0xFF001D3D), Color(0xFF000814)],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              _buildHeader(),
              Expanded(
                child: RefreshIndicator(
                  onRefresh: _loadData,
                  color: Colors.blue,
                  child: SingleChildScrollView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildStatsGrid(),
                        const SizedBox(height: 32),
                        _buildMissionsSection(),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Colors.blue.withOpacity(0.1),
            Colors.transparent,
          ],
        ),
        border: Border(bottom: BorderSide(color: Colors.white.withOpacity(0.1))),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    DateFormat('EEEE, MMM d').format(DateTime.now()).toUpperCase(),
                    style: TextStyle(
                      fontSize: 11,
                      color: Colors.white.withOpacity(0.6),
                      letterSpacing: 2,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'MISSION CONTROL',
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.w900,
                      color: Colors.white,
                      letterSpacing: 2,
                    ),
                  ),
                ],
              ),
              _buildProfileSection(),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildProfileSection() {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.1)),
      ),
      child: Row(
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                driverName,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 4),
              Row(
                children: [
                  AnimatedBuilder(
                    animation: _pulseAnimation,
                    builder: (context, child) {
                      return Transform.scale(
                        scale: _pulseAnimation.value,
                        child: Container(
                          width: 8,
                          height: 8,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: _getStatusColor(driverStatus),
                            boxShadow: [
                              BoxShadow(
                                color: _getStatusColor(driverStatus),
                                blurRadius: 8,
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                  const SizedBox(width: 6),
                  Text(
                    driverStatus.toUpperCase(),
                    style: TextStyle(
                      color: _getStatusColor(driverStatus),
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1,
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(width: 12),
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: LinearGradient(
                colors: [Colors.blue.shade400, Colors.blue.shade700],
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.blue.withOpacity(0.5),
                  blurRadius: 10,
                ),
              ],
            ),
            child: Center(
              child: Text(
                driverName.isNotEmpty ? driverName[0].toUpperCase() : '?',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatsGrid() {
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 3,
      mainAxisSpacing: 16,
      crossAxisSpacing: 16,
      childAspectRatio: 1.1,
      children: [
        _buildStatCard('ACTIVE', stats['active']!, Colors.blue, Icons.rocket_launch),
        _buildStatCard('PENDING', stats['pending']!, Colors.orange, Icons.schedule),
        _buildStatCard('DONE', stats['completed']!, Colors.green, Icons.check_circle),
      ],
    );
  }

  Widget _buildStatCard(String label, int value, Color color, IconData icon) {
    return AnimatedBuilder(
      animation: _statsController,
      builder: (context, child) {
        return Transform.scale(
          scale: _statsController.value,
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  color.withOpacity(0.2),
                  color.withOpacity(0.05),
                ],
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: color.withOpacity(0.3)),
              boxShadow: [
                BoxShadow(
                  color: color.withOpacity(0.2),
                  blurRadius: 10,
                ),
              ],
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(icon, color: color, size: 28),
                const SizedBox(height: 8),
                Text(
                  '$value',
                  style: TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.w900,
                    color: color,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 11,
                    color: Colors.white.withOpacity(0.7),
                    letterSpacing: 1,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildMissionsSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'ACTIVE MISSIONS',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: Colors.white70,
                letterSpacing: 2,
              ),
            ),
            TextButton(
              onPressed: () => context.go('/missions'),
              child: const Text('VIEW ALL'),
            ),
          ],
        ),
        const SizedBox(height: 16),
        if (isLoadingMissions)
          const Center(
            child: Padding(
              padding: EdgeInsets.all(40),
              child: CircularProgressIndicator(color: Colors.blue),
            ),
          )
        else if (errorMessage != null)
          Center(
            child: Padding(
              padding: const EdgeInsets.all(40),
              child: Text(
                errorMessage!,
                style: const TextStyle(color: Colors.redAccent),
              ),
            ),
          )
        else if (missions.isEmpty)
            Center(
              child: Padding(
                padding: const EdgeInsets.all(40),
                child: Column(
                  children: [
                    Icon(Icons.rocket_launch, size: 64, color: Colors.white.withOpacity(0.3)),
                    const SizedBox(height: 16),
                    const Text(
                      'No missions assigned',
                      style: TextStyle(color: Colors.white60, fontSize: 16),
                    ),
                  ],
                ),
              ),
            )
          else
            ...missions.take(5).map((m) => _buildMissionCard(m)),
      ],
    );
  }

  Widget _buildMissionCard(Map<String, dynamic> mission) {
    final status = (mission['status'] as String? ?? '').toUpperCase();
    Color statusColor = Colors.grey;
    String statusLabel = 'UNKNOWN';

    switch (status) {
      case 'IN_TRANSIT':
        statusColor = Colors.blue;
        statusLabel = 'IN TRANSIT';
        break;
      case 'SCHEDULED':
      case 'PENDING':
        statusColor = Colors.orange;
        statusLabel = 'SCHEDULED';
        break;
      case 'DELIVERED':
      case 'COMPLETED':
        statusColor = Colors.green;
        statusLabel = 'COMPLETED';
        break;
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Colors.white.withOpacity(0.08),
            Colors.white.withOpacity(0.02),
          ],
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.1)),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () {
            final id = mission['id']?.toString();
            if (id != null) context.go('/mission/$id');
          },
          borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Container(
                  width: 50,
                  height: 50,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [statusColor.withOpacity(0.3), statusColor.withOpacity(0.1)],
                    ),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(Icons.rocket_launch, color: statusColor, size: 24),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        mission['deliveryNumber']?.toString() ?? 'DEL-${mission['id']}',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        mission['deliveryAddress']?.toString() ?? 'Unknown destination',
                        style: const TextStyle(
                          color: Colors.white60,
                          fontSize: 13,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: statusColor.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: statusColor.withOpacity(0.5)),
                        ),
                        child: Text(
                          statusLabel,
                          style: TextStyle(
                            color: statusColor,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                Icon(Icons.arrow_forward_ios, color: Colors.white.withOpacity(0.3), size: 16),
              ],
            ),
          ),
        ),
      ),
    );
  }
}