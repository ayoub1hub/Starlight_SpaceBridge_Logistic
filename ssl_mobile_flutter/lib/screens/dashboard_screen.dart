import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:intl/intl.dart';
import '../widgets/starfield_background.dart';
import '../widgets/orbital_glass_card.dart';
import 'dart:math';

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

  // Driver profile from backend
  String driverName = 'Chargement...';
  String driverStatus = 'Inconnu';
  Color statusColor = Colors.grey;
  String vehiclePlate = '—';
  String? driverPhotoUrl;
  bool isLoadingDriver = true;
  String? driverError;

  @override
  void initState() {
    super.initState();
    _loadDriverProfile();
    _loadMyMissions();
  }

  Future<String?> _getValidToken() async {
    final token = await _storage.read(key: 'access_token');
    if (token == null || token.isEmpty) return null;
    print('Token récupéré (longueur: ${token.length})');
    return token;
  }

  // ────────────────────────────────────────────────
  // CHARGEMENT PROFIL CHAUFFEUR (depuis backend)
  // ────────────────────────────────────────────────
  Future<void> _loadDriverProfile() async {
    setState(() {
      isLoadingDriver = true;
      driverError = null;
    });

    try {
      final token = await _getValidToken();
      if (token == null) {
        setState(() {
          driverName = 'Non connecté';
          driverStatus = '—';
          statusColor = Colors.grey;
          isLoadingDriver = false;
        });
        return;
      }

      final uri = Uri.parse('http://10.0.2.2:8080/api/drivers/me');
      // Pour vrai téléphone → 'http://192.168.1.xxx:8080/api/drivers/me'

      print('Appel profil chauffeur: $uri');

      final response = await http.get(
        uri,
        headers: {
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
        },
      ).timeout(const Duration(seconds: 10));

      print('Réponse profil: ${response.statusCode}');

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body) as Map<String, dynamic>;

        setState(() {
          driverName = data['name'] ?? 'Chauffeur inconnu';
          vehiclePlate = data['vehiclePlateNumber'] ?? '—';
          driverStatus = data['status'] ?? 'Inconnu';
          driverPhotoUrl = data['photoUrl']; // si ton DTO a ce champ

          statusColor = _getStatusColor(driverStatus.toLowerCase());
          isLoadingDriver = false;
        });
      } else if (response.statusCode == 401 || response.statusCode == 403) {
        print('401/403 profil → suppression tokens');
        await _storage.deleteAll();
        if (mounted) context.go('/login?reason=session_expired');
      } else {
        throw Exception('Erreur ${response.statusCode}');
      }
    } catch (e) {
      print('Erreur profil chauffeur: $e');
      setState(() {
        driverName = 'Erreur';
        driverStatus = '—';
        statusColor = Colors.redAccent;
        driverError = 'Profil non chargé';
        isLoadingDriver = false;
      });
    }
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'available':
      case 'disponible':
        return Colors.greenAccent;
      case 'busy':
      case 'occupé':
      case 'in_transit':
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
      if (token == null) throw Exception('Session invalide');

      final uri = Uri.parse('http://10.0.2.2:8080/api/deliveries/my-deliveries');

      print('Appel missions: $uri');

      final response = await http.get(
        uri,
        headers: {
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
        },
      ).timeout(const Duration(seconds: 12));

      print('Réponse missions: ${response.statusCode}');

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        setState(() {
          missions = data;
          _calculateStats();
          isLoadingMissions = false;
        });
      } else if (response.statusCode == 401 || response.statusCode == 403) {
        print('401/403 missions → suppression tokens');
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
            : 'Erreur chargement missions';
        isLoadingMissions = false;
      });
    }
  }

  void _calculateStats() {
    int active = 0, pending = 0, completed = 0;
    for (var mission in missions) {
      final status = (mission['status'] ?? '').toUpperCase();
      if (status == 'IN_TRANSIT') active++;
      else if (status == 'SCHEDULED' || status == 'PENDING') pending++;
      else if (status == 'DELIVERED' || status == 'COMPLETED') completed++;
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
                // Header avec profil chauffeur
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

                      // Profil chauffeur
                      if (isLoadingDriver)
                        const SizedBox(
                          width: 40,
                          height: 40,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white70),
                        )
                      else if (driverError != null)
                        Tooltip(
                          message: driverError,
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
                                  style: const TextStyle(
                                    fontSize: 15,
                                    color: Colors.white,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Container(
                                      width: 9,
                                      height: 9,
                                      decoration: BoxDecoration(
                                        shape: BoxShape.circle,
                                        color: statusColor,
                                        boxShadow: [
                                          BoxShadow(
                                            color: statusColor.withOpacity(0.7),
                                            blurRadius: 8,
                                            spreadRadius: 2,
                                          ),
                                        ],
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    Text(
                                      driverStatus,
                                      style: TextStyle(
                                        fontSize: 12,
                                        color: statusColor,
                                        fontWeight: FontWeight.w500,
                                      ),
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
                    onRefresh: () async {
                      await Future.wait([_loadDriverProfile(), _loadMyMissions()]);
                    },
                    color: Colors.blueAccent,
                    backgroundColor: Colors.black87,
                    child: CustomScrollView(
                      slivers: [
                        SliverPadding(
                          padding: const EdgeInsets.all(20),
                          sliver: SliverList(
                            delegate: SliverChildListDelegate([
                              // Stats
                              GridView.count(
                                shrinkWrap: true,
                                physics: const NeverScrollableScrollPhysics(),
                                crossAxisCount: 2,
                                mainAxisSpacing: 16,
                                crossAxisSpacing: 16,
                                childAspectRatio: 1.7,
                                children: [
                                  _buildStatCard(Icons.local_shipping_rounded, 'Active', stats['active']!, Colors.blueAccent, true),
                                  _buildStatCard(Icons.hourglass_bottom_rounded, 'En attente', stats['pending']!, Colors.orangeAccent, false),
                                  _buildStatCard(Icons.check_circle_rounded, 'Terminées', stats['completed']!, Colors.greenAccent, false),
                                  _buildStatCard(Icons.format_list_numbered_rounded, 'Total', stats['total']!, Colors.purpleAccent, false),
                                ],
                              ),

                              const SizedBox(height: 32),

                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  const Text(
                                    'MISSIONS ASSIGNÉES',
                                    style: TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w600,
                                      color: Color(0xFF94A3B8),
                                      letterSpacing: 1.5,
                                    ),
                                  ),
                                  TextButton(
                                    onPressed: () => context.go('/missions'),
                                    child: const Text(
                                      'Voir tout',
                                      style: TextStyle(color: Colors.blueAccent, fontSize: 14),
                                    ),
                                  ),
                                ],
                              ),

                              const SizedBox(height: 12),

                              if (isLoadingMissions)
                                const Center(child: CircularProgressIndicator(color: Colors.blueAccent))
                              else if (missionsError != null)
                                Center(
                                  child: Padding(
                                    padding: const EdgeInsets.symmetric(vertical: 60),
                                    child: Column(
                                      children: [
                                        const Icon(Icons.error_outline_rounded, color: Colors.redAccent, size: 48),
                                        const SizedBox(height: 16),
                                        Text(
                                          missionsError!,
                                          style: const TextStyle(color: Colors.redAccent, fontSize: 16),
                                          textAlign: TextAlign.center,
                                        ),
                                      ],
                                    ),
                                  ),
                                )
                              else if (missions.isEmpty)
                                  const Center(
                                    child: Padding(
                                      padding: EdgeInsets.symmetric(vertical: 80),
                                      child: Text(
                                        'Aucune mission assignée pour le moment.\nPrêt pour la prochaine orbite !',
                                        style: TextStyle(color: Colors.white70, fontSize: 16, height: 1.5),
                                        textAlign: TextAlign.center,
                                      ),
                                    ),
                                  )
                                else
                                  ...missions.map((mission) => _buildMissionCard(mission)).toList(),
                            ]),
                          ),
                        ),
                      ],
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

  // _buildStatCard et _buildMissionCard inchangés
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
    final status = (mission['status'] ?? '').toUpperCase();
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
        onTap: () => context.go('/mission/${mission['id']}'),
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        leading: CircleAvatar(
          radius: 24,
          backgroundColor: statusColor.withOpacity(0.2),
          child: Icon(Icons.local_shipping_rounded, color: statusColor),
        ),
        title: Text(
          mission['deliveryNumber'] ?? 'LIV-${mission['id']}',
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500, color: Colors.white),
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 6),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                mission['deliveryAddress'] ?? 'Destination inconnue',
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
                      'Prévue : ${DateFormat('dd MMM').format(DateTime.parse(mission['scheduledDate']))}',
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