
export class Board {
    constructor(element_id, rows, cols) {
        this.board = document.getElementById(element_id);
        this.rows = rows;
        this.cols = cols;
        this.currentDelay = 0;
        this.start_cell = null;
        this.target_cell = null;
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
        this.resetDelayTime();
        this.resetStartAndTarget();
        this.generateStartAndTarget();
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
        this.end_cell = null;
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

    valid_cell(cell)
    {
        return cell.row >= 0 && cell.col >= 0 && cell.row < this.rows && cell.col < this.cols;
    }

    get_random_cell()
    {
        let row = Math.floor(Math.random() * this.rows);
        let col = Math.floor(Math.random() * this.cols);
        return { row, col};
    }

    generateStartAndTarget()
    {
        let start_cell = this.get_random_cell();
        this.start_cell = start_cell;
        this.start_cell.dom = this.board.rows[start_cell.row].cells[start_cell.col];
        this.start_cell.dom.innerText = ">";

        let target_cell = { row: start_cell.row, col: start_cell.col };
        while (target_cell.row === start_cell.row && target_cell.col === start_cell.col)
        {
            (target_cell = this.get_random_cell());
        }
        this.target_cell = target_cell;
        this.target_cell.dom = this.board.rows[target_cell.row].cells[target_cell.col];
        this.target_cell.dom.innerText = "x";
    }


}