import { useEffect } from "react";

/**
 * O onboarding começa no fuso do NAVEGADOR, quando ele está na lista oferecida.
 *
 * JTA — especificação 0001 (sales_funil/especificacoes/0001-fuso-luanda-no-onboarding.md).
 * Um navegador em Angola reporta `Africa/Luanda`; sem isto, «Onde você atende»
 * abria sempre em São Paulo, a pessoa não mudava, e a organização ficava 4 horas
 * atrás (agenda, janelas do follow-up, horários ditos pelo agente).
 *
 * Fora da lista, fica o recurso (`FUSO_PADRAO`): o <select> só tem <option> para
 * a lista, e um valor sem opção mostraria um fuso e gravaria outro — o mesmo
 * motivo de `fusoOferecidoOuPadrao` em `lib/tempo/fusos.ts`.
 */
export function fusoDoNavegadorNaLista(
  oferecidos: readonly string[],
  recurso: string,
  lerDoNavegador: () => string | undefined = () => Intl.DateTimeFormat().resolvedOptions().timeZone,
): string {
  let doNavegador: string | undefined;
  try {
    doNavegador = lerDoNavegador();
  } catch {
    // Navegador sem Intl utilizável: nada a sugerir, fica o recurso.
    return recurso;
  }
  return doNavegador && oferecidos.includes(doNavegador) ? doNavegador : recurso;
}

/**
 * Ajusta o fuso inicial de um formulário depois de montar.
 *
 * Num `useEffect`, e não no valor inicial do `useState`: o servidor não sabe o
 * fuso do navegador, e escolhê-lo durante a renderização faria o HTML do
 * servidor e o do navegador diferirem (erro de hidratação). O custo é a lista
 * mostrar o recurso durante um instante antes de mudar.
 *
 * Só troca enquanto o valor ainda é o recurso: se a pessoa já escolheu outro
 * fuso, não é tocado.
 */
export function useFusoDoNavegador(
  oferecidos: readonly string[],
  recurso: string,
  setFuso: (atualizar: (atual: string) => string) => void,
): void {
  useEffect(() => {
    const sugerido = fusoDoNavegadorNaLista(oferecidos, recurso);
    if (sugerido !== recurso) setFuso((atual) => (atual === recurso ? sugerido : atual));
    // Só na montagem: depois disso, o fuso é escolha da pessoa.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
