---
description: Mantém o contexto do Sentinel App atualizado antes de qualquer modificação.
---

Antes de realizar qualquer modificação no código ou arquitetura do Sentinel App, você **DEVE** executar a análise completa para garantir que entende o estado atual, o que já está implementado e como as peças se conectam.

### Passos:

1. Execute o seguinte prompt de contexto:
   > "Use @code-documentation-code-explain para analisar o projeto em `/home/lucas/Área de trabalho/sentinel-app`. Me explique como as peças se encaixam, desde o clique do usuário no frontend até a resposta da IA no backend, focando na lógica do jogo."

2. Leia atentamente a explicação gerada pela IA.

3. Compare o estado descrito com a modificação solicitada para identificar:
   - O que já existe e pode ser reutilizado.
   - O que ainda não foi implementado.
   - Possíveis conflitos de lógica ou arquitetura.

4. Proceda com a modificação somente após ter total clareza do fluxo completo.
