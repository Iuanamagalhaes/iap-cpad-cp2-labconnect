import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Cores } from '../constants/cores';

export default function ListaVazia({ mensagem = 'Nenhum item encontrado.' }) {
  return (
    <View style={estilos.container}>
      <Image
        source={require('../assets/sem-resultados.png')}
        style={estilos.imagem}
        resizeMode="contain"
      />

      <Text style={estilos.texto}>{mensagem}</Text>
    </View>
  );
}
const estilos = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  imagem: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  texto: {
    color: Cores.textoApagado,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});