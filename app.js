// Lista delle carte del Cluedo
const cards = [
    { type: "section", name: "CHI?" },

    { type: "card", name: "Reverendo Green" },
    { type: "card", name: "Colonnello Mustard" },
    { type: "card", name: "Dottoressa Orchid" },
    { type: "card", name: "Contessa Peacock" },
    { type: "card", name: "Professor Plum" },
    { type: "card", name: "Miss Scarlett" },
    
    { type: "section", name: "CHE COSA?" },

    { type: "card", name: "Candeliere" },
    { type: "card", name: "Pugnale" },
    { type: "card", name: "Tubo di piombo" },
    { type: "card", name: "Pistola" },
    { type: "card", name: "Corda" },
    { type: "card", name: "Chiave inglese" },

    { type: "section", name: "DOVE?" },

    { type: "card", name: "Sala da ballo" },
    { type: "card", name: "Sala del biliardo" },
    { type: "card", name: "Serra" },
    { type: "card", name: "Sala da pranzo" },
    { type: "card", name: "Bagno" },
    { type: "card", name: "Cucina" },
    { type: "card", name: "Biblioteca" },
    { type: "card", name: "Salotto" },
    { type: "card", name: "Studio" }
   
];

// Troviamo gli elementi principali della pagina
const newGameButton = document.getElementById("newGameButton");
const gameArea = document.getElementById("gameArea");

// Avvio nuova partita
newGameButton.addEventListener("click", function() {
    // Chiediamo il nome del giocatore principale
    const myName = prompt("Come ti chiami?");

    // Chiediamo il numero degli altri giocatori
    const numberOfPlayers = prompt("Quanti altri giocatori ci sono?");

    // Liste giocatori
    const deductionPlayers = ["Banco", myName];
    const gamePlayers = [myName];

    for(let i = 0; i < numberOfPlayers; i++) {
        const playerName = prompt("Nome del giocatore " + (i + 1));

        deductionPlayers.push(playerName);
        gamePlayers.push(playerName);
    }

    renderTables(deductionPlayers, gamePlayers);
});

// Costruisce tutte le tabelle
function renderTables(deductionPlayers, gamePlayers) {
    const longestNameLength = Math.max(...deductionPlayers.map(player => player.length));
    const columnWidth = Math.max(44, longestNameLength * 10);

    gameArea.style.setProperty("--player-column-width", columnWidth + "px");

    let html = "";

    html += '<div class="tablesContainer">';

    html += buildQuestionsTable(gamePlayers);
    html += buildExclusionsTable(gamePlayers);
    html += buildDeductionTable(deductionPlayers);

    html += "</div>";

    gameArea.innerHTML = html;

    activateDeductionCells();
    activateCounterCells();
    activateExclusionsRegister();
}

// Costruisce la tabella Deduzioni
function buildDeductionTable(players) {
    let html = "";

    html += '<div class="tableBlock">';
    html += "<h2>Deduzioni</h2>";
    html += "<table>";

    html += buildHeaderRow(players);

    for(let card of cards) {
        if(card.type === "section") {
            html += buildSectionRow(card.name, players);
        } else {
            html += "<tr>";
            html += '<td class="cardName" contenteditable="true">' + card.name + "</td>";

            for(let player of players) {
                html += '<td class="gameCell"></td>';
            }

            html += "</tr>";
        }
    }

    html += "</table>";
    html += "</div>";

    return html;
}

// Costruisce la tabella Domande fatte
function buildQuestionsTable(players) {
    let html = "";

    html += '<div class="tableBlock">';
    html += "<h2>Domande fatte</h2>";
    html += '<table id="questionsTable">';

    html += buildHeaderRow(players);

    for(let card of cards) {
        if(card.type === "section") {
            html += buildSectionRow(card.name, players);
        } else {
            html += "<tr>";
            html += '<td class="cardName">' + card.name + "</td>";

            for(let player of players) {
                html += '<td class="counterCell">0</td>';
            }

            html += "</tr>";
        }
    }

    html += "</table>";
    html += "</div>";

    return html;
}

