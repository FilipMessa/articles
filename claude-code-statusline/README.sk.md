# Claude Code Statusline: všetko podstatné na jednom riadku

Pri práci s Claude Code som si často otváral `/usage`, aby som zistil, ako som na tom so spotrebou a kedy sa mi obnovia limity.

Postupne som si cez Claude doplnil niekoľko informácií priamo do statusline. Bolo to lepšie, ale stále mi tam niečo chýbalo.

Až som narazil na príspevok od Davida Grudla, kde ukázal, ako to má nastavené on. To ma inšpirovalo upraviť si vlastnú statusline a pripraviť k nej skill, cez ktorý sa dá jednoducho nainštalovať a prispôsobiť.

Odvtedy `/usage` takmer nepoužívam.

## Čo zobrazuje

![Ukážka Claude Code statusline](https://raw.githubusercontent.com/FilipMessa/claude-code-statusline/main/demo/demo.gif)

Na jednom riadku mám informácie, ktoré ma pri práci zaujímajú:

- **Model a kontextové okno** – aktuálny model a využitie kontextu.
- **Prompt cache** – čas zostávajúci do expirácie cache.
- **Spotreba predplatného** – využitie limitu a čas do jeho obnovenia. Šípka upozorňuje, keď limit čerpám rýchlejšie, než plynie čas.
- **Projekt a Git worktree** – v ktorom projekte a worktree práve pracujem.
- **Scratchpad** – prístup k súborom, ktoré si Claude vytvoril počas relácie.

## Inštalácia

Statusline som zverejnil na GitHube spolu so skillom pre Claude Code.

Skill sa postará o inštaláciu a umožňuje aj ďalšie úpravy. Napríklad zmeniť šírku indikátora kontextu, odstrániť nepotrebné informácie alebo pridať Git branch.

Postup inštalácie, ukážky a zdrojový kód nájdeš v repozitári:

**[FilipMessa/claude-code-statusline](https://github.com/FilipMessa/claude-code-statusline)**

Škoda, že podobné nastavenie zatiaľ nemám aj v Codexe. Verím však, že je to len otázka času.
