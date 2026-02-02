import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:ssl_delivery_ops/screens/settings_screen.dart';
import 'screens/splash_screen.dart';
import 'screens/login_screen.dart';
import 'screens/dashboard_screen.dart';
import 'screens/mission_list_screen.dart';
import 'screens/mission_detail_screen.dart';
import 'screens/mission_status_screen.dart';
import 'screens/incident_report_screen.dart';
import 'theme/mission_theme.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp])
      .then((_) {
    runApp(const SSLDeliveryOpsApp());
  });
}

class SSLDeliveryOpsApp extends StatelessWidget {
  const SSLDeliveryOpsApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'SSL Delivery Ops',
      debugShowCheckedModeBanner: false,
      theme: missionTheme,
      routerConfig: _router,
    );
  }
}

final GoRouter _router = GoRouter(
  routes: [
    GoRoute(path: '/',
        builder: (context, state) => const SplashScreen()),
    GoRoute(path: '/login',
        builder: (context, state) => LoginScreen()),
    GoRoute(
        path: '/dashboard',
        builder: (context, state) => const DashboardScreen()),
    GoRoute(
        path: '/missions',
        builder: (context, state) => const MissionListScreen()),
    GoRoute(
      path: '/mission/:id',
      builder: (context, state) =>
          MissionDetailScreen(id: state.pathParameters['id']!),
    ),
    GoRoute(
      path: '/mission/:id/status',
      builder: (context, state) =>
          MissionStatusScreen(id: state.pathParameters['id']!),
    ),
    GoRoute(
      path: '/mission/:id/incident',
      builder: (context, state) =>
          IncidentReportScreen(id: state.pathParameters['id']!),
    ),
    GoRoute(
      path: '/settings',
      builder: (context, state) => const SettingsScreen(),
    ),
  ],
  initialLocation: '/',
);
