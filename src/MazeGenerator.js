export const MAZE_ALGORITHMS = {
    PRIM: 'Prim',
    KRUSKAL: 'Kruskal'
};

const FRONTIER_DIRECTIONS = [[0, 1] , [1, 0], [0, -1], [-1, 0]];


Object.freeze(MAZE_ALGORITHMS);

export class MazeGenerator {
    constructor() {
        this.currentAlgorithm = MAZE_ALGORITHMS.PRIM; // default algorithm
    }

    setAlgorithm(algorithm) {
        this.currentAlgorithm = algorithm;
    }

    generateMaze(board) {
        board.clearBoard();
        switch(this.currentAlgorithm) {
            case MAZE_ALGORITHMS.PRIM:
                return this.primMaze(board);
            case MAZE_ALGORITHMS.KRUSKAL:
                return this.kruskalMaze(board);
            default:
                console.error('Unknown maze generation algorithm');
                return;
        }
    }

    isValidFrontier(board, frontier) {
        return board.valid_cell(frontier) && !board.isWall(frontier);
    }

    isValidNonWallCell(board, cell) {
        return board.valid_cell(cell) && !board.isWall(cell) && !board.isTarget(cell) && !board.isStart(cell);
    }

    // Placeholder for Prim's algorithm implementation
    primMaze(board) {
        // 1. Pick a random cell as the starting point
        const start_cell = board.getRandomCell();
        // Keep track of visited cells to prevent loops
        const visited_cells = new Set();
        visited_cells.add(`${start_cell.row},${start_cell.col}`);

        // 2. Add all of its frontiers to the frontier list 
        const frontier_list = FRONTIER_DIRECTIONS.map((direction) => {
            return { 
                row: start_cell.row + direction[0] * 2, // Move 2 cells out for frontiers
                col: start_cell.col + direction[1] * 2, // Move 2 cells out for frontiers
                direction: direction
            };
        }).filter(frontier => this.isValidFrontier(board, frontier, []));

        while (frontier_list.length > 0) {
            const randomIndex = Math.floor(Math.random() * frontier_list.length);
            const frontier = frontier_list[randomIndex];
            frontier_list.splice(randomIndex, 1);

            const frontierKey = `${frontier.row},${frontier.col}`;
            if (visited_cells.has(frontierKey)) continue;
            
            visited_cells.add(frontierKey);

            if (this.isValidFrontier(board, frontier)) {
                // Get the cell between the frontier and its parent
                const inBetweenCell = {
                    row: frontier.row - frontier.direction[0], // Move 1 cell back from frontier
                    col: frontier.col - frontier.direction[1]  // Move 1 cell back from frontier
                };
                
                inBetweenCell.dom = board.getCell(inBetweenCell.row, inBetweenCell.col).dom;
                board.toggleWall(inBetweenCell.dom, false);
                frontier.dom = board.getCell(frontier.row, frontier.col).dom;
                board.toggleWall(frontier.dom, false);
                // Add new frontiers 2 cells out
                FRONTIER_DIRECTIONS.forEach(direction => {
                    const newFrontier = {
                        row: frontier.row + direction[0] * 2, // Move 2 cells out
                        col: frontier.col + direction[1] * 2, // Move 2 cells out
                        direction: direction
                    };
                    
                    frontier_list.push(newFrontier);
                });
            }
        }
    }

    // Placeholder for Kruskal's algorithm implementation
    kruskalMaze(board) {
        console.log('Kruskal\'s maze generation to be implemented');
        // Implementation will go here
    }

    initializeMazeSelector(selector) {
        const algorithms = Object.values(MAZE_ALGORITHMS);
        
        // Clear existing options
        selector.innerHTML = '';
        
        // Add maze generation algorithms to selector
        algorithms.forEach(algorithm => {
            const option = document.createElement('option');
            option.value = algorithm;
            option.text = `${algorithm}'s Algorithm`;
            selector.appendChild(option);
        });
    }
}
