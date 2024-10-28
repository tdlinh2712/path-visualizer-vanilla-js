export const MAZE_ALGORITHMS = {
    PRIM: 'Prim',
    KRUSKAL: 'Kruskal'
};

const FRONTIER_DIRECTIONS = [[0, 1] , [1, 0], [0, -1], [-1, 0]];

const KRUSKAL_DIRECTIONS = [[0, 1] , [1, 0]];

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
        // 1. Initialize each cell with unique set ID
        const cell_flags = [];
        const frontier_list = [];
        let setId = 0;
        
        for (let i = 0; i < board.rows; i++) {
            cell_flags.push([]);
            for (let j = 0; j < board.cols; j++) {
                // Give each cell a unique set ID
                cell_flags[i].push(i % 2 === 0 && j % 2 === 0 ? setId++ : -1);
                
                // Only consider cells that can be part of the maze (even coordinates)
                if (i % 2 === 0 && j % 2 === 0) {
                    const cell = board.getCell(i, j);
                    const frontiers = KRUSKAL_DIRECTIONS.map(direction => ({
                        row: cell.row + direction[0] * 2,
                        col: cell.col + direction[1] * 2,
                        direction: direction,
                        fromRow: cell.row,
                        fromCol: cell.col
                    })).filter(frontier => this.isValidFrontier(board, frontier));
                    frontier_list.push(...frontiers);
                }
            }
        }
        
        while (frontier_list.length > 0) {
            const randomIndex = Math.floor(Math.random() * frontier_list.length);
            const frontier = frontier_list[randomIndex];
            frontier_list.splice(randomIndex, 1);
            
            const set1 = cell_flags[frontier.fromRow][frontier.fromCol];
            const set2 = cell_flags[frontier.row][frontier.col];
            
            // Only connect cells from different sets
            if (set1 !== set2 && set1 !== -1 && set2 !== -1) {
                // Carve the path
                board.toggleWall(board.getCell(frontier.row, frontier.col).dom, false);
                board.toggleWall(board.getCell(
                    frontier.fromRow + frontier.direction[0],
                    frontier.fromCol + frontier.direction[1]
                ).dom, false);
                
                // Merge sets
                const oldSet = set2;
                for (let i = 0; i < cell_flags.length; i++) {
                    for (let j = 0; j < cell_flags[i].length; j++) {
                        if (cell_flags[i][j] === oldSet) {
                            cell_flags[i][j] = set1;
                        }
                    }
                }
            }
        }
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
