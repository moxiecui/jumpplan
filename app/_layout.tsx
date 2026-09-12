import { Stack } from 'expo-router';
import { TrainingProvider } from '@/training/TrainingProvider';

export default function RootLayout() {
  return <TrainingProvider><Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#f6f8fc' } }} /></TrainingProvider>;
}
