# Patches JTA sobre a comunidade

Cada linha é um ficheiro da comunidade alterado pela JTA: um conflito possível em
cada lab. O objetivo é esta tabela encolher. Ficheiros novos (`lib/jta/...`) não
entram aqui, porque não dão conflito.

Processo e regras: `sales_funil/docs/manter-deskcomm/guia-fork-deskcomm-angola.md`
(secção 4) e a skill `deskcomm-angola-codigo`. As especificações vivem em
`sales_funil/especificacoes/`.

| Patch | Ficheiros | Porquê | PR na comunidade | Estado |
|---|---|---|---|---|
| Luanda no onboarding (esp. 0001) | lib/tempo/fusos.ts | a lista do onboarding (`FUSOS_DO_ONBOARDING`) não tinha Luanda; +1 linha | — | permanente |
| Fuso do navegador no onboarding (esp. 0001) | app/onboarding/welcome/_form.tsx | ponto de ligação (1 import + 1 chamada) para `lib/jta/fuso-do-navegador.ts` | — | permanente |
