import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { ProvedorAuth, useAuth } from '../context/ContextoAuth';
import { ProvedorDadosApp } from '../context/ContextoDadosApp';
import { Cores } from '../constants/cores';

function NavegacaoRaizLayout() {
  const { usuario, carregando } = useAuth();
  const roteador = useRouter();
  const segmentos = useSegments();

  useEffect(() => {
    if (carregando) return;
    const estaNoGrupoAuth = segmentos[0] === '(auth)';
    if (!usuario && !estaNoGrupoAuth) {
      roteador.replace('/(auth)/login');
    } else if (usuario && estaNoGrupoAuth) {
      roteador.replace('/');
    }
  }, [usuario, carregando, segmentos]);

  if (carregando) {
    return (
      <View style={{ flex: 1, backgroundColor: Cores.fundo, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={Cores.primario} size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)/login" />
      <Stack.Screen name="(auth)/cadastro" />
      <Stack.Screen name="index" />
      <Stack.Screen name="laboratorios" />
      <Stack.Screen name="softwares" />
      <Stack.Screen name="problemas" />
      <Stack.Screen name="suporte" />
    </Stack>
  );
}

export default function LayoutRaiz() {
  return (
    <ProvedorAuth>
      <ProvedorDadosApp>
        <NavegacaoRaizLayout />
      </ProvedorDadosApp>
    </ProvedorAuth>
  );
}
