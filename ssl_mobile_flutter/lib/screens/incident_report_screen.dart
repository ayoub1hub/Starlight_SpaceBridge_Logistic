import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:math' as math;

class IncidentReportScreen extends StatefulWidget {
  final String id;
  const IncidentReportScreen({super.key, required this.id});

  @override
  State<IncidentReportScreen> createState() => _IncidentReportScreenState();
}

class _IncidentReportScreenState extends State<IncidentReportScreen> with TickerProviderStateMixin {
  String selectedType = '';
  String selectedSeverity = 'medium';
  final TextEditingController _descriptionController = TextEditingController();
  List<XFile> photos = [];
  bool uploading = false;
  final _storage = const FlutterSecureStorage();
  final ImagePicker _picker = ImagePicker();

  late AnimationController _animationController;
  late AnimationController _starsController;
  late AnimationController _particlesController;

  final List<Map<String, dynamic>> incidentTypes = [
    {'value': 'delay', 'label': 'Delay', 'icon': Icons.access_time_rounded, 'color': const Color(0xFFF59E0B)},
    {'value': 'damage', 'label': 'Package Damage', 'icon': Icons.inventory_rounded, 'color': const Color(0xFFEF4444)},
    {'value': 'access_denied', 'label': 'Access Denied', 'icon': Icons.lock_rounded, 'color': const Color(0xFFFF6B00)},
    {'value': 'recipient_unavailable', 'label': 'Recipient Unavailable', 'icon': Icons.person_off_rounded, 'color': const Color(0xFF8B5CF6)},
    {'value': 'vehicle_issue', 'label': 'Vehicle Issue', 'icon': Icons.build_rounded, 'color': const Color(0xFF06B6D4)},
    {'value': 'other', 'label': 'Other', 'icon': Icons.help_outline_rounded, 'color': const Color(0xFF64748B)},
  ];

  final Map<String, Map<String, dynamic>> severityConfig = {
    'low': {'label': 'LOW', 'color': const Color(0xFF06B6D4)},
    'medium': {'label': 'MEDIUM', 'color': const Color(0xFFF59E0B)},
    'high': {'label': 'HIGH', 'color': const Color(0xFFFF6B00)},
    'critical': {'label': 'CRITICAL', 'color': const Color(0xFFEF4444)},
  };

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