// Costruisce la tabella Esclusioni
function buildExclusionsTable(players) {
    let html = '<div class="tableBlock exclusionsBlock">';
    html += '<h2>Esclusioni</h2>';
    html += '<p class="registerHelp">Registra chi ha mostrato una delle tre carte chiamate.</p>';
    html += '<form id="exclusionsForm" class="exclusionsForm">';
    html += '<label>Chi ha mostrato<select name="player" required>';
    html += '<option value="">Scegli il giocatore</option>';
    players.forEach(function(player, index) {
        html += '<option value="' + index + '">' + escapeHtml(player) + '</option>';
    });
    html += '</select></label>';

    const fieldNames = ["suspect", "weapon", "room"];
    let sectionIndex = -1;
    for(let card of cards) {
        if(card.type === "section") {
            if(sectionIndex >= 0) html += '</select></label>';
            sectionIndex++;
            html += '<label>' + card.name + '<select name="' + fieldNames[sectionIndex] + '" required>';
            html += '<option value="">Scegli la carta</option>';
        } else {
            html += '<option>' + escapeHtml(card.name) + '</option>';
        }
    }
    html += '</select></label>';
    html += '<button type="submit">Registra chiamata</button></form>';
    html += '<p id="exclusionsEmpty" class="registerHelp">Nessuna chiamata registrata.</p>';
    html += '<p id="exclusionsStatus" class="registerStatus" role="status"></p>';
    html += '<table id="exclusionsTable" hidden><thead><tr>';
    html += '<th scope="col">N.</th><th scope="col">Chi ha mostrato</th>';
    html += '<th scope="col">Possibili carte</th><th scope="col">Azioni</th>';
    html += '</tr></thead><tbody></tbody></table></div>';
    return html;
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function(character) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character];
    });
}

// Ogni riga conserva le tre alternative della stessa risposta.
function activateExclusionsRegister() {
    const form = document.getElementById("exclusionsForm");
    const table = document.getElementById("exclusionsTable");
    const body = table.querySelector("tbody");
    const empty = document.getElementById("exclusionsEmpty");
    const status = document.getElementById("exclusionsStatus");
    let nextNumber = 1;

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        if(!form.reportValidity()) return;

        const player = form.elements.namedItem("player");
        const number = nextNumber++;
        const row = document.createElement("tr");
        const numberCell = document.createElement("td");
        numberCell.textContent = number;
        const playerCell = document.createElement("td");
        playerCell.textContent = player.options[player.selectedIndex].textContent;
        const cardsCell = document.createElement("td");
        cardsCell.className = "possibleCards";
        for(const field of ["suspect", "weapon", "room"]) {
            const card = document.createElement("span");
            card.textContent = form.elements.namedItem(field).value;
            cardsCell.appendChild(card);
        }
        const actionsCell = document.createElement("td");
        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "removeCall";
        remove.textContent = "Elimina";
        remove.setAttribute("aria-label", "Elimina chiamata " + number);
        remove.addEventListener("click", function() {
            row.remove();
            table.hidden = body.rows.length === 0;
            empty.hidden = body.rows.length !== 0;
            status.textContent = "Chiamata " + number + " eliminata.";
        });
        actionsCell.appendChild(remove);
        row.append(numberCell, playerCell, cardsCell, actionsCell);
        body.prepend(row);
        table.hidden = false;
        empty.hidden = true;
        status.textContent = "Chiamata " + number + " registrata.";
    });
}

// Costruisce la riga intestazione
function buildHeaderRow(players) {
    let html = "";

    html += "<tr>";
    html += "<th>Carta</th>";

    for(let player of players) {
        html += "<th>" + escapeHtml(player) + "</th>";
    }

    html += "</tr>";

    return html;
}

// Costruisce una riga sezione senza celle giocatore
function buildSectionRow(sectionName, players) {
    let html = "";
    const colspan = players.length + 1;

    html += "<tr>";
    html += '<td class="sectionTitle" colspan="' + colspan + '">' + sectionName + "</td>";
    html += "</tr>";

    return html;
}

// Attiva le celle colorate della tabella Deduzioni
function activateDeductionCells() {
    const cells = document.querySelectorAll(".gameCell");

    for(let cell of cells) {
        cell.addEventListener("click", function() {
            if(cell.style.backgroundColor === "") {
                cell.style.backgroundColor = "red";
            } else if(cell.style.backgroundColor === "red") {
                cell.style.backgroundColor = "green";

                const row = cell.parentElement;
                const rowCells = row.querySelectorAll(".gameCell");

                for(let otherCell of rowCells) {
                    if(otherCell !== cell) {
                        otherCell.style.backgroundColor = "red";
                    }
                }
            } else {
                const row = cell.parentElement;
                const rowCells = row.querySelectorAll(".gameCell");

                for(let otherCell of rowCells) {
                    otherCell.style.backgroundColor = "";
                }
            }
        });
    }
}

// Attiva le celle contatore della tabella Domande fatte
function activateCounterCells() {
    const counterCells = document.querySelectorAll(".counterCell");

    for(let counterCell of counterCells) {
        counterCell.addEventListener("click", function() {
            let currentValue = Number(counterCell.textContent);

            currentValue++;

            if(currentValue > 15) {
                currentValue = 0;
            }

            counterCell.textContent = currentValue;
        });
    }
}
