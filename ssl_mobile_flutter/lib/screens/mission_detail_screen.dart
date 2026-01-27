import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';
import '../widgets/starfield_background.dart';
import '../widgets/glass_card.dart'; // ou orbital_glass_card selon ton choix
import '../theme/mission_colors.dart'; // suppose que tu as ce fichier

class MissionDetailScreen extends StatefulWidget {
  final String id;
  const MissionDetailScreen({super.key, required this.id});

  @override
  State<MissionDetailScreen> createState() => _MissionDetailScreenState();
}

class _MissionDetailScreenState extends State<MissionDetailScreen> {
  final _storage = const FlutterSecureStorage();

  Map<String, dynamic>? mission;
  bool isLoading = true;
  String? errorMessage;

  final _dateFormat = DateFormat('dd MMM yyyy');
  final _dateTimeFormat = DateFormat('dd MMM yyyy • HH:mm');
  final _numberFormat = NumberFormat.decimalPattern('fr');

  @override
  void initState() {
    super.initState();
    _fetchMission();
  }

  void _showSnackBar({
    required String message,
    required Color backgroundColor,
    IconData? icon,
    Duration duration = const Duration(seconds: 3),
  }) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            if (icon != null) ...[
              Icon(icon, color: Colors.white, size: 20),
              const SizedBox(width: 12),
            ],
            Expanded(
              child: Text(
                message,
                style: const TextStyle(color: Colors.white, fontSize: 14),
              ),
            ),
          ],
        ),
        backgroundColor: backgroundColor.withOpacity(0.95),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        margin: const EdgeInsets.fromLTRB(16, 0, 16, 80), // marge haute pour éviter les boutons
        duration: duration,
        elevation: 6,
      ),
    );
  }

  Future<void> _updateDeliveryStatus(String newStatus) async {
    try {
      final token = await _storage.read(key: 'access_token');
      if (token == null || token.trim().isEmpty) {
        _showSnackBar(
          message: 'Session invalide. Veuillez vous reconnecter.',
          backgroundColor: Colors.redAccent,
          icon: Icons.error_outline,
          duration: const Duration(seconds: 4),
        );
        return;
      }

      final uri = Uri.parse(
        'http://localhost:8080/api/deliveries/${widget.id}/status?status=$newStatus',
      );

      print('→ PUT $uri');

      final response = await http.put(
        uri,
        headers: {
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      ).timeout(const Duration(seconds: 10));

      print('← Status: ${response.statusCode}');

      if (response.statusCode == 200 || response.statusCode == 204) {
        _showSnackBar(
          message: newStatus == 'IN_TRANSIT'
              ? 'Livraison démarrée avec succès'
              : 'Livraison marquée comme terminée',
          backgroundColor: Colors.green.shade700,
          icon: Icons.check_circle_outline,
        );
        await _fetchMission();
      } else if (response.statusCode == 401 || response.statusCode == 403) {
        await _storage.deleteAll();
        if (mounted) context.go('/login?reason=expired');
        _showSnackBar(
          message: 'Session expirée',
          backgroundColor: Colors.redAccent,
          icon: Icons.warning_amber,
          duration: const Duration(seconds: 4),
        );
      } else {
        final errorBody = response.body.isNotEmpty ? ' → ${response.body}' : '';
        throw Exception('Erreur ${response.statusCode}$errorBody');
      }
    } catch (e) {
      print('Erreur mise à jour statut: $e');
      _showSnackBar(
        message: 'Échec de la mise à jour : $e',
        backgroundColor: Colors.redAccent,
        icon: Icons.error_outline,
        duration: const Duration(seconds: 5),
      );
    }
  }

  Future<void> _fetchMission() async {
    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    try {
      final token = await _storage.read(key: 'access_token');
      if (token == null || token.isEmpty) {
        throw Exception('Session invalide. Veuillez vous reconnecter.');
      }

      // Adapte selon ton environnement
      final uri = Uri.parse('http://localhost:8080/api/deliveries/${widget.id}');
      // Pour vrai téléphone : 'http://192.168.1.xxx:8080/api/deliveries/${widget.id}'

      final response = await http.get(
        uri,
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
      } else if (response.statusCode == 401 || response.statusCode == 403) {
        await _storage.deleteAll();
        if (mounted) context.go('/login?reason=expired');
        throw Exception('Session expirée ou accès refusé');
      } else {
        throw Exception('Erreur ${response.statusCode} : ${response.body}');
      }
    } catch (e) {
      setState(() {
        errorMessage = e.toString().contains('Timeout')
            ? 'Délai dépassé – Vérifiez votre connexion ou le serveur'
            : 'Impossible de charger la mission : $e';
        isLoading = false;
      });
    }
  }

  Color _getStatusColor(String? status) {
    switch ((status ?? '').toUpperCase()) {
      case 'IN_TRANSIT':   return Colors.blueAccent;
      case 'SCHEDULED':    return Colors.amber;
      case 'PENDING':      return Colors.orange;
      case 'DELIVERED':    return Colors.greenAccent;
      case 'COMPLETED':    return Colors.teal;
      case 'CANCELLED':    return Colors.redAccent;
      default:             return Colors.grey.shade600;
    }
  }

  String _getStatusDisplay(String? status) {
    switch ((status ?? '').toUpperCase()) {
      case 'IN_TRANSIT':   return 'EN COURS DE LIVRAISON';
      case 'SCHEDULED':    return 'PLANIFIÉE';
      case 'PENDING':      return 'EN ATTENTE';
      case 'DELIVERED':    return 'LIVRÉE';
      case 'COMPLETED':    return 'TERMINÉE';
      case 'CANCELLED':    return 'ANNULÉE';
      default:             return status?.toUpperCase() ?? 'INCONNU';
    }
  }

  void _openMaps(double? lat, double? lng, String? fallbackAddress) async {
    if (lat != null && lng != null) {
      final url = Uri.parse('https://www.google.com/maps/search/?api=1&query=$lat,$lng');
      if (await canLaunchUrl(url)) await launchUrl(url, mode: LaunchMode.externalApplication);
    } else if (fallbackAddress != null) {
      final url = Uri.parse('https://www.google.com/maps/search/?api=1&query=${Uri.encodeComponent(fallbackAddress)}');
      if (await canLaunchUrl(url)) await launchUrl(url, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return _buildLoadingScreen();
    }

    if (errorMessage != null || mission == null) {
      return _buildErrorScreen();
    }

    final status = mission!['status'] as String?;
    final priority = mission!['priority'] as String?;
    final isActive = ['SCHEDULED', 'PENDING', 'IN_TRANSIT'].contains(status?.toUpperCase());

    return Scaffold(
      backgroundColor: MissionColors.backgroundPrimary,
      body: Stack(
        children: [
          const StarfieldBackground(intensity: 0.65),

          // Glow contextuel
          Positioned.fill(
            child: IgnorePointer(
              child: Opacity(
                opacity: 0.12,
                child: Container(
                  decoration: BoxDecoration(
                    gradient: RadialGradient(
                      center: Alignment.topRight,
                      radius: 1.2,
                      colors: [
                        _getStatusColor(status).withOpacity(0.4),
                        Colors.transparent,
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),

          SafeArea(
            child: Column(
              children: [
                _buildHeader(status, priority),

                Expanded(
                  child: RefreshIndicator(
                    onRefresh: _fetchMission,
                    color: MissionColors.accentPrimary,
                    child: SingleChildScrollView(
                      padding: const EdgeInsets.fromLTRB(16, 8, 16, 120),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          _buildStatusPriorityRow(status, priority),
                          const SizedBox(height: 20),

                          GlassCard(
                            glowColor: _getStatusColor(status).withOpacity(0.3),
                            child: Padding(
                              padding: const EdgeInsets.all(20),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const SectionHeader('INFORMATIONS PRINCIPALES'),
                                  const SizedBox(height: 16),
                                  _buildDetailRow(
                                    icon: Icons.confirmation_number_outlined,
                                    label: 'Numéro de livraison',
                                    value: mission!['deliveryNumber'] ?? '—',
                                  ),
                                  _buildDetailRow(
                                    icon: Icons.link,
                                    label: 'Référence commande',
                                    value: mission!['orderReference'] ?? '—',
                                  ),
                                  _buildDetailRow(
                                    icon: Icons.warehouse,
                                    label: 'Entrepôt source',
                                    value: mission!['warehouseId']?.toString() ?? '—',
                                  ),
                                ],
                              ),
                            ),
                          ),

                          const SizedBox(height: 20),

                          GlassCard(
                            child: Padding(
                              padding: const EdgeInsets.all(20),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const SectionHeader('CHAUFFEUR & CLIENT'),
                                  const SizedBox(height: 16),
                                  _buildDetailRow(
                                    icon: Icons.person_outline,
                                    label: 'Client',
                                    value: mission!['customerName'] ?? 'Non renseigné',
                                  ),
                                  if (mission!['driver'] != null) ...[
                                    _buildDetailRow(
                                      icon: Icons.drive_eta,
                                      label: 'Chauffeur',
                                      value: mission!['driver']['name'] ?? '—',
                                    ),
                                    if (mission!['driver']['phone'] != null)
                                      _buildDetailRow(
                                        icon: Icons.phone,
                                        label: 'Téléphone chauffeur',
                                        value: mission!['driver']['phone'],
                                      ),
                                  ],
                                ],
                              ),
                            ),
                          ),

                          const SizedBox(height: 20),

                          GlassCard(
                            child: Padding(
                              padding: const EdgeInsets.all(20),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const SectionHeader('ADRESSE DE LIVRAISON'),
                                  const SizedBox(height: 16),
                                  _buildLocationDetail(
                                    address: mission!['deliveryAddress'],
                                    lat: mission!['destinationLatitude'],
                                    lng: mission!['destinationLongitude'],
                                  ),
                                  if (mission!['estimatedDistanceKm'] != null)
                                    _buildDetailRow(
                                      icon: Icons.straighten,
                                      label: 'Distance estimée',
                                      value: '${_numberFormat.format(mission!['estimatedDistanceKm'])} km',
                                    ),
                                  if (mission!['actualDistanceKm'] != null)
                                    _buildDetailRow(
                                      icon: Icons.route,
                                      label: 'Distance réelle',
                                      value: '${_numberFormat.format(mission!['actualDistanceKm'])} km',
                                    ),
                                ],
                              ),
                            ),
                          ),

                          const SizedBox(height: 20),

                          GlassCard(
                            child: Padding(
                              padding: const EdgeInsets.all(20),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const SectionHeader('PLANIFICATION & ÉTAT'),
                                  const SizedBox(height: 16),
                                  _buildDetailRow(
                                    icon: Icons.event_available,
                                    label: 'Date prévue',
                                    value: mission!['scheduledDate'] != null
                                        ? _dateFormat.format(DateTime.parse(mission!['scheduledDate']))
                                        : '—',
                                  ),
                                  _buildDetailRow(
                                    icon: Icons.schedule,
                                    label: 'Planifiée le',
                                    value: mission!['scheduledAt'] != null
                                        ? _dateTimeFormat.format(DateTime.parse(mission!['scheduledAt']))
                                        : '—',
                                  ),
                                  if (mission!['pickedUpAt'] != null)
                                    _buildDetailRow(
                                      icon: Icons.local_shipping,
                                      label: 'Enlèvement effectué',
                                      value: _dateTimeFormat.format(DateTime.parse(mission!['pickedUpAt'])),
                                    ),
                                  if (mission!['deliveredAt'] != null)
                                    _buildDetailRow(
                                      icon: Icons.check_circle_outline,
                                      label: 'Livraison effectuée',
                                      value: _dateTimeFormat.format(DateTime.parse(mission!['deliveredAt'])),
                                    ),
                                ],
                              ),
                            ),
                          ),

                          if (mission!['notes'] != null && (mission!['notes'] as String).trim().isNotEmpty) ...[
                            const SizedBox(height: 20),
                            GlassCard(
                              child: Padding(
                                padding: const EdgeInsets.all(20),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const SectionHeader('NOTES'),
                                    const SizedBox(height: 12),
                                    Text(
                                      mission!['notes'],
                                      style: const TextStyle(
                                        color: Colors.white70,
                                        height: 1.5,
                                        fontSize: 15,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],

                          const SizedBox(height: 40),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),

          if (isActive) _buildActionBar(status),
        ],
      ),
    );
  }

  Widget _buildHeader(String? status, String? priority) {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 12),
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.55),
        border: Border(bottom: BorderSide(color: Colors.white.withOpacity(0.08))),
      ),
      child: Row(
        children: [
          IconButton(
            icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white70),
            onPressed: () => context.go('/dashboard'),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  mission!['deliveryNumber'] ?? 'Livraison ${widget.id}',
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w500,
                    color: Colors.white,
                    letterSpacing: 0.5,
                  ),
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    _buildBadge(_getStatusDisplay(status), _getStatusColor(status)),
                    const SizedBox(width: 12),
                    if (priority != null && priority.toUpperCase() != 'NORMAL')
                      _buildBadge(priority.toUpperCase(), priority.toUpperCase() == 'HIGH' ? Colors.redAccent : Colors.orangeAccent),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusPriorityRow(String? status, String? priority) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        _buildBadge(_getStatusDisplay(status), _getStatusColor(status)),
        if (priority != null)
          _buildBadge('Priorité $priority', priority.toUpperCase() == 'HIGH' ? Colors.redAccent : Colors.orangeAccent),
      ],
    );
  }

  Widget _buildBadge(String text, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      decoration: BoxDecoration(
        color: color.withOpacity(0.15),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withOpacity(0.4)),
      ),
      child: Text(
        text,
        style: TextStyle(
          color: color,
          fontSize: 13,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }

  Widget _buildLocationDetail({
    String? address,
    double? lat,
    double? lng,
  }) {
    return InkWell(
      onTap: () => _openMaps(lat, lng, address),
      borderRadius: BorderRadius.circular(12),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 8),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(Icons.location_on, color: MissionColors.accentPrimary, size: 26),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('ADRESSE', style: TextStyle(fontSize: 12, color: Color(0xFF94A3B8))),
                  const SizedBox(height: 6),
                  Text(
                    address ?? (lat != null && lng != null ? 'Coordonnées : $lat, $lng' : 'Non renseignée'),
                    style: const TextStyle(fontSize: 15, color: Colors.white, height: 1.4),
                  ),
                ],
              ),
            ),
            const Icon(Icons.open_in_new, size: 20, color: Colors.white54),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow({
    required IconData icon,
    required String label,
    required String value,
    VoidCallback? onTap,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: Colors.white70, size: 22),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8))),
                const SizedBox(height: 4),
                Text(value, style: const TextStyle(fontSize: 15, color: Colors.white)),
              ],
            ),
          ),
          if (onTap != null)
            IconButton(
              icon: const Icon(Icons.phone, size: 20, color: Colors.white54),
              onPressed: onTap,
            ),
        ],
      ),
    );
  }

  Widget _buildActionBar(String? status) {
    return Positioned(
      bottom: 0,
      left: 0,
      right: 0,
      child: Container(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 28),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              MissionColors.backgroundPrimary.withOpacity(0.3),
              MissionColors.backgroundPrimary,
            ],
          ),
        ),
        child: SafeArea(
          top: false,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (status?.toUpperCase() == 'SCHEDULED' || status?.toUpperCase() == 'PENDING')
                _buildPrimaryActionButton(
                  'DÉMARRER LA LIVRAISON',
                  Icons.play_circle_filled_rounded,
                  MissionColors.accentPrimary,
                      () async {
                    await _updateDeliveryStatus('IN_TRANSIT');
                  },
                ),

              if (status?.toUpperCase() == 'IN_TRANSIT') ...[
                _buildPrimaryActionButton(
                  'MARQUER COMME LIVRÉE',
                  Icons.check_circle,
                  Colors.greenAccent,
                      () async {
                    await _updateDeliveryStatus('DELIVERED');
                  },
                ),
                const SizedBox(height: 12),
                _buildOutlinedActionButton(
                  'SIGNALER UN PROBLÈME',
                  Icons.report_problem,
                  Colors.orangeAccent,
                      () => context.go('/mission/${widget.id}/incident'),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
  Widget _buildPrimaryActionButton(String label, IconData icon, Color color, VoidCallback onPressed) {
    return SizedBox(
      width: double.infinity,
      height: 58,
      child: ElevatedButton.icon(
        icon: Icon(icon, size: 26),
        label: Text(label, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: color,
          foregroundColor: Colors.white,
          elevation: 8,
          shadowColor: color.withOpacity(0.5),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        ),
      ),
    );
  }

  Widget _buildOutlinedActionButton(String label, IconData icon, Color color, VoidCallback onPressed) {
    return SizedBox(
      width: double.infinity,
      height: 58,
      child: OutlinedButton.icon(
        icon: Icon(icon, size: 26),
        label: Text(label, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
        onPressed: onPressed,
        style: OutlinedButton.styleFrom(
          foregroundColor: color,
          side: BorderSide(color: color, width: 1.5),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        ),
      ),
    );
  }

  Widget _buildLoadingScreen() {
    return Scaffold(
      backgroundColor: MissionColors.backgroundPrimary,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const CircularProgressIndicator(color: MissionColors.accentPrimary, strokeWidth: 3),
            const SizedBox(height: 32),
            const Text(
              'RÉCUPÉRATION DES DONNÉES DE LIVRAISON',
              style: TextStyle(color: Colors.white70, fontSize: 16, letterSpacing: 1.2),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildErrorScreen() {
    return Scaffold(
      backgroundColor: MissionColors.backgroundPrimary,
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, color: Colors.redAccent, size: 64),
              const SizedBox(height: 24),
              Text(
                errorMessage ?? 'Erreur inattendue',
                style: const TextStyle(color: Colors.redAccent, fontSize: 18),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 32),
              OutlinedButton.icon(
                icon: const Icon(Icons.refresh),
                label: const Text('RÉESSAYER'),
                onPressed: _fetchMission,
                style: OutlinedButton.styleFrom(
                  foregroundColor: Colors.white,
                  side: const BorderSide(color: Colors.white70),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class SectionHeader extends StatelessWidget {
  final String text;
  const SectionHeader(this.text, {super.key});

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: const TextStyle(
        fontSize: 13,
        fontWeight: FontWeight.w600,
        color: Color(0xFF94A3B8),
        letterSpacing: 1.8,
      ),
    );
  }
}