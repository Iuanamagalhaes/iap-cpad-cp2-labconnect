import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import { useAuth } from '../context/ContextoAuth';
import { Cores } from '../constants/cores';

export default function PaginaInicial() {
  const roteador = useRouter();
  const { usuario, sair } = useAuth();

  const animacaoOpacidade = useRef(new Animated.Value(0)).current;
  const animacaoSlide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animacaoOpacidade, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(animacaoSlide, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const primeiroNome = usuario?.nome?.split(' ')[0] || 'Usuário';

  return (
    <ScrollView style={estilos.scroll} contentContainerStyle={estilos.container}>
      <Animated.View style={{ opacity: animacaoOpacidade, transform: [{ translateY: animacaoSlide }] }}>
        <View style={estilos.cabecalho}>
          <View style={estilos.saudacaoLinha}>
            <Image
              source={require('../assets/aluno.png')}
              style={estilos.iconeAluno}
            />
            <View>
              <Text style={estilos.saudacaoTitulo}>Bem-vindo (a),</Text>
              <Text style={estilos.nomeUsuario}>{primeiroNome}</Text>
            </View>
          </View>
          <TouchableOpacity style={estilos.botaoSair} onPress={sair}>
            <Text style={estilos.textoBotaoSair}>Sair</Text>
          </TouchableOpacity>
        </View>

        <Text style={estilos.titulo}>LABCONNECT</Text>
        <Text style={estilos.subtitulo}>
          Gerencie laboratórios, solicite software e reporte problemas.
        </Text>

        <TouchableOpacity style={estilos.card} onPress={() => roteador.push('/laboratorios')}>
          <View style={estilos.cardConteudo}>
            <Text style={estilos.cardTitulo}>LABORATÓRIOS</Text>
            <Text style={estilos.cardDescricao}>Consulte horários e disponibilidade dos laboratórios</Text>
          </View>
          <Image source={require('../assets/laptop-computer.png')} style={estilos.cardIcone} />
        </TouchableOpacity>

        <TouchableOpacity style={estilos.card} onPress={() => roteador.push('/softwares')}>
          <View style={estilos.cardConteudo}>
            <Text style={estilos.cardTitulo}>SOFTWARES</Text>
            <Text style={estilos.cardDescricao}>Solicite a instalação de softwares para máquinas</Text>
          </View>
          <Image source={require('../assets/download.png')} style={estilos.cardIcone} />
        </TouchableOpacity>

        <TouchableOpacity style={estilos.card} onPress={() => roteador.push('/problemas')}>
          <View style={estilos.cardConteudo}>
            <Text style={estilos.cardTitulo}>PROBLEMAS</Text>
            <Text style={estilos.cardDescricao}>Informe problemas técnicos nos equipamentos</Text>
          </View>
          <Image source={require('../assets/warning.png')} style={estilos.cardIcone} />
        </TouchableOpacity>

        <TouchableOpacity style={estilos.card} onPress={() => roteador.push('/suporte')}>
          <View style={estilos.cardConteudo}>
            <Text style={estilos.cardTitulo}>SUPORTE</Text>
            <Text style={estilos.cardDescricao}>Solicite ajuda imediata do HelpCenter</Text>
          </View>
          <Image source={require('../assets/question.png')} style={estilos.cardIcone} />
        </TouchableOpacity>

      </Animated.View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: Cores.fundo,
  },
  container: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  saudacaoLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconeAluno: {
    width: 40,
    height: 40,
    resizeMode: 'contain'
  },
  saudacaoTitulo: {
    color: Cores.textoSecundario,
    fontSize: 13,
    fontWeight: '400',
  },
  nomeUsuario: {
    color: Cores.textoPrimario,
    fontSize: 18,
    fontWeight: '700',
  },
  botaoSair: {
    backgroundColor: Cores.superficie,
    borderWidth: 1,
    borderColor: Cores.primario,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  textoBotaoSair: {
    color: Cores.primario,
    fontWeight: '700',
    fontSize: 13,
  },
  titulo: {
    color: Cores.primario,
    fontSize: 42,
    fontWeight: '900',
    marginBottom: 10,
  },
  subtitulo: {
    color: Cores.textoApagado,
    marginBottom: 30,
    fontWeight: '300',
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Cores.superficie,
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: Cores.primario,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    minHeight: 100,
  },
  cardConteudo: {
    flex: 1,
    paddingRight: 12,
  },
  cardTitulo: {
    color: Cores.primario,
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  cardDescricao: {
    color: Cores.textoApagado,
    fontSize: 13,
    lineHeight: 18,
    maxWidth: 220,
  },
  cardIcone: {
    width: 36,
    height: 36,
    tintColor: Cores.primario,
    resizeMode: 'contain',
  },
});