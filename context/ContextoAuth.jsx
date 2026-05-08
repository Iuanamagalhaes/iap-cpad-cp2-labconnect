import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVES_ARMAZENAMENTO = {
  USUARIOS: '@labconnect:users',
  SESSAO: '@labconnect:session',
};

const ContextoAuth = createContext(null);

export function ProvedorAuth({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarSessao() {
      try {
        const sessaoJson = await AsyncStorage.getItem(CHAVES_ARMAZENAMENTO.SESSAO);
        if (sessaoJson) {
          setUsuario(JSON.parse(sessaoJson));
        }
      } catch (e) {
        console.error('Erro ao carregar sessão:', e);
      } finally {
        setCarregando(false);
      }
    }
    carregarSessao();
  }, []);

  async function cadastrar({ nome, email, senha }) {
    try {
      const usuariosJson = await AsyncStorage.getItem(CHAVES_ARMAZENAMENTO.USUARIOS);
      const usuarios = usuariosJson ? JSON.parse(usuariosJson) : [];

      const emailJaExiste = usuarios.some(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (emailJaExiste) {
        return { sucesso: false, erro: 'E-mail já cadastrado.' };
      }

      const novoUsuario = { nome, email: email.toLowerCase(), senha };
      await AsyncStorage.setItem(
        CHAVES_ARMAZENAMENTO.USUARIOS,
        JSON.stringify([...usuarios, novoUsuario])
      );
      return { sucesso: true };
    } catch (e) {
      return { sucesso: false, erro: 'Erro ao cadastrar. Tente novamente.' };
    }
  }

  async function login({ email, senha }) {
    try {
      const usuariosJson = await AsyncStorage.getItem(CHAVES_ARMAZENAMENTO.USUARIOS);
      const usuarios = usuariosJson ? JSON.parse(usuariosJson) : [];

      const encontrado = usuarios.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() && u.senha === senha
      );

      if (!encontrado) {
        return { sucesso: false, erro: 'E-mail ou senha incorretos.' };
      }

      const dadosSessao = { nome: encontrado.nome, email: encontrado.email };
      await AsyncStorage.setItem(
        CHAVES_ARMAZENAMENTO.SESSAO,
        JSON.stringify(dadosSessao)
      );
      setUsuario(dadosSessao);
      return { sucesso: true };
    } catch (e) {
      return { sucesso: false, erro: 'Erro ao fazer login. Tente novamente.' };
    }
  }

  async function sair() {
    try {
      await AsyncStorage.removeItem(CHAVES_ARMAZENAMENTO.SESSAO);
      setUsuario(null);
    } catch (e) {
      console.error('Erro ao fazer logout:', e);
    }
  }

  return (
    <ContextoAuth.Provider value={{ usuario, carregando, login, sair, cadastrar }}>
      {children}
    </ContextoAuth.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(ContextoAuth);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de ProvedorAuth');
  return ctx;
}
