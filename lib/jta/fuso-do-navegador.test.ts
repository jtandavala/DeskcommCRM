/**
 * O fuso inicial do onboarding vem do navegador quando está na lista
 * (JTA — especificação 0001).
 */
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FUSO_PADRAO, FUSOS_DO_ONBOARDING } from "@/lib/tempo/fusos";

import { fusoDoNavegadorNaLista, useFusoDoNavegador } from "./fuso-do-navegador";

const LISTA = FUSOS_DO_ONBOARDING.map((f) => f.id);

describe("fusoDoNavegadorNaLista", () => {
  it("um navegador em Angola começa em Luanda", () => {
    expect(fusoDoNavegadorNaLista(LISTA, FUSO_PADRAO, () => "Africa/Luanda")).toBe("Africa/Luanda");
  });

  it("um fuso fora da lista fica no recurso", () => {
    expect(fusoDoNavegadorNaLista(LISTA, FUSO_PADRAO, () => "Asia/Tokyo")).toBe(FUSO_PADRAO);
  });

  it("sem fuso do navegador fica no recurso", () => {
    expect(fusoDoNavegadorNaLista(LISTA, FUSO_PADRAO, () => undefined)).toBe(FUSO_PADRAO);
    expect(fusoDoNavegadorNaLista(LISTA, FUSO_PADRAO, () => "")).toBe(FUSO_PADRAO);
  });

  it("um Intl que lança não derruba o formulário", () => {
    const lanca = () => {
      throw new RangeError("Intl indisponível");
    };
    expect(fusoDoNavegadorNaLista(LISTA, FUSO_PADRAO, lanca)).toBe(FUSO_PADRAO);
  });
});

describe("useFusoDoNavegador", () => {
  function comNavegadorEm(tz: string) {
    vi.spyOn(Intl, "DateTimeFormat").mockReturnValue({
      resolvedOptions: () => ({ timeZone: tz }),
    } as unknown as Intl.DateTimeFormat);
  }

  it("troca o recurso pelo fuso do navegador", () => {
    comNavegadorEm("Africa/Luanda");
    const setFuso = vi.fn();
    renderHook(() => useFusoDoNavegador(LISTA, FUSO_PADRAO, setFuso));
    const atualizar = setFuso.mock.calls[0]![0] as (atual: string) => string;
    expect(atualizar(FUSO_PADRAO)).toBe("Africa/Luanda");
    vi.restoreAllMocks();
  });

  it("não mexe numa escolha que a pessoa já fez", () => {
    comNavegadorEm("Africa/Luanda");
    const setFuso = vi.fn();
    renderHook(() => useFusoDoNavegador(LISTA, FUSO_PADRAO, setFuso));
    const atualizar = setFuso.mock.calls[0]![0] as (atual: string) => string;
    expect(atualizar("Europe/Lisbon")).toBe("Europe/Lisbon");
    vi.restoreAllMocks();
  });

  it("sem sugestão diferente do recurso, não chama setFuso", () => {
    comNavegadorEm("Asia/Tokyo");
    const setFuso = vi.fn();
    renderHook(() => useFusoDoNavegador(LISTA, FUSO_PADRAO, setFuso));
    expect(setFuso).not.toHaveBeenCalled();
    vi.restoreAllMocks();
  });
});
