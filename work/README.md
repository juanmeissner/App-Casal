# Entre Nós

Jogo de casal com 1.051 perguntas em 11 categorias: as 1.000 originais e 51 novas sobre universo geek, super-heróis e quadrinhos. Cada toque sorteia uma pergunta ainda não exibida. O progresso e a última pergunta ficam salvos no navegador.

## Abrir

Abra `index.html` no navegador. Para garantir que o progresso continue salvo de forma estável, execute um servidor local nesta pasta e abra o endereço mostrado:

```powershell
py -m http.server 4173
```

Depois acesse `http://localhost:4173`. Não é preciso instalar pacotes.

## Arquivos

- `perguntas.json`: base com as 1.051 perguntas.
- `questions-data.js`: a mesma base carregada pelo navegador.
- `app.js`: sorteio sem repetição, progresso, restauração e reinício.
- `styles.css`: interface adaptada primeiro para celular.

O botão **Recomeçar** confirma antes de limpar o progresso. Os dados ficam somente no navegador em que o jogo é usado.
