import { useState } from 'react';

export function useValidacao(valoresIniciais, regras) {
  const [valores, setValores] = useState(valoresIniciais);
  const [erros, setErros] = useState({});
  const [camposChacoalhando, setCamposChacoalhando] = useState({});
  const [tocados, setTocados] = useState({});

  function definirValor(campo, valor) {
    setValores((anterior) => ({ ...anterior, [campo]: valor }));
    // Valida em tempo real após o campo ter sido tocado
    if (tocados[campo]) {
      const errosCampo = validarCampo(campo, valor, { ...valores, [campo]: valor });
      setErros((anterior) => ({ ...anterior, [campo]: errosCampo }));
    }
  }

  function tocar(campo) {
    setTocados((anterior) => ({ ...anterior, [campo]: true }));
    const errosCampo = validarCampo(campo, valores[campo], valores);
    setErros((anterior) => ({ ...anterior, [campo]: errosCampo }));
  }

  function validarCampo(campo, valor, todosValores) {
    const regrasCampo = regras[campo];
    if (!regrasCampo) return null;

    for (const regra of regrasCampo) {
      const erro = regra(valor, todosValores);
      if (erro) return erro;
    }
    return null;
  }

  function validar() {
    const novosErros = {};
    let temErro = false;

    for (const campo of Object.keys(regras)) {
      const erro = validarCampo(campo, valores[campo], valores);
      if (erro) {
        novosErros[campo] = erro;
        temErro = true;
      }
    }

    setErros(novosErros);
    setTocados(
      Object.keys(regras).reduce((acc, k) => ({ ...acc, [k]: true }), {})
    );

    if (temErro) {
      // Faz shake em todos os campos com erro
      const chacoalhadas = Object.keys(novosErros).reduce(
        (acc, k) => ({ ...acc, [k]: Date.now() }),
        {}
      );
      setCamposChacoalhando(chacoalhadas);
    }

    return !temErro;
  }

  function redefinir() {
    setValores(valoresIniciais);
    setErros({});
    setCamposChacoalhando({});
    setTocados({});
  }

  const eValido = Object.keys(regras).every(
    (campo) => !erros[campo] && valores[campo]
  );

  return { valores, erros, camposChacoalhando, definirValor, tocar, validar, redefinir, eValido };
}

// Regras de validação reutilizáveis
export const Regras = {
  obrigatorio: (rotulo) => (valor) =>
    !valor || !String(valor).trim() ? `${rotulo} é obrigatório.` : null,

  email: () => (valor) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return valor && !re.test(valor) ? 'Formato de e-mail inválido.' : null;
  },

  tamanhoMinimo: (min, rotulo) => (valor) =>
    valor && String(valor).length < min
      ? `${rotulo} deve ter pelo menos ${min} caracteres.`
      : null,

  coincidir: (outroCampo, rotulo) => (valor, todosValores) =>
    valor && todosValores[outroCampo] && valor !== todosValores[outroCampo]
      ? `${rotulo} não confere.` : null,
};
