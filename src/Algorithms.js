import {Board} from './Board.js';

export class AlgorithmFactory
{
    constructor() {
    }

    static bfs(board, start_cell, target_cell)
    {
        // console.log("finding path ", start_cell, target_cell);
        let seen = [];
        const directions = [[0, 1], [0, -1] , [1, 0], [-1, 0]];
        let queue = [];
        queue.push({...start_cell, prev: [start_cell] });
        seen.push(start_cell);
        while (queue.length > 0)
        {
            const cur_cell = queue.shift();
            for (let i = 0; i < directions.length; i++)
            {
                const next_cell = {row: cur_cell.row + directions[i][0], col:  cur_cell.col + directions[i][1]};

                if (!board.valid_cell(next_cell) || seen.find((cell) => cell.row === next_cell.row && cell.col === next_cell.col)) {
                    continue;
                }
                seen.push(next_cell);
                const prev = [...cur_cell.prev, next_cell];
                if (next_cell.row === target_cell.row && next_cell.col === target_cell.col)
                {
                    // found target
                    return {visited_nodes: seen, found_path: prev};
                }
                queue.push({...next_cell, prev: prev});
            }
        }
    }
}