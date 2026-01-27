import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:intl/intl.dart';
import '../widgets/starfield_background.dart';
import '../widgets/orbital_glass_card.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final _storage = const FlutterSecureStorage();

  // Missions
  List<dynamic> missions = [];
  Map<String, int> stats = {'active': 0, 'pending': 0, 'completed': 0, 'total': 0};
  bool isLoadingMissions = true;
  String? missionsError;

  // Driver profile
  String driverName = 'Chargement...';
  String driverPhone = 'Chargement...';
  String driverStatus = 'Inconnu';
  Color statusColor = Colors.grey;
  String vehiclePlate = '—';
  String? driverPhotoUrl;
  bool isLoadingDriver = true;
  String? driverErrorMessage;

  @override
  void initState() {
    super.initState();
    _loadDriverProfile();
    _loadMyMissions();
  }

  Future<String?> _getValidToken() async {
    final token = await _storage.read(key: 'access_token');
    if (token == null || token.trim().isEmpty) return null;
    print('Token récupéré (longueur: ${token.length})');
    return token;
  }

  // ────────────────────────────────────────────────
  // CHARGEMENT PROFIL CHAUFFEUR
  // ────────────────────────────────────────────────
  Future<void> _loadDriverProfile() async {
    setState(() {
      isLoadingDriver = true;
      driverErrorMessage = null;
    });

    try {
      final token = await _getValidToken();
      if (token == null) {
        _setUnauthenticatedState();
        return;
      }

      final uri = Uri.parse('http://localhost:8080/api/drivers/me');
      // Pour tester sur un vrai téléphone : Uri.parse('http://192.168.1.xxx:8080/api/drivers/me')

      print('→ GET $uri');

      final response = await http.get(
        uri,
        headers: {
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
        },
      ).timeout(const Duration(seconds: 10));

      print('← Profil status: ${response.statusCode}');

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        print('JSON reçu profil:');
        print(jsonEncode(data));   // ← affiche tout le JSON
        if (data is! Map<String, dynamic>) {
          throw const FormatException('Réponse invalide (pas un objet JSON)');
        }

        setState(() {
          driverName = data['name']?.toString() ?? 'Chauffeur inconnu';
          driverPhone = data['phone']?.toString() ?? 'Phone inconnu';
          vehiclePlate = data['vehiclePlateNumber']?.toString() ?? '—';
          driverStatus = (data['status']?.toString() ?? 'Inconnu').toLowerCase();
          driverPhotoUrl = data['photoUrl']?.toString();
          statusColor = _getStatusColor(driverStatus);
          isLoadingDriver = false;
        });
      } else if (response.statusCode == 401 || response.statusCode == 403) {
        print('401/403 → déconnexion');
        await _storage.deleteAll();
        if (mounted) context.go('/login?reason=session_expired');
      } else {
        throw Exception('Erreur serveur ${response.statusCode}');
      }
    } catch (e, stack) {
      print('Erreur chargement profil: $e');
      debugPrintStack(stackTrace: stack);

      setState(() {
        driverErrorMessage = e.toString().contains('Timeout')
            ? 'Délai dépassé'
            : 'Impossible de charger le profil';
        driverName = 'Erreur';
        driverStatus = '—';
        statusColor = Colors.redAccent;
        isLoadingDriver = false;
      });
    }
  }

  void _setUnauthenticatedState() {
    setState(() {
      driverName = 'Non connecté';
      driverStatus = '—';
      statusColor = Colors.grey;
      isLoadingDriver = false;
    });
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'available':
      case 'disponible':
        return Colors.greenAccent;
      case 'busy':
      case 'occupé':
      case 'in_transit':
      case 'en route':
        return Colors.orangeAccent;
      case 'offline':
        return Colors.grey;
      default:
        return Colors.blueGrey;
    }
  }

  // ────────────────────────────────────────────────
  // CHARGEMENT MISSIONS
  // ────────────────────────────────────────────────
  Future<void> _loadMyMissions() async {
    setState(() {
      isLoadingMissions = true;
      missionsError = null;
    });

    try {
      final token = await _getValidToken();
      if (token == null) {
        throw Exception('Session invalide');
      }

      final uri = Uri.parse('http://localhost:8080/api/deliveries/my-deliveries');
      print('→ GET $uri');

      final response = await http.get(
        uri,
        headers: {
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
        },
      ).timeout(const Duration(seconds: 12));

      print('← Missions status: ${response.statusCode}');

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final List<dynamic> missionList = data is List ? data : [];

        setState(() {
          missions = missionList;
          _calculateStats();
          isLoadingMissions = false;
        });
      } else if (response.statusCode == 401 || response.statusCode == 403) {
        print('401/403 missions → déconnexion');
        await _storage.deleteAll();
        if (mounted) context.go('/login?reason=session_expired');
      } else {
        throw Exception('Erreur ${response.statusCode}');
      }
    } catch (e) {
      print('Erreur missions: $e');
      setState(() {
        missionsError = e.toString().contains('Timeout')
            ? 'Délai dépassé'
            : 'Impossible de charger les missions';
        isLoadingMissions = false;
      });
    }
  }

  void _calculateStats() {
    int active = 0, pending = 0, completed = 0;
    for (var mission in missions) {
      final status = (mission['status'] as String? ?? '').toUpperCase();
      if (status == 'IN_TRANSIT') active++;
      if (status == 'SCHEDULED' || status == 'PENDING') pending++;
      if (status == 'DELIVERED' || status == 'COMPLETED') completed++;
    }

    setState(() {
      stats = {
        'active': active,
        'pending': pending,
        'completed': completed,
        'total': missions.length,
      };
    });
  }

  @override
  Widget build(BuildContext context) {
    final dateFormat = DateFormat('dd MMM yyyy');

    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          const StarfieldBackground(intensity: 0.7),

          SafeArea(
            child: Column(
              children: [
                // Header
                Container(
                  padding: const EdgeInsets.fromLTRB(20, 16, 20, 12),
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.75),
                    border: Border(bottom: BorderSide(color: Colors.white.withOpacity(0.08))),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            dateFormat.format(DateTime.now()).toUpperCase(),
                            style: const TextStyle(
                              fontSize: 11,
                              color: Color(0xFF94A3B8),
                              letterSpacing: 2.5,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          const SizedBox(height: 4),
                          const Text(
                            'Mission Control',
                            style: TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.w300,
                              color: Colors.white,
                              letterSpacing: 0.5,
                            ),
                          ),
                        ],
                      ),

                      // Profil mini
                      if (isLoadingDriver)
                        const SizedBox(
                          width: 40,
                          height: 40,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white70),
                        )
                      else if (driverErrorMessage != null)
                        Tooltip(
                          message: driverErrorMessage,
                          child: CircleAvatar(
                            radius: 24,
                            backgroundColor: Colors.redAccent.withOpacity(0.3),
                            child: const Icon(Icons.error_outline, color: Colors.redAccent),
                          ),
                        )
                      else
                        Row(
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.end,
                              children: [
                                Text(
                                  driverName,
                                  style: const TextStyle(fontSize: 15, color: Colors.white, fontWeight: FontWeight.w500),
                                ),
                                Text(
                                  driverPhone,
                                  style: const TextStyle(fontSize: 15, color: Colors.white, fontWeight: FontWeight.w500),
                                ),
                                const SizedBox(height: 2),
                                Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Container(
                                      width: 10,
                                      height: 10,
                                      decoration: BoxDecoration(
                                        shape: BoxShape.circle,
                                        color: statusColor,
                                        boxShadow: [
                                          BoxShadow(
                                            color: statusColor.withOpacity(0.6),
                                            blurRadius: 8,
                                            spreadRadius: 2,
                                          ),
                                        ],
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    Text(
                                      driverStatus,
                                      style: TextStyle(fontSize: 12, color: statusColor),
                                    ),
                                  ],
                                ),
                                if (vehiclePlate != '—')
                                  Text(
                                    'Pl: $vehiclePlate',
                                    style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8)),
                                  ),
                              ],
                            ),
                            const SizedBox(width: 14),
                            CircleAvatar(
                              radius: 24,
                              backgroundColor: Colors.blueGrey.shade700,
                              backgroundImage: driverPhotoUrl != null ? NetworkImage(driverPhotoUrl!) : null,
                              child: driverPhotoUrl == null
                                  ? Text(
                                driverName.isNotEmpty ? driverName[0].toUpperCase() : '?',
                                style: const TextStyle(color: Colors.white, fontSize: 20),
                              )
                                  : null,
                            ),
                          ],
                        ),
                    ],
                  ),
                ),

                Expanded(
                  child: RefreshIndicator(
                    onRefresh: () => Future.wait([_loadDriverProfile(), _loadMyMissions()]),
                    color: Colors.blueAccent,
                    backgroundColor: Colors.black87,
                    child: SingleChildScrollView(
                      physics: const AlwaysScrollableScrollPhysics(),
                      padding: const EdgeInsets.fromLTRB(20, 0, 20, 160), // ← espace en bas pour le scroll + sécurité
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Tes stats (GridView)
                          GridView.count(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            crossAxisCount: 2,
                            mainAxisSpacing: 12,          // ← réduit de 16 à 12
                            crossAxisSpacing: 12,
                            childAspectRatio: 1.75,       // ← un peu plus haut pour moins écraser
                            children: [
                              _buildStatCard(Icons.local_shipping_rounded, 'Active', stats['active']!, Colors.blueAccent, true),
                              _buildStatCard(Icons.hourglass_bottom_rounded, 'En attente', stats['pending']!, Colors.orangeAccent, false),
                              _buildStatCard(Icons.check_circle_rounded, 'Terminées', stats['completed']!, Colors.greenAccent, false),
                              _buildStatCard(Icons.format_list_numbered_rounded, 'Total', stats['total']!, Colors.purpleAccent, false),
                            ],
                          ),

                          const SizedBox(height: 24),     // ← réduit de 32

                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text(
                                'MISSIONS ASSIGNÉES',
                                style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Color(0xFF94A3B8), letterSpacing: 1.5),
                              ),
                              TextButton(
                                onPressed: () => context.go('/missions'),
                                child: const Text('Voir tout', style: TextStyle(color: Colors.blueAccent)),
                              ),
                            ],
                          ),

                          const SizedBox(height: 8),      // ← réduit de 12

                          if (isLoadingMissions)
                            const Center(child: CircularProgressIndicator(color: Colors.blueAccent))
                          else if (missionsError != null)
                            _buildErrorWidget(missionsError!)
                          else if (missions.isEmpty)
                              _buildEmptyState()
                            else
                              ...missions.map((mission) => _buildMissionCard(mission)).toList(),

                          const SizedBox(height: 60),     // espace final
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

  Widget _buildErrorWidget(String message) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 60),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.error_outline_rounded, color: Colors.redAccent, size: 48),
            const SizedBox(height: 16),
            Text(
              message,
              style: const TextStyle(color: Colors.redAccent, fontSize: 16),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 80),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.local_shipping_outlined, color: Colors.white38, size: 64),
            const SizedBox(height: 16),
            const Text(
              'Aucune mission assignée pour le moment.\nPrêt pour la prochaine orbite !',
              style: TextStyle(color: Colors.white70, fontSize: 16, height: 1.5),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(IconData icon, String label, int value, Color color, bool highlight) {
    return OrbitalGlassCard(
      glowColor: color.withOpacity(0.3),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 32, color: color),
            const SizedBox(height: 12),
            Text(
              '$value',
              style: TextStyle(
                fontSize: 38,
                fontWeight: FontWeight.w300,
                color: highlight ? Colors.white : color.withOpacity(0.9),
              ),
            ),
            const SizedBox(height: 6),
            Text(
              label.toUpperCase(),
              style: TextStyle(
                fontSize: 12,
                color: Colors.white70,
                letterSpacing: 1.2,
              ),
            ),
          ],
        ),
      ),
    ).animate().fadeIn(duration: 600.ms).scaleXY(begin: 0.92, end: 1.0);
  }

  Widget _buildMissionCard(Map<String, dynamic> mission) {
    final status = (mission['status'] as String? ?? '').toUpperCase();
    Color statusColor = Colors.grey;
    String statusLabel = 'INCONNU';

    switch (status) {
      case 'IN_TRANSIT':
        statusColor = Colors.blueAccent;
        statusLabel = 'EN COURS';
        break;
      case 'SCHEDULED':
      case 'PENDING':
        statusColor = Colors.amber;
        statusLabel = 'PLANIFIÉE';
        break;
      case 'DELIVERED':
      case 'COMPLETED':
        statusColor = Colors.greenAccent;
        statusLabel = 'LIVRÉE';
        break;
      case 'CANCELLED':
        statusColor = Colors.redAccent;
        statusLabel = 'ANNULÉE';
        break;
    }

    return OrbitalGlassCard(
      margin: const EdgeInsets.only(bottom: 16),
      glowColor: statusColor.withOpacity(0.2),
      child: ListTile(
        onTap: () {
          final id = mission['id']?.toString();
          if (id != null && id.isNotEmpty) {
            context.go('/mission/$id');
          }
        },
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        leading: CircleAvatar(
          radius: 24,
          backgroundColor: statusColor.withOpacity(0.2),
          child: Icon(Icons.local_shipping_rounded, color: statusColor),
        ),
        title: Text(
          mission['deliveryNumber']?.toString() ?? 'LIV-${mission['id'] ?? '?'}',
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500, color: Colors.white),
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 6),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                mission['deliveryAddress']?.toString() ?? 'Destination inconnue',
                style: const TextStyle(color: Colors.white70, fontSize: 13),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                    decoration: BoxDecoration(
                      color: statusColor.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: statusColor.withOpacity(0.4)),
                    ),
                    child: Text(
                      statusLabel,
                      style: TextStyle(color: statusColor, fontSize: 11, fontWeight: FontWeight.w600),
                    ),
                  ),
                  const SizedBox(width: 12),
                  if (mission['scheduledDate'] != null)
                    Text(
                      'Prévue : ${DateFormat('dd MMM').format(DateTime.tryParse(mission['scheduledDate']) ?? DateTime.now())}',
                      style: const TextStyle(color: Colors.white54, fontSize: 12),
                    ),
                ],
              ),
            ],
          ),
        ),
        trailing: const Icon(Icons.chevron_right_rounded, color: Colors.white54),
      ),
    ).animate().fadeIn(duration: 700.ms).slideY(begin: 0.15, end: 0);
  }
}