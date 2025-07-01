// This file ensures the root (/) route is defined for expo-router.
// It redirects to the tabs navigator.
import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/(tabs)/todos" />;
}
