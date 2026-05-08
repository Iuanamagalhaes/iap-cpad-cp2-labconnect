import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Cores } from '../constants/cores';

export default function BarraDePesquisa({ valor, aoAlterarTexto, placeholder = 'Buscar...' }) {
  return (
    <View style={estilos.container}>
      <TextInput
        style={estilos.entrada}
        value={valor}
        onChangeText={aoAlterarTexto}
        placeholder={placeholder}
        placeholderTextColor={Cores.placeholder}
        clearButtonMode="while-editing"
        autoCorrect={false}
        autoCapitalize="none"
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  entrada: {
    backgroundColor: Cores.superficie,
    borderRadius: 8,
    color: Cores.textoPrimario,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: Cores.borda,
  },
});
