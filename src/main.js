import { Board } from './Board.js';
import { AlgorithmFactory } from "./Algorithms.js";

let rows = 20;
let cols = 30;

const board = new Board("board", rows, cols);

const algoirthm_factory = new AlgorithmFactory();

board.initializeElements();

board.resetBoard();


const start_button = document.getElementById("start-btn");

const reset_button = document.getElementById("reset-btn");

// const Algorithm = Object.freeze({
//     BFS:   Symbol("bfs"),
//     DFS:  Symbol("dfs"),
//     DIJIKSTRA: Symbol("dijikstra")
// });

let selected_algorithm = "bfs";

const algorithm_button = document.getElementById("algorithm-btn");


reset_button.addEventListener("click", () => {
    board.resetBoard(board);
});

start_button.addEventListener("click", () => {
    // clear all current css
    board.clearBoard();
    let visited_nodes = [];
    let found_path = [];
    // try bfs
    switch (selected_algorithm) {
        case "bfs":
        {
            ({visited_nodes, found_path} = AlgorithmFactory.bfs(board, board.start_cell, board.target_cell));
            break;
        }
        case "dfs":
        {
            break;
        }
        case "dijikstra":
        {
            break;
        }
    }


    board.visualizeVisitedNodes(visited_nodes);
    board.visualizeFoundPath(found_path);
});

algorithm_button.addEventListener("change", () => {
    selected_algorithm = algorithm_button.value;
    console.log(selected_algorithm);
})




