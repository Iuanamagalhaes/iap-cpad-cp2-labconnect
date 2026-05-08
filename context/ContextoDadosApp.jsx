import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVES_ARMAZENAMENTO = {
  SOFTWARES: '@labconnect:softwares',
  PROBLEMAS: '@labconnect:problemas',
};

const softwaresIniciais = [
  { id: '1', nome: 'Android Studio', sala: 'Sala 502', status: 'Pendente' },
  { id: '2', nome: 'VS Code', sala: 'Sala 103', status: 'Concluído' },
  { id: '3', nome: 'MATLAB', sala: 'Sala 301', status: 'Em andamento' },
  { id: '4', nome: 'AutoCAD', sala: 'Sala 210', status: 'Concluído' },
  { id: '5', nome: 'Python', sala: 'Sala 405', status: 'Pendente' },
  { id: '6', nome: 'Arduino IDE', sala: 'Sala 602', status: 'Concluído' },
];

const problemasIniciais = [
  { id: '1', equipamento: 'Projetor', local: 'Sala 301', descricao: 'Sem sinal de imagem', status: 'Em análise' },
  { id: '2', equipamento: 'Computador', local: 'Sala 210', descricao: 'Não liga', status: 'Resolvido' },
  { id: '3', equipamento: 'Ar-condicionado', local: 'Sala 502', descricao: 'Não liga', status: 'Pendente' },
];

const ContextoDadosApp = createContext(null);

export function ProvedorDadosApp({ children }) {
  const [softwares, setSoftwares] = useState([]);
  const [problemas, setProblemas] = useState([]);
  const [carregandoSoftwares, setCarregandoSoftwares] = useState(true);
  const [carregandoProblemas, setCarregandoProblemas] = useState(true);

  // Carrega softwares do AsyncStorage ao montar
  useEffect(() => {
    async function carregarSoftwares() {
      try {
        const json = await AsyncStorage.getItem(CHAVES_ARMAZENAMENTO.SOFTWARES);
        if (json) {
          setSoftwares(JSON.parse(json));
        } else {
          // Primeira execução: salva dados iniciais
          await AsyncStorage.setItem(
            CHAVES_ARMAZENAMENTO.SOFTWARES,
            JSON.stringify(softwaresIniciais)
          );
          setSoftwares(softwaresIniciais);
        }
      } catch (e) {
        setSoftwares(softwaresIniciais);
      } finally {
        setCarregandoSoftwares(false);
      }
    }
    carregarSoftwares();
  }, []);

  // Carrega problemas do AsyncStorage ao montar
  useEffect(() => {
    async function carregarProblemas() {
      try {
        const json = await AsyncStorage.getItem(CHAVES_ARMAZENAMENTO.PROBLEMAS);
        if (json) {
          setProblemas(JSON.parse(json));
        } else {
          await AsyncStorage.setItem(
            CHAVES_ARMAZENAMENTO.PROBLEMAS,
            JSON.stringify(problemasIniciais)
          );
          setProblemas(problemasIniciais);
        }
      } catch (e) {
        setProblemas(problemasIniciais);
      } finally {
        setCarregandoProblemas(false);
      }
    }
    carregarProblemas();
  }, []);

  // Adiciona software e persiste
  async function adicionarSoftware(item) {
    const novoItem = { ...item, id: Date.now().toString() };
    const novaLista = [novoItem, ...softwares];
    setSoftwares(novaLista);
    await AsyncStorage.setItem(CHAVES_ARMAZENAMENTO.SOFTWARES, JSON.stringify(novaLista));
  }

  // Adiciona problema e persiste
  async function adicionarProblema(item) {
    const novoItem = { ...item, id: Date.now().toString() };
    const novaLista = [novoItem, ...problemas];
    setProblemas(novaLista);
    await AsyncStorage.setItem(CHAVES_ARMAZENAMENTO.PROBLEMAS, JSON.stringify(novaLista));
  }

  return (
    <ContextoDadosApp.Provider
      value={{
        softwares,
        problemas,
        carregandoSoftwares,
        carregandoProblemas,
        adicionarSoftware,
        adicionarProblema,
      }}
    >
      {children}
    </ContextoDadosApp.Provider>
  );
}

export function useDadosApp() {
  const ctx = useContext(ContextoDadosApp);
  if (!ctx) throw new Error('useDadosApp deve ser usado dentro de ProvedorDadosApp');
  return ctx;
}
