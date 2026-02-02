import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';
import 'dart:math' as math;

class MissionDetailScreen extends StatefulWidget {
  final String id;
  const MissionDetailScreen({super.key, required this.id});

  @override
  State<MissionDetailScreen> createState() => _MissionDetailScreenState();
}

class _MissionDetailScreenState extends State<MissionDetailScreen> with TickerProviderStateMixin {
  final _storage = const FlutterSecureStorage();

  Map<String, dynamic>? mission;
  bool isLoading = true;
  String? errorMessage;

  final _dateFormat = DateFormat('dd MMM yyyy');
  final _dateTimeFormat = DateFormat('dd MMM yyyy • HH:mm');

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

    _fetchMission();
  }

  @override
  void dispose() {
    _animationController.dispose();
    _starsController.dispose();
    _particlesController.dispose();
    super.dispose();
  }

  void _showMessage(String message, {bool isError = false}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.2),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(
                isError ? Icons.error_outline_rounded : Icons.check_circle_rounded,
                color: Colors.white,
                size: 20,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    isError ? 'Error' : 'Success',
                    style: const TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 15,
                    ),
                  ),
                  Text(
                    message,
                    style: TextStyle(
                      fontSize: 13,
                      color: Colors.white.withOpacity(0.9),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        backgroundColor: isError ? const Color(0xFFEF4444) : const Color(0xFF10B981),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        margin: const EdgeInsets.all(16),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      ),
    );
  }

  Future<void> _updateStatus(String newStatus) async {
    try {
      final token = await _storage.read(key: 'access_token');
      if (token == null) {
        _showMessage('Session expired', isError: true);
        return;
      }

      final response = await http.put(
        Uri.parse('http://localhost:8080/api/deliveries/${widget.id}/status?status=$newStatus'),
        headers: {
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
        },
      ).timeout(const Duration(seconds: 10));

      if (response.statusCode == 200 || response.statusCode == 204) {
        _showMessage(newStatus == 'IN_TRANSIT' ? 'Delivery started' : 'Delivery completed');
        await _fetchMission();
      } else if (response.statusCode == 401) {
        await _storage.deleteAll();
        if (mounted) context.go('/login');
      } else {
        throw Exception('Failed to update status');
      }
    } catch (e) {
      _showMessage('Update failed: $e', isError: true);
    }
  }

  Future<void> _fetchMission() async {
    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    try {
      final token = await _storage.read(key: 'access_token');
      if (token == null) {
        if (mounted) context.go('/login');
        return;
      }

      final response = await http.get(
        Uri.parse('http://localhost:8080/api/deliveries/${widget.id}'),
        headers: {
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
        },
      ).timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        setState(() {
          mission = jsonDecode(response.body);
          isLoading = false;
        });
        _animationController.forward();
      } else if (response.statusCode == 401) {
        await _storage.deleteAll();
        if (mounted) context.go('/login');
      } else {
        throw Exception('Failed to load mission');
      }
    } catch (e) {
      setState(() {
        errorMessage = 'Failed to load mission details';
        isLoading = false;
      });
    }
  }

  Color _getStatusColor(String? status) {
    switch ((status ?? '').toUpperCase()) {
      case 'IN_TRANSIT': return const Color(0xFF06B6D4);
      case 'SCHEDULED': return const Color(0xFFF59E0B);
      case 'PENDING': return const Color(0xFFEF4444);
      case 'DELIVERED': return const Color(0xFF10B981);
      case 'COMPLETED': return const Color(0xFF059669);
      case 'CANCELLED': return const Color(0xFFEF4444);
      default: return const Color(0xFF64748B);
    }
  }

  String _getStatusDisplay(String? status) {
    switch ((status ?? '').toUpperCase()) {
      case 'IN_TRANSIT': return 'IN TRANSIT';
      case 'SCHEDULED': return 'SCHEDULED';
      case 'PENDING': return 'PENDING';
      case 'DELIVERED': return 'DELIVERED';
      case 'COMPLETED': return 'COMPLETED';
      case 'CANCELLED': return 'CANCELLED';
      default: return status?.toUpperCase() ?? 'UNKNOWN';
    }
  }

  void _openMaps(double? lat, double? lng, String? address) async {
    if (lat != null && lng != null) {
      final url = Uri.parse('https://www.google.com/maps/search/?api=1&query=$lat,$lng');
      if (await canLaunchUrl(url)) await launchUrl(url);
    } else if (address != null) {
      final url = Uri.parse('https://www.google.com/maps/search/?api=1&query=${Uri.encodeComponent(address)}');
      if (await canLaunchUrl(url)) await launchUrl(url);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) return _buildLoadingScreen();
    if (errorMessage != null || mission == null) return _buildErrorScreen();

    final status = mission!['status'] as String?;
    final isActive = ['SCHEDULED', 'PENDING', 'IN_TRANSIT'].contains(status?.toUpperCase());

    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          _buildGalaxyBackground(),
          _buildAmbientParticles(),
          SafeArea(
            child: Column(
              children: [
                _buildHeader(status),
                Expanded(
                  child: RefreshIndicator(
                    onRefresh: _fetchMission,
                    color: const Color(0xFF06B6D4),
                    backgroundColor: const Color(0xFF0F172A),
                    child: SingleChildScrollView(
                      padding: EdgeInsets.fromLTRB(16, 8, 16, isActive ? 140 : 40),
                      child: FadeTransition(
                        opacity: _animationController,
                        child: Column(
                          children: [
                            _buildInfoCard(),
                            const SizedBox(height: 16),
                            _buildCustomerCard(),
                            const SizedBox(height: 16),
                            _buildAddressCard(),
                            const SizedBox(height: 16),
                            _buildScheduleCard(),
                            if (mission!['notes'] != null) ...[
                              const SizedBox(height: 16),
                              _buildNotesCard(),
                            ],
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      bottomSheet: isActive ? _buildActionBar(status) : null,
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

  Widget _buildHeader(String? status) {
    final statusColor = _getStatusColor(status);

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
          color: statusColor.withOpacity(0.3),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: statusColor.withOpacity(0.2),
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
                  statusColor.withOpacity(0.2),
                  statusColor.withOpacity(0.1),
                ],
              ),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(
                color: statusColor.withOpacity(0.3),
              ),
            ),
            child: IconButton(
              icon: Icon(Icons.arrow_back_ios_new_rounded, color: statusColor, size: 20),
              onPressed: () => context.go('/dashboard'),
              padding: EdgeInsets.zero,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ShaderMask(
                  shaderCallback: (bounds) => LinearGradient(
                    colors: [statusColor, statusColor.withOpacity(0.7)],
                  ).createShader(bounds),
                  child: Text(
                    mission!['deliveryNumber'] ?? 'Delivery ${widget.id}',
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w900,
                      color: Colors.white,
                      letterSpacing: 0.5,
                    ),
                  ),
                ),
                const SizedBox(height: 10),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        statusColor.withOpacity(0.2),
                        statusColor.withOpacity(0.1),
                      ],
                    ),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: statusColor.withOpacity(0.4)),
                  ),
                  child: Text(
                    _getStatusDisplay(status),
                    style: TextStyle(
                      color: statusColor,
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 1.5,
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

  Widget _buildInfoCard() {
    return _buildCard(
      title: 'DELIVERY INFO',
      icon: Icons.info_outline_rounded,
      color: const Color(0xFF06B6D4),
      children: [
        _buildDetailRow(Icons.confirmation_number_outlined, 'Delivery Number', mission!['deliveryNumber'] ?? '—'),
        _buildDetailRow(Icons.link, 'Order Reference', mission!['orderReference'] ?? '—'),
        _buildDetailRow(Icons.warehouse_outlined, 'Warehouse', mission!['warehouseId']?.toString() ?? '—'),
      ],
    );
  }

  Widget _buildCustomerCard() {
    return _buildCard(
      title: 'CUSTOMER',
      icon: Icons.person_outline_rounded,
      color: const Color(0xFF8B5CF6),
      children: [
        _buildDetailRow(Icons.account_circle_outlined, 'Customer Name', mission!['customerName'] ?? 'Not specified'),
        if (mission!['driver'] != null) ...[
          _buildDetailRow(Icons.local_shipping_outlined, 'Driver', mission!['driver']['name'] ?? '—'),
          if (mission!['driver']['phone'] != null)
            _buildDetailRow(Icons.phone_outlined, 'Driver Phone', mission!['driver']['phone']),
        ],
      ],
    );
  }

  Widget _buildAddressCard() {
    final address = mission!['deliveryAddress'];
    final lat = mission!['destinationLatitude'];
    final lng = mission!['destinationLongitude'];

    return _buildCard(
      title: 'DELIVERY ADDRESS',
      icon: Icons.location_on_outlined,
      color: const Color(0xFF10B981),
      children: [
        InkWell(
          onTap: () => _openMaps(lat, lng, address),
          borderRadius: BorderRadius.circular(16),
          child: Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [
                  Color(0xFF10B981),
                  Color(0xFF059669),
                ],
              ),
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF10B981).withOpacity(0.3),
                  blurRadius: 15,
                  spreadRadius: -2,
                ),
              ],
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.map_rounded, color: Colors.white, size: 28),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        address ?? (lat != null && lng != null ? 'Coordinates: $lat, $lng' : 'Not specified'),
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Tap to open in maps',
                        style: TextStyle(
                          color: Colors.white.withOpacity(0.8),
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
                Icon(
                  Icons.arrow_forward_ios_rounded,
                  color: Colors.white.withOpacity(0.8),
                  size: 18,
                ),
              ],
            ),
          ),
        ),
        if (mission!['estimatedDistanceKm'] != null)
          _buildDetailRow(Icons.straighten, 'Estimated Distance', '${mission!['estimatedDistanceKm']} km'),
        if (mission!['actualDistanceKm'] != null)
          _buildDetailRow(Icons.route_rounded, 'Actual Distance', '${mission!['actualDistanceKm']} km'),
      ],
    );
  }

  Widget _buildScheduleCard() {
    return _buildCard(
      title: 'SCHEDULE',
      icon: Icons.schedule_rounded,
      color: const Color(0xFFF59E0B),
      children: [
        _buildDetailRow(
          Icons.event_available_rounded,
          'Scheduled Date',
          mission!['scheduledDate'] != null ? _dateFormat.format(DateTime.parse(mission!['scheduledDate'])) : '—',
        ),
        if (mission!['scheduledAt'] != null)
          _buildDetailRow(
            Icons.access_time_rounded,
            'Scheduled At',
            _dateTimeFormat.format(DateTime.parse(mission!['scheduledAt'])),
          ),
        if (mission!['pickedUpAt'] != null)
          _buildDetailRow(
            Icons.inventory_rounded,
            'Picked Up At',
            _dateTimeFormat.format(DateTime.parse(mission!['pickedUpAt'])),
          ),
        if (mission!['deliveredAt'] != null)
          _buildDetailRow(
            Icons.check_circle_rounded,
            'Delivered At',
            _dateTimeFormat.format(DateTime.parse(mission!['deliveredAt'])),
          ),
      ],
    );
  }

  Widget _buildNotesCard() {
    return _buildCard(
      title: 'NOTES',
      icon: Icons.note_outlined,
      color: const Color(0xFF3B82F6),
      children: [
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                Colors.white.withOpacity(0.08),
                Colors.white.withOpacity(0.04),
              ],
            ),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: const Color(0xFF3B82F6).withOpacity(0.2)),
          ),
          child: Text(
            mission!['notes'] ?? '',
            style: const TextStyle(
              color: Colors.white,
              fontSize: 15,
              height: 1.6,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildCard({
    required String title,
    required IconData icon,
    required Color color,
    required List<Widget> children,
  }) {
    return Container(
      padding: const EdgeInsets.all(24),
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
          color: color.withOpacity(0.3),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.1),
            blurRadius: 20,
            spreadRadius: -5,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [color.withOpacity(0.2), color.withOpacity(0.1)],
                  ),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icon, color: color, size: 20),
              ),
              const SizedBox(width: 12),
              Text(
                title,
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w800,
                  color: color.withOpacity(0.9),
                  letterSpacing: 1.5,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          ...children,
        ],
      ),
    );
  }

  Widget _buildDetailRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: const Color(0xFF06B6D4).withOpacity(0.6), size: 20),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.white.withOpacity(0.5),
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  value,
                  style: const TextStyle(
                    fontSize: 15,
                    color: Colors.white,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionBar(String? status) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Colors.transparent, Color(0xFF000000)],
        ),
        border: Border(
          top: BorderSide(color: const Color(0xFF06B6D4).withOpacity(0.2)),
        ),
      ),
      child: SafeArea(
        top: false,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (status?.toUpperCase() == 'SCHEDULED' || status?.toUpperCase() == 'PENDING')
              _buildActionButton(
                'START DELIVERY',
                Icons.rocket_launch_rounded,
                const Color(0xFF06B6D4),
                const Color(0xFF3B82F6),
                    () => _updateStatus('IN_TRANSIT'),
              ),
            if (status?.toUpperCase() == 'IN_TRANSIT') ...[
              _buildActionButton(
                'MARK AS DELIVERED',
                Icons.check_circle_rounded,
                const Color(0xFF10B981),
                const Color(0xFF059669),
                    () => _updateStatus('DELIVERED'),
              ),
              const SizedBox(height: 12),
              Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      Colors.white.withOpacity(0.1),
                      Colors.white.withOpacity(0.05),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: const Color(0xFFEF4444).withOpacity(0.4),
                    width: 2,
                  ),
                ),
                child: Material(
                  color: Colors.transparent,
                  child: InkWell(
                    onTap: () => context.go('/mission/${widget.id}/incident'),
                    borderRadius: BorderRadius.circular(16),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.report_problem_rounded,
                            color: const Color(0xFFEF4444),
                            size: 24,
                          ),
                          const SizedBox(width: 12),
                          const Text(
                            'REPORT ISSUE',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w700,
                              letterSpacing: 1,
                              color: Color(0xFFEF4444),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildActionButton(
      String label,
      IconData icon,
      Color color1,
      Color color2,
      VoidCallback onPressed,
      ) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        gradient: LinearGradient(colors: [color1, color2]),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: color1.withOpacity(0.4),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: ElevatedButton.icon(
        icon: Icon(icon, size: 24),
        label: Text(
          label,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w700,
            letterSpacing: 1,
          ),
        ),
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.transparent,
          foregroundColor: Colors.white,
          shadowColor: Colors.transparent,
          padding: const EdgeInsets.symmetric(vertical: 18),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
        ),
      ),
    );
  }

  Widget _buildLoadingScreen() {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          _buildGalaxyBackground(),
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                SizedBox(
                  width: 60,
                  height: 60,
                  child: CircularProgressIndicator(
                    color: const Color(0xFF06B6D4),
                    strokeWidth: 4,
                  ),
                ),
                const SizedBox(height: 32),
                const Text(
                  'LOADING MISSION DATA...',
                  style: TextStyle(
                    color: Colors.white70,
                    fontSize: 14,
                    letterSpacing: 2,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildErrorScreen() {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          _buildGalaxyBackground(),
          Center(
            child: Padding(
              padding: const EdgeInsets.all(32),
              child: Container(
                padding: const EdgeInsets.all(40),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      Colors.white.withOpacity(0.08),
                      Colors.white.withOpacity(0.03),
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
                      child: const Icon(
                        Icons.error_outline_rounded,
                        color: Color(0xFFEF4444),
                        size: 64,
                      ),
                    ),
                    const SizedBox(height: 24),
                    Text(
                      errorMessage ?? 'Unexpected error',
                      style: const TextStyle(
                        color: Color(0xFFEF4444),
                        fontSize: 18,
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
                        label: const Text('RETRY'),
                        onPressed: _fetchMission,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.transparent,
                          foregroundColor: Colors.white,
                          shadowColor: Colors.transparent,
                          padding: const EdgeInsets.symmetric(
                            horizontal: 32,
                            vertical: 16,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// Reusing painters from previous screens
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