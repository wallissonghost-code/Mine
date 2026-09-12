# Mine · Live Breaker

Brick-breaker vertical para lives. Cada participante pode virar uma bola com foto/@ do TikTok. O jogo foi estruturado em módulos separados para evitar arquivo monolítico.

## Arquitetura
- `src/game.js`: física, blocos, bolas, partículas e renderização.
- `src/audio.js`: SFX via Web Audio, sem arquivos pesados.
- `src/live.js`: normalização de identidade do viewer e comandos do painel.
- `src/main.js`: bootstrap.

## Comandos Live
- `spawn_ball`: bola com foto/@ do usuário.
- `multiball`: múltiplas bolas do usuário.
- `power_ball`: bola com dano maior.
- `add_row`: nova formação.
- `clear_bricks`: conclui a formação atual.

O normalizador aceita variações comuns de payload (`user`, `sender`, `viewer`, `author`) e campos de identidade/avatar sem acoplar o motor do jogo ao transporte.

## Teste
Abra `index.html`. Por padrão entram três bolas demo. Use `?nodemo=1` para abrir vazio.