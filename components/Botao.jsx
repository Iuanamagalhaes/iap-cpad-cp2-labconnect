import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Cores } from '../constants/cores';

export default function Botao({
  titulo,
  aoPresionar,
  carregando = false,
  desabilitado = false,
  variante = 'primario', // 'primario' | 'contorno' | 'fantasma'
  estilo,
  estiloTexto,
}) {
  const estaDesabilitado = desabilitado || carregando;

  return (
    <TouchableOpacity
      style={[
        estilos.base,
        variante === 'primario' && estilos.primario,
        variante === 'contorno' && estilos.contorno,
        variante === 'fantasma' && estilos.fantasma,
        estaDesabilitado && estilos.desabilitado,
        estilo,
      ]}
      onPress={aoPresionar}
      disabled={estaDesabilitado}
      activeOpacity={0.8}
    >
      {carregando ? (
        <ActivityIndicator color={variante === 'contorno' ? Cores.primario : '#fff'} />
      ) : (
        <Text
          style={[
            estilos.texto,
            variante === 'contorno' && estilos.textoContorno,
            variante === 'fantasma' && estilos.textoFantasma,
            estiloTexto,
          ]}
        >
          {titulo}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
  base: {
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  primario: {
    backgroundColor: Cores.primario,
  },
  contorno: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Cores.primario,
  },
  fantasma: {
    backgroundColor: 'transparent',
  },
  desabilitado: {
    opacity: 0.5,
  },
  texto: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.3,
  },
  textoContorno: {
    color: Cores.primario,
  },
  textoFantasma: {
    color: Cores.textoApagado,
  },
});
