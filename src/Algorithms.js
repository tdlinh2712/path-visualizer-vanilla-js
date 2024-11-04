import {PriorityQueue} from "./PriorityQueue.js";
import {euclidean_distance, is_target, manhattan_distance, should_skip_cell} from "./AlgorithmHelper.js";

export const SUPPORTED_ALGOS = Object.freeze({
    BFS:   "BFS",
    DFS:  "DFS",
    DIJIKSTRA: "Dijikstra",
    A_STAR: "A*",
});

const CELL_DIRECTIONS = [[0, 1] , [1, 0], [0, -1], [-1, 0]];

export class AlgorithmFactory
{
    constructor() {
        this.supported_algorithms = SUPPORTED_ALGOS;
        this.current_algorithm = SUPPORTED_ALGOS.BFS;
        this.selector_dom = null;
    }

    initializeAlgorithmSelector(algorithm_button)
    {
        this.selector_dom = algorithm_button;
        for (var [key, value] of Object.entries(this.supported_algorithms)){
            var opt = document.createElement('option');
            opt.value = value;
            opt.innerHTML = value;
            algorithm_button.appendChild(opt);
        }
        //initialize to BFS
        algorithm_button.value = this.current_algorithm;
    }

    setAlgorithm(algo)
    {
        this.current_algorithm = algo;
    }

    findPath(board, start_cell, target_cell)
    {
        switch (this.current_algorithm) {
            case SUPPORTED_ALGOS.BFS:
            {
                return AlgorithmFactory.BFS(board, start_cell, target_cell);
            }
            case SUPPORTED_ALGOS.DFS:
            {
                return AlgorithmFactory.DFS(board, start_cell, target_cell);
            }
            case SUPPORTED_ALGOS.DIJIKSTRA:
            {
                return AlgorithmFactory.Dijikstra(board, start_cell, target_cell);
            }
            case SUPPORTED_ALGOS.A_STAR:
            {
                return AlgorithmFactory.AStar(board, start_cell, target_cell);
            }
            default:
                console.log("Unsupported option ", this.current_algorithm);
                return {visited_nodes: [], found_path: []}
        }
    }

    static BFS(board, start_cell, target_cell)
    {
        let seen = [];
        let queue = [];
        queue.push({...start_cell, prev: [start_cell] });
        seen.push(start_cell);
        while (queue.length > 0)
        {
            const cur_cell = queue.shift();
            for (let i = 0; i < CELL_DIRECTIONS.length; i++)
            {
                const next_cell = {row: cur_cell.row + CELL_DIRECTIONS[i][0], col:  cur_cell.col + CELL_DIRECTIONS[i][1]};

                if (should_skip_cell(next_cell, board, seen)) {
                    continue;
                }
                seen.push(next_cell);
                const prev = [...cur_cell.prev, next_cell];
                if (is_target(next_cell, target_cell))
                {
                    // found target
                    return {visited_nodes: seen, found_path: prev};
                }
                queue.push({...next_cell, prev: prev});
            }
        }
        return {visited_nodes: seen, found_path: []};
    }

    static DFS(board, start_cell, target_cell)
    {
        let seen = [];
        let current_path = [];
        return AlgorithmFactory.DFSImpl(board, start_cell, target_cell, current_path);
    }

    static DFSImpl(board, cur_cell, target_cell, seen)
    {
        seen.push(cur_cell);
        if (is_target(cur_cell, target_cell))
        {
            // found target
            return {visited_nodes: seen, found_path: [cur_cell]};
        }
        for (let i = 0; i < CELL_DIRECTIONS.length; i++)
        {
            const next_cell = {row: cur_cell.row + CELL_DIRECTIONS[i][0], col:  cur_cell.col + CELL_DIRECTIONS[i][1]};

            if (should_skip_cell(next_cell, board, seen)) {
                continue;
            }
            //otherwise, explore this node
            const { found_path } = AlgorithmFactory.DFSImpl(board, next_cell, target_cell, seen);
            if (found_path.length > 0)
            {
                return {visited_nodes: seen, found_path: [ cur_cell, ...found_path] };
            }
        }
        return {visited_nodes: seen, found_path: []};
    }

    static Dijikstra(board, start_cell, target_cell)
    {
        let visited_nodes = [];
        let unvisited = new PriorityQueue();
        unvisited.enqueue({...start_cell, path: [start_cell] }, 0 );
        while (unvisited.size() > 0)
        {
            const {node : smallest_node, priority} = unvisited.dequeue();
            if (is_target(smallest_node, target_cell))
            {
                return { visited_nodes, found_path: smallest_node.path };
            }
            if (should_skip_cell(smallest_node, board, visited_nodes)) {
                continue;
            }
            visited_nodes.push(smallest_node);
            // otherwise, keep updating adjacent node
            for (let i = 0; i < CELL_DIRECTIONS.length; i++) {
                const next_cell = {
                    row: smallest_node.row + CELL_DIRECTIONS[i][0],
                    col: smallest_node.col + CELL_DIRECTIONS[i][1]
                };
                if (!should_skip_cell(next_cell, board, visited_nodes)) {
                    unvisited.enqueue({ ...next_cell, path: [...smallest_node.path, next_cell] }, priority + 1);
                }
            }
        }
        return {visited_nodes, found_path: []};
    }

    static AStar(board, start_cell, target_cell)
    {
        let visited_nodes = [];
        let unvisited = new PriorityQueue();
        // distance: current path length, heuristic: eucledian distance from cell to target
        unvisited.enqueue({...start_cell, path: [start_cell], distance : 0, heuristic: 0 }, 0 );
        while (unvisited.size() > 0)
        {
            const {node : smallest_node } = unvisited.dequeue();
            if (is_target(smallest_node, target_cell))
            {
                return { visited_nodes, found_path: smallest_node.path };
            }
            if (should_skip_cell(smallest_node, board, visited_nodes)) {
                continue;
            }
            visited_nodes.push(smallest_node);
            // otherwise, keep updating adjacent node
            for (let i = 0; i < CELL_DIRECTIONS.length; i++) {
                const next_cell = {
                    row: smallest_node.row + CELL_DIRECTIONS[i][0],
                    col: smallest_node.col + CELL_DIRECTIONS[i][1]
                };
                if (!should_skip_cell(next_cell, board, visited_nodes)) {
                    let node = { ...next_cell, path: [...smallest_node.path, next_cell] , distance : smallest_node.distance + 1, heuristic: manhattan_distance(next_cell, target_cell) };
                    unvisited.enqueue( node , node.distance + node.heuristic);
                }
            }
        }
        return {visited_nodes, found_path: []};
    }
}