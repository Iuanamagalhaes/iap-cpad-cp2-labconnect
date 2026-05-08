import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
} from 'react-native';
import { Cores } from '../constants/cores';

export default function Entrada({
  rotulo,
  erro,
  chacoalhar,
  estiloContainer,
  style,
  ...props
}) {
  const animacaoChacoalhar = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (chacoalhar) {
      Animated.sequence([
        Animated.timing(animacaoChacoalhar, { toValue: 10, duration: 60, useNativeDriver: true }),
        Animated.timing(animacaoChacoalhar, { toValue: -10, duration: 60, useNativeDriver: true }),
        Animated.timing(animacaoChacoalhar, { toValue: 8, duration: 60, useNativeDriver: true }),
        Animated.timing(animacaoChacoalhar, { toValue: -8, duration: 60, useNativeDriver: true }),
        Animated.timing(animacaoChacoalhar, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start();
    }
  }, [chacoalhar]);

  return (
    <Animated.View
      style={[estilos.container, estiloContainer, { transform: [{ translateX: animacaoChacoalhar }] }]}
    >
      {rotulo ? <Text style={estilos.rotulo}>{rotulo}</Text> : null}
      <TextInput
        style={[estilos.entrada, erro ? estilos.entradaComErro : null, style]}
        placeholderTextColor={Cores.placeholder}
        {...props}
      />
      {erro ? <Text style={estilos.textoErro}>{erro}</Text> : null}
    </Animated.View>
  );
}

const estilos = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  rotulo: {
    color: Cores.textoSecundario,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 10,
  },
  entrada: {
    backgroundColor: Cores.superficieAlternativa,
    borderRadius: 8,
    color: Cores.textoPrimario,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    borderWidth: 1,
    borderColor: Cores.borda,
  },
  entradaComErro: {
    borderColor: Cores.erro,
  },
  textoErro: {
    color: Cores.erro,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 2,
  },
});