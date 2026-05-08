import React from 'react';
import { View, TextInput, StyleSheet, Image } from 'react-native';
import { Cores } from '../constants/cores';

export default function BarraDeBusca({ valor, aoMudar, placeholder = 'Buscar...' }) {
  return (
    <View style={estilos.container}>
      <Image
        source={require('../assets/lupa_busca.png')}
        style={estilos.icone}
      />
      <TextInput
        style={estilos.entrada}
        value={valor}
        onChangeText={aoMudar}
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Cores.superficie,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Cores.borda,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  icone: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    marginRight: 8,
  },
  entrada: {
    flex: 1,
    color: Cores.textoPrimario,
    paddingVertical: 12,
    fontSize: 14,
  },
});
