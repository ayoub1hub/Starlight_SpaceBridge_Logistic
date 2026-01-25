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

  List<dynamic> missions = [];
  Map<String, int> stats = {'active': 0, 'pending': 0, 'completed': 0, 'total': 0};
  bool loading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    _loadMyMissions();
  }

  Future<void> _loadMyMissions() async {
    print('=== DÉBUT CHARGEMENT MISSIONS ===');

    setState(() {
      loading = true;
      error = null;
    });

    try {
      final token = await _storage.read(key: 'access_token');

      // DEBUG DÉTAILLÉ
      print('🔍 Debug Token:');
      print('   Token null? ${token == null}');
      print('   Token empty? ${token?.isEmpty ?? true}');
      print('   Token length: ${token?.length ?? 0}');

      if (token != null && token.isNotEmpty) {
        print('   Token preview: ${token.substring(0, min(80, token.length))}...');

        // Vérifier que c'est un JWT valide (3 parties séparées par des points)
        final parts = token.split('.');
        print('   JWT parts count: ${parts.length} (should be 3)');
      }

      if (token == null || token.isEmpty) {
        throw Exception('Token vide ou null - veuillez vous reconnecter');
      }

      print('📡 Envoi requête vers backend...');
      final response = await http.get(
        Uri.parse('http://localhost:8080/api/deliveries/my-deliveries'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      print('📡 Réponse reçue:');
      print('💠 AccessToken: $token');
      print('   Status: ${response.statusCode}');
      print('   Body length: ${response.body.length}');
      print('   Body preview: ${response.body.substring(0, min(200, response.body.length))}');

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        print('✅ ${data.length} missions chargées');

        setState(() {
          missions = data;
          _calculateStats();
          loading = false;
        });
      } else if (response.statusCode == 401) {
        throw Exception('Non autorisé - Token invalide ou expiré');
      } else {
        throw Exception('Erreur ${response.statusCode}: ${response.body}');
      }
    } catch (e) {
      print('❌ ERREUR CHARGEMENT: $e');
      setState(() {
        error = 'Impossible de charger les missions : $e';
        loading = false;
      });
    }
  }

  void _calculateStats() {
    int active = 0;
    int pending = 0;
    int completed = 0;

    for (var mission in missions) {
      final status = mission['status']?.toLowerCase();
      if (status == 'in_transit') active++;
      else if (status == 'scheduled' || status == 'pending') pending++;
      else if (status == 'delivered') completed++;
    }

    stats = {
      'active': active,
      'pending': pending,
      'completed': completed,
      'total': missions.length,
    };
  }

  @override
  Widget build(BuildContext context) {
    final dateFormat = DateFormat('yyyy.MM.dd');
    final timeFormat = DateFormat('HH:mm');

    return Scaffold(
      body: Stack(
        children: [
          const StarfieldBackground(intensity: 0.6),
          Positioned(
            bottom: -150,
            right: -150,
            child: Opacity(
              opacity: 0.2,
              child: Container(
                width: 500,
                height: 500,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: RadialGradient(
                    colors: [
                      Colors.blueAccent.withOpacity(0.4),
                      Colors.blueAccent.withOpacity(0.1),
                      Colors.transparent,
                    ],
                  ),
                ),
              ),
            ),
          ),
          SafeArea(
            child: Column(
              children: [
                // Header
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    border: Border(bottom: BorderSide(color: Colors.white.withOpacity(0.1))),
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
                            style: const TextStyle(fontSize: 10, fontFamily: 'monospace', color: Color(0xFF64748B), letterSpacing: 2),
                          ),
                          const SizedBox(height: 4),
                          const Text('Mission Control', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w300, color: Colors.white)),
                        ],
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          const Text('COURIER', style: TextStyle(fontSize: 10, color: Color(0xFF64748B), letterSpacing: 2)),
                          const SizedBox(height: 4),
                          Text(
                            'ID: 1001', // Tu pourras extraire le username du JWT plus tard
                            style: const TextStyle(fontSize: 14, color: Color(0xFF94A3B8), fontFamily: 'monospace'),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                Expanded(
                  child: RefreshIndicator(
                    onRefresh: _loadMyMissions,
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
                            _buildStatCard(icon: Icons.local_shipping, label: 'Active', value: stats['active']!, highlight: true),
                            _buildStatCard(icon: Icons.access_time, label: 'Pending', value: stats['pending']!),
                            _buildStatCard(icon: Icons.check_circle, label: 'Completed', value: stats['completed']!),
                            _buildStatCard(icon: Icons.inventory, label: 'Total', value: stats['total']!),
                          ],
                        ),

                        const SizedBox(height: 32),

                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text('MISSIONS ORBITALES', style: TextStyle(fontSize: 12, color: Color(0xFF64748B), letterSpacing: 2)),
                            TextButton(
                              onPressed: () => context.go('/missions'),
                              child: const Text('Voir tout →', style: TextStyle(color: Colors.blueAccent)),
                            ),
                          ],
                        ),

                        const SizedBox(height: 12),

                        if (loading)
                          const Center(child: CircularProgressIndicator())
                        else if (error != null)
                          Center(child: Text(error!, style: const TextStyle(color: Colors.redAccent)))
                        else if (missions.isEmpty)
                            const Center(child: Text('Aucune mission en cours. Prêt pour le prochain lancement !', style: TextStyle(color: Colors.white70)))
                          else
                            ...missions.map((mission) => _buildMissionCard(mission)).toList(),
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

  Widget _buildStatCard({required IconData icon, required String label, required int value, bool highlight = false}) {
    return OrbitalGlassCard(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, size: 20, color: highlight ? Colors.white : const Color(0xFF64748B)),
            const SizedBox(height: 12),
            Text('$value', style: TextStyle(fontSize: 32, fontWeight: FontWeight.w300, color: highlight ? Colors.white : const Color(0xFF94A3B8))),
            Text(label.toUpperCase(), style: const TextStyle(fontSize: 10, color: Color(0xFF64748B), letterSpacing: 1.5)),
          ],
        ),
      ),
    );
  }

  Widget _buildMissionCard(Map<String, dynamic> mission) {
    final status = (mission['status'] ?? '').toLowerCase();
    Color statusColor;
    String statusLabel;

    switch (status) {
      case 'in_transit':
        statusColor = Colors.blue;
        statusLabel = 'EN TRANSIT';
        break;
      case 'scheduled':
      case 'pending':
        statusColor = Colors.amber;
        statusLabel = 'EN ATTENTE';
        break;
      case 'delivered':
        statusColor = Colors.green;
        statusLabel = 'DÉPLOYÉE';
        break;
      default:
        statusColor = Colors.grey;
        statusLabel = status.toUpperCase();
    }

    return OrbitalGlassCard(
      child: ListTile(
        onTap: () => context.go('/mission/${mission['id']}'),
        contentPadding: const EdgeInsets.all(16),
        title: Text(
          mission['deliveryNumber'] ?? 'MSN-UNKNOWN',
          style: const TextStyle(fontFamily: 'monospace', fontSize: 16, color: Colors.white),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 8),
            Text(mission['deliveryAddress'] ?? 'Adresse inconnue', style: const TextStyle(color: Colors.white70)),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: statusColor.withOpacity(0.2),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: statusColor.withOpacity(0.6)),
              ),
              child: Text(statusLabel, style: TextStyle(color: statusColor, fontSize: 12, fontWeight: FontWeight.bold)),
            ),
          ],
        ),
        trailing: const Icon(Icons.chevron_right, color: Colors.white60),
      ),
    ).animate().fadeIn(duration: 600.ms).slideY(begin: 0.3, end: 0);
  }
}