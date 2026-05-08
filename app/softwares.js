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

const CORES_STATUS = {
  Pendente: Cores.erro,
  Concluído: Cores.sucesso,
  'Em andamento': Cores.destaque,
};

export default function Softwares() {
  const roteador = useRouter();
  const { softwares, carregandoSoftwares, adicionarSoftware } = useDadosApp();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarSucesso, setMostrarSucesso] = useState(false);
  const [textoBusca, setTextoBusca] = useState('');

  const animacaoOpacidade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(animacaoOpacidade, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  const { valores, erros, camposChacoalhando, definirValor, tocar, validar, redefinir } = useValidacao(
    { nomeSoftware: '', sala: '' },
    {
      nomeSoftware: [Regras.obrigatorio('Nome do software')],
      sala: [Regras.obrigatorio('Sala')],
    }
  );

  const listaFiltrada = softwares.filter((item) => {
    const busca = textoBusca.toLowerCase();
    return (
      item.nome.toLowerCase().includes(busca) ||
      item.sala.toLowerCase().includes(busca) ||
      item.status.toLowerCase().includes(busca)
    );
  });

  async function handleEnviar() {
    if (!validar()) return;
    await adicionarSoftware({ nome: valores.nomeSoftware.trim(), sala: valores.sala.trim(), status: 'Pendente' });
    redefinir();
    setMostrarFormulario(false);
    setMostrarSucesso(true);
    setTimeout(() => setMostrarSucesso(false), 3000);
  }

  function renderizarItem({ item }) {
    return (
      <View style={estilos.card}>
        <View>
          <Text style={estilos.cardTitulo}>{item.nome}</Text>
          <Text style={estilos.cardSala}>{item.sala}</Text>
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
            carregandoSoftwares ? (
              <ActivityIndicator color={Cores.primario} style={{ marginTop: 40 }} />
            ) : (
              <ListaVazia
                mensagem={
                  textoBusca
                    ? `Nenhum resultado para "${textoBusca}".`
                    : 'Nenhuma solicitação ainda.\nClique em "Nova Solicitação".'
                }
              />
            )
          }
          ListHeaderComponent={
            <View>
              <TouchableOpacity style={estilos.botaoVoltar} onPress={() => roteador.back()}>
                <Image
                  source={require('../assets/seta-para-a-esquerda.png')}
                  style={estilos.iconeVoltar}
                />
                <Text style={estilos.textoVoltar}>Voltar</Text>
              </TouchableOpacity>

              <Text style={estilos.titulo}>Instalação de{'\n'}Software</Text>
              <Text style={estilos.subtitulo}>
                Solicite a instalação de softwares para o andamento das aulas
              </Text>

              <TouchableOpacity
                style={estilos.botaoNovo}
                onPress={() => setMostrarFormulario(!mostrarFormulario)}
              >
                <Text style={estilos.textoBotaoNovo}>
                  {mostrarFormulario ? 'Cancelar' : 'Nova Solicitação'}
                </Text>
              </TouchableOpacity>

              {mostrarFormulario && (
                <View style={estilos.cardFormulario}>
                  <Entrada
                    rotulo="Nome do Software"
                    placeholder="Ex.: AutoCAD, MATLAB..."
                    value={valores.nomeSoftware}
                    onChangeText={(v) => definirValor('nomeSoftware', v)}
                    onBlur={() => tocar('nomeSoftware')}
                    erro={erros.nomeSoftware}
                    chacoalhar={camposChacoalhando.nomeSoftware}
                  />
                  <Entrada
                    rotulo="Sala"
                    placeholder="Ex.: Sala 501"
                    value={valores.sala}
                    onChangeText={(v) => definirValor('sala', v)}
                    onBlur={() => tocar('sala')}
                    erro={erros.sala}
                    chacoalhar={camposChacoalhando.sala}
                  />
                  <Botao titulo="Enviar solicitação" aoPresionar={handleEnviar} estilo={estilos.botaoEnviar} />
                </View>
              )}

              <BarraDeBusca
                valor={textoBusca}
                aoMudar={setTextoBusca}
                placeholder="Buscar por nome, sala ou status..."
              />

              {softwares.length > 0 && (
                <Text style={estilos.textoContador}>
                  {listaFiltrada.length} de {softwares.length} solicitação(ões)
                </Text>
              )}
            </View>
          }
        />
      </Animated.View>

      <Notificacao
        visivel={mostrarSucesso}
        mensagem="Solicitação enviada com sucesso!"
        tipo="sucesso"
      />
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: Cores.fundo },
  container: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 40 },

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

  titulo: { color: Cores.primario, fontSize: 32, fontWeight: '900', lineHeight: 38, marginBottom: 8 },
  subtitulo: { color: Cores.textoApagado, fontSize: 13, marginBottom: 24, lineHeight: 18 },

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
  botaoEnviar: { marginTop: 16 },

  textoContador: { color: Cores.textoDesabilitado, fontSize: 12, marginBottom: 8 },

  card: {
    backgroundColor: Cores.superficie,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitulo: { color: Cores.textoPrimario, fontWeight: '700', fontSize: 15, marginBottom: 3 },
  cardSala: { color: Cores.textoApagado, fontSize: 12 },
  badgeStatus: { borderRadius: 4, paddingHorizontal: 8, paddingVertical: 4 },
  textoStatus: { color: '#fff', fontSize: 11, fontWeight: '700' },
});
