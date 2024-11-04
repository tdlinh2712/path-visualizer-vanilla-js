const START_SYMBOL = ">";
const TARGET_SYMBOL = "X";
const WALL_CLASS = "wall";

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
    }

    clearBoard()
    {
        for (let i = 0 ; i < this.rows; i++)
        {
            for (let j = 0; j < this.cols; j++)
            {
                const cell = this.board.rows[i].cells[j];
                cell.classList.remove("visitedNode");
                cell.classList.remove("shortestPath");
            }
        }
        this.resetDelayTime();
    }

    clearWalls() {
        for (let i = 0 ; i < this.rows; i++)
        {
            for (let j = 0; j < this.cols; j++)
            {
                const cell = this.board.rows[i].cells[j];
                cell.classList.remove(WALL_CLASS);
            }
        }
    }

    resetStartAndTarget()
    {
        // if currently there's a start and end node, we need to reset the content of that node
        if (this.start_cell != null)
        {
            this.start_cell.dom.innerText="";
        }
        if (this.target_cell != null)
        {
            this.target_cell.dom.innerText="";
        }
        this.start_cell = null;
        this.target_cell = null;
    }
    // visualizing paths

    visualizeVisitedNodes(visitedNodes)
    {
        visitedNodes.forEach((cell, i) => {
            const cell_dom = this.board.rows[cell.row].cells[cell.col];
            setTimeout(() => {
                cell_dom.className = "visitedNode";
                }, i * 2 + this.currentDelay);
        });

        this.currentDelay += visitedNodes.length * 2;
    }

    visualizeFoundPath(foundPath)
    {
        foundPath.forEach((cell, i) => {
            const cell_dom = board.rows[cell.row].cells[cell.col];
            setTimeout(() => {
                cell_dom.className = "shortestPath";
            }, i * 5 + this.currentDelay);
        });
        this.currentDelay += foundPath.length * 5;
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
        this.start_cell = start_cell;
        this.start_cell.dom = this.board.rows[start_cell.row].cells[start_cell.col];
        this.start_cell.dom.innerText = START_SYMBOL;

        let target_cell = null;
        do {
            target_cell = this.getRandomCell();
        } while ((target_cell.row === start_cell.row && target_cell.col === start_cell.col) || this.isWall(this.getCell(target_cell.row, target_cell.col)));

        this.target_cell = target_cell;
        this.target_cell.dom = this.board.rows[target_cell.row].cells[target_cell.col];
        this.target_cell.dom.innerText = TARGET_SYMBOL;
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

    toggleWall(cell) {
        if (cell.innerText === START_SYMBOL || cell.innerText === TARGET_SYMBOL) {
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
}