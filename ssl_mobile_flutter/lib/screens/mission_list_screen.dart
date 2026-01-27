import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:intl/intl.dart';
import '../widgets/starfield_background.dart';
import '../widgets/glass_card.dart'; // ou orbital_glass_card si tu préfères
import '../theme/mission_colors.dart';

class MissionListScreen extends StatefulWidget {
  const MissionListScreen({super.key});

  @override
  State<MissionListScreen> createState() => MissionListScreenState();
}

class MissionListScreenState extends State<MissionListScreen> {
  final _storage = const FlutterSecureStorage();

  List<Map<String, dynamic>> missions = [];
  List<Map<String, dynamic>> filteredMissions = [];

  String statusFilter = 'all';
  String searchQuery = '';

  bool isLoading = true;
  String? errorMessage;

  @override
  void initState() {
    super.initState();
    _loadMissions();
  }

  Future<String?> _getValidToken() async {
    final token = await _storage.read(key: 'access_token');
    if (token == null || token.isEmpty) return null;
    return token;
  }

  Future<void> _loadMissions() async {
    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    try {
      final token = await _getValidToken();
      if (token == null) {
        if (mounted) context.go('/login?reason=session_expired');
        throw Exception('Session invalide');
      }

      // URL : adapte selon ton environnement
      final uri = Uri.parse('http://localhost:8080/api/deliveries/my-deliveries');
      // Pour vrai téléphone : 'http://192.168.1.xxx:8080/api/deliveries/my-deliveries'

      final response = await http.get(
        uri,
        headers: {
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
        },
      ).timeout(const Duration(seconds: 12));

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        setState(() {
          missions = List<Map<String, dynamic>>.from(data);
          _applyFilters(); // applique filtres initiaux
          isLoading = false;
        });
      } else if (response.statusCode == 401) {
        await _storage.deleteAll();
        if (mounted) context.go('/login?reason=session_expired');
      } else {
        throw Exception('Erreur ${response.statusCode}');
      }
    } catch (e) {
      setState(() {
        errorMessage = e.toString().contains('Timeout')
            ? 'Délai dépassé – Vérifiez votre connexion ou le serveur'
            : 'Impossible de charger les missions : $e';
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
      backgroundColor: MissionColors.backgroundPrimary,
      body: Stack(
        children: [
          const StarfieldBackground(intensity: 0.7),

          SafeArea(
            child: Column(
              children: [
                // Header fixe
                Container(
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.65),
                    border: Border(bottom: BorderSide(color: Colors.white.withOpacity(0.08))),
                  ),
                  child: Column(
                    children: [
                      Padding(
                        padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                        child: Row(
                          children: [
                            IconButton(
                              icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white70),
                              onPressed: () => context.go("/dashboard"),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'Toutes les missions',
                                    style: TextStyle(
                                      fontSize: 20,
                                      fontWeight: FontWeight.w400,
                                      color: Colors.white,
                                    ),
                                  ),
                                  Text(
                                    '${filteredMissions.length} missions trouvées',
                                    style: const TextStyle(
                                      fontSize: 12,
                                      color: Color(0xFF94A3B8),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Barre de recherche
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        child: TextField(
                          onChanged: (value) {
                            setState(() {
                              searchQuery = value;
                              _applyFilters();
                            });
                          },
                          style: const TextStyle(color: Colors.white),
                          decoration: InputDecoration(
                            hintText: 'Rechercher par numéro, client ou adresse...',
                            hintStyle: TextStyle(color: Colors.white.withOpacity(0.5)),
                            prefixIcon: const Icon(Icons.search, color: Colors.white60),
                            filled: true,
                            fillColor: Colors.white.withOpacity(0.08),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide.none,
                            ),
                            contentPadding: const EdgeInsets.symmetric(vertical: 12),
                          ),
                        ),
                      ),

                      // Filtres status (chips)
                      SizedBox(
                        height: 48,
                        child: ListView(
                          scrollDirection: Axis.horizontal,
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          children: [
                            _buildFilterChip('Toutes', 'all'),
                            _buildFilterChip('En attente', 'scheduled'),
                            _buildFilterChip('En cours', 'in_transit'),
                            _buildFilterChip('Livrées', 'delivered'),
                            _buildFilterChip('Annulées', 'cancelled'),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),

                Expanded(
                  child: RefreshIndicator(
                    onRefresh: _loadMissions,
                    color: MissionColors.accentPrimary,
                    child: isLoading
                        ? const Center(child: CircularProgressIndicator())
                        : errorMessage != null
                        ? Center(
                      child: Padding(
                        padding: const EdgeInsets.all(32),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.error_outline, color: Colors.redAccent, size: 64),
                            const SizedBox(height: 24),
                            Text(
                              errorMessage!,
                              style: const TextStyle(color: Colors.redAccent, fontSize: 16),
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: 32),
                            OutlinedButton.icon(
                              icon: const Icon(Icons.refresh),
                              label: const Text('Réessayer'),
                              onPressed: _loadMissions,
                              style: OutlinedButton.styleFrom(foregroundColor: Colors.white),
                            ),
                          ],
                        ),
                      ),
                    )
                        : filteredMissions.isEmpty
                        ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.filter_list_off, size: 80, color: Colors.white.withOpacity(0.4)),
                          const SizedBox(height: 24),
                          const Text(
                            'Aucune mission trouvée',
                            style: TextStyle(color: Colors.white70, fontSize: 18),
                          ),
                          const SizedBox(height: 8),
                          const Text(
                            'Modifiez vos filtres ou actualisez',
                            style: TextStyle(color: Color(0xFF94A3B8), fontSize: 14),
                          ),
                        ],
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
                            .slideY(begin: 0.15, end: 0, delay: (index * 80).ms);
                      },
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

  Widget _buildFilterChip(String label, String value) {
    final isSelected = statusFilter == value;
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: FilterChip(
        label: Text(
          label,
          style: TextStyle(
            color: isSelected ? Colors.black : Colors.white,
            fontSize: 13,
            fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
          ),
        ),
        selected: isSelected,
        onSelected: (selected) {
          setState(() {
            statusFilter = value;
            _applyFilters();
          });
        },
        backgroundColor: Colors.white.withOpacity(0.08),
        selectedColor: MissionColors.accentPrimary,
        checkmarkColor: Colors.black,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      ),
    );
  }

  Widget _buildMissionCard(Map<String, dynamic> mission) {
    final status = (mission['status'] ?? '').toLowerCase();
    Color statusColor;
    String statusText;

    switch (status) {
      case 'in_transit':
        statusColor = Colors.blueAccent;
        statusText = 'EN COURS';
        break;
      case 'pending':
      case 'scheduled':
        statusColor = Colors.amber;
        statusText = 'EN ATTENTE';
        break;
      case 'delivered':
      case 'completed':
        statusColor = Colors.greenAccent;
        statusText = 'LIVRÉE';
        break;
      case 'cancelled':
        statusColor = Colors.redAccent;
        statusText = 'ANNULÉE';
        break;
      default:
        statusColor = Colors.grey;
        statusText = 'INCONNU';
    }

    return GlassCard(
      margin: const EdgeInsets.only(bottom: 16),
      child: ListTile(
        onTap: () => context.go('/mission/${mission['id']}'),
        contentPadding: const EdgeInsets.all(20),
        leading: CircleAvatar(
          radius: 26,
          backgroundColor: statusColor.withOpacity(0.2),
          child: Icon(Icons.local_shipping_rounded, color: statusColor),
        ),
        title: Text(
          mission['deliveryNumber'] ?? 'LIV-${mission['id']}',
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w500,
            color: Colors.white,
          ),
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 8),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                mission['deliveryAddress'] ?? 'Adresse inconnue',
                style: const TextStyle(color: Colors.white70, fontSize: 14),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: statusColor.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: statusColor.withOpacity(0.4)),
                    ),
                    child: Text(
                      statusText,
                      style: TextStyle(color: statusColor, fontSize: 12, fontWeight: FontWeight.w600),
                    ),
                  ),
                  const SizedBox(width: 12),
                  if (mission['customerName'] != null)
                    Text(
                      mission['customerName'],
                      style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
                    ),
                ],
              ),
            ],
          ),
        ),
        trailing: const Icon(Icons.chevron_right_rounded, color: Colors.white54, size: 28),
      ),
    );
  }
}