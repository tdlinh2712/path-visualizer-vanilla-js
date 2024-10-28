// helper functions
export const should_skip_cell = (cell, board, seen) =>
{
    // check if cell is invalid, or a wall, or if we've seen this cell before
    return !board.valid_cell(cell) || board.isWall(cell) || seen.find((seen_cell) => seen_cell.row === cell.row && seen_cell.col === cell.col);
}

export const is_target = (cell, target_cell) =>
{
    return (cell.row === target_cell.row && cell.col === target_cell.col);
}

export const manhattan_distance = (cell, target_cell) =>
{
    return Math.abs(cell.row - target_cell.row) + Math.abs(cell.col - target_cell.col);
}

export const euclidean_distance = (cell, target_cell) =>
{
    const row_sq = Math.pow(cell.row - target_cell.row, 2);
    const col_sq = Math.pow(cell.col - target_cell.col, 2);
    return Math.sqrt(row_sq + row_sq);
}