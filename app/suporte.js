import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useRef, useEffect, useState } from 'react';
import { Animated } from 'react-native';
import Entrada from '../components/Entrada';
import Botao from '../components/Botao';
import Notificacao from '../components/Notificacao';
import { Cores } from '../constants/cores';
import { useValidacao, Regras } from '../hooks/useValidacao';

export default function Suporte() {
  const roteador = useRouter();
  const [mostrarSucesso, setMostrarSucesso] = useState(false);

  const animacaoOpacidade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(animacaoOpacidade, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  const { valores, erros, camposChacoalhando, definirValor, tocar, validar, redefinir } = useValidacao(
    { nome: '', sala: '', motivo: '' },
    {
      nome: [Regras.obrigatorio('Nome')],
      sala: [Regras.obrigatorio('Sala')],
    }
  );

  function handleEnviar() {
    if (!validar()) return;
    setMostrarSucesso(true);
    redefinir();
    setTimeout(() => setMostrarSucesso(false), 4000);
  }

  return (
    <KeyboardAvoidingView
      style={estilos.tela}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Animated.View style={[estilos.tela, { opacity: animacaoOpacidade }]}>
        <ScrollView
          style={estilos.scroll}
          contentContainerStyle={estilos.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Botão Voltar */}
          <TouchableOpacity style={estilos.botaoVoltar} onPress={() => roteador.back()}>
            <Image
              source={require('../assets/seta-para-a-esquerda.png')}
              style={estilos.iconeVoltar}
            />
            <Text style={estilos.textoVoltar}>Voltar</Text>
          </TouchableOpacity>

          <Text style={estilos.titulo}>Suporte Rápido</Text>
          <Text style={estilos.subtitulo}>Ajuda imediata</Text>

          <View style={estilos.avisoTempo}>
            <Text style={estilos.textoAviso}>
              Tempo médio de chegada:{' '}
              <Text style={estilos.textoAvisoDestaque}>10–15 minutos</Text>
            </Text>
          </View>

          <View style={estilos.cardFormulario}>
            <Text style={estilos.descricaoFormulario}>
              Preencha os dados abaixo e um técnico será enviado diretamente à sua sala.
            </Text>

            <Entrada
              rotulo="Seu nome"
              placeholder="Ex.: Prof. João Silva"
              value={valores.nome}
              onChangeText={(v) => definirValor('nome', v)}
              onBlur={() => tocar('nome')}
              erro={erros.nome}
              chacoalhar={camposChacoalhando.nome}
              autoCapitalize="words"
            />

            <Entrada
              rotulo="Sala atual"
              placeholder="Ex.: Sala 502"
              value={valores.sala}
              onChangeText={(v) => definirValor('sala', v)}
              onBlur={() => tocar('sala')}
              erro={erros.sala}
              chacoalhar={camposChacoalhando.sala}
            />

            <Entrada
              rotulo="Motivo (opcional)"
              placeholder="Descreva brevemente o que está acontecendo..."
              value={valores.motivo}
              onChangeText={(v) => definirValor('motivo', v)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={{ minHeight: 90, paddingTop: 12 }}
            />

            <Botao titulo="Chamar técnico agora" aoPresionar={handleEnviar} estilo={estilos.botaoEnviar} />
          </View>

          <View style={estilos.rodape}>
            <Text style={estilos.textoRodape}>
              Horário de atendimento do HelpCenter:{'\n'}
              <Text style={estilos.textoRodapeDestaque}>Segunda a Sexta, 08h00 – 18h30</Text>
            </Text>
          </View>
        </ScrollView>
      </Animated.View>

      <Notificacao
        visivel={mostrarSucesso}
        mensagem="Técnico acionado com sucesso!"
        sub="Nossa equipe está a caminho da sua sala."
        tipo="sucesso"
      />
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: Cores.fundo },
  scroll: { flex: 1 },
  container: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 60 },

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
  subtitulo: { color: Cores.textoApagado, fontSize: 14, marginBottom: 20 },

  avisoTempo: {
    backgroundColor: Cores.fundoAviso,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    padding: 14,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: Cores.destaque,
  },
  textoAviso: { color: Cores.textoApagado, fontSize: 13 },
  textoAvisoDestaque: { color: Cores.destaque, fontWeight: '700' },

  cardFormulario: {
    backgroundColor: Cores.superficie,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
    borderLeftWidth: 3,
    borderLeftColor: Cores.primario,
  },
  descricaoFormulario: { color: Cores.textoApagado, fontSize: 13, lineHeight: 19 },
  botaoEnviar: { marginTop: 20 },

  rodape: { marginTop: 28, alignItems: 'center' },
  textoRodape: { color: Cores.textoDesabilitado, fontSize: 12, textAlign: 'center', lineHeight: 20 },
  textoRodapeDestaque: { color: '#666', fontWeight: '700' },
});
