export const MAZE_ALGORITHMS = {
    PRIM: 'Prim',
    KRUSKAL: 'Kruskal',
    RECURSIVE_BACKTRACKING: 'Recursive Backtracking',
    ELLER: 'Eller'
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
            case MAZE_ALGORITHMS.RECURSIVE_BACKTRACKING:
                this.recursiveBacktrackingMaze(board);
                break;
            case MAZE_ALGORITHMS.ELLER:
                this.ellersMaze(board);
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
        this.currentDelay += -parseInt(document.getElementById("speed-range").value);
    }

    initializeMaze(board) {
        this.currentDelay = 2000;
        board.resetToWalls();
    }

    isValidFrontier(board, frontier) {
        return board.valid_cell(frontier) && board.isWall(frontier);
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

    /** ALGORITHMS IMPLEMENTATION **/

    // Placeholder for Prim's algorithm implementation
    primMaze(board) {
        const start_row = Math.floor(Math.random() * board.rows/2) * 2;
        const start_col = Math.floor(Math.random() * board.cols/2) * 2;
        const start_cell = board.getCell(start_row, start_col);
        this.animateMaze(board, [start_cell]);
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

    recursiveBacktrackingMaze(board) {
        let start_cell = board.getCell(0, 0);
        let visited_cells = new Array(board.rows).fill(0).map(() => new Array(board.cols).fill(false));
        this.recursiveBacktrackingImpl(board, start_cell, visited_cells);
    }

    recursiveBacktrackingImpl(board, cell, visited_cells) {
        visited_cells[cell.row][cell.col] = true;
        this.animateMaze(board, [board.getCell(cell.row, cell.col)]);

        const frontier_list = FRONTIER_DIRECTIONS.map((direction) => {
            return { 
                row: cell.row + direction[0] * 2, // Move 2 cells out for frontiers
                col: cell.col + direction[1] * 2, // Move 2 cells out for frontiers
                direction: direction
            };
        }).filter(frontier => board.valid_cell(frontier) && !visited_cells[frontier.row][frontier.col]);
        while (frontier_list.length > 0) {
            const randomIndex = Math.floor(Math.random() * frontier_list.length);
            const frontier = frontier_list[randomIndex];
            frontier_list.splice(randomIndex, 1);

            // carve a path from current cell to frontier
            if (visited_cells[frontier.row][frontier.col]) {
                //already visited, skip
                continue;
            }
            // carve a path from current cell to frontier
            this.animateMaze(board, [board.getCell(frontier.row - frontier.direction[0], frontier.col - frontier.direction[1])]);
            this.recursiveBacktrackingImpl(board, frontier, visited_cells);
        }
    }

    // Placeholder for Eller's algorithm implementation
    ellersMaze(board) {
        // Initialize the first row with each cell in its own set
        // Even columns get unique set IDs (0,2,4...)
        let cur_set = new Uint16Array(board.cols);  // Creates array pre-filled with 0s
        for(let i = 0; i < board.cols; i++) {
            cur_set[i] = i;
        }

        // Map to track which columns belong to each set
        let set_id_to_col = new Map();

        // Initialize the map with even-numbered columns
        cur_set.forEach((col) => 
            {
                if (col % 2 == 1) {
                    return;  // Skip odd columns (walls)
                }
                set_id_to_col.set(col, [col]); 
            });

        // Process each row of the maze (skip odd rows which are walls)
        for (let row = 0; row < board.rows; row+=2) {
            let last_row = (row + 2 >= board.rows);

            // Step 1: Randomly connect adjacent cells in the current row
            for (let col = 0; col < board.cols - 2; col+=2) {
                if (cur_set[col] != cur_set[col+2]) {
                    // If cells are in different sets, randomly decide to merge them
                    // Always merge if this is the last row
                    let should_merge = last_row ? true : Math.floor(Math.random() * 2);
                    if (should_merge) {
                        // Merge the sets of the two columns
                        this.mergeSetInRow(cur_set, cur_set[col], cur_set[col+2], set_id_to_col);
                        // Carve a path between the cells by removing walls
                        this.animateMaze(board, [board.getCell(row, col), board.getCell(row, col+1), board.getCell(row, col+2)]);
                    }
                }
            }

            // Skip vertical connections if this is the last row
            if (last_row) {
                continue;
            }

            // Step 2: Initialize the next row with new set IDs
            const next_row = new Uint16Array(board.cols);
            for(let i = 0; i < board.cols; i++) {
                next_row[i] = i + (row+2) * board.cols;
            }
            
            // Step 3: For each set in current row, randomly connect at least one cell vertically
            set_id_to_col.forEach((connected_cols, key) => {
                for (let j = 0; j < connected_cols.length * 0.6; j++)
                {
                    // Choose a random column from the current set
                    let random_index = Math.floor(Math.random() * connected_cols.length);
                    let connected_col = connected_cols[random_index];
                    // Connect it to the cell below by giving it the same set ID
                    next_row[connected_col] = key;
                    // Carve a vertical path by removing walls
                    this.animateMaze(board, [board.getCell(row, connected_col), board.getCell(row+1, connected_col), board.getCell(row+2, connected_col)]);
                }
            });

            // Step 4: Reset and rebuild the set_id_to_col map for the next row
            set_id_to_col = new Map();
            next_row.forEach((set_id, col) => 
                {
                    if (col % 2 == 1) {
                        return;  // Skip odd columns (walls)
                    }
                    // Add column to its set in the map
                    const cols_in_set = set_id_to_col.get(set_id);
                    if (cols_in_set) {
                        cols_in_set.push(col);
                    } else {
                        set_id_to_col.set(set_id, [col]); 
                    }
                });

            // Update current row to next row for next iteration
            cur_set = next_row;
        }
        // Note: For the last row, all adjacent cells are connected to ensure a complete maze
    }

    mergeSetInRow(cur_set, new_flag, old_flag, set_id_to_col)
    {
        set_id_to_col.set(new_flag, [...set_id_to_col.get(new_flag), ...set_id_to_col.get(old_flag)]);
        set_id_to_col.delete(old_flag);
        for (let col = 0; col < cur_set.length; col +=2)
        {
            if (cur_set[col] == old_flag)
            {
                cur_set[col] = new_flag;
            }
        }
    }

}
