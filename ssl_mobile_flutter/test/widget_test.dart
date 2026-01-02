import 'package:flutter_test/flutter_test.dart';
import '../lib/main.dart';

void main() {
  testWidgets('App builds without crashing', (WidgetTester tester) async {
    await tester.pumpWidget(const SSLDeliveryOpsApp());
    await tester.pumpAndSettle();
    expect(true, isTrue);
  });
}