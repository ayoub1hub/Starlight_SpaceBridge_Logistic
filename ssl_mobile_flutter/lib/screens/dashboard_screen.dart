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
  late AnimationController _starsController;
  late AnimationController _particlesController;
  late Animation<double> _pulseAnimation;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    )..repeat(reverse: true);

    _statsController = AnimationController(
      duration: const Duration(milliseconds: 1200),
      vsync: this,
    );

    _starsController = AnimationController(
      duration: const Duration(seconds: 120),
      vsync: this,
    )..repeat();

    _particlesController = AnimationController(
      duration: const Duration(seconds: 30),
      vsync: this,
    )..repeat();

    _pulseAnimation = Tween<double>(begin: 1.0, end: 1.15).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );

    _loadData();
  }

  @override
  void dispose() {
    _pulseController.dispose();
    _statsController.dispose();
    _starsController.dispose();
    _particlesController.dispose();
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
        return const Color(0xFF00FFA3);
      case 'busy':
      case 'in_transit':
        return const Color(0xFFFFB800);
      default:
        return const Color(0xFF64748B);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          // Multi-layered galaxy background
          _buildGalaxyBackground(),

          // Ambient particles
          _buildAmbientParticles(),

          // Content with glass morphism
          SafeArea(
            child: Column(
              children: [
                _buildHeader(),
                Expanded(
                  child: RefreshIndicator(
                    onRefresh: _loadData,
                    color: const Color(0xFF06B6D4),
                    backgroundColor: const Color(0xFF0F172A),
                    child: SingleChildScrollView(
                      physics: const AlwaysScrollableScrollPhysics(),
                      padding: const EdgeInsets.all(24),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          _buildStatsGrid(),
                          const SizedBox(height: 40),
                          _buildMissionsSection(),
                          const SizedBox(height: 40),
                        ],
                      ),
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

  Widget _buildGalaxyBackground() {
    return AnimatedBuilder(
      animation: Listenable.merge([_starsController, _particlesController]),
      builder: (context, child) {
        return Container(
          decoration: const BoxDecoration(
            gradient: RadialGradient(
              center: Alignment(-0.3, -0.7),
              radius: 1.8,
              colors: [
                Color(0xFF1E1B4B),
                Color(0xFF0F172A),
                Color(0xFF020617),
                Color(0xFF000000),
              ],
              stops: [0.0, 0.3, 0.7, 1.0],
            ),
          ),
          child: Stack(
            children: [
              // Background nebula layer
              CustomPaint(
                painter: NebulaPainter(
                  animationValue: _starsController.value,
                ),
                size: Size.infinite,
              ),
              // Stars layer
              CustomPaint(
                painter: EnhancedStarsPainter(
                  animationValue: _starsController.value,
                ),
                size: Size.infinite,
              ),
              // Foreground effects
              CustomPaint(
                painter: CosmicEffectsPainter(
                  animationValue: _particlesController.value,
                ),
                size: Size.infinite,
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildAmbientParticles() {
    return AnimatedBuilder(
      animation: _particlesController,
      builder: (context, child) {
        return CustomPaint(
          painter: AmbientParticlesPainter(
            animationValue: _particlesController.value,
          ),
          size: Size.infinite,
        );
      },
    );
  }

  Widget _buildHeader() {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Colors.white.withOpacity(0.08),
            Colors.white.withOpacity(0.03),
          ],
        ),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: Colors.white.withOpacity(0.1),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF06B6D4).withOpacity(0.1),
            blurRadius: 30,
            spreadRadius: -5,
          ),
          BoxShadow(
            color: Colors.black.withOpacity(0.3),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          width: 4,
                          height: 16,
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [Color(0xFF06B6D4), Color(0xFF3B82F6)],
                            ),
                            borderRadius: BorderRadius.circular(2),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Text(
                          DateFormat('EEEE, MMMM d, yyyy').format(DateTime.now()).toUpperCase(),
                          style: TextStyle(
                            fontSize: 10,
                            color: const Color(0xFF06B6D4).withOpacity(0.8),
                            letterSpacing: 1.5,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    ShaderMask(
                      shaderCallback: (bounds) => const LinearGradient(
                        colors: [
                          Color(0xFF06B6D4),
                          Color(0xFF3B82F6),
                          Color(0xFF8B5CF6),
                        ],
                      ).createShader(bounds),
                      child: const Text(
                        'MISSION CONTROL',
                        style: TextStyle(
                          fontSize: 32,
                          fontWeight: FontWeight.w900,
                          color: Colors.white,
                          letterSpacing: 1,
                          height: 1.2,
                        ),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'SpaceBridge Delivery System',
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.white.withOpacity(0.5),
                        letterSpacing: 0.5,
                      ),
                    ),
                  ],
                ),
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
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Colors.white.withOpacity(0.1),
            Colors.white.withOpacity(0.05),
          ],
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: const Color(0xFF06B6D4).withOpacity(0.3),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF06B6D4).withOpacity(0.2),
            blurRadius: 20,
            spreadRadius: -5,
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                driverName,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.3,
                ),
              ),
              const SizedBox(height: 6),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  AnimatedBuilder(
                    animation: _pulseAnimation,
                    builder: (context, child) {
                      return Container(
                        width: 10,
                        height: 10,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: _getStatusColor(driverStatus),
                          boxShadow: [
                            BoxShadow(
                              color: _getStatusColor(driverStatus),
                              blurRadius: 8 * _pulseAnimation.value,
                              spreadRadius: 2 * _pulseAnimation.value,
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                  const SizedBox(width: 8),
                  Text(
                    driverStatus.toUpperCase(),
                    style: TextStyle(
                      color: _getStatusColor(driverStatus),
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 1.2,
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(width: 16),
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: const LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  Color(0xFF06B6D4),
                  Color(0xFF3B82F6),
                  Color(0xFF8B5CF6),
                ],
              ),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF06B6D4).withOpacity(0.5),
                  blurRadius: 20,
                  spreadRadius: 2,
                ),
              ],
            ),
            child: Container(
              margin: const EdgeInsets.all(2),
              decoration: const BoxDecoration(
                shape: BoxShape.circle,
                color: Color(0xFF0F172A),
              ),
              child: Center(
                child: Text(
                  driverName.isNotEmpty ? driverName[0].toUpperCase() : '?',
                  style: const TextStyle(
                    color: Color(0xFF06B6D4),
                    fontSize: 24,
                    fontWeight: FontWeight.w900,
                  ),
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
      childAspectRatio: 1.0,
      children: [
        _buildStatCard(
          'ACTIVE',
          stats['active']!,
          const Color(0xFF06B6D4),
          const Color(0xFF3B82F6),
          Icons.rocket_launch_rounded,
        ),
        _buildStatCard(
          'PENDING',
          stats['pending']!,
          const Color(0xFFF59E0B),
          const Color(0xFFEF4444),
          Icons.access_time_rounded,
        ),
        _buildStatCard(
          'COMPLETED',
          stats['completed']!,
          const Color(0xFF10B981),
          const Color(0xFF059669),
          Icons.check_circle_rounded,
        ),
      ],
    );
  }

  Widget _buildStatCard(String label, int value, Color color1, Color color2, IconData icon) {
    return AnimatedBuilder(
      animation: _statsController,
      builder: (context, child) {
        final curvedValue = Curves.easeOutBack.transform(_statsController.value);
        return Transform.scale(
          scale: curvedValue,
          child: Opacity(
            opacity: _statsController.value,
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    Colors.white.withOpacity(0.1),
                    Colors.white.withOpacity(0.05),
                  ],
                ),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(
                  color: color1.withOpacity(0.3),
                  width: 1.5,
                ),
                boxShadow: [
                  BoxShadow(
                    color: color1.withOpacity(0.2),
                    blurRadius: 20,
                    spreadRadius: -5,
                  ),
                  BoxShadow(
                    color: Colors.black.withOpacity(0.3),
                    blurRadius: 15,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Stack(
                children: [
                  // Gradient overlay
                  Positioned(
                    top: 0,
                    right: 0,
                    child: Container(
                      width: 80,
                      height: 80,
                      decoration: BoxDecoration(
                        gradient: RadialGradient(
                          colors: [
                            color1.withOpacity(0.15),
                            Colors.transparent,
                          ],
                        ),
                      ),
                    ),
                  ),
                  // Content
                  Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [color1, color2],
                            ),
                            borderRadius: BorderRadius.circular(12),
                            boxShadow: [
                              BoxShadow(
                                color: color1.withOpacity(0.4),
                                blurRadius: 12,
                                spreadRadius: 0,
                              ),
                            ],
                          ),
                          child: Icon(icon, color: Colors.white, size: 24),
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            ShaderMask(
                              shaderCallback: (bounds) => LinearGradient(
                                colors: [color1, color2],
                              ).createShader(bounds),
                              child: Text(
                                '$value',
                                style: const TextStyle(
                                  fontSize: 36,
                                  fontWeight: FontWeight.w900,
                                  color: Colors.white,
                                  height: 1,
                                ),
                              ),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              label,
                              style: TextStyle(
                                fontSize: 11,
                                color: Colors.white.withOpacity(0.6),
                                letterSpacing: 1.5,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
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
            Row(
              children: [
                Container(
                  width: 4,
                  height: 20,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF06B6D4), Color(0xFF3B82F6)],
                    ),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
                const SizedBox(width: 12),
                const Text(
                  'ACTIVE MISSIONS',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                    letterSpacing: 1.2,
                  ),
                ),
              ],
            ),
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    const Color(0xFF06B6D4).withOpacity(0.2),
                    const Color(0xFF3B82F6).withOpacity(0.2),
                  ],
                ),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: const Color(0xFF06B6D4).withOpacity(0.3),
                ),
              ),
              child: Material(
                color: Colors.transparent,
                child: InkWell(
                  onTap: () => context.go('/missions'),
                  borderRadius: BorderRadius.circular(12),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Text(
                          'VIEW ALL',
                          style: TextStyle(
                            color: Color(0xFF06B6D4),
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 1,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Icon(
                          Icons.arrow_forward_rounded,
                          color: const Color(0xFF06B6D4),
                          size: 16,
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 20),
        if (isLoadingMissions)
          Center(
            child: Padding(
              padding: const EdgeInsets.all(60),
              child: Column(
                children: [
                  SizedBox(
                    width: 50,
                    height: 50,
                    child: CircularProgressIndicator(
                      color: const Color(0xFF06B6D4),
                      strokeWidth: 3,
                    ),
                  ),
                  const SizedBox(height: 20),
                  Text(
                    'Loading missions...',
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.5),
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),
          )
        else if (errorMessage != null)
          _buildEmptyState(
            Icons.error_outline_rounded,
            errorMessage!,
            const Color(0xFFEF4444),
          )
        else if (missions.isEmpty)
            _buildEmptyState(
              Icons.rocket_launch_rounded,
              'No missions assigned yet',
              const Color(0xFF06B6D4),
            )
          else
            ...missions.take(5).map((m) => _buildMissionCard(m)),
      ],
    );
  }

  Widget _buildEmptyState(IconData icon, String message, Color color) {
    return Container(
      padding: const EdgeInsets.all(48),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Colors.white.withOpacity(0.05),
            Colors.white.withOpacity(0.02),
          ],
        ),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: color.withOpacity(0.2),
        ),
      ),
      child: Center(
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: LinearGradient(
                  colors: [
                    color.withOpacity(0.2),
                    color.withOpacity(0.1),
                  ],
                ),
              ),
              child: Icon(
                icon,
                size: 48,
                color: color.withOpacity(0.6),
              ),
            ),
            const SizedBox(height: 20),
            Text(
              message,
              style: TextStyle(
                color: Colors.white.withOpacity(0.6),
                fontSize: 16,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMissionCard(Map<String, dynamic> mission) {
    final status = (mission['status'] as String? ?? '').toUpperCase();
    Color statusColor1 = const Color(0xFF64748B);
    Color statusColor2 = const Color(0xFF475569);
    String statusLabel = 'UNKNOWN';
    IconData statusIcon = Icons.help_outline_rounded;

    switch (status) {
      case 'IN_TRANSIT':
        statusColor1 = const Color(0xFF06B6D4);
        statusColor2 = const Color(0xFF3B82F6);
        statusLabel = 'IN TRANSIT';
        statusIcon = Icons.near_me_rounded;
        break;
      case 'SCHEDULED':
      case 'PENDING':
        statusColor1 = const Color(0xFFF59E0B);
        statusColor2 = const Color(0xFFEF4444);
        statusLabel = 'SCHEDULED';
        statusIcon = Icons.schedule_rounded;
        break;
      case 'DELIVERED':
      case 'COMPLETED':
        statusColor1 = const Color(0xFF10B981);
        statusColor2 = const Color(0xFF059669);
        statusLabel = 'COMPLETED';
        statusIcon = Icons.check_circle_rounded;
        break;
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Colors.white.withOpacity(0.1),
            Colors.white.withOpacity(0.05),
          ],
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: statusColor1.withOpacity(0.3),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: statusColor1.withOpacity(0.15),
            blurRadius: 20,
            spreadRadius: -5,
          ),
          BoxShadow(
            color: Colors.black.withOpacity(0.3),
            blurRadius: 15,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () {
            final id = mission['id']?.toString();
            if (id != null) context.go('/mission/$id');
          },
          borderRadius: BorderRadius.circular(20),
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Row(
              children: [
                Container(
                  width: 64,
                  height: 64,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [statusColor1, statusColor2],
                    ),
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: statusColor1.withOpacity(0.4),
                        blurRadius: 12,
                        spreadRadius: 0,
                      ),
                    ],
                  ),
                  child: Icon(
                    Icons.rocket_launch_rounded,
                    color: Colors.white,
                    size: 32,
                  ),
                ),
                const SizedBox(width: 20),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        mission['deliveryNumber']?.toString() ?? 'DEL-${mission['id']}',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 17,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 0.3,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Icon(
                            Icons.location_on_rounded,
                            size: 16,
                            color: Colors.white.withOpacity(0.5),
                          ),
                          const SizedBox(width: 6),
                          Expanded(
                            child: Text(
                              mission['deliveryAddress']?.toString() ?? 'Unknown destination',
                              style: TextStyle(
                                color: Colors.white.withOpacity(0.6),
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              statusColor1.withOpacity(0.2),
                              statusColor2.withOpacity(0.2),
                            ],
                          ),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(
                            color: statusColor1.withOpacity(0.4),
                          ),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              statusIcon,
                              size: 14,
                              color: statusColor1,
                            ),
                            const SizedBox(width: 6),
                            Text(
                              statusLabel,
                              style: TextStyle(
                                color: statusColor1,
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                                letterSpacing: 1,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.05),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    Icons.arrow_forward_ios_rounded,
                    color: statusColor1.withOpacity(0.6),
                    size: 18,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// Enhanced Nebula Painter
class NebulaPainter extends CustomPainter {
  final double animationValue;

  NebulaPainter({required this.animationValue});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..maskFilter = const MaskFilter.blur(BlurStyle.normal, 100);

    // Large purple nebula
    paint.color = const Color(0xFF5B21B6).withOpacity(0.12);
    canvas.drawCircle(
      Offset(size.width * 0.2, size.height * 0.3),
      200,
      paint,
    );

    // Cyan nebula
    paint.color = const Color(0xFF0891B2).withOpacity(0.15);
    canvas.drawCircle(
      Offset(size.width * 0.75, size.height * 0.25),
      180,
      paint,
    );

    // Pink nebula
    paint.color = const Color(0xFFDB2777).withOpacity(0.08);
    canvas.drawCircle(
      Offset(size.width * 0.6, size.height * 0.7),
      160,
      paint,
    );

    // Blue nebula
    paint.color = const Color(0xFF1D4ED8).withOpacity(0.1);
    canvas.drawCircle(
      Offset(size.width * 0.3, size.height * 0.8),
      140,
      paint,
    );
  }

  @override
  bool shouldRepaint(NebulaPainter oldDelegate) => false;
}

// Enhanced Stars Painter
class EnhancedStarsPainter extends CustomPainter {
  final double animationValue;
  final math.Random _random = math.Random(42);

  EnhancedStarsPainter({required this.animationValue});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint();

    // Background stars (small, numerous)
    for (int i = 0; i < 200; i++) {
      final x = _random.nextDouble() * size.width;
      final y = _random.nextDouble() * size.height;
      final starSize = _random.nextDouble() * 1.5 + 0.3;

      final twinkle = (math.sin((animationValue * math.pi * 2) + i * 0.1) + 1) / 2;
      paint.color = Colors.white.withOpacity(0.2 + (twinkle * 0.5));

      canvas.drawCircle(Offset(x, y), starSize, paint);
    }

    // Medium stars with glow
    for (int i = 0; i < 50; i++) {
      final x = _random.nextDouble() * size.width;
      final y = _random.nextDouble() * size.height;
      final starSize = _random.nextDouble() * 2 + 0.8;

      final twinkle = (math.sin((animationValue * math.pi * 2) + i * 0.3) + 1) / 2;

      // Glow
      paint.color = const Color(0xFF06B6D4).withOpacity(0.3 + (twinkle * 0.4));
      paint.maskFilter = const MaskFilter.blur(BlurStyle.normal, 4);
      canvas.drawCircle(Offset(x, y), starSize * 3, paint);

      // Core
      paint.color = Colors.white.withOpacity(0.7 + (twinkle * 0.3));
      paint.maskFilter = null;
      canvas.drawCircle(Offset(x, y), starSize, paint);
    }

    // Bright accent stars
    for (int i = 0; i < 15; i++) {
      final x = _random.nextDouble() * size.width;
      final y = _random.nextDouble() * size.height;
      final starSize = _random.nextDouble() * 2.5 + 1.5;

      final twinkle = (math.sin((animationValue * math.pi * 2) + i * 0.5) + 1) / 2;

      // Outer glow
      paint.color = const Color(0xFF3B82F6).withOpacity(0.4 + (twinkle * 0.3));
      paint.maskFilter = const MaskFilter.blur(BlurStyle.normal, 8);
      canvas.drawCircle(Offset(x, y), starSize * 4, paint);

      // Inner glow
      paint.color = const Color(0xFF06B6D4).withOpacity(0.6 + (twinkle * 0.4));
      paint.maskFilter = const MaskFilter.blur(BlurStyle.normal, 3);
      canvas.drawCircle(Offset(x, y), starSize * 2, paint);

      // Core
      paint.color = Colors.white;
      paint.maskFilter = null;
      canvas.drawCircle(Offset(x, y), starSize, paint);
    }
  }

  @override
  bool shouldRepaint(EnhancedStarsPainter oldDelegate) {
    return oldDelegate.animationValue != animationValue;
  }
}

// Cosmic Effects Painter (shooting stars, comets)
class CosmicEffectsPainter extends CustomPainter {
  final double animationValue;

  CosmicEffectsPainter({required this.animationValue});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..strokeWidth = 2.5
      ..strokeCap = StrokeCap.round;

    // Draw shooting stars
    for (int i = 0; i < 3; i++) {
      final progress = (animationValue + (i * 0.33)) % 1.0;

      if (progress < 0.15) {
        final startX = size.width * (0.3 + i * 0.25);
        final startY = size.height * (0.15 + i * 0.2);
        final length = 80.0 * (progress / 0.15);

        final gradient = LinearGradient(
          colors: [
            Colors.white,
            const Color(0xFF06B6D4).withOpacity(0.8),
            const Color(0xFF3B82F6).withOpacity(0.4),
            Colors.transparent,
          ],
        );

        paint.shader = gradient.createShader(
          Rect.fromPoints(
            Offset(startX, startY),
            Offset(startX + length * 1.5, startY + length),
          ),
        );

        paint.strokeWidth = 3 * (1 - progress / 0.15);

        canvas.drawLine(
          Offset(startX, startY),
          Offset(startX + length * 1.5, startY + length),
          paint,
        );
      }
    }
  }

  @override
  bool shouldRepaint(CosmicEffectsPainter oldDelegate) {
    return oldDelegate.animationValue != animationValue;
  }
}

// Ambient Particles Painter
class AmbientParticlesPainter extends CustomPainter {
  final double animationValue;
  final math.Random _random = math.Random(123);

  AmbientParticlesPainter({required this.animationValue});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint();

    for (int i = 0; i < 30; i++) {
      final baseX = _random.nextDouble() * size.width;
      final baseY = _random.nextDouble() * size.height;

      // Floating animation
      final floatOffset = math.sin((animationValue * math.pi * 2) + i) * 20;
      final x = baseX + floatOffset;
      final y = baseY + (animationValue * size.height * 0.1) % size.height;

      final opacity = (math.sin((animationValue * math.pi * 2) + i * 0.5) + 1) / 2;

      paint.color = const Color(0xFF06B6D4).withOpacity(opacity * 0.15);
      paint.maskFilter = const MaskFilter.blur(BlurStyle.normal, 15);

      canvas.drawCircle(Offset(x, y), 3, paint);
    }
  }

  @override
  bool shouldRepaint(AmbientParticlesPainter oldDelegate) {
    return oldDelegate.animationValue != animationValue;
  }
}