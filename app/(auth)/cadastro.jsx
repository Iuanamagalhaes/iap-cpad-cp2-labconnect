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
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/ContextoAuth';
import Entrada from '../../components/Input';
import Botao from '../../components/Botao';
import { Cores } from '../../constants/cores';
import { useValidacao, Regras } from '../../hooks/useValidacao';

export default function Cadastro() {
  const roteador = useRouter();
  const { cadastrar } = useAuth();
  const [carregando, setCarregando] = useState(false);
  const [erroApi, setErroApi] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const animacaoFade = useRef(new Animated.Value(0)).current;
  const animacaoSlide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animacaoFade, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(animacaoSlide, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const { valores, erros, camposChacoalhando, definirValor, tocar, validar, redefinir } =
    useValidacao(
      { nome: '', email: '', senha: '', confirmaSenha: '' },
      {
        nome: [Regras.obrigatorio('Nome')],
        email: [Regras.obrigatorio('E-mail'), Regras.email()],
        senha: [Regras.obrigatorio('Senha'), Regras.tamanhoMinimo(6, 'Senha')],
        confirmaSenha: [
          Regras.obrigatorio('Confirmação de senha'),
          Regras.coincidir('senha', 'As senhas'),
        ],
      }
    );

  async function handleCadastro() {
    setErroApi('');
    if (!validar()) return;

    setCarregando(true);
    const resultado = await cadastrar({
      nome: valores.nome,
      email: valores.email,
      senha: valores.senha,
    });
    setCarregando(false);

    if (!resultado.sucesso) {
      setErroApi(resultado.erro);
      return;
    }

    setSucesso(true);
    redefinir();
    setTimeout(() => {
      roteador.replace('/(auth)/login');
    }, 2000);
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
          <TouchableOpacity style={estilos.botaoVoltar} onPress={() => roteador.back()}>
            <Image
              source={require('../../assets/seta-para-a-esquerda.png')}
              style={estilos.iconeVoltar}
            />
            <Text style={estilos.textoVoltar}>Voltar</Text>
          </TouchableOpacity>

          <Text style={estilos.titulo}>Criar Conta</Text>
          <Text style={estilos.subtitulo}>
            Preencha os dados abaixo para se cadastrar
          </Text>

          <View style={estilos.card}>
            <Entrada
              rotulo="Nome completo"
              placeholder="Ex.: João da Silva"
              value={valores.nome}
              onChangeText={(v) => definirValor('nome', v)}
              onBlur={() => tocar('nome')}
              erro={erros.nome}
              chacoalhar={camposChacoalhando.nome}
              autoCapitalize="words"
            />

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
            />

            <Entrada
              rotulo="Confirmar senha"
              placeholder="Repita sua senha"
              value={valores.confirmaSenha}
              onChangeText={(v) => definirValor('confirmaSenha', v)}
              onBlur={() => tocar('confirmaSenha')}
              erro={erros.confirmaSenha}
              chacoalhar={camposChacoalhando.confirmaSenha}
              secureTextEntry
            />

            {erroApi ? (
              <View style={estilos.caixaErroApi}>
                <Text style={estilos.textoErroApi}>{erroApi}</Text>
              </View>
            ) : null}

            {sucesso ? (
              <View style={estilos.caixaSucesso}>
                <Text style={estilos.textoSucesso}>
                  ✓ Cadastro realizado! Redirecionando para o login...
                </Text>
              </View>
            ) : null}

            <Botao
              titulo="Criar conta"
              aoPresionar={handleCadastro}
              carregando={carregando}
              desabilitado={sucesso}
              estilo={estilos.botaoCadastro}
            />
          </View>

          <View style={estilos.linhaLogin}>
            <Text style={estilos.textoLogin}>Já tem conta? </Text>
            <TouchableOpacity onPress={() => roteador.push('/(auth)/login')}>
              <Text style={estilos.linkLogin}>Fazer login</Text>
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
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },

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

  titulo: {
    color: Cores.primario,
    fontSize: 36,
    fontWeight: '900',
    marginBottom: 6,
  },
  subtitulo: {
    color: Cores.textoApagado,
    fontSize: 14,
    marginBottom: 28,
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
  caixaSucesso: {
    backgroundColor: Cores.fundoSucesso,
    borderRadius: 6,
    padding: 12,
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: Cores.sucesso,
  },
  textoSucesso: {
    color: Cores.sucesso,
    fontSize: 13,
    fontWeight: '600',
  },
  botaoCadastro: {
    marginTop: 20,
  },
  linhaLogin: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  textoLogin: {
    color: Cores.textoApagado,
    fontSize: 14,
  },
  linkLogin: {
    color: Cores.primario,
    fontSize: 14,
    fontWeight: '700',
  },
});
