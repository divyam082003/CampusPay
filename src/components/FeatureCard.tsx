import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type FeatureCardProps = {
  title: string;
  onPress?: () => void;
};

export default function FeatureCard({
  title,
  onPress,
}: FeatureCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
    >
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,

    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,

    elevation: 3,
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
  },
});