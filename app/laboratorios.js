import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import { Cores } from '../constants/cores';

const laboratorios = [
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
      SEXTA: [{ disciplina: 'Object-Oriented Programming', professor: 'Prof. Ygor Moraes Martins dos Anjos', inicio: '08:00', fim: '09:40' }],
    },
  },
];

export default function Laboratorios() {
  const roteador = useRouter();
  const [labSelecionado, setLabSelecionado] = useState(laboratorios[0]);

  const animacaoOpacidade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(animacaoOpacidade, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.ScrollView
      style={[estilos.scroll, { opacity: animacaoOpacidade }]}
      contentContainerStyle={estilos.container}
    >
      <TouchableOpacity style={estilos.botaoVoltar} onPress={() => roteador.back()}>
        <Image
          source={require('../assets/seta-para-a-esquerda.png')}
          style={estilos.iconeVoltar}
        />
        <Text style={estilos.textoVoltar}>Voltar</Text>
      </TouchableOpacity>

      <Text style={estilos.titulo}>Laboratórios</Text>
      <Text style={estilos.subtitulo}>Consulte a disponibilidade</Text>

      {laboratorios.map((lab, indice) => {
        const estaSelecionado = lab.nome === labSelecionado.nome;
        const corStatus = lab.status === 'Disponível' ? Cores.sucesso : Cores.erro;
        return (
          <TouchableOpacity
            key={indice}
            style={[estilos.cardLab, estaSelecionado && estilos.cardLabSelecionado]}
            onPress={() => setLabSelecionado(lab)}
          >
            <View style={estilos.ladoEsquerdoCard}>
              <Image source={require('../assets/lab-icon.png')} style={estilos.iconeLab} />
              <View>
                <Text style={estilos.nomeLab}>{lab.nome}</Text>
                <Text style={estilos.localizacaoLab}>{lab.andar} · {lab.sala}</Text>
              </View>
            </View>
            <View style={[estilos.badgeStatus, { backgroundColor: corStatus }]}>
              <Text style={estilos.textoStatus}>{lab.status}</Text>
            </View>
          </TouchableOpacity>
        );
      })}

      <Text style={estilos.tituloAgenda}>Agenda - {labSelecionado.nome}</Text>
      <Text style={estilos.localizacaoAgenda}>{labSelecionado.andar} · {labSelecionado.sala}</Text>

      {Object.entries(labSelecionado.agenda).map(([dia, aulas]) => (
        <View key={dia} style={estilos.blocoDia}>
          <Text style={estilos.nomeDia}>{dia}</Text>
          {aulas.length === 0 ? (
            <View style={estilos.cardAula}>
              <Text style={estilos.semAula}>Sem agendamentos{'\n'}até o momento.</Text>
            </View>
          ) : (
            aulas.map((aula, j) => (
              <View key={j} style={estilos.cardAula}>
                <View style={estilos.bordaAula} />
                <View style={estilos.infoAula}>
                  <Text style={estilos.disciplinaAula}>{aula.disciplina}</Text>
                  <Text style={estilos.professorAula}>{aula.professor}</Text>
                </View>
                <View style={estilos.horarioAula}>
                  <Text style={estilos.textoHorario}>{aula.inicio} - {aula.fim}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      ))}
    </Animated.ScrollView>
  );
}

const estilos = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Cores.fundo },
  container: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 50 },

  botaoVoltar: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 28,
    gap: 8,
  },
  iconeVoltar: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  textoVoltar: { color: Cores.primario, fontWeight: '700', fontSize: 14 },

  titulo: { color: Cores.primario, fontSize: 34, fontWeight: '900', marginBottom: 4 },
  subtitulo: { color: Cores.textoApagado, fontSize: 14, marginBottom: 24 },

  cardLab: {
    backgroundColor: Cores.superficie,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardLabSelecionado: { borderWidth: 1, borderColor: Cores.primario },
  ladoEsquerdoCard: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  nomeLab: { color: Cores.textoPrimario, fontWeight: '700', fontSize: 14 },
  localizacaoLab: { color: Cores.textoApagado, fontSize: 12, marginTop: 2 },
  badgeStatus: { borderRadius: 4, paddingHorizontal: 8, paddingVertical: 4 },
  textoStatus: { color: '#fff', fontSize: 11, fontWeight: '700' },

  tituloAgenda: { color: Cores.textoPrimario, fontWeight: '900', fontSize: 18, marginTop: 24, marginBottom: 2 },
  localizacaoAgenda: { color: Cores.textoApagado, fontSize: 12, marginBottom: 20 },

  blocoDia: { marginBottom: 16 },
  nomeDia: { color: Cores.primario, fontWeight: '700', fontSize: 12, letterSpacing: 1, marginBottom: 8 },

  cardAula: {
    backgroundColor: Cores.superficie,
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bordaAula: { width: 3, height: '100%', backgroundColor: Cores.primario, borderRadius: 2, marginRight: 12, minHeight: 36 },
  infoAula: { flex: 1 },
  disciplinaAula: { color: Cores.textoPrimario, fontWeight: '700', fontSize: 13 },
  professorAula: { color: Cores.textoApagado, fontSize: 12, marginTop: 2 },
  horarioAula: { backgroundColor: Cores.superficieAlternativa, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 4 },
  textoHorario: { color: Cores.primario, fontSize: 11, fontWeight: '700' },
  semAula: { color: '#666', fontSize: 13, lineHeight: 20 },
  iconeLab: { width: 28, height: 28, resizeMode: 'contain' },
});