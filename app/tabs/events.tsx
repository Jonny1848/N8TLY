import { View, Text } from 'react-native';
import { theme } from '../../constants/theme';

export default function EventsScreen() {
  return (
    <View className="flex-1 bg-white justify-center items-center">
      <Text 
        style={{ color: theme.colors.neutral.gray[900] }} 
        className="text-4xl font-bold"
      >
        Events
      </Text>
    </View>
  );
}