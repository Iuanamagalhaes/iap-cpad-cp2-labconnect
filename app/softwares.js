import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

const STATUS_COLORS = {
  Pendente: '#ED145B',
  Concluído: '#22c55e',
  'Em andamento': '#f59e0b',
};

const initialLista = [
  { nome: 'Android Studio', sala: 'Sala 502', status: 'Pendente' },
  { nome: 'VS Code', sala: 'Sala 103', status: 'Concluído' },
  { nome: 'MATLAB', sala: 'Sala 301', status: 'Em andamento' },
  { nome: 'AutoCAD', sala: 'Sala 210', status: 'Concluído' },
  { nome: 'Python', sala: 'Sala 405', status: 'Pendente' },
  { nome: 'Arduino IDE', sala: 'Sala 602', status: 'Concluído' },
];

export default function Softwares() {
  const router = useRouter();
  const [lista, setLista] = useState(initialLista);
  const [showForm, setShowForm] = useState(false);
  const [nomeSoftware, setNomeSoftware] = useState('');
  const [sala, setSala] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  function handleEnviar() {
    if (!nomeSoftware.trim() || !sala.trim()) return;
    const nova = { nome: nomeSoftware.trim(), sala: sala.trim(), status: 'Pendente' };
    setLista([nova, ...lista]);
    setNomeSoftware('');
    setSala('');
    setShowForm(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Instalação de{'\n'}Software</Text>
        <Text style={styles.subtitle}>Solicite a instalação de softwares para o andamento das aulas</Text>

        <TouchableOpacity style={styles.newBtn} onPress={() => setShowForm(!showForm)}>
          <Text style={styles.newBtnText}>+ Nova Solicitação</Text>
        </TouchableOpacity>

        {showForm && (
          <View style={styles.formCard}>
            <Text style={styles.label}>Nome do Software</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex.: AutoCAD, MATLAB..."
              placeholderTextColor="#555"
              value={nomeSoftware}
              onChangeText={setNomeSoftware}
            />
            <Text style={styles.label}>Sala</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex.: 501"
              placeholderTextColor="#555"
              value={sala}
              onChangeText={setSala}
            />
            <TouchableOpacity style={styles.submitBtn} onPress={handleEnviar}>
              <Text style={styles.submitBtnText}>Enviar solicitação</Text>
            </TouchableOpacity>
          </View>
        )}

        {lista.map((item, index) => (
          <View key={index} style={styles.card}>
            <View>
              <Text style={styles.cardTitle}>{item.nome}</Text>
              <Text style={styles.cardSala}>{item.sala}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] || '#555' }]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {showSuccess && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>Solicitação enviada com sucesso!</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#0a0a0a' },
  scroll: { flex: 1 },
  container: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 40 },

  backBtn: {
    backgroundColor: '#ED145B',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginBottom: 28,
  },
  backText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  title: { color: '#ED145B', fontSize: 32, fontWeight: '900', lineHeight: 38, marginBottom: 8 },
  subtitle: { color: '#aaa', fontSize: 13, marginBottom: 24, lineHeight: 18 },

  newBtn: {
    backgroundColor: '#ED145B',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
  },
  newBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  formCard: {
    backgroundColor: '#141414',
    borderBottomRightRadius: 10,
    borderTopightRadius: 10,
    padding: 18,
    marginBottom: 24,
    borderLeftWidth: 3,
    borderLeftColor: '#ED145B',
  },
  label: { color: '#ccc', fontSize: 13, marginBottom: 6, marginTop: 10 },
  input: {
    backgroundColor: '#1e1e1e',
    borderRadius: 6,
    color: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  submitBtn: {
    backgroundColor: '#ED145B',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
  },
  submitBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  card: {
    backgroundColor: '#141414',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: { color: '#fff', fontWeight: '700', fontSize: 15, marginBottom: 3 },
  cardSala: { color: '#777', fontSize: 12 },
  statusBadge: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: { color: '#fff', fontSize: 11, fontWeight: '700' },

  toast: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: '#1a3a2a',
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#22c55e',
    alignItems: 'center',
  },
  toastText: { color: '#22c55e', fontWeight: '700', fontSize: 14 },
});