import 'package:flutter/material.dart';
import 'mission_colors.dart';

final TextTheme missionTextTheme = const TextTheme(
  displayLarge:
  TextStyle(fontSize: 56, fontWeight: FontWeight.w700, letterSpacing: 1.0),
  displayMedium: TextStyle(fontSize: 42, fontWeight: FontWeight.w600),
  displaySmall: TextStyle(fontSize: 32, fontWeight: FontWeight.w600),
  headlineLarge:
  TextStyle(fontSize: 28, fontWeight: FontWeight.w700, letterSpacing: 0.5),
  headlineMedium: TextStyle(fontSize: 24, fontWeight: FontWeight.w600),
  headlineSmall: TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
  titleLarge: TextStyle(fontSize: 20, fontWeight: FontWeight.w700),
  titleMedium: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
  titleSmall: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
  bodyLarge: TextStyle(fontSize: 18, fontWeight: FontWeight.w400),
  bodyMedium: TextStyle(fontSize: 16, fontWeight: FontWeight.w400),
  bodySmall: TextStyle(fontSize: 14, fontWeight: FontWeight.w400),
  labelLarge:
  TextStyle(fontSize: 18, fontWeight: FontWeight.w600, letterSpacing: 1.8),
  labelMedium:
  TextStyle(fontSize: 16, fontWeight: FontWeight.w600, letterSpacing: 1.4),
  labelSmall:
  TextStyle(fontSize: 14, fontWeight: FontWeight.w500, letterSpacing: 1.0),
);

final ThemeData missionTheme = ThemeData(
  useMaterial3: true,
  brightness: Brightness.dark,
  colorScheme: const ColorScheme.dark(
    primary: MissionColors.accentPrimary,
    secondary: MissionColors.accentSecondary,
    surface: Colors.transparent, // We use custom glass cards
    background: MissionColors.backgroundPrimary,
    error: MissionColors.critical,
  ),
  scaffoldBackgroundColor: MissionColors.backgroundPrimary,
  textTheme: missionTextTheme,
  appBarTheme: const AppBarTheme(
    backgroundColor: Colors.transparent,
    elevation: 0,
    foregroundColor: MissionColors.textPrimary,
    centerTitle: true,
  ),
  cardTheme: CardThemeData(
    color: Colors.transparent,
    shadowColor: Colors.black.withOpacity(0.6),
    elevation: 20,
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
    clipBehavior: Clip.antiAlias,
  ),
);
