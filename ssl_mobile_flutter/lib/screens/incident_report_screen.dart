import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import '../widgets/starfield_background.dart';
import '../widgets/glass_card.dart';
import '../theme/mission_colors.dart';

class IncidentReportScreen extends StatefulWidget {
  final String id;
  const IncidentReportScreen({super.key, required this.id});

  @override
  State<IncidentReportScreen> createState() => _IncidentReportScreenState();
}

class _IncidentReportScreenState extends State<IncidentReportScreen> {
  String selectedType = '';
  String selectedSeverity = 'medium';
  final TextEditingController _descriptionController = TextEditingController();
  List<XFile> photos = [];
  bool uploading = false;

  final ImagePicker _picker = ImagePicker();

  final List<Map<String, dynamic>> incidentTypes = [
    {
      'value': 'delay',
      'label': 'Delay',
      'icon': Icons.access_time,
      'desc': 'Delivery will be delayed'
    },
    {
      'value': 'damage',
      'label': 'Package Damage',
      'icon': Icons.inventory,
      'desc': 'Package is damaged'
    },
    {
      'value': 'access_denied',
      'label': 'Access Denied',
      'icon': Icons.lock,
      'desc': 'Cannot access location'
    },
    {
      'value': 'recipient_unavailable',
      'label': 'Recipient Unavailable',
      'icon': Icons.person_off,
      'desc': 'No one to receive'
    },
    {
      'value': 'vehicle_issue',
      'label': 'Vehicle Issue',
      'icon': Icons.build,
      'desc': 'Vehicle problem'
    },
    {
      'value': 'other',
      'label': 'Other',
      'icon': Icons.help_outline,
      'desc': 'Other incident'
    },
  ];

  final Map<String, Map<String, dynamic>> severityConfig = {
    'low': {'label': 'Low', 'color': Colors.blue},
    'medium': {'label': 'Medium', 'color': Colors.amber},
    'high': {'label': 'High', 'color': Colors.orange},
    'critical': {'label': 'Critical', 'color': Colors.red},
  };

  // Mock active missions - replace with real API
  final List<Map<String, dynamic>> activeMissions = List.generate(
      5,
          (i) => {
        'id': 'MSN-2025-${200 + i}',
        'mission_code': 'MSN-2025-${200 + i}',
        'recipient_name': 'Client ${i + 1}',
      });

  Future<void> _pickPhotos() async {
    final List<XFile>? picked =
    await _picker.pickMultiImage(limit: 4 - photos.length);
    if (picked != null) {
      setState(() {
        photos.addAll(picked);
      });
    }
  }

  void _removePhoto(int index) {
    setState(() {
      photos.removeAt(index);
    });
  }

