import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import { useDadosApp } from '../context/ContextoDadosApp';
import Entrada from '../components/Entrada';
import Botao from '../components/Botao';
import Notificacao from '../components/Notificacao';
import BarraDeBusca from '../components/BarraDeBusca';
import ListaVazia from '../components/ListaVazia';
import { Cores } from '../constants/cores';
import { useValidacao, Regras } from '../hooks/useValidacao';

const listaEquipamentos = ['Computador', 'Projetor', 'Ar-condicionado', 'Impressora', 'Monitor', 'Outro'];
const CORES_STATUS = { Pendente: Cores.erro, 'Em análise': Cores.destaque, Resolvido: Cores.sucesso };

export default function Problemas() {
  const roteador = useRouter();
  const { problemas, carregandoProblemas, adicionarProblema } = useDadosApp();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [equipamentoSelecionado, setEquipamentoSelecionado] = useState(null);
  const [erroEquipamento, setErroEquipamento] = useState('');
  const [mostrarSucesso, setMostrarSucesso] = useState(false);
  const [textoBusca, setTextoBusca] = useState('');

  const animacaoOpacidade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(animacaoOpacidade, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  const { valores, erros, camposChacoalhando, definirValor, tocar, validar, redefinir } = useValidacao(
    { local: '', descricao: '' },
    {
      local: [Regras.obrigatorio('Local')],
    }
  );

  // Filtragem em tempo real
  const listaFiltrada = problemas.filter((item) => {
    const busca = textoBusca.toLowerCase();
    return (
      item.equipamento.toLowerCase().includes(busca) ||
      item.local.toLowerCase().includes(busca) ||
      item.status.toLowerCase().includes(busca) ||
      (item.descricao && item.descricao.toLowerCase().includes(busca))
    );
  });

  async function handleEnviar() {
    if (!equipamentoSelecionado) {
      setErroEquipamento('Selecione um equipamento.');
      return;
    }
    setErroEquipamento('');
    if (!validar()) return;

    await adicionarProblema({
      equipamento: equipamentoSelecionado,
      local: valores.local.trim(),
      descricao: valores.descricao.trim(),
      status: 'Pendente',
    });
    setEquipamentoSelecionado(null);
    redefinir();
    setMostrarFormulario(false);
    setMostrarSucesso(true);
    setTimeout(() => setMostrarSucesso(false), 3500);
  }

  function renderizarItem({ item }) {
    return (
      <View style={estilos.card}>
        <View style={estilos.cardEsquerda}>
          <Text style={estilos.cardEquipamento}>{item.equipamento}</Text>
          <Text style={estilos.cardLocal}>{item.local}</Text>
          {!!item.descricao && <Text style={estilos.cardDescricao}>{item.descricao}</Text>}
        </View>
        <View style={[estilos.badgeStatus, { backgroundColor: CORES_STATUS[item.status] || '#555' }]}>
          <Text style={estilos.textoStatus}>{item.status}</Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={estilos.tela}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Animated.View style={[estilos.tela, { opacity: animacaoOpacidade }]}>
        <FlatList
          data={listaFiltrada}
          keyExtractor={(item) => item.id}
          renderItem={renderizarItem}
          contentContainerStyle={estilos.container}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            carregandoProblemas ? (
              <ActivityIndicator color={Cores.primario} style={{ marginTop: 40 }} />
            ) : (
              <ListaVazia
                mensagem={
                  textoBusca
                    ? `Nenhum resultado para "${textoBusca}".`
                    : 'Nenhum problema relatado ainda.\nClique em "Relatar Problema".'
                }
              />
            )
          }
          ListHeaderComponent={
            <View>
              {/* Botão Voltar */}
              <TouchableOpacity style={estilos.botaoVoltar} onPress={() => roteador.back()}>
                <Image
                  source={require('../assets/seta-para-a-esquerda.png')}
                  style={estilos.iconeVoltar}
                />
                <Text style={estilos.textoVoltar}>Voltar</Text>
              </TouchableOpacity>

              <Text style={estilos.titulo}>Problemas</Text>
              <Text style={estilos.subtitulo}>Informe problemas técnicos nos equipamentos</Text>

              <TouchableOpacity
                style={estilos.botaoNovo}
                onPress={() => setMostrarFormulario(!mostrarFormulario)}
              >
                <Text style={estilos.textoBotaoNovo}>
                  {mostrarFormulario ? 'Cancelar' : 'Relatar Problema'}
                </Text>
              </TouchableOpacity>

              {mostrarFormulario && (
                <View style={estilos.cardFormulario}>
                  <Text style={estilos.rotulo}>Equipamento</Text>
                  <View style={estilos.grade}>
                    {listaEquipamentos.map((item) => (
                      <TouchableOpacity
                        key={item}
                        style={[
                          estilos.botaoEquipamento,
                          equipamentoSelecionado === item && estilos.botaoEquipamentoAtivo,
                        ]}
                        onPress={() => {
                          setEquipamentoSelecionado(item);
                          setErroEquipamento('');
                        }}
                      >
                        <Text
                          style={[
                            estilos.textoBotaoEquipamento,
                            equipamentoSelecionado === item && estilos.textoBotaoEquipamentoAtivo,
                          ]}
                        >
                          {item}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {erroEquipamento ? (
                    <Text style={estilos.erroCampo}>{erroEquipamento}</Text>
                  ) : null}

                  <Entrada
                    rotulo="Local"
                    placeholder="Ex.: 3º Andar, Sala 305"
                    value={valores.local}
                    onChangeText={(v) => definirValor('local', v)}
                    onBlur={() => tocar('local')}
                    erro={erros.local}
                    chacoalhar={camposChacoalhando.local}
                  />

                  <Entrada
                    rotulo="Descrição do problema"
                    placeholder="Descreva o que está acontecendo..."
                    value={valores.descricao}
                    onChangeText={(v) => definirValor('descricao', v)}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    style={{ minHeight: 70, paddingTop: 10 }}
                  />

                  <Botao titulo="Enviar relato" aoPresionar={handleEnviar} estilo={estilos.botaoEnviar} />
                </View>
              )}

              {/* Barra de busca com ícone de lupa */}
              <BarraDeBusca
                valor={textoBusca}
                aoMudar={setTextoBusca}
                placeholder="Buscar por equipamento, local ou status..."
              />

              {problemas.length > 0 && (
                <Text style={estilos.textoContador}>
                  {listaFiltrada.length} de {problemas.length} problema(s)
                </Text>
              )}
            </View>
          }
        />
      </Animated.View>

      <Notificacao
        visivel={mostrarSucesso}
        mensagem="Problema relatado com sucesso!"
        sub="Nossa equipe técnica foi notificada."
        tipo="sucesso"
      />
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: Cores.fundo },
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

  botaoNovo: {
    backgroundColor: Cores.primario,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
  },
  textoBotaoNovo: { color: '#fff', fontWeight: '700', fontSize: 15 },

  cardFormulario: {
    backgroundColor: Cores.superficie,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    padding: 18,
    marginBottom: 24,
    borderLeftWidth: 3,
    borderLeftColor: Cores.primario,
  },
  rotulo: { color: Cores.textoSecundario, fontSize: 13, fontWeight: '600', marginBottom: 8, marginTop: 10 },
  grade: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  botaoEquipamento: {
    backgroundColor: Cores.superficieAlternativa,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Cores.borda,
    marginBottom: 4,
  },
  botaoEquipamentoAtivo: { backgroundColor: Cores.primario, borderColor: Cores.primario },
  textoBotaoEquipamento: { color: Cores.textoApagado, fontWeight: '600', fontSize: 13 },
  textoBotaoEquipamentoAtivo: { color: '#fff' },
  erroCampo: { color: Cores.erro, fontSize: 12, marginTop: 4, marginBottom: 4 },
  botaoEnviar: { marginTop: 16 },

  textoContador: { color: Cores.textoDesabilitado, fontSize: 12, marginBottom: 8 },

  card: {
    backgroundColor: Cores.superficie,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardEsquerda: { flex: 1, paddingRight: 10 },
  cardEquipamento: { color: Cores.textoPrimario, fontWeight: '700', fontSize: 15, marginBottom: 2 },
  cardLocal: { color: Cores.textoApagado, fontSize: 12, marginBottom: 4 },
  cardDescricao: { color: '#999', fontSize: 12 },
  badgeStatus: { borderRadius: 4, paddingHorizontal: 8, paddingVertical: 4 },
  textoStatus: { color: '#fff', fontSize: 11, fontWeight: '700' },
});
