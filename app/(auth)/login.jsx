import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/ContextoAuth';
import Entrada from '../../components/Entrada';
import Botao from '../../components/Botao';
import { Cores } from '../../constants/cores';
import { useValidacao, Regras } from '../../hooks/useValidacao';

export default function Login() {
  const roteador = useRouter();
  const { login } = useAuth();
  const [carregando, setCarregando] = useState(false);
  const [erroApi, setErroApi] = useState('');

  const animacaoFade = useRef(new Animated.Value(0)).current;
  const animacaoSlide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animacaoFade, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(animacaoSlide, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const { valores, erros, camposChacoalhando, definirValor, tocar, validar } = useValidacao(
    { email: '', senha: '' },
    {
      email: [Regras.obrigatorio('E-mail'), Regras.email()],
      senha: [Regras.obrigatorio('Senha'), Regras.tamanhoMinimo(6, 'Senha')],
    }
  );

  async function handleLogin() {
    setErroApi('');
    if (!validar()) return;

    setCarregando(true);
    const resultado = await login({ email: valores.email, senha: valores.senha });
    setCarregando(false);

    if (!resultado.sucesso) {
      setErroApi(resultado.erro);
    }
  }

  return (
    <KeyboardAvoidingView
      style={estilos.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={estilos.scroll}
        contentContainerStyle={estilos.container}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View
          style={{ opacity: animacaoFade, transform: [{ translateY: animacaoSlide }] }}
        >
          <Text style={estilos.bemVindo}>Bem-vindo ao</Text>
          <Text style={estilos.titulo}>LABCONNECT</Text>
          <Text style={estilos.subtitulo}>Faça login para continuar</Text>

          <View style={estilos.card}>
            <Entrada
              rotulo="E-mail"
              placeholder="seu@email.com"
              value={valores.email}
              onChangeText={(v) => definirValor('email', v)}
              onBlur={() => tocar('email')}
              erro={erros.email}
              chacoalhar={camposChacoalhando.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Entrada
              rotulo="Senha"
              placeholder="Mínimo 6 caracteres"
              value={valores.senha}
              onChangeText={(v) => definirValor('senha', v)}
              onBlur={() => tocar('senha')}
              erro={erros.senha}
              chacoalhar={camposChacoalhando.senha}
              secureTextEntry
              estiloContainer={{ marginTop: 4 }}
            />

            {erroApi ? (
              <View style={estilos.caixaErroApi}>
                <Text style={estilos.textoErroApi}>{erroApi}</Text>
              </View>
            ) : null}

            <Botao
              titulo="Entrar"
              aoPresionar={handleLogin}
              carregando={carregando}
              estilo={estilos.botaoLogin}
            />
          </View>

          <View style={estilos.linhaCadastro}>
            <Text style={estilos.textoCadastro}>Não tem conta? </Text>
            <TouchableOpacity onPress={() => roteador.push('/(auth)/cadastro')}>
              <Text style={estilos.linkCadastro}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Cores.fundo },
  scroll: { flex: 1 },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  bemVindo: {
    color: Cores.textoPrimario,
    fontSize: 22,
    fontWeight: '900',
  },
  titulo: {
    color: Cores.primario,
    fontSize: 42,
    fontWeight: '900',
    marginBottom: 8,
  },
  subtitulo: {
    color: Cores.textoApagado,
    fontSize: 14,
    marginBottom: 32,
    fontWeight: '300',
  },
  card: {
    backgroundColor: Cores.superficie,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: Cores.primario,
  },
  caixaErroApi: {
    backgroundColor: Cores.fundoErro,
    borderRadius: 6,
    padding: 12,
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: Cores.erro,
  },
  textoErroApi: {
    color: Cores.erro,
    fontSize: 13,
    fontWeight: '600',
  },
  botaoLogin: {
    marginTop: 20,
  },
  linhaCadastro: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  textoCadastro: {
    color: Cores.textoApagado,
    fontSize: 14,
  },
  linkCadastro: {
    color: Cores.primario,
    fontSize: 14,
    fontWeight: '700',
  },
});