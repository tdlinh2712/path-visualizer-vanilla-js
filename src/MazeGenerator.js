export const MAZE_ALGORITHMS = {
    PRIM: 'Prim',
    KRUSKAL: 'Kruskal'
};

const FRONTIER_DIRECTIONS = [[0, 1] , [1, 0], [0, -1], [-1, 0]];

const KRUSKAL_DIRECTIONS = {
    HORIZONTAL: [0, 1],
    VERTICAL: [1, 0]
};

Object.freeze(MAZE_ALGORITHMS);

export class MazeGenerator {
    constructor() {
        this.currentAlgorithm = MAZE_ALGORITHMS.PRIM; // default algorithm
    }

    setAlgorithm(algorithm) {
        this.currentAlgorithm = algorithm;
    }

    generateMaze(board) {
        this.initializeMaze(board);
        switch(this.currentAlgorithm) {
            case MAZE_ALGORITHMS.PRIM: 
                this.primMaze(board);
                break;
            case MAZE_ALGORITHMS.KRUSKAL:
                this.kruskalMaze(board);
                break;
            default:
                console.error('Unknown maze generation algorithm');
                return;
        }
        // set begining cell and ending cell as start and target
        setTimeout(() => {
            let start_cell = { row: 0, col: 0 };
            let target_cell = { row: board.rows - 1, col: board.cols - 1 };
            board.setStartAndTarget(start_cell, target_cell);
        }, this.currentDelay);
    }

    animateMaze(board, frontiers) {
        setTimeout(() => {
            frontiers.forEach(frontier => {
                if (frontier.dom) {
                    frontier.dom.classList.add('maze-reveal');
                    board.untoggleWall(frontier.dom);
                }
            });
        }, this.currentDelay);
        this.currentDelay += 10;
    }

    initializeMaze(board) {
        this.currentDelay = 0;
        board.resetBoard();
        for (let i = 0; i < board.rows; i++) {
            for (let j = 0; j < board.cols; j++) {
                board.toggleWall(board.getCell(i, j).dom);
            }
        }
    }

    isValidFrontier(board, frontier) {
        return board.valid_cell(frontier) && board.isWall(frontier);
    }

    // Placeholder for Prim's algorithm implementation
    primMaze(board) {
        // 1. Get a random even-numbered cell as the starting point
        const evenRow = 2 * Math.floor(Math.random() * Math.floor(board.rows / 2));
        const evenCol = 2 * Math.floor(Math.random() * Math.floor(board.cols / 2));
        const start_cell = board.getCell(evenRow, evenCol);
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
                frontier.dom = board.getCell(frontier.row, frontier.col).dom;
                this.animateMaze(board, [frontier, inBetweenCell ]);
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
        const frontier_list = [];
        let cur_flag = 1;
        let cell_flags = new Array(board.rows).fill(0).map(() => new Array(board.cols).fill(0));
        for (let i = 0; i < board.rows; i+=2) 
        {
            for (let j = 0; j < board.cols; j+=2) 
            {
                if (j + KRUSKAL_DIRECTIONS.HORIZONTAL[1] * 2 < board.cols)
                {
                    frontier_list.push({
                        row: i,
                        col: j,
                        direction: KRUSKAL_DIRECTIONS.HORIZONTAL
                    });
                }
                if (i + KRUSKAL_DIRECTIONS.VERTICAL[0] * 2 < board.rows)
                {
                    frontier_list.push({
                        row: i,
                        col: j,
                        direction: KRUSKAL_DIRECTIONS.VERTICAL
                    });
                }
                cell_flags[i][j] = cur_flag;
                cur_flag++;                
            }
        }

        while (frontier_list.length > 0) {
            const randomIndex = Math.floor(Math.random() * frontier_list.length);
            const frontier = frontier_list[randomIndex];
            const connectingCell = {
                row: frontier.row + frontier.direction[0] * 2,
                col: frontier.col + frontier.direction[1] * 2
            };
            if (cell_flags[connectingCell.row][connectingCell.col] !== cell_flags[frontier.row][frontier.col]) {
                const oldFlag = cell_flags[connectingCell.row][connectingCell.col];
                const newFlag = cell_flags[frontier.row][frontier.col];
                
                // Use the existing replaceFlag method instead of inline replacement
                cell_flags = this.replaceFlag(cell_flags, oldFlag, newFlag);
                // TODO: move this to a separate function
                // connect the two cells
                const added_cells = [];
                for (let i = frontier.row; i <= connectingCell.row; i++) {
                    for (let j = frontier.col; j <= connectingCell.col; j++) {
                        const cell = board.getCell(i, j);
                        added_cells.push(cell);
                    }
                }
                this.animateMaze(board, added_cells);
            }
            frontier_list.splice(randomIndex, 1);
        }
    }

    replaceFlag(cell_flags, old_flag, new_flag) {
        for (let i = 0; i < cell_flags.length; i+=2) {
            for (let j = 0; j < cell_flags[i].length; j+=2) {
                if (cell_flags[i][j] === old_flag) {
                    cell_flags[i][j] = new_flag;
                }
            }
        }
        return cell_flags;
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
