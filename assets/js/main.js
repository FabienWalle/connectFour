var cell = document.querySelectorAll('.cell');
for (let i = 0; i < cell.length; i++) {
    cell[i].addEventListener("click", (event) => {
        tag(event.target);
    });
}
// ajoute l'événement "clique pour ajouter un pion"; en mode CPU, on doit quand même cliquer sur n'importe quel rond pour faire jouer le CPU

var player = "yellow";
// détermine le pemier joueur à l'initialisation et enregistre le joueur qui va jouer
var lap = 0;
// pour déterminer un match nul, compte le nombre de tour dans la manche actuelle
var playerOne = 0;
var playerTwo = 0;
var drawScore = 0;
//score des joueurs et nombre de matchs nuls

const grid = [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15], [0, 4, 8, 12], [1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15], [0, 5, 10, 15], [3, 6, 9, 12]];
// liste des conditions de victoire si on extrait un tableau de 4*4 depuis un plateau de puissance 4 organisé en lignes (et pas en colonnes comme le notre)

function whoPlays() {
    if (player === "red") {
        document.querySelector("#tour").innerText = "jaune"
    } else if (player === "yellow") {
        document.querySelector("#tour").innerText = "rouge"
    }
}
//pour savoir qui doit jouer

function reset() {
    let cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.style.backgroundColor = "";
    });
    player = "yellow";
    lap = 0;
}

function tag(element) {
    if (element.style.backgroundColor == "") {
        player = player === "red" ? "yellow" : "red";
        if (player === "red") {
            gravity(element);
        } else if (player === "yellow" && document.getElementById("checkbox").checked == false) {
            gravity(element);
        } else if (player === "yellow" && document.getElementById("checkbox").checked == true) {
            computer();
        }
        connectFour();
        draw();
        whoPlays();
        lap++;
    }
}
// fonction attribuée à chaque cellule : appelle toutes les autres fonctions et décompte le nombre de tour joué pendant la manche actuelle

function draw() {
    if (lap == 42) {
        reset();
        player = "red";
        drawScore++;
        document.querySelector("#drawScore").innerText = drawScore;
        console.log("égalité");
    }
};
// fonction pour décompter le match nul

function computer() {
    let cells = document.querySelectorAll('.cell');
    let random = randomNumber(0, 41);
    while (true) {
        if (cells[random].style.backgroundColor != "") {
            random = randomNumber(0, 41);
        } else {
            gravity(cells[random]);
            break
        }
    }
}
// fonction pour que le joueur jaune soit une case random et non un joueur, ne s'active qu'au clique

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function connectFour() {
    let cells = document.querySelectorAll('.cell');
    for (let X = 0; X < 19; X = X + 6) {
        for (let Y = 0; Y < 3; Y++) {
            let square = [cells[(Y + X)], cells[(Y + X + 6)], cells[(Y + X + 12)], cells[(Y + X + 18)], cells[(Y + X + 1)], cells[(Y + X + 7)], cells[(Y + X + 13)], cells[(Y + X + 19)], cells[(Y + X + 2)], cells[(Y + X + 8)], cells[(Y + X + 14)], cells[(Y + X + 20)], cells[(Y + X + 3)], cells[(Y + X + 9)], cells[(Y + X + 15)], cells[(Y + X + 21)]];
            // notre plateau étant cartographié en colonnes et non en lignes, cette variable "square" permet, en plus de récupérer un tableau de 4*4, de réorienter l'organisation de notre plateau en lignes et non plus en colonnes, avant de faire les comparaisons; d'où la double boucle étrange en +6 et +1
            for (let i = 0; i != 10; i++) {
                if (square[grid[i][0]].style.backgroundColor == square[grid[i][1]].style.backgroundColor && square[grid[i][1]].style.backgroundColor == square[grid[i][2]].style.backgroundColor && square[grid[i][2]].style.backgroundColor == square[grid[i][3]].style.backgroundColor) {
                    if (square[grid[i][0]].style.backgroundColor == "red") {
                        playerTwo++;
                        document.querySelector("#playerTwoScore").innerText = playerTwo;
                        reset();
                    } else if (square[grid[i][0]].style.backgroundColor == "yellow") {
                        playerOne++;
                        document.querySelector("#playerOneScore").innerText = playerOne;
                        reset();
                    }
                } 
            }
        }
    }
}
// fonction pour vérifier les conditions de victoire : extrait un tableau de 4*4 depuis le plateau de jeu, vérifie si une combinaison de 4 couleurs identiques non blanches est présente (row, column, diag, rDiag), puis décale le tableau sur un axe X horizontal de 3 vers la droite, et sur un axe vertical Y de 2 vers le bas. Ce mouvement ressemble à celui d'une photocopieuse qui balaye de gauche à droite jusqu'à avoir scanner toute le plateau.

function gravity(element) {
    element.style.backgroundColor = player;
    let column = element.parentNode;
    column = column.querySelectorAll('.cell');
    for (let index = 0; index < 5; index++) {
        if (column[(index)].style.backgroundColor != "" && column[(index + 1)].style.backgroundColor == "") {
            column[(index)].style.backgroundColor = "";
            column[(index + 1)].style.backgroundColor = player;
        }
    }
}
// fonction qui permet de faire descendre le jeton joué vers le bas dans la colonne sélectionnée. Le fait d'avoir organisé le HTML en sept "div" verticales contenant 6 "div", et non 6 "div" horizontales contenant 7 "div", facilite la récupération des colonnes pour jouer la gravité. Si A est non blanc et B est blanc, alors A est blanc et B est non blanc.