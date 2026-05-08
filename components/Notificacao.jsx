import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Cores } from '../constants/cores';

export default function Notificacao({ visivel, mensagem, sub, tipo = 'sucesso' }) {
  const opacidade = useRef(new Animated.Value(0)).current;
  const transladarY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (visivel) {
      Animated.parallel([
        Animated.timing(opacidade, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.timing(transladarY, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacidade, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(transladarY, { toValue: 20, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visivel]);

  const corBorda = tipo === 'sucesso' ? Cores.sucesso : Cores.erro;
  const corFundo = tipo === 'sucesso' ? Cores.fundoSucesso : Cores.fundoErro;
  const corTexto = tipo === 'sucesso' ? Cores.sucesso : Cores.erro;

  return (
    <Animated.View
      style={[
        estilos.notificacao,
        { backgroundColor: corFundo, borderLeftColor: corBorda, opacity: opacidade, transform: [{ translateY: transladarY }] },
      ]}
      pointerEvents="none"
    >
      <Text style={[estilos.textoNotificacao, { color: corTexto }]}>{mensagem}</Text>
      {sub ? <Text style={[estilos.subNotificacao, { color: corTexto, opacity: 0.7 }]}>{sub}</Text> : null}
    </Animated.View>
  );
}

const estilos = StyleSheet.create({
  notificacao: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderLeftWidth: 4,
  },
  textoNotificacao: { fontWeight: '700', fontSize: 14, marginBottom: 2 },
  subNotificacao: { fontSize: 12 },
});