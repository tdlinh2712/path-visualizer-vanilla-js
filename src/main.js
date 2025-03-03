import { Board } from './Board.js';
import { AlgorithmFactory } from './Algorithms.js';
import { PriorityQueue } from './PriorityQueue.js';
import './AlgorithmHelper.js'; 
import { MazeGenerator } from './MazeGenerator.js';

// Calculate grid size based on window size and cell size
const CELL_SIZE = 25; // pixels
const PADDING = 300;   // pixels for padding/margins

function calculateGridSize() {
    const availableWidth = window.innerWidth - PADDING;
    const availableHeight = window.innerHeight - PADDING;
    
    // Floor to nearest odd number by dividing by 2, flooring, multiplying by 2, and adding 1 so that the maze is always odd number of rows and columns 
    const cols = Math.floor(availableWidth / CELL_SIZE / 2) * 2 + 1;
    const rows = Math.floor(availableHeight / CELL_SIZE / 2) * 2 + 1;
    
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
    const generator = algorithm_factory.findPath(board, board.start_cell, board.target_cell);
    board.visualizePathFindingAlgorithm(generator);
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






