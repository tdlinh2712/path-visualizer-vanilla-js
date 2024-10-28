import { MazeGenerator } from '../MazeGenerator.js';
import { Board } from '../Board.js';

describe('MazeGenerator', () => {
    let mazeGenerator;
    let board;

    beforeEach(() => {
        document.body.innerHTML = '<table id="board"></table>';
        mazeGenerator = new MazeGenerator();
        board = new Board('board', 10, 10);
        board.initializeElements();
    });

    test('Initialize with default algorithm', () => {
        expect(mazeGenerator.currentAlgorithm).toBe('Prim');
    });

    test('Set algorithm', () => {
        mazeGenerator.setAlgorithm('Kruskal');
        expect(mazeGenerator.currentAlgorithm).toBe('Kruskal');
    });

    test('Initialize maze selector', () => {
        const selector = document.createElement('select');
        mazeGenerator.initializeMazeSelector(selector);
        expect(selector.children.length).toBe(2);
        expect(selector.children[0].value).toBe('Prim');
        expect(selector.children[1].value).toBe('Kruskal');
    });
});