  void _submitReport() async {
    if (selectedType.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select incident type')),
      );
      return;
    }
    if (_descriptionController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please provide a description')),
      );
      return;
    }

    setState(() => uploading = true);

    // Simulate upload delay
    await Future.delayed(const Duration(seconds: 2));

    setState(() => uploading = false);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('Incident reported successfully'),
        backgroundColor: Colors.green,
      ),
    );

    context.go('/dashboard');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Space background
          const StarfieldBackground(intensity: 0.7),

          // Ambient planets
          Positioned(
            top: -80,
            left: -80,
            child: Opacity(
                opacity: 0.15, child: _buildPlanet(400, Colors.deepPurple)),
          ),
          Positioned(
            bottom: -120,
            right: -100,
            child: Opacity(opacity: 0.2, child: _buildPlanet(450, Colors.red)),
          ),

          SafeArea(
            child: Column(
              children: [
                // Header
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    border: Border(
                        bottom:
                        BorderSide(color: Colors.white.withOpacity(0.1))),
                    color: Colors.black.withOpacity(0.4),
                  ),
                  child: Row(
                    children: [
                      IconButton(
                        icon: const Icon(Icons.arrow_back_ios_new,
                            color: Colors.white70),
                        onPressed: () => context.pop(),
                      ),
                      const SizedBox(width: 12),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Report Incident',
                              style: TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.w300,
                                  color: Colors.white),
                            ),
                            Text(
                              'Document delivery issue',
                              style: TextStyle(
                                  fontSize: 12, color: Color(0xFF64748B)),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),

                // Scrollable Form
                Expanded(
                  child: ListView(
                    padding: const EdgeInsets.all(16),
                    children: [
                      // Mission Selection (if not preselected)
                      if (widget.id == null && activeMissions.isNotEmpty)
                        GlassCard(
                          child: Padding(
                            padding: const EdgeInsets.all(20),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'RELATED MISSION (OPTIONAL)',
                                  style: TextStyle(
                                      fontSize: 11,
                                      color: Color(0xFF64748B),
                                      letterSpacing: 2),
                                ),
                                const SizedBox(height: 12),
                                DropdownButtonFormField<String>(
                                  value: null,
                                  hint: const Text('Select mission...',
                                      style: TextStyle(color: Colors.white70)),
                                  decoration: InputDecoration(
                                    filled: true,
                                    fillColor: Colors.white.withOpacity(0.08),
                                    border: OutlineInputBorder(
                                      borderSide: BorderSide(
                                          color: Colors.white.withOpacity(0.3)),
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    enabledBorder: OutlineInputBorder(
                                      borderSide: BorderSide(
                                          color: Colors.white.withOpacity(0.3)),
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    focusedBorder: OutlineInputBorder(
                                      borderSide: const BorderSide(
                                          color: Colors.white70),
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                  ),
                                  dropdownColor: const Color(0xFF1E293B),
                                  style: const TextStyle(color: Colors.white),
                                  items: activeMissions
                                      .map<DropdownMenuItem<String>>((m) {
                                    return DropdownMenuItem<String>(
                                      value: m['id'] as String,
                                      child: Text(
                                          '${m['mission_code']} - ${m['recipient_name']}'),
                                    );
                                  }).toList(),
                                  onChanged: (String? newValue) {
                                    // Handle selection if needed
                                    // setState(() => selectedMissionId = newValue);
                                  },
                                ),
                              ],
                            ),
                          ),
                        ),

                      const SizedBox(height: 20),

                      // Incident Type Grid
                      GlassCard(
                        child: Padding(
                          padding: const EdgeInsets.all(20),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'INCIDENT TYPE',
                                style: TextStyle(
                                    fontSize: 11,
                                    color: Color(0xFF64748B),
                                    letterSpacing: 2),
                              ),
                              const SizedBox(height: 16),
                              GridView.count(
                                shrinkWrap: true,
                                physics: const NeverScrollableScrollPhysics(),
                                crossAxisCount: 2,
                                mainAxisSpacing: 12,
                                crossAxisSpacing: 12,
                                childAspectRatio: 2.2,
                                children: incidentTypes.map((type) {
                                  final isSelected =
                                      selectedType == type['value'];
                                  return InkWell(
                                    onTap: () => setState(
                                            () => selectedType = type['value']),
                                    borderRadius: BorderRadius.circular(12),
                                    child: Container(
                                      padding: const EdgeInsets.all(16),
                                      decoration: BoxDecoration(
                                        border: Border.all(
                                          color: isSelected
                                              ? Colors.amber
                                              : Colors.white.withOpacity(0.3),
                                          width: 1.5,
                                        ),
                                        color: isSelected
                                            ? Colors.amber.withOpacity(0.15)
                                            : Colors.transparent,
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      child: Column(
                                        crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                        children: [
                                          Icon(
                                            type['icon'],
                                            size: 28,
                                            color: isSelected
                                                ? Colors.amber
                                                : const Color(0xFF64748B),
                                          ),
                                          const SizedBox(height: 8),
                                          Text(
                                            type['label'],
                                            style: TextStyle(
                                              fontSize: 14,
                                              color: isSelected
                                                  ? Colors.white
                                                  : Colors.white70,
                                              fontWeight: FontWeight.w500,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  );
                                }).toList(),
                              ),
                            ],
                          ),
                        ),
                      ),

                      const SizedBox(height: 20),

                      // Severity Level
                      GlassCard(
                        child: Padding(
                          padding: const EdgeInsets.all(20),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'SEVERITY LEVEL',
                                style: TextStyle(
                                    fontSize: 11,
                                    color: Color(0xFF64748B),
                                    letterSpacing: 2),
                              ),
                              const SizedBox(height: 16),
                              Row(
                                children: severityConfig.entries.map((entry) {
                                  final isSelected =
                                      selectedSeverity == entry.key;
                                  final color = entry.value['color'] as Color;
                                  return Expanded(
                                    child: Padding(
                                      padding: const EdgeInsets.symmetric(
                                          horizontal: 4),
                                      child: InkWell(
                                        onTap: () => setState(
                                                () => selectedSeverity = entry.key),
                                        borderRadius: BorderRadius.circular(12),
                                        child: Container(
                                          padding: const EdgeInsets.symmetric(
                                              vertical: 12),
                                          decoration: BoxDecoration(
                                            border: Border.all(
                                              color: isSelected
                                                  ? color
                                                  : Colors.white
                                                  .withOpacity(0.3),
                                              width: 2,
                                            ),
                                            color: isSelected
                                                ? color.withOpacity(0.2)
                                                : Colors.transparent,
                                            borderRadius:
                                            BorderRadius.circular(12),
                                          ),
                                          child: Text(
                                            entry.value['label'],
                                            textAlign: TextAlign.center,
                                            style: TextStyle(
                                              fontSize: 12,
                                              color: isSelected
                                                  ? color
                                                  : Colors.white70,
                                              letterSpacing: 1.5,
                                              fontWeight: FontWeight.w600,
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                  );
                                }).toList(),
                              ),
                            ],
                          ),
                        ),
                      ),

                      const SizedBox(height: 20),

                      // Description
                      GlassCard(
                        child: Padding(
                          padding: const EdgeInsets.all(20),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'DESCRIPTION',
                                style: TextStyle(
                                    fontSize: 11,
                                    color: Color(0xFF64748B),
                                    letterSpacing: 2),
                              ),
                              const SizedBox(height: 12),
                              TextField(
                                controller: _descriptionController,
                                maxLines: 5,
                                style: const TextStyle(color: Colors.white),
                                decoration: InputDecoration(
                                  hintText:
                                  'Describe the incident in detail...',
                                  hintStyle: TextStyle(
                                      color: Colors.white.withOpacity(0.5)),
                                  filled: true,
                                  fillColor: Colors.white.withOpacity(0.08),
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide: BorderSide(
                                        color: Colors.white.withOpacity(0.3)),
                                  ),
                                  enabledBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide: BorderSide(
                                        color: Colors.white.withOpacity(0.3)),
                                  ),
                                  focusedBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide:
                                    const BorderSide(color: Colors.white70),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),

                      const SizedBox(height: 20),

                      // Photos
                      GlassCard(
                        child: Padding(
                          padding: const EdgeInsets.all(20),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'PHOTOS (OPTIONAL)',
                                style: TextStyle(
                                    fontSize: 11,
                                    color: Color(0xFF64748B),
                                    letterSpacing: 2),
                              ),
                              const SizedBox(height: 16),
                              GridView.builder(
                                shrinkWrap: true,
                                physics: const NeverScrollableScrollPhysics(),
                                gridDelegate:
                                const SliverGridDelegateWithFixedCrossAxisCount(
                                  crossAxisCount: 4,
                                  crossAxisSpacing: 12,
                                  mainAxisSpacing: 12,
                                ),
                                itemCount:
                                photos.length + (photos.length < 4 ? 1 : 0),
                                itemBuilder: (context, index) {
                                  if (index == photos.length) {
                                    return InkWell(
                                      onTap: _pickPhotos,
                                      borderRadius: BorderRadius.circular(12),
                                      child: Container(
                                        decoration: BoxDecoration(
                                          border: Border.all(
                                            color:
                                            Colors.white.withOpacity(0.4),
                                            style: BorderStyle.solid,
                                            width: 2,
                                            strokeAlign:
                                            BorderSide.strokeAlignOutside,
                                          ),
                                          borderRadius:
                                          BorderRadius.circular(12),
                                          color: Colors.white.withOpacity(0.05),
                                        ),
                                        child: const Column(
                                          mainAxisAlignment:
                                          MainAxisAlignment.center,
                                          children: [
                                            Icon(Icons.camera_alt,
                                                size: 32,
                                                color: Color(0xFF64748B)),
                                            SizedBox(height: 8),
                                            Text('Add',
                                                style: TextStyle(
                                                    fontSize: 12,
                                                    color: Color(0xFF64748B))),
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
                                              color: Colors.black54,
                                              shape: BoxShape.circle,
                                            ),
                                            child: const Icon(Icons.close,
                                                size: 16, color: Colors.white),
                                          ),
                                        ),
                                      ),
                                    ],
                                  );
                                },
                              ),
                            ],
                          ),
                        ),
                      ),

                      const SizedBox(height: 100), // Space for fixed button
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Fixed Submit Button
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: MissionColors.backgroundPrimary.withOpacity(0.9),
                border: Border(
                    top: BorderSide(color: Colors.white.withOpacity(0.1))),
              ),
              child: SafeArea(
                top: false,
                child: SizedBox(
                  height: 64,
                  child: ElevatedButton.icon(
                    onPressed: uploading ? null : _submitReport,
                    icon: uploading
                        ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                          strokeWidth: 2, color: Colors.white),
                    )
                        : const Icon(Icons.warning_amber, size: 24),
                    label: Text(
                      uploading
                          ? 'Uploading Photos...'
                          : 'Submit Incident Report',
                      style: const TextStyle(
                          fontSize: 16, fontWeight: FontWeight.w600),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.orange.withOpacity(0.9),
                      foregroundColor: Colors.white,
                      elevation: 20,
                      shadowColor: Colors.orange.withOpacity(0.6),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16)),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPlanet(double size, Color color) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: RadialGradient(
          colors: [
            color.withOpacity(0.5),
            color.withOpacity(0.2),
            Colors.transparent,
          ],
        ),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.4),
            blurRadius: 100,
            spreadRadius: 40,
          ),
        ],
      ),
    );
  }
}
