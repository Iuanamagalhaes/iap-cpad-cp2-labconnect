import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

const equipamentos = ['Computador', 'Projetor', 'Ar-condicionado', 'Impressora', 'Monitor', 'Outro'];

const problemasIniciais = [
  { equipamento: 'Projetor', local: 'Sala 301', descricao: 'Sem sinal de imagem', status: 'Em análise' },
  { equipamento: 'Computador', local: 'Sala 210', descricao: 'Não liga', status: 'Resolvido' },
  { equipamento: 'Ar-condicionado', local: 'Sala 502', descricao: 'Não liga', status: 'Pendente' },
];

const STATUS_COLORS = { Pendente: '#ED145B', 'Em análise': '#f59e0b', Resolvido: '#22c55e' };

export default function Problemas() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [equipamento, setEquipamento] = useState(null);
  const [local, setLocal] = useState('');
  const [descricao, setDescricao] = useState('');
  const [lista, setLista] = useState(problemasIniciais);
  const [showSuccess, setShowSuccess] = useState(false);

  function handleEnviar() {
    if (!equipamento || !local.trim()) return;
    setLista([{ equipamento, local: local.trim(), descricao: descricao.trim(), status: 'Pendente' }, ...lista]);
    setEquipamento(null);
    setLocal('');
    setDescricao('');
    setShowForm(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3500);
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Problemas</Text>
        <Text style={styles.subtitle}>Informe problemas técnicos nos equipamentos</Text>

        <TouchableOpacity style={styles.newBtn} onPress={() => setShowForm(!showForm)}>
          <Text style={styles.newBtnText}>+ Relatar Problema</Text>
        </TouchableOpacity>

        {showForm && (
          <View style={styles.formCard}>
            <Text style={styles.label}>Equipamento</Text>
            <View style={styles.grid}>
              {equipamentos.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[styles.tipoBtn, equipamento === item && styles.tipoBtnActive]}
                  onPress={() => setEquipamento(item)}
                >
                  <Text style={[styles.tipoBtnText, equipamento === item && styles.tipoBtnTextActive]}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.label}>Local</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex.: 3º Andar, Sala 305"
              placeholderTextColor="#444"
              value={local}
              onChangeText={setLocal}
            />
            <Text style={styles.label}>Descrição do problema</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descreva o que está acontecendo..."
              placeholderTextColor="#444"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              value={descricao}
              onChangeText={setDescricao}
            />
            <TouchableOpacity style={styles.submitBtn} onPress={handleEnviar}>
              <Text style={styles.submitBtnText}>Enviar relato</Text>
            </TouchableOpacity>
          </View>
        )}

        {lista.map((item, i) => (
          <View key={i} style={styles.card}>
            <View style={styles.cardLeft}>
              <Text style={styles.cardEquip}>{item.equipamento}</Text>
              <Text style={styles.cardLocal}>{item.local}</Text>
              {!!item.descricao && <Text style={styles.cardDesc}>{item.descricao}</Text>}
            </View>
            <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] || '#555' }]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {showSuccess && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>Problema relatado com sucesso!</Text>
          <Text style={styles.toastSub}>Nossa equipe técnica foi notificada.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#0a0a0a' },
  scroll: { flex: 1 },
  container: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 50 },
  backBtn: { backgroundColor: '#ED145B', alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6, marginBottom: 28 },
  backText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  title: { color: '#ED145B', fontSize: 34, fontWeight: '900', marginBottom: 4 },
  subtitle: { color: '#888', fontSize: 14, marginBottom: 24 },
  newBtn: { backgroundColor: '#ED145B', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginBottom: 20, alignSelf: 'flex-start', paddingHorizontal: 20 },
  newBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  formCard: { backgroundColor: '#141414', borderBottomRightRadius: 10, borderTopRightRadius: 10, padding: 18, marginBottom: 24, borderLeftWidth: 3, borderLeftColor: '#ED145B' },
  label: { color: '#ccc', fontSize: 13, fontWeight: '600', marginBottom: 8, marginTop: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  tipoBtn: { backgroundColor: '#1e1e1e', borderRadius: 6, paddingVertical: 10, paddingHorizontal: 12, borderWidth: 1, borderColor: '#2a2a2a', marginBottom: 4 },
  tipoBtnActive: { backgroundColor: '#ED145B', borderColor: '#ED145B' },
  tipoBtnText: { color: '#aaa', fontWeight: '600', fontSize: 13 },
  tipoBtnTextActive: { color: '#fff' },
  input: { backgroundColor: '#1a1a1a', borderRadius: 6, color: '#fff', paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, borderWidth: 1, borderColor: '#252525' },
  textArea: { minHeight: 70, paddingTop: 10 },
  submitBtn: { backgroundColor: '#ED145B', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 16 },
  submitBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  card: { backgroundColor: '#141414', borderRadius: 8, padding: 16, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardLeft: { flex: 1, paddingRight: 10 },
  cardEquip: { color: '#fff', fontWeight: '700', fontSize: 15, marginBottom: 2 },
  cardLocal: { color: '#777', fontSize: 12, marginBottom: 4 },
  cardDesc: { color: '#999', fontSize: 12 },
  statusBadge: { borderRadius: 4, paddingHorizontal: 8, paddingVertical: 4 },
  statusText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  toast: { position: 'absolute', bottom: 40, left: 20, right: 20, backgroundColor: '#1a3a2a', borderBottomRightRadius: 10, borderTopRightRadius: 10, paddingVertical: 16, paddingHorizontal: 20, borderLeftWidth: 4, borderLeftColor: '#22c55e' },
  toastText: { color: '#22c55e', fontWeight: '700', fontSize: 14, marginBottom: 4 },
  toastSub: { color: '#5a9a6a', fontSize: 12 },
});