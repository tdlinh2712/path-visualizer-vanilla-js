const WALL_CLASS = "wall";
const NOT_WALL_CLASS = "not-wall";

export class Board {
    constructor(element_id, rows, cols) {
        this.board = document.getElementById(element_id);
        this.rows = rows;
        this.cols = cols;
        this.currentDelay = 0;
        this.start_cell = null;
        this.target_cell = null;
        this.isMouseDown = false;
        this.addWallEventListeners();
        this.visitedNodes = [];
        this.foundPath = [];
        this.stat = { visited_cells: 0, path_length: 0, elapsedTime: 0 };
    }

    // Initializations, reset board etc
    initializeElements() {
        for (let row_index = 0; row_index < this.rows; row_index++) {
            let row = this.board.insertRow(row_index);
            for (let col = 0; col < this.cols; col++) {
                row.insertCell(col);
            }
        }
    }

    resetDelayTime() {
        this.currentDelay = 0;
    }

    resetBoard()
    {
        this.clearBoard();
        this.clearWalls();
        this.resetDelayTime();
        this.resetStartAndTarget();
        this.stat = { visited_cells: 0, path_length: 0, elapsedTime: 0 };
    }

    clearBoard()
    {
        this.visitedNodes.forEach((cell, i) => 
        {
            const cell_dom = this.board.rows[cell.row].cells[cell.col];
            cell_dom.classList.remove("visitedNode");
        });

        this.foundPath.forEach((cell, i) => 
            {
                const cell_dom = this.board.rows[cell.row].cells[cell.col];
                cell_dom.classList.remove("shortestPath");
            });

        this.resetDelayTime();
    }

    fillWithWalls() {
        this.board.classList.add('fill-walls');
    }

    clearWalls() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const cell = this.board.rows[i].cells[j];
                cell.classList.remove(WALL_CLASS);
            }
        }
    }

    resetStartAndTarget()
    {
        if (this.start_cell != null) {
            this.start_cell.dom.classList.remove('start-cell');
        }
        if (this.target_cell != null) {
            this.target_cell.dom.classList.remove('target-cell');
        }
        this.start_cell = null;
        this.target_cell = null;
    }
    // visualizing paths

    visualizeNewVisitedCell(cell)
    {
        if(this.containsClass(cell, "visitedNode")) {
            return;
        }
        if (this.isStart(cell) || this.isTarget(cell)) {
            return;
        }
        this.stat.visited_cells += 1;
        const cell_dom = this.board.rows[cell.row].cells[cell.col];
        cell_dom.className = "visitedNode";
    }

    visualizeFoundPath(new_path)
    {
        let diff_index = Math.min(new_path.length, this.foundPath.length)
            // undo the differences
            for (let i = 1; i < Math.min(new_path.length, this.foundPath.length); i++)
            {
                const new_cell = new_path[i];
                const curr_cell = this.foundPath[i];
                if (new_cell.row != curr_cell.row || new_cell.col != curr_cell.col)
                {
                    diff_index = i;
                    break;
                }
            }
        this.foundPath.slice(diff_index).forEach((cell, i) => {
            const cell_dom = this.board.rows[cell.row].cells[cell.col];
            cell_dom.className = "visitedNode";
        })
        new_path.slice(diff_index).forEach((cell, i) => {
            if (this.isStart(cell) || this.isTarget(cell)) {
                return;
            }
            const cell_dom = this.board.rows[cell.row].cells[cell.col];
            cell_dom.className = "shortestPath";
        });
        this.foundPath = new_path;
        this.stat.path_length = this.foundPath.length;
    }

    displayStat() {
        const statElement = document.getElementById("stat");
        statElement.innerHTML = `
            <div class="stat-value">Visited Nodes: ${this.stat.visited_cells}</div>
            <div class="stat-value">Path Length: ${this.stat.path_length}</div>
            <div class="stat-value">Time Elapsed: ${this.stat.elapsedTime}</div>
        `;
    }

    visualizePathFindingAlgorithm(func)
    {
        this.foundPath = []
        const startTime = Date.now();
        const id = setInterval(() => {
            const current_time = Date.now();
            this.stat.elapsedTime = (Date.now() - startTime) / 1000; // Calculate elapsed time in seconds
            const result = func.next();
            if (result.done)
            {
                
                clearInterval(id);
                const {visited_nodes, found_path} = result.value;
                this.visitedNodes = visited_nodes;
                // this.foundPath = found_path;
                this.visualizeFoundPath(found_path);
                this.displayStat();
                return;
            }
            const [new_visited_node, current_path] = result.value;
            // animate new_visited_node
            this.visualizeNewVisitedCell(new_visited_node);
            // animate current_path
            this.visualizeFoundPath(current_path);
            this.displayStat();
        }, document.getElementById("speed-range").value * -5);
    }

    // algorithms

    valid_cell(cell) {
        // Check if out of bounds
        if (cell.row < 0 || cell.col < 0 || cell.row >= this.rows || cell.col >= this.cols) {
            return false;
        }
        
        return true;
    }

    getRandomCell()
    {
        let row = Math.floor(Math.random() * this.rows);
        let col = Math.floor(Math.random() * this.cols);
        return { row, col};
    }

    getCell(row, col) {
        return {
            dom: this.board.rows[row].cells[col],
            row,
            col
        };

    }

    generateStartAndTarget()
    {
        let start_cell = null;
        do {
            start_cell = this.getRandomCell();
        } while (this.isWall(this.getCell(start_cell.row, start_cell.col)));
        let target_cell = null;
        do {
            target_cell = this.getRandomCell();
        } while ((target_cell.row === start_cell.row && target_cell.col === start_cell.col) || this.isWall(this.getCell(target_cell.row, target_cell.col)));
        this.setStartAndTarget(start_cell, target_cell);
    }

    setStartAndTarget(start_cell, target_cell) {
        this.resetStartAndTarget();
        this.start_cell = start_cell;
        this.start_cell.dom = this.board.rows[start_cell.row].cells[start_cell.col];
        this.start_cell.dom.classList.add('start-cell');

        this.target_cell = target_cell;
        this.target_cell.dom = this.board.rows[target_cell.row].cells[target_cell.col];
        this.target_cell.dom.classList.add('target-cell');
    }

    addWallEventListeners() {
        this.board.addEventListener('dragstart', (e) => e.preventDefault());
        
        this.board.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.isMouseDown = true;
            if (e.target.tagName === 'TD') {
                this.toggleWall(e.target);
            }
        });

        this.board.addEventListener('mouseover', (e) => {
            if (this.isMouseDown && e.target.tagName === 'TD') {
                this.toggleWall(e.target);
            }
        });

        window.addEventListener('mouseup', () => {
            this.isMouseDown = false;
        });
    }

    resetToWalls() {
        this.clearBoard();
        this.resetDelayTime();
        this.resetStartAndTarget();
        const fragment = document.createDocumentFragment();
        
        // 1. Build new table structure in memory (not in DOM yet)
        for (let row = 0; row < this.rows; row++) {
            const tr = document.createElement('tr');
            for (let col = 0; col < this.cols; col++) {
                const td = document.createElement('td');
                td.classList.add('wall');
                tr.appendChild(td);
            }
            fragment.appendChild(tr);
        }
        
        // 2. Clear existing table completely
        this.board.innerHTML = '';
        
        // 3. Add new table structure
        this.board.appendChild(fragment);  // Replaces empty content with new table
    }

    toggleWall(cell) {
        // Get the row and column from the cell's position in the table
        const row = cell.parentNode.rowIndex;
        const col = cell.cellIndex;
        
        // Compare with stored start and target cell coordinates
        if ((this.start_cell && row === this.start_cell.row && col === this.start_cell.col) ||
            (this.target_cell && row === this.target_cell.row && col === this.target_cell.col)) {
            return;
        }
        cell.classList.add(WALL_CLASS);
    }

    untoggleWall(cell) {
        cell.classList.remove(WALL_CLASS);
    }

    isWall(cell) {
        return this.board.rows[cell.row].cells[cell.col].classList.contains(WALL_CLASS);
    }

    isTarget(cell) {
        return cell.row === this.target_cell.row && cell.col === this.target_cell.col;
    }

    isStart(cell) {
        return cell.row === this.start_cell.row && cell.col === this.start_cell.col;
    }

    containsClass(cell, className) {
        return this.board.rows[cell.row].cells[cell.col].classList.contains(className);
    }
}