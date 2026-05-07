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

export default function Suporte() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [sala, setSala] = useState('');
  const [andar, setAndar] = useState('');
  const [motivo, setMotivo] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  function handleEnviar() {
    if (!nome.trim() || !sala.trim()) return;
    setShowSuccess(true);
    setNome(''); setSala(''); setAndar(''); setMotivo('');
    setTimeout(() => setShowSuccess(false), 4000);
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Suporte Rápido</Text>
        <Text style={styles.subtitle}>Ajuda imediata</Text>

        <View style={styles.infoBanner}>
          <Text style={styles.infoBannerText}>
            Tempo médio de chegada:{' '}
            <Text style={styles.infoBannerHighlight}>10–15 minutos</Text>
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.cardDesc}>
            Preencha os dados abaixo e um técnico será enviado diretamente à sua sala.
          </Text>

          <Text style={styles.label}>Seu nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex.: Prof. João Silva"
            placeholderTextColor="#444"
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.label}>Sala atual</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex.: Sala 502"
            placeholderTextColor="#444"
            value={sala}
            onChangeText={setSala}
          />

          <Text style={styles.label}>Motivo</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descreva brevemente o que está acontecendo..."
            placeholderTextColor="#444"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={motivo}
            onChangeText={setMotivo}
          />

          <TouchableOpacity style={styles.submitBtn} onPress={handleEnviar}>
            <Text style={styles.submitBtnText}>Chamar técnico agora</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Horário de atendimento do HelpCenter:{'\n'}
            <Text style={styles.footerHighlight}>Segunda a Sexta, 08h00 – 18h30</Text>
          </Text>
        </View>
      </ScrollView>

      {showSuccess && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>Técnico acionado com sucesso!</Text>
          <Text style={styles.toastSub}>Nossa equipe está a caminho da sua sala.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#0a0a0a' },
  scroll: { flex: 1 },
  container: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 60 },

  backBtn: {
    backgroundColor: '#ED145B',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginBottom: 28,
  },
  backText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  title: { color: '#ED145B', fontSize: 34, fontWeight: '900', marginBottom: 4 },
  subtitle: { color: '#888', fontSize: 14, marginBottom: 20 },

  infoBanner: {
    backgroundColor: '#1e1a10',
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    padding: 14,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#f59e0b',
  },
  infoBannerText: { color: '#aaa', fontSize: 13 },
  infoBannerHighlight: { color: '#f59e0b', fontWeight: '700' },

  formCard: {
    backgroundColor: '#141414',
      borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#ED145B',
  },
  cardDesc: { color: '#777', fontSize: 13, lineHeight: 19 },

  label: { color: '#ccc', fontSize: 13, fontWeight: '600', marginBottom: 8, marginTop: 14 },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 6,
    color: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#252525',
  },
  textArea: { minHeight: 90, paddingTop: 12 },

  submitBtn: {
    backgroundColor: '#ED145B',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  submitBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  footer: { marginTop: 28, alignItems: 'center' },
  footerText: { color: '#444', fontSize: 12, textAlign: 'center', lineHeight: 20 },
  footerHighlight: { color: '#666', fontWeight: '700' },

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
  },
  toastText: { color: '#22c55e', fontWeight: '700', fontSize: 14, marginBottom: 4 },
  toastSub: { color: '#5a9a6a', fontSize: 12 },
});