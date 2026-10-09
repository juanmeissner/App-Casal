# Entre Nós

Jogo de casal com 1.371 perguntas em 19 categorias: as 1.000 originais, 51 sobre universo geek, super-heróis e quadrinhos e 320 distribuídas entre oito novos temas. Cada toque sorteia uma pergunta ainda não exibida. O progresso e a última pergunta ficam salvos no navegador.

Os novos temas têm 40 perguntas cada: Viagens e aventuras; Cozinha a dois; Casa e convivência; Vida digital; Celebrações e tradições; Criatividade em dupla; Natureza e animais; Bem-estar e autocuidado.

## Abrir

O aplicativo está na raiz do repositório. Para testar localmente, abra um terminal em `E:\GitHub\App-Casal`, execute um servidor nesta pasta e acesse o endereço abaixo:

```powershell
py -m http.server 4173
```

Depois acesse `http://localhost:4173/`. Não é preciso instalar pacotes. Na publicação pelo GitHub Pages, use a raiz do repositório como origem; os arquivos do aplicativo usam caminhos relativos.

## Instalar como aplicativo

- No Chrome ou Edge, use o botão **Instalar no dispositivo** quando ele aparecer, ou a opção **Instalar aplicativo** no menu do navegador.
- No Safari do iPhone, toque em **Compartilhar**, depois em **Adicionar à Tela de Início** e, se aparecer, ative **Abrir como App**.
- Após o primeiro carregamento com internet, o jogo abre offline. As perguntas e o progresso ficam salvos no navegador do próprio dispositivo.

Para instalar no celular a partir de outro computador, o app precisa estar em um endereço HTTPS. O `localhost` do computador não é acessível pelo `localhost` do celular.

## Arquivos

- `perguntas.json`: base com as 1.371 perguntas.
- `questions-data.js`: a mesma base carregada pelo navegador.
- `app.js`: sorteio sem repetição, progresso, restauração e reinício.
- `styles.css`: interface adaptada primeiro para celular.
- `manifest.webmanifest`, `sw.js` e `icons/`: instalação e abertura offline.

O botão **Recomeçar** confirma antes de limpar o progresso. Os dados ficam somente no navegador em que o jogo é usado.