    _animationController.forward();
  }

  @override
  void dispose() {
    _animationController.dispose();
    _starsController.dispose();
    _particlesController.dispose();
    _descriptionController.dispose();
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

  Future<void> _pickPhotos() async {
    try {
      final List<XFile>? picked = await _picker.pickMultiImage(limit: 4 - photos.length);
      if (picked != null && picked.isNotEmpty) {
        setState(() => photos.addAll(picked));
      }
    } catch (e) {
      _showMessage('Failed to pick photos: $e', isError: true);
    }
  }

  void _removePhoto(int index) {
    setState(() => photos.removeAt(index));
  }

  Future<void> _submitReport() async {
    if (selectedType.isEmpty) {
      _showMessage('Please select an incident type', isError: true);
      return;
    }
    if (_descriptionController.text.trim().isEmpty) {
      _showMessage('Please add a description', isError: true);
      return;
    }

    setState(() => uploading = true);

    try {
      final token = await _storage.read(key: 'access_token');
      if (token == null) {
        throw Exception('Session expired');
      }

      var request = http.MultipartRequest(
        'POST',
        Uri.parse('http://localhost:8080/api/incidents'),
      )..headers['Authorization'] = 'Bearer $token';

      request.files.add(
        http.MultipartFile.fromString(
          'request',
          jsonEncode({
            'deliveryId': widget.id,
            'type': selectedType.toUpperCase(),
            'severity': selectedSeverity.toUpperCase(),
            'description': _descriptionController.text.trim(),
          }),
          filename: 'request.json',
          contentType: http.MediaType('application', 'json'),
        ),
      );

      for (var photo in photos) {
        final file = await http.MultipartFile.fromPath('photos', photo.path);
        request.files.add(file);
      }

      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);

      if (response.statusCode == 201 || response.statusCode == 200) {
        _showMessage('Incident reported successfully!');
        Future.delayed(const Duration(seconds: 1), () {
          if (mounted) context.go('/dashboard');
        });
      } else {
        throw Exception('Server error (${response.statusCode})');
      }
    } catch (e) {
      _showMessage('Failed to submit: $e', isError: true);
    } finally {
      setState(() => uploading = false);
    }
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
                Expanded(
                  child: FadeTransition(
                    opacity: _animationController,
                    child: ListView(
                      padding: const EdgeInsets.all(16),
                      children: [
                        _buildIncidentTypeSection(),
                        const SizedBox(height: 20),
                        _buildSeveritySection(),
                        const SizedBox(height: 20),
                        _buildDescriptionSection(),
                        const SizedBox(height: 20),
                        _buildPhotosSection(),
                        const SizedBox(height: 120),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      floatingActionButton: _buildSubmitButton(),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
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
          color: const Color(0xFFEF4444).withOpacity(0.3),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFEF4444).withOpacity(0.2),
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
                  const Color(0xFFEF4444).withOpacity(0.2),
                  const Color(0xFFEF4444).withOpacity(0.1),
                ],
              ),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(
                color: const Color(0xFFEF4444).withOpacity(0.3),
              ),
            ),
            child: IconButton(
              icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Color(0xFFEF4444), size: 20),
              onPressed: () => context.go('/mission/${widget.id}'),
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
                      Color(0xFFEF4444),
                      Color(0xFFFF6B00),
                    ],
                  ).createShader(bounds),
                  child: const Text(
                    'REPORT INCIDENT',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w900,
                      color: Colors.white,
                      letterSpacing: 1.2,
                    ),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Document delivery issue',
                  style: TextStyle(
                    fontSize: 12,
                    color: const Color(0xFFEF4444).withOpacity(0.7),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildIncidentTypeSection() {
    return _buildCard(
      title: 'INCIDENT TYPE',
      icon: Icons.warning_amber_rounded,
      color: const Color(0xFFEF4444),
      child: GridView.count(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        crossAxisCount: 2,
        mainAxisSpacing: 12,
        crossAxisSpacing: 12,
        childAspectRatio: 1.2,
        children: incidentTypes.map((type) {
          final isSelected = selectedType == type['value'];
          final color = type['color'] as Color;
          return Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: () => setState(() => selectedType = type['value']),
              borderRadius: BorderRadius.circular(16),
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  gradient: isSelected
                      ? LinearGradient(
                    colors: [color.withOpacity(0.3), color.withOpacity(0.1)],
                  )
                      : LinearGradient(
                    colors: [
                      Colors.white.withOpacity(0.08),
                      Colors.white.withOpacity(0.04),
                    ],
                  ),
                  border: Border.all(
                    color: isSelected ? color : Colors.white.withOpacity(0.2),
                    width: isSelected ? 2 : 1,
                  ),
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: isSelected
                      ? [
                    BoxShadow(
                      color: color.withOpacity(0.3),
                      blurRadius: 15,
                      spreadRadius: -2,
                    ),
                  ]
                      : null,
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      type['icon'],
                      size: 36,
                      color: isSelected ? color : Colors.white54,
                    ),
                    const SizedBox(height: 12),
                    Text(
                      type['label'],
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 13,
                        color: isSelected ? Colors.white : Colors.white70,
                        fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildSeveritySection() {
    return _buildCard(
      title: 'SEVERITY LEVEL',
      icon: Icons.priority_high_rounded,
      color: const Color(0xFFF59E0B),
      child: Row(
        children: severityConfig.entries.map((entry) {
          final isSelected = selectedSeverity == entry.key;
          final color = entry.value['color'] as Color;
          return Expanded(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 4),
              child: Material(
                color: Colors.transparent,
                child: InkWell(
                  onTap: () => setState(() => selectedSeverity = entry.key),
                  borderRadius: BorderRadius.circular(12),
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    decoration: BoxDecoration(
                      gradient: isSelected
                          ? LinearGradient(
                        colors: [color.withOpacity(0.3), color.withOpacity(0.1)],
                      )
                          : LinearGradient(
                        colors: [
                          Colors.white.withOpacity(0.08),
                          Colors.white.withOpacity(0.04),
                        ],
                      ),
                      border: Border.all(
                        color: isSelected ? color : Colors.white.withOpacity(0.2),
                        width: 2,
                      ),
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: isSelected
                          ? [
                        BoxShadow(
                          color: color.withOpacity(0.3),
                          blurRadius: 12,
                        ),
                      ]
                          : null,
                    ),
                    child: Text(
                      entry.value['label'],
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 11,
                        color: isSelected ? color : Colors.white70,
                        letterSpacing: 1.5,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildDescriptionSection() {
    return _buildCard(
      title: 'DESCRIPTION',
      icon: Icons.description_rounded,
      color: const Color(0xFF06B6D4),
      child: TextField(
        controller: _descriptionController,
        maxLines: 5,
        style: const TextStyle(color: Colors.white, fontSize: 15),
        decoration: InputDecoration(
          hintText: 'Describe the incident in detail...',
          hintStyle: TextStyle(color: Colors.white.withOpacity(0.3)),
          filled: true,
          fillColor: Colors.white.withOpacity(0.05),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide(color: Colors.white.withOpacity(0.2)),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide(color: Colors.white.withOpacity(0.2)),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: const BorderSide(color: Color(0xFF06B6D4), width: 2),
          ),
          contentPadding: const EdgeInsets.all(16),
        ),
      ),
    );
  }

  Widget _buildPhotosSection() {
    return _buildCard(
      title: 'PHOTOS (OPTIONAL)',
      icon: Icons.camera_alt_rounded,
      color: const Color(0xFF8B5CF6),
      child: GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 3,
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
        ),
        itemCount: photos.length + (photos.length < 4 ? 1 : 0),
        itemBuilder: (context, index) {
          if (index == photos.length) {
            return Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: _pickPhotos,
                borderRadius: BorderRadius.circular(16),
                child: Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        const Color(0xFF8B5CF6).withOpacity(0.2),
                        const Color(0xFF8B5CF6).withOpacity(0.1),
                      ],
                    ),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: const Color(0xFF8B5CF6).withOpacity(0.4),
                      width: 2,
                    ),
                  ),
                  child: const Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.add_a_photo_rounded, size: 32, color: Color(0xFF8B5CF6)),
                      SizedBox(height: 8),
                      Text(
                        'Add',
                        style: TextStyle(
                          fontSize: 12,
                          color: Color(0xFF8B5CF6),
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          }
          return Stack(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: Image.file(
                  File(photos[index].path),
                  width: double.infinity,
                  height: double.infinity,
                  fit: BoxFit.cover,
                ),
              ),
              Positioned(
                top: 4,
                right: 4,
                child: Material(
                  color: Colors.transparent,
                  child: InkWell(
                    onTap: () => _removePhoto(index),
                    borderRadius: BorderRadius.circular(20),
                    child: Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFFEF4444), Color(0xFFDC2626)],
                        ),
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFFEF4444).withOpacity(0.5),
                            blurRadius: 8,
                          ),
                        ],
                      ),
                      child: const Icon(Icons.close_rounded, size: 16, color: Colors.white),
                    ),
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildCard({
    required String title,
    required IconData icon,
    required Color color,
    required Widget child,
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
          child,
        ],
      ),
    );
  }

  Widget _buildSubmitButton() {
    return Container(
      width: MediaQuery.of(context).size.width - 32,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFFEF4444), Color(0xFFDC2626)],
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFEF4444).withOpacity(0.5),
            blurRadius: 30,
            offset: const Offset(0, 10),
            spreadRadius: -5,
          ),
        ],
      ),
      child: ElevatedButton.icon(
        onPressed: uploading ? null : _submitReport,
        icon: uploading
            ? const SizedBox(
          width: 24,
          height: 24,
          child: CircularProgressIndicator(
            color: Colors.white,
            strokeWidth: 3,
          ),
        )
            : const Icon(Icons.send_rounded, size: 24),
        label: Text(
          uploading ? 'SUBMITTING...' : 'SUBMIT REPORT',
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w700,
            letterSpacing: 1.5,
          ),
        ),
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
}

// Reusing painters
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
  }

  @override
  bool shouldRepaint(EnhancedStarsPainter oldDelegate) => oldDelegate.animationValue != animationValue;
}

class CosmicEffectsPainter extends CustomPainter {
  final double animationValue;
  CosmicEffectsPainter({required this.animationValue});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..strokeWidth = 2.5..strokeCap = StrokeCap.round;
    for (int i = 0; i < 3; i++) {
      final progress = (animationValue + (i * 0.33)) % 1.0;
      if (progress < 0.15) {
        final startX = size.width * (0.3 + i * 0.25);
        final startY = size.height * (0.15 + i * 0.2);
        final length = 80.0 * (progress / 0.15);
        final gradient = LinearGradient(colors: [Colors.white, const Color(0xFF06B6D4).withOpacity(0.8), const Color(0xFF3B82F6).withOpacity(0.4), Colors.transparent]);
        paint.shader = gradient.createShader(Rect.fromPoints(Offset(startX, startY), Offset(startX + length * 1.5, startY + length)));
        paint.strokeWidth = 3 * (1 - progress / 0.15);
        canvas.drawLine(Offset(startX, startY), Offset(startX + length * 1.5, startY + length), paint);
      }
    }
  }

  @override
  bool shouldRepaint(CosmicEffectsPainter oldDelegate) => oldDelegate.animationValue != animationValue;
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
  bool shouldRepaint(AmbientParticlesPainter oldDelegate) => oldDelegate.animationValue != animationValue;
}