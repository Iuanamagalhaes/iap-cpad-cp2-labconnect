import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.titleSmall}>Bem-vindo ao</Text>
      <Text style={styles.title}>LABCONNECT</Text>
      <Text style={styles.subtitle}>
        Gerencie laboratórios, solicite software e reporte problemas.
      </Text>

      <TouchableOpacity style={styles.card} onPress={() => router.push('/laboratorios')}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>LABORATÓRIOS</Text>
          <Text style={styles.cardDesc}>Consulte horários e disponibilidade dos laboratórios</Text>
        </View>
        <Image source={require('../assets/laptop-computer.png')} style={styles.cardIcon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => router.push('/softwares')}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>SOFTWARES</Text>
          <Text style={styles.cardDesc}>Solicite a instalação de softwares para máquinas</Text>
        </View>
        <Image source={require('../assets/download.png')} style={styles.cardIcon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => router.push('/problemas')}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>PROBLEMAS</Text>
          <Text style={styles.cardDesc}>Informe problemas técnicos nos equipamentos</Text>
        </View>
        <Image source={require('../assets/warning.png')} style={styles.cardIcon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => router.push('/suporte')}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>SUPORTE</Text>
          <Text style={styles.cardDesc}>Solicite ajuda imediata do HelpCenter</Text>
        </View>
        <Image source={require('../assets/question.png')} style={styles.cardIcon} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  container: {
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  titleSmall: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '900',
  },
  title: {
    color: '#ED145B',
    fontSize: 42,
    fontWeight: '900',
    marginBottom: 10,
  },
  subtitle: {
    color: '#cccccc',
    marginBottom: 30,
    fontWeight: '300',
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111111',
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#ED145B',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    minHeight: 100,
  },
  cardContent: {
    flex: 1,
    paddingRight: 12,
  },
  cardTitle: {
    color: '#ED145B',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  cardDesc: {
    color: '#999999',
    fontSize: 13,
    lineHeight: 18,
    maxWidth: 220,
  },
  cardIcon: {
    width: 36,
    height: 36,
    tintColor: '#ED145B',
    resizeMode: 'contain',
  },
});