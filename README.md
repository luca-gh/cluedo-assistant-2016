# Cluedo Assistant

Web app in italiano per annotare domande, indizi e deduzioni durante una partita a Cluedo, al posto del classico foglietto di carta. Include 6 personaggi, 6 armi e 9 stanze.

**[Apri l'app](https://luca-gh.github.io/cluedo-assistant/)**

## Iniziare una partita

1. Premi **Nuova Partita**.
2. Inserisci il tuo nome e il numero degli altri giocatori.
3. Inserisci i nomi degli altri giocatori.

Le tre tabelle compaiono affiancate nell'ordine **Domande poste → Indizi forniti → Deduzioni**. Su schermi piccoli può essere necessario scorrere orizzontalmente.

## Domande poste

Ogni colonna corrisponde a un giocatore e ogni riga a una carta. Tocca una cella per incrementare il contatore e annotare quante volte quel giocatore ha incluso la carta nelle proprie domande. Dopo 15 il contatore torna a 0.

## Indizi forniti

Le celle sono modificabili liberamente: puoi inserire numeri o brevi note per ricordare le possibili carte mostrate da ciascun giocatore.

Per esempio, se Marco mostra una carta alla chiamata **Reverendo Green, Candeliere, Sala da ballo**, scrivi `1` nelle tre celle corrispondenti della colonna di Marco. Il numero comune identifica il gruppo: Marco possiede almeno una delle tre carte. Per una risposta successiva usa `2`, poi `3` e così via. Se una carta compare in più gruppi, puoi annotare più numeri nella stessa cella, per esempio `1, 3`.

La numerazione e i ragionamenti per esclusione sono gestiti manualmente.

## Deduzioni

La tabella comprende i giocatori e una colonna **Banco**, da usare per le carte della soluzione.

Toccando una cella passi tra questi stati:

- **Rosso:** la carta è esclusa per quel giocatore.
- **Verde:** la carta è attribuita a quel giocatore; le altre celle della stessa riga diventano rosse automaticamente.
- Toccando una cella verde, **l'intera riga torna senza colore**.

Puoi modificare i nomi delle carte direttamente nella tabella Deduzioni. La modifica riguarda soltanto quella tabella per la partita corrente.

## Salvataggio

La partita rimane soltanto nella pagina aperta: al momento non è salvata né sincronizzata tra dispositivi. Ricaricare la pagina o avviare una nuova partita cancella le annotazioni. Anche chiudere l'app può farle perdere.

## Avvio in locale

Non servono installazioni, dipendenze o compilazione:

```sh
git clone https://github.com/luca-gh/cluedo-assistant.git
cd cluedo-assistant
```

Apri `index.html` nel browser.

## Struttura del progetto

| File | Contenuto |
| --- | --- |
| `index.html` | Pagina principale e collegamenti alle risorse |
| `app.js` | Elenco delle carte, creazione delle tabelle e interazioni |
| `style.css` | Stile e disposizione delle tabelle |
| `manifest.json` | Nome, icona e impostazioni di apertura della web app |
| `images/` | Banner e icone |

## Pubblicazione

Il sito è pubblicato su GitHub Pages dalla cartella principale del branch `main` di questo repository. Dopo un push, occorre attendere il completamento della pubblicazione. Il browser può conservare una copia precedente dei file in cache, quindi gli aggiornamenti potrebbero non comparire subito.
