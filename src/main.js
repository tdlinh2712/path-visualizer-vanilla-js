import { Board } from './Board.js';
import { AlgorithmFactory } from './Algorithms.js';
import { PriorityQueue } from './PriorityQueue.js';
import './AlgorithmHelper.js'; 
import { MazeGenerator } from './MazeGenerator.js';

// Calculate grid size based on window size and cell size
const CELL_SIZE = 25; // pixels
const PADDING = 200;   // pixels for padding/margins

function calculateGridSize() {
    const availableWidth = window.innerWidth - PADDING;
    const availableHeight = window.innerHeight - PADDING;
    
    const cols = Math.floor(availableWidth / CELL_SIZE);
    const rows = Math.floor(availableHeight / CELL_SIZE);
    
    return { rows, cols };
}

// Use the calculated size
const { rows, cols } = calculateGridSize();
const board = new Board("board", rows, cols);

const algorithm_factory = new AlgorithmFactory();

board.initializeElements();

board.resetBoard();
board.generateStartAndTarget();


const start_button = document.getElementById("start-btn");

const reset_button = document.getElementById("reset-btn");

const algorithm_button = document.getElementById("algorithm-btn");

algorithm_factory.initializeAlgorithmSelector(algorithm_button);

algorithm_button.addEventListener("change", () => {
    algorithm_factory.setAlgorithm(algorithm_button.value);
})

reset_button.addEventListener("click", () => {
    board.resetBoard();
    board.generateStartAndTarget();
});

start_button.addEventListener("click", () => {
    // clear all current css
    board.clearBoard();
    const { visited_nodes, found_path } = algorithm_factory.findPath(board, board.start_cell, board.target_cell);
    board.visualizeVisitedNodes(visited_nodes);
    board.visualizeFoundPath(found_path);
});

const maze_generator = new MazeGenerator();
const maze_button = document.getElementById("maze-btn");
const generate_maze_button = document.getElementById("generate-maze-btn");

// Initialize maze selector
maze_generator.initializeMazeSelector(maze_button);

// Add event listeners
maze_button.addEventListener("change", () => {
    maze_generator.setAlgorithm(maze_button.value);
});

generate_maze_button.addEventListener("click", () => {
    maze_generator.generateMaze(board);
});






