import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

const labs = [
  {
    nome: 'Laboratório Maker',
    andar: '6º Andar',
    sala: 'Sala 602',
    status: 'Indisponível',
    agenda: {
      SEGUNDA: [{ disciplina: 'Edge Computing', professor: 'Prof. Lucas Gomes Moreira', inicio: '08:00', fim: '09:40' }],
      TERÇA: [{ disciplina: 'Edge Computing', professor: 'Prof. Lucas Gomes Moreira', inicio: '08:00', fim: '09:40' }],
      QUARTA: [{ disciplina: 'Edge Computing', professor: 'Prof. Lucas Gomes Moreira', inicio: '08:00', fim: '09:40' }],
      QUINTA: [{ disciplina: 'Robótica', professor: 'Prof. Fernando Nascimento da Silva', inicio: '19:00', fim: '20:40' }],
      SEXTA: [{ disciplina: 'IoT Avançado', professor: 'Prof. Victor Ribeiro Fernandes', inicio: '19:00', fim: '20:40' }],
    },
  },
  {
    nome: 'Laboratório MAC',
    andar: '3º Andar',
    sala: 'Sala 305',
    status: 'Disponível',
    agenda: {
      SEGUNDA: [{ disciplina: 'Cross-Plataform Application Development', professor: 'Prof. Hercules Lima Ramos', inicio: '10:00', fim: '11:40' }],
      TERÇA: [],
      QUARTA: [{ disciplina: 'Data Science and Analytics', professor: 'Prof. Roberto Gutierrez Beraldo', inicio: '08:00', fim: '09:40' }],
      QUINTA: [],
      SEXTA: [{ disciplina: 'Object-Oriented Programind', professor: 'Prof. Ygor Moraes Martins dos Anjos', inicio: '08:00', fim: '09:40' }],
    },
  }
];

export default function Laboratorios() {
  const router = useRouter();
  const [selectedLab, setSelectedLab] = useState(labs[0]);

  const statusColor = selectedLab.status === 'Disponível' ? '#22c55e' : '#ED145B';

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Laboratórios</Text>
      <Text style={styles.subtitle}>Consulte a disponibilidade</Text>

      {labs.map((lab, i) => {
        const isSelected = lab.nome === selectedLab.nome;
        const sc = lab.status === 'Disponível' ? '#22c55e' : '#ED145B';
        return (
          <TouchableOpacity
            key={i}
            style={[styles.labCard, isSelected && styles.labCardSelected]}
            onPress={() => setSelectedLab(lab)}
          >
            <View style={styles.labCardLeft}>
              <Image source={require('../assets/lab-icon.png')} style={styles.labIcon} />
              <View>
                <Text style={styles.labNome}>{lab.nome}</Text>
                <Text style={styles.labLoc}>{lab.andar} · {lab.sala}</Text>
              </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: sc }]}>
              <Text style={styles.statusText}>{lab.status}</Text>
            </View>
          </TouchableOpacity>
        );
      })}

      <Text style={styles.agendaTitle}>Agenda - {selectedLab.nome}</Text>
      <Text style={styles.agendaLoc}>{selectedLab.andar} · {selectedLab.sala}</Text>

      {Object.entries(selectedLab.agenda).map(([dia, aulas]) => (
        <View key={dia} style={styles.diaBlock}>
          <Text style={styles.diaNome}>{dia}</Text>
          {aulas.length === 0 ? (
            <View style={styles.aulaCard}>
              <Text style={styles.semAula}>Sem agendamentos{'\n'}até o momento.</Text>
            </View>
          ) : (
            aulas.map((aula, j) => (
              <View key={j} style={styles.aulaCard}>
                <View style={styles.aulaBorder} />
                <View style={styles.aulaInfo}>
                  <Text style={styles.aulaDisciplina}>{aula.disciplina}</Text>
                  <Text style={styles.aulaProf}>{aula.professor}</Text>
                </View>
                <View style={styles.aulaHorario}>
                  <Text style={styles.aulaHorarioText}>{aula.inicio} - {aula.fim}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#0a0a0a' },
  container: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 50 },

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
  subtitle: { color: '#888', fontSize: 14, marginBottom: 24 },

  labCard: {
    backgroundColor: '#141414',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labCardSelected: {
    borderWidth: 1,
    borderColor: '#ED145B',
  },
  labCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  labNome: { color: '#fff', fontWeight: '700', fontSize: 14 },
  labLoc: { color: '#777', fontSize: 12, marginTop: 2 },
  statusBadge: { borderRadius: 4, paddingHorizontal: 8, paddingVertical: 4 },
  statusText: { color: '#fff', fontSize: 11, fontWeight: '700' },

  agendaTitle: { color: '#fff', fontWeight: '900', fontSize: 18, marginTop: 24, marginBottom: 2 },
  agendaLoc: { color: '#777', fontSize: 12, marginBottom: 20 },

  diaBlock: { marginBottom: 16 },
  diaNome: { color: '#ED145B', fontWeight: '700', fontSize: 12, letterSpacing: 1, marginBottom: 8 },

  aulaCard: {
    backgroundColor: '#141414',
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  aulaBorder: {
    width: 3,
    height: '100%',
    backgroundColor: '#ED145B',
    borderRadius: 2,
    marginRight: 12,
    minHeight: 36,
  },
  aulaInfo: { flex: 1 },
  aulaDisciplina: { color: '#fff', fontWeight: '700', fontSize: 13 },
  aulaProf: { color: '#777', fontSize: 12, marginTop: 2 },
  aulaHorario: {
    backgroundColor: '#1e1e1e',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  aulaHorarioText: { color: '#ED145B', fontSize: 11, fontWeight: '700' },
  semAula: { color: '#666', fontSize: 13, lineHeight: 20 },
});