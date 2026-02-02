import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:math' as math;

class MissionListScreen extends StatefulWidget {
  const MissionListScreen({super.key});

  @override
  State<MissionListScreen> createState() => MissionListScreenState();
}

class MissionListScreenState extends State<MissionListScreen> with TickerProviderStateMixin {
  final _storage = const FlutterSecureStorage();

  List<Map<String, dynamic>> missions = [];
  List<Map<String, dynamic>> filteredMissions = [];

  String statusFilter = 'all';
  String searchQuery = '';

  bool isLoading = true;
  String? errorMessage;

  late AnimationController _animationController;
  late AnimationController _starsController;
  late AnimationController _particlesController;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 800),
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

    _loadMissions();
  }

  @override
  void dispose() {
    _animationController.dispose();
    _starsController.dispose();
    _particlesController.dispose();
    super.dispose();
  }

  Future<String?> _getToken() async {
    return await _storage.read(key: 'access_token');
  }

  Future<void> _loadMissions() async {
    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    try {
      final token = await _getToken();
      if (token == null) {
        if (mounted) context.go('/login');
        return;
      }

      final response = await http.get(
        Uri.parse('http://localhost:8080/api/deliveries/my-deliveries'),
        headers: {
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
        },
      ).timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        setState(() {
          missions = List<Map<String, dynamic>>.from(data);
          _applyFilters();
          isLoading = false;
        });
        _animationController.forward(from: 0);
      } else if (response.statusCode == 401) {
        await _storage.deleteAll();
        if (mounted) context.go('/login');
      }
    } catch (e) {
      setState(() {
        errorMessage = 'Failed to load missions';
        isLoading = false;
      });
    }
  }

  void _applyFilters() {
    filteredMissions = missions.where((mission) {
      final status = (mission['status'] ?? '').toLowerCase();
      final matchesStatus = statusFilter == 'all' || status == statusFilter;
      final matchesSearch = searchQuery.isEmpty ||
          (mission['deliveryNumber'] ?? '').toLowerCase().contains(searchQuery.toLowerCase()) ||
          (mission['customerName'] ?? '').toLowerCase().contains(searchQuery.toLowerCase()) ||
          (mission['deliveryAddress'] ?? '').toLowerCase().contains(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          _buildGalaxyBackground(),
          _buildAmbientParticles(),
          SafeArea(
            child: Column(
              children: [
                _buildHeader(),
                _buildSearchBar(),
                _buildFilters(),
                Expanded(child: _buildMissionList()),
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
              CustomPaint(
                painter: NebulaPainter(animationValue: _starsController.value),
                size: Size.infinite,
              ),
              CustomPaint(
                painter: EnhancedStarsPainter(animationValue: _starsController.value),
                size: Size.infinite,
              ),
              CustomPaint(
                painter: CosmicEffectsPainter(animationValue: _particlesController.value),
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
          painter: AmbientParticlesPainter(animationValue: _particlesController.value),
          size: Size.infinite,
        );
      },
    );
  }

  Widget _buildHeader() {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(20),
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
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  const Color(0xFF06B6D4).withOpacity(0.2),
                  const Color(0xFF3B82F6).withOpacity(0.2),
                ],
              ),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(
                color: const Color(0xFF06B6D4).withOpacity(0.3),
              ),
            ),
            child: IconButton(
              icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Color(0xFF06B6D4), size: 20),
              onPressed: () => context.go("/dashboard"),
              padding: EdgeInsets.zero,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ShaderMask(
                  shaderCallback: (bounds) => const LinearGradient(
                    colors: [
                      Color(0xFF06B6D4),
                      Color(0xFF3B82F6),
                      Color(0xFF8B5CF6),
                    ],
                  ).createShader(bounds),
                  child: const Text(
                    'ALL MISSIONS',
                    style: TextStyle(
                      fontSize: 26,
                      fontWeight: FontWeight.w900,
                      color: Colors.white,
                      letterSpacing: 1.2,
                    ),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '${filteredMissions.length} missions found',
                  style: TextStyle(
                    fontSize: 13,
                    color: const Color(0xFF06B6D4).withOpacity(0.7),
                    letterSpacing: 0.5,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchBar() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              Colors.white.withOpacity(0.1),
              Colors.white.withOpacity(0.05),
            ],
          ),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: const Color(0xFF06B6D4).withOpacity(0.3),
            width: 1.5,
          ),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFF06B6D4).withOpacity(0.1),
              blurRadius: 20,
              spreadRadius: -5,
            ),
          ],
        ),
        child: TextField(
          onChanged: (value) {
            setState(() {
              searchQuery = value;
              _applyFilters();
            });
          },
          style: const TextStyle(color: Colors.white, fontSize: 15),
          decoration: InputDecoration(
            hintText: 'Search missions...',
            hintStyle: TextStyle(
              color: Colors.white.withOpacity(0.4),
              fontSize: 15,
            ),
            prefixIcon: Icon(
              Icons.search_rounded,
              color: const Color(0xFF06B6D4).withOpacity(0.6),
              size: 24,
            ),
            border: InputBorder.none,
            contentPadding: const EdgeInsets.symmetric(vertical: 18, horizontal: 20),
          ),
        ),
      ),
    );
  }

  Widget _buildFilters() {
    return Container(
      height: 64,
      margin: const EdgeInsets.only(top: 20, bottom: 8),
      child: ListView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        children: [
          _buildFilterChip('All', 'all', Icons.grid_view_rounded),
          _buildFilterChip('Scheduled', 'scheduled', Icons.schedule_rounded),
          _buildFilterChip('In Transit', 'in_transit', Icons.near_me_rounded),
          _buildFilterChip('Delivered', 'delivered', Icons.check_circle_rounded),
          _buildFilterChip('Cancelled', 'cancelled', Icons.cancel_rounded),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label, String value, IconData icon) {
    final isSelected = statusFilter == value;

    Color color1, color2;
    if (value == 'all') {
      color1 = const Color(0xFF06B6D4);
      color2 = const Color(0xFF3B82F6);
    } else if (value == 'in_transit') {
      color1 = const Color(0xFF06B6D4);
      color2 = const Color(0xFF3B82F6);
    } else if (value == 'scheduled') {
      color1 = const Color(0xFFF59E0B);
      color2 = const Color(0xFFEF4444);
    } else if (value == 'delivered') {
      color1 = const Color(0xFF10B981);
      color2 = const Color(0xFF059669);
    } else {
      color1 = const Color(0xFFEF4444);
      color2 = const Color(0xFFDC2626);
    }

    return Padding(
      padding: const EdgeInsets.only(right: 12),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () {
            setState(() {
              statusFilter = value;
              _applyFilters();
            });
          },
          borderRadius: BorderRadius.circular(16),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            decoration: BoxDecoration(
              gradient: isSelected
                  ? LinearGradient(colors: [color1, color2])
                  : LinearGradient(
                colors: [
                  Colors.white.withOpacity(0.08),
                  Colors.white.withOpacity(0.04),
                ],
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: isSelected ? color1 : Colors.white.withOpacity(0.2),
                width: 1.5,
              ),
              boxShadow: isSelected
                  ? [
                BoxShadow(
                  color: color1.withOpacity(0.4),
                  blurRadius: 12,
                  spreadRadius: 0,
                ),
              ]
                  : null,
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  icon,
                  size: 20,
                  color: isSelected ? Colors.white : Colors.white70,
                ),
                const SizedBox(width: 8),
                Text(
                  label,
                  style: TextStyle(
                    color: isSelected ? Colors.white : Colors.white70,
                    fontSize: 14,
                    fontWeight: isSelected ? FontWeight.w700 : FontWeight.w600,
                    letterSpacing: 0.3,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildMissionList() {
    return RefreshIndicator(
      onRefresh: _loadMissions,
      color: const Color(0xFF06B6D4),
      backgroundColor: const Color(0xFF0F172A),
      child: isLoading
          ? Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
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
      )
          : errorMessage != null
          ? _buildErrorState()
          : filteredMissions.isEmpty
          ? _buildEmptyState()
          : AnimatedBuilder(
        animation: _animationController,
        builder: (context, child) {
          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: filteredMissions.length,
            itemBuilder: (context, index) {
              return FadeTransition(
                opacity: Tween<double>(begin: 0.0, end: 1.0).animate(
                  CurvedAnimation(
                    parent: _animationController,
                    curve: Interval(
                      (index / filteredMissions.length) * 0.5,
                      1.0,
                      curve: Curves.easeOut,
                    ),
                  ),
                ),
                child: SlideTransition(
                  position: Tween<Offset>(
                    begin: const Offset(0, 0.2),
                    end: Offset.zero,
                  ).animate(
                    CurvedAnimation(
                      parent: _animationController,
                      curve: Interval(
                        (index / filteredMissions.length) * 0.5,
                        1.0,
                        curve: Curves.easeOutCubic,
                      ),
                    ),
                  ),
                  child: _buildMissionCard(filteredMissions[index]),
                ),
              );
            },
          );
        },
      ),
    );
  }

  Widget _buildErrorState() {
    return Center(
      child: Container(
        margin: const EdgeInsets.all(32),
        padding: const EdgeInsets.all(32),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              Colors.white.withOpacity(0.05),
              Colors.white.withOpacity(0.02),
            ],
          ),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: const Color(0xFFEF4444).withOpacity(0.3),
          ),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: LinearGradient(
                  colors: [
                    const Color(0xFFEF4444).withOpacity(0.2),
                    const Color(0xFFEF4444).withOpacity(0.1),
                  ],
                ),
              ),
              child: Icon(
                Icons.error_outline_rounded,
                color: const Color(0xFFEF4444).withOpacity(0.8),
                size: 48,
              ),
            ),
            const SizedBox(height: 24),
            Text(
              errorMessage!,
              style: const TextStyle(
                color: Color(0xFFEF4444),
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 32),
            Container(
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFFEF4444), Color(0xFFDC2626)],
                ),
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFFEF4444).withOpacity(0.3),
                    blurRadius: 12,
                  ),
                ],
              ),
              child: ElevatedButton.icon(
                icon: const Icon(Icons.refresh_rounded),
                label: const Text('Retry'),
                onPressed: _loadMissions,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.transparent,
                  foregroundColor: Colors.white,
                  shadowColor: Colors.transparent,
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Container(
        margin: const EdgeInsets.all(32),
        padding: const EdgeInsets.all(48),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              Colors.white.withOpacity(0.05),
              Colors.white.withOpacity(0.02),
            ],
          ),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: const Color(0xFF06B6D4).withOpacity(0.2),
          ),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: LinearGradient(
                  colors: [
                    const Color(0xFF06B6D4).withOpacity(0.2),
                    const Color(0xFF06B6D4).withOpacity(0.1),
                  ],
                ),
              ),
              child: Icon(
                Icons.rocket_launch_rounded,
                size: 64,
                color: const Color(0xFF06B6D4).withOpacity(0.6),
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'No missions found',
              style: TextStyle(
                color: Colors.white,
                fontSize: 20,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Try adjusting your filters',
              style: TextStyle(
                color: Colors.white.withOpacity(0.5),
                fontSize: 14,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMissionCard(Map<String, dynamic> mission) {
    final status = (mission['status'] ?? '').toLowerCase();
    Color statusColor1, statusColor2;
    String statusText;
    IconData statusIcon;

    switch (status) {
      case 'in_transit':
        statusColor1 = const Color(0xFF06B6D4);
        statusColor2 = const Color(0xFF3B82F6);
        statusText = 'IN TRANSIT';
        statusIcon = Icons.near_me_rounded;
        break;
      case 'pending':
      case 'scheduled':
        statusColor1 = const Color(0xFFF59E0B);
        statusColor2 = const Color(0xFFEF4444);
        statusText = 'SCHEDULED';
        statusIcon = Icons.schedule_rounded;
        break;
      case 'delivered':
      case 'completed':
        statusColor1 = const Color(0xFF10B981);
        statusColor2 = const Color(0xFF059669);
        statusText = 'DELIVERED';
        statusIcon = Icons.check_circle_rounded;
        break;
      case 'cancelled':
        statusColor1 = const Color(0xFFEF4444);
        statusColor2 = const Color(0xFFDC2626);
        statusText = 'CANCELLED';
        statusIcon = Icons.cancel_rounded;
        break;
      default:
        statusColor1 = const Color(0xFF64748B);
        statusColor2 = const Color(0xFF475569);
        statusText = 'UNKNOWN';
        statusIcon = Icons.help_outline_rounded;
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
          onTap: () => context.go('/mission/${mission['id']}'),
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
                      ),
                    ],
                  ),
                  child: Icon(statusIcon, color: Colors.white, size: 32),
                ),
                const SizedBox(width: 20),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        mission['deliveryNumber'] ?? 'DEL-${mission['id']}',
                        style: const TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.w700,
                          color: Colors.white,
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
                              mission['deliveryAddress'] ?? 'Unknown address',
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
                      Row(
                        children: [
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
                                  size: 12,
                                  color: statusColor1,
                                ),
                                const SizedBox(width: 6),
                                Text(
                                  statusText,
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
                          if (mission['customerName'] != null) ...[
                            const SizedBox(width: 12),
                            Expanded(
                              child: Row(
                                children: [
                                  Icon(
                                    Icons.person_rounded,
                                    size: 14,
                                    color: Colors.white.withOpacity(0.5),
                                  ),
                                  const SizedBox(width: 4),
                                  Expanded(
                                    child: Text(
                                      mission['customerName'],
                                      style: TextStyle(
                                        color: Colors.white.withOpacity(0.7),
                                        fontSize: 12,
                                        fontWeight: FontWeight.w500,
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ],
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

// Reusing the painters from the dashboard
class NebulaPainter extends CustomPainter {
  final double animationValue;

  NebulaPainter({required this.animationValue});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..maskFilter = const MaskFilter.blur(BlurStyle.normal, 100);

    paint.color = const Color(0xFF5B21B6).withOpacity(0.12);
    canvas.drawCircle(Offset(size.width * 0.2, size.height * 0.3), 200, paint);

    paint.color = const Color(0xFF0891B2).withOpacity(0.15);
    canvas.drawCircle(Offset(size.width * 0.75, size.height * 0.25), 180, paint);

    paint.color = const Color(0xFFDB2777).withOpacity(0.08);
    canvas.drawCircle(Offset(size.width * 0.6, size.height * 0.7), 160, paint);

    paint.color = const Color(0xFF1D4ED8).withOpacity(0.1);
    canvas.drawCircle(Offset(size.width * 0.3, size.height * 0.8), 140, paint);
  }

  @override
  bool shouldRepaint(NebulaPainter oldDelegate) => false;
}

class EnhancedStarsPainter extends CustomPainter {
  final double animationValue;
  final math.Random _random = math.Random(42);

  EnhancedStarsPainter({required this.animationValue});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint();

    for (int i = 0; i < 200; i++) {
      final x = _random.nextDouble() * size.width;
      final y = _random.nextDouble() * size.height;
      final starSize = _random.nextDouble() * 1.5 + 0.3;

      final twinkle = (math.sin((animationValue * math.pi * 2) + i * 0.1) + 1) / 2;
      paint.color = Colors.white.withOpacity(0.2 + (twinkle * 0.5));

      canvas.drawCircle(Offset(x, y), starSize, paint);
    }

    for (int i = 0; i < 50; i++) {
      final x = _random.nextDouble() * size.width;
      final y = _random.nextDouble() * size.height;
      final starSize = _random.nextDouble() * 2 + 0.8;

      final twinkle = (math.sin((animationValue * math.pi * 2) + i * 0.3) + 1) / 2;

      paint.color = const Color(0xFF06B6D4).withOpacity(0.3 + (twinkle * 0.4));
      paint.maskFilter = const MaskFilter.blur(BlurStyle.normal, 4);
      canvas.drawCircle(Offset(x, y), starSize * 3, paint);

      paint.color = Colors.white.withOpacity(0.7 + (twinkle * 0.3));
      paint.maskFilter = null;
      canvas.drawCircle(Offset(x, y), starSize, paint);
    }

    for (int i = 0; i < 15; i++) {
      final x = _random.nextDouble() * size.width;
      final y = _random.nextDouble() * size.height;
      final starSize = _random.nextDouble() * 2.5 + 1.5;

      final twinkle = (math.sin((animationValue * math.pi * 2) + i * 0.5) + 1) / 2;

      paint.color = const Color(0xFF3B82F6).withOpacity(0.4 + (twinkle * 0.3));
      paint.maskFilter = const MaskFilter.blur(BlurStyle.normal, 8);
      canvas.drawCircle(Offset(x, y), starSize * 4, paint);

      paint.color = const Color(0xFF06B6D4).withOpacity(0.6 + (twinkle * 0.4));
      paint.maskFilter = const MaskFilter.blur(BlurStyle.normal, 3);
      canvas.drawCircle(Offset(x, y), starSize * 2, paint);

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

class CosmicEffectsPainter extends CustomPainter {
  final double animationValue;

  CosmicEffectsPainter({required this.animationValue});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..strokeWidth = 2.5
      ..strokeCap = StrokeCap.round;

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