# Pasta da trilha sonora

Os arquivos de áudio guardados aqui viram automaticamente a playlist da zona
**Rádio** da página `/criativo`. Não precisa cadastrar nada no `/admin`: jogar o
arquivo nesta pasta e commitar já publica a faixa.

## Formatos aceitos

`.mp3` · `.m4a` · `.ogg` · `.oga` · `.wav` · `.flac`

## Nome do arquivo

A convenção é **`Artista - Título.mp3`** — o leitor separa os dois pelo hífen:

```text
Pink Floyd - Time.mp3        → artista "Pink Floyd", faixa "Time"
Lucas Riboldi - Demo 01.mp3  → artista "Lucas Riboldi", faixa "Demo 01"
esboco-sem-nome.mp3          → sem artista, faixa "esboco-sem-nome"
```

Sem o hífen o nome inteiro vira o título e o artista fica vazio — é de
propósito: melhor mostrar o arquivo como está do que inventar metadados.

## Ordem

Alfabética, com números tratados como números (`Faixa 2` vem antes de
`Faixa 10`). Para forçar uma ordem, prefixe: `01 - `, `02 - `…

## Faixas com capa ou comentário

Esta pasta não guarda metadados. Para pôr capa, comentário ou controlar a
ordem manualmente, cadastre a faixa em `/admin → Rádio` — as duas fontes são
somadas na mesma playlist, com as da pasta primeiro.

## Peso

Os arquivos vão no bundle do site. Nada aqui é carregado até o visitante dar
play (`preload="none"`), mas o repositório carrega o peso de todos — mantenha a
pasta enxuta.
