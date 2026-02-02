import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';

class MissionDetailScreen extends StatefulWidget {
  final String id;
  const MissionDetailScreen({super.key, required this.id});

  @override
  State<MissionDetailScreen> createState() => _MissionDetailScreenState();
}

class _MissionDetailScreenState extends State<MissionDetailScreen> with SingleTickerProviderStateMixin {
  final _storage = const FlutterSecureStorage();

  Map<String, dynamic>? mission;
  bool isLoading = true;
  String? errorMessage;

  final _dateFormat = DateFormat('dd MMM yyyy');
  final _dateTimeFormat = DateFormat('dd MMM yyyy • HH:mm');

  late AnimationController _animationController;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    _fetchMission();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  void _showMessage(String message, {bool isError = false}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Icon(
              isError ? Icons.error_outline : Icons.check_circle_outline,
              color: Colors.white,
            ),
            const SizedBox(width: 12),
            Expanded(child: Text(message)),
          ],
        ),
        backgroundColor: isError ? Colors.red : Colors.green,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
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
      case 'IN_TRANSIT': return Colors.blue;
      case 'SCHEDULED': return Colors.amber;
      case 'PENDING': return Colors.orange;
      case 'DELIVERED': return Colors.green;
      case 'COMPLETED': return Colors.teal;
      case 'CANCELLED': return Colors.red;
      default: return Colors.grey;
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
              _buildHeader(status),
              Expanded(
                child: RefreshIndicator(
                  onRefresh: _fetchMission,
                  color: Colors.blue,
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
      ),
      floatingActionButton: isActive ? null : null,
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
      bottomSheet: isActive ? _buildActionBar(status) : null,
    );
  }

  Widget _buildHeader(String? status) {
    final statusColor = _getStatusColor(status);

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            statusColor.withOpacity(0.2),
            Colors.transparent,
          ],
        ),
        border: Border(bottom: BorderSide(color: Colors.white.withOpacity(0.1))),
      ),
      child: Row(
        children: [
          Container(
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white.withOpacity(0.2)),
            ),
            child: IconButton(
              icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white70),
              onPressed: () => context.go('/dashboard'),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  mission!['deliveryNumber'] ?? 'Delivery ${widget.id}',
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w900,
                    color: Colors.white,
                    letterSpacing: 1,
                  ),
                ),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [statusColor.withOpacity(0.3), statusColor.withOpacity(0.1)],
                    ),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: statusColor.withOpacity(0.5)),
                  ),
                  child: Text(
                    _getStatusDisplay(status),
                    style: TextStyle(
                      color: statusColor,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
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
      icon: Icons.info_outline,
      children: [
        _buildDetailRow(Icons.confirmation_number_outlined, 'Delivery Number', mission!['deliveryNumber'] ?? '—'),
        _buildDetailRow(Icons.link, 'Order Reference', mission!['orderReference'] ?? '—'),
        _buildDetailRow(Icons.warehouse, 'Warehouse', mission!['warehouseId']?.toString() ?? '—'),
      ],
    );
  }

  Widget _buildCustomerCard() {
    return _buildCard(
      title: 'CUSTOMER',
      icon: Icons.person_outline,
      children: [
        _buildDetailRow(Icons.account_circle, 'Customer Name', mission!['customerName'] ?? 'Not specified'),
        if (mission!['driver'] != null) ...[
          _buildDetailRow(Icons.local_shipping, 'Driver', mission!['driver']['name'] ?? '—'),
          if (mission!['driver']['phone'] != null)
            _buildDetailRow(Icons.phone, 'Driver Phone', mission!['driver']['phone']),
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
      children: [
        InkWell(
          onTap: () => _openMaps(lat, lng, address),
          borderRadius: BorderRadius.circular(12),
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  Colors.blue.withOpacity(0.2),
                  Colors.blue.withOpacity(0.05),
                ],
              ),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.blue.withOpacity(0.3)),
            ),
            child: Row(
              children: [
                const Icon(Icons.map, color: Colors.blue, size: 28),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        address ?? (lat != null && lng != null ? 'Coordinates: $lat, $lng' : 'Not specified'),
                        style: const TextStyle(color: Colors.white, fontSize: 15),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Tap to open in maps',
                        style: TextStyle(color: Colors.blue.shade300, fontSize: 12),
                      ),
                    ],
                  ),
                ),
                const Icon(Icons.launch, color: Colors.blue, size: 20),
              ],
            ),
          ),
        ),
        if (mission!['estimatedDistanceKm'] != null)
          _buildDetailRow(Icons.straighten, 'Estimated Distance', '${mission!['estimatedDistanceKm']} km'),
        if (mission!['actualDistanceKm'] != null)
          _buildDetailRow(Icons.route, 'Actual Distance', '${mission!['actualDistanceKm']} km'),
      ],
    );
  }

  Widget _buildScheduleCard() {
    return _buildCard(
      title: 'SCHEDULE',
      icon: Icons.schedule,
      children: [
        _buildDetailRow(
          Icons.event_available,
          'Scheduled Date',
          mission!['scheduledDate'] != null ? _dateFormat.format(DateTime.parse(mission!['scheduledDate'])) : '—',
        ),
        if (mission!['scheduledAt'] != null)
          _buildDetailRow(
            Icons.access_time,
            'Scheduled At',
            _dateTimeFormat.format(DateTime.parse(mission!['scheduledAt'])),
          ),
        if (mission!['pickedUpAt'] != null)
          _buildDetailRow(
            Icons.inventory,
            'Picked Up At',
            _dateTimeFormat.format(DateTime.parse(mission!['pickedUpAt'])),
          ),
        if (mission!['deliveredAt'] != null)
          _buildDetailRow(
            Icons.check_circle,
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
      children: [
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.05),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: Colors.white.withOpacity(0.1)),
          ),
          child: Text(
            mission!['notes'] ?? '',
            style: const TextStyle(color: Colors.white70, fontSize: 15, height: 1.5),
          ),
        ),
      ],
    );
  }

  Widget _buildCard({required String title, required IconData icon, required List<Widget> children}) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Colors.white.withOpacity(0.08),
            Colors.white.withOpacity(0.02),
          ],
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withOpacity(0.1)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: Colors.blue, size: 20),
              const SizedBox(width: 12),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.bold,
                  color: Colors.white60,
                  letterSpacing: 2,
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
          Icon(icon, color: Colors.white.withOpacity(0.5), size: 20),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: const TextStyle(fontSize: 12, color: Colors.white54),
                ),
                const SizedBox(height: 4),
                Text(
                  value,
                  style: const TextStyle(fontSize: 15, color: Colors.white, fontWeight: FontWeight.w500),
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
          colors: [Color(0x00000814), Color(0xFF000814)],
        ),
        border: Border(top: BorderSide(color: Colors.white.withOpacity(0.1))),
      ),
      child: SafeArea(
        top: false,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (status?.toUpperCase() == 'SCHEDULED' || status?.toUpperCase() == 'PENDING')
              _buildActionButton(
                'START DELIVERY',
                Icons.rocket_launch,
                Colors.blue,
                    () => _updateStatus('IN_TRANSIT'),
              ),
            if (status?.toUpperCase() == 'IN_TRANSIT') ...[
              _buildActionButton(
                'MARK AS DELIVERED',
                Icons.check_circle,
                Colors.green,
                    () => _updateStatus('DELIVERED'),
              ),
              const SizedBox(height: 12),
              OutlinedButton.icon(
                icon: const Icon(Icons.report_problem),
                label: const Text('REPORT ISSUE'),
                onPressed: () => context.go('/mission/${widget.id}/incident'),
                style: OutlinedButton.styleFrom(
                  foregroundColor: Colors.orange,
                  side: const BorderSide(color: Colors.orange, width: 2),
                  minimumSize: const Size(double.infinity, 56),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildActionButton(String label, IconData icon, Color color, VoidCallback onPressed) {
    return Container(
      width: double.infinity,
      height: 56,
      decoration: BoxDecoration(
        gradient: LinearGradient(colors: [color, color.withOpacity(0.8)]),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.3),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: ElevatedButton.icon(
        icon: Icon(icon, size: 24),
        label: Text(
          label,
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, letterSpacing: 1),
        ),
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.transparent,
          foregroundColor: Colors.white,
          shadowColor: Colors.transparent,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        ),
      ),
    );
  }

  Widget _buildLoadingScreen() {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF000814), Color(0xFF001D3D), Color(0xFF000814)],
          ),
        ),
        child: const Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CircularProgressIndicator(color: Colors.blue),
              SizedBox(height: 24),
              Text(
                'LOADING MISSION DATA...',
                style: TextStyle(
                  color: Colors.white70,
                  fontSize: 14,
                  letterSpacing: 2,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildErrorScreen() {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF000814), Color(0xFF001D3D), Color(0xFF000814)],
          ),
        ),
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(32),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.error_outline, color: Colors.red, size: 64),
                const SizedBox(height: 24),
                Text(
                  errorMessage ?? 'Unexpected error',
                  style: const TextStyle(color: Colors.redAccent, fontSize: 18),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 32),
                ElevatedButton.icon(
                  icon: const Icon(Icons.refresh),
                  label: const Text('RETRY'),
                  onPressed: _fetchMission,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
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