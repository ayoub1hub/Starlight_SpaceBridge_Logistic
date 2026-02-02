import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class IncidentReportScreen extends StatefulWidget {
  final String id;
  const IncidentReportScreen({super.key, required this.id});

  @override
  State<IncidentReportScreen> createState() => _IncidentReportScreenState();
}

class _IncidentReportScreenState extends State<IncidentReportScreen> with SingleTickerProviderStateMixin {
  String selectedType = '';
  String selectedSeverity = 'medium';
  final TextEditingController _descriptionController = TextEditingController();
  List<XFile> photos = [];
  bool uploading = false;
  final _storage = const FlutterSecureStorage();
  final ImagePicker _picker = ImagePicker();

  late AnimationController _animationController;

  final List<Map<String, dynamic>> incidentTypes = [
    {'value': 'delay', 'label': 'Delay', 'icon': Icons.access_time, 'color': Colors.amber},
    {'value': 'damage', 'label': 'Package Damage', 'icon': Icons.inventory, 'color': Colors.red},
    {'value': 'access_denied', 'label': 'Access Denied', 'icon': Icons.lock, 'color': Colors.orange},
    {'value': 'recipient_unavailable', 'label': 'Recipient Unavailable', 'icon': Icons.person_off, 'color': Colors.purple},
    {'value': 'vehicle_issue', 'label': 'Vehicle Issue', 'icon': Icons.build, 'color': Colors.blue},
    {'value': 'other', 'label': 'Other', 'icon': Icons.help_outline, 'color': Colors.grey},
  ];

  final Map<String, Map<String, dynamic>> severityConfig = {
    'low': {'label': 'LOW', 'color': Colors.blue},
    'medium': {'label': 'MEDIUM', 'color': Colors.amber},
    'high': {'label': 'HIGH', 'color': Colors.orange},
    'critical': {'label': 'CRITICAL', 'color': Colors.red},
  };

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    );
    _animationController.forward();
  }

  @override
  void dispose() {
    _animationController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  void _showMessage(String message, {bool isError = false}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Icon(isError ? Icons.error_outline : Icons.check_circle_outline, color: Colors.white),
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
        context.go('/dashboard');
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
      ),
      floatingActionButton: _buildSubmitButton(),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Colors.orange.withOpacity(0.2),
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
              onPressed: () => context.go('/mission/${widget.id}'),
            ),
          ),
          const SizedBox(width: 16),
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'REPORT INCIDENT',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w900,
                    color: Colors.white,
                    letterSpacing: 2,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  'Document delivery issue',
                  style: TextStyle(fontSize: 12, color: Colors.white54),
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
      icon: Icons.warning_amber,
      child: GridView.count(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        crossAxisCount: 2,
        mainAxisSpacing: 12,
        crossAxisSpacing: 12,
        childAspectRatio: 1.3,
        children: incidentTypes.map((type) {
          final isSelected = selectedType == type['value'];
          final color = type['color'] as Color;
          return InkWell(
            onTap: () => setState(() => selectedType = type['value']),
            borderRadius: BorderRadius.circular(16),
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: isSelected
                    ? LinearGradient(
                  colors: [color.withOpacity(0.3), color.withOpacity(0.1)],
                )
                    : null,
                border: Border.all(
                  color: isSelected ? color : Colors.white.withOpacity(0.2),
                  width: isSelected ? 2 : 1,
                ),
                borderRadius: BorderRadius.circular(16),
                boxShadow: isSelected
                    ? [
                  BoxShadow(
                    color: color.withOpacity(0.3),
                    blurRadius: 10,
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
                      fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                    ),
                  ),
                ],
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
      icon: Icons.priority_high,
      child: Row(
        children: severityConfig.entries.map((entry) {
          final isSelected = selectedSeverity == entry.key;
          final color = entry.value['color'] as Color;
          return Expanded(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 4),
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
                        : null,
                    border: Border.all(
                      color: isSelected ? color : Colors.white.withOpacity(0.2),
                      width: 2,
                    ),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    entry.value['label'],
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 11,
                      color: isSelected ? color : Colors.white70,
                      letterSpacing: 1.5,
                      fontWeight: FontWeight.bold,
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
      icon: Icons.description,
      child: TextField(
        controller: _descriptionController,
        maxLines: 5,
        style: const TextStyle(color: Colors.white),
        decoration: InputDecoration(
          hintText: 'Describe the incident in detail...',
          hintStyle: TextStyle(color: Colors.white.withOpacity(0.3)),
          filled: true,
          fillColor: Colors.white.withOpacity(0.05),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide(color: Colors.white.withOpacity(0.2)),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide(color: Colors.white.withOpacity(0.2)),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: Colors.blue, width: 2),
          ),
        ),
      ),
    );
  }

  Widget _buildPhotosSection() {
    return _buildCard(
      title: 'PHOTOS (OPTIONAL)',
      icon: Icons.camera_alt,
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
            return InkWell(
              onTap: _pickPhotos,
              borderRadius: BorderRadius.circular(12),
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      Colors.blue.withOpacity(0.2),
                      Colors.blue.withOpacity(0.05),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.blue.withOpacity(0.3), width: 2),
                ),
                child: const Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.add_a_photo, size: 32, color: Colors.blue),
                    SizedBox(height: 8),
                    Text('Add', style: TextStyle(fontSize: 12, color: Colors.blue)),
                  ],
                ),
              ),
            );
          }
          return Stack(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
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
                child: InkWell(
                  onTap: () => _removePhoto(index),
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: const BoxDecoration(
                      color: Colors.red,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.close, size: 16, color: Colors.white),
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildCard({required String title, required IconData icon, required Widget child}) {
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
              Icon(icon, color: Colors.orange, size: 20),
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
          child,
        ],
      ),
    );
  }

  Widget _buildSubmitButton() {
    return Container(
      width: MediaQuery.of(context).size.width - 32,
      height: 60,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Colors.orange, Color(0xFFFF6B00)],
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.orange.withOpacity(0.4),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: ElevatedButton.icon(
        onPressed: uploading ? null : _submitReport,
        icon: uploading
            ? const SizedBox(
          width: 24,
          height: 24,
          child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
        )
            : const Icon(Icons.send, size: 24),
        label: Text(
          uploading ? 'UPLOADING...' : 'SUBMIT REPORT',
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            letterSpacing: 2,
          ),
        ),
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.transparent,
          foregroundColor: Colors.white,
          shadowColor: Colors.transparent,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        ),
      ),
    );
  }
}