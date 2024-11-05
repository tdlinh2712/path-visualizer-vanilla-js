# Path Finding Visualizer

A vanilla JavaScript implementation of popular pathfinding algorithms and maze generation algorithms with interactive visualization.

## 🚀 Features

- **Pathfinding Algorithms**
  - Breadth-First Search (BFS)
  - Depth-First Search (DFS)
  - Dijkstra's Algorithm
  - A* Search

- **Maze Generation Algorithms**
  - Prim's Algorithm
  - Kruskal's Algorithm
  - Recursive Backtracking
  - Eller's Algorithm

- **Interactive Features**
  - Click and drag to create walls
  - Generate random mazes
  - Visualize algorithm execution
  - Adjustable grid size
  - Real-time animation

## 🎮 How to Use

1. **Select Algorithm**
   - Choose a pathfinding algorithm from the dropdown menu
   - Choose a maze generation algorithm if desired

2. **Create Maze**
   - Click "Generate Maze" to create a random maze, or
   - Draw walls manually by clicking and dragging on the grid

3. **Start Visualization**
   - Click "Start" to begin the pathfinding visualization
   - Use "Reset Board" to clear the grid

## 🛠️ Technical Details

### Grid System
- Dynamic grid sizing based on window dimensions
- Odd-numbered rows and columns for proper maze generation
- Cell size: 25px

### Visualization
- Custom CSS animations for:
  - Path discovery
  - Shortest path
  - Wall creation
  - Start/Target cells

### Implementation
- Pure JavaScript (no frameworks)
- CSS Grid for layout
- Custom Priority Queue implementation
- Object-oriented design

## 🎯 Algorithms

### Pathfinding
- **BFS**: Guarantees shortest path, explores uniformly
- **DFS**: Memory efficient, not optimal for shortest paths
- **Dijkstra**: Optimal for weighted graphs
- **A***: Optimal with heuristic-based search

### Maze Generation
- **Prim's**: Creates perfect mazes with uniform distribution. Grows from a single point, resulting in balanced patterns and evenly distributed passages. Ideal for traditional, symmetrical-feeling mazes.
- **Kruskal's**: Generates mazes with longer corridors. Works by randomly connecting separate regions simultaneously, creating more winding passages and stretched-out patterns. Good for exploratory mazes.
- **Recursive Backtracking**: Creates mazes with fewer branches. Uses depth-first approach, following a single path until it hits a dead end before backtracking. Tends to create long, winding corridors with fewer alternative paths, resulting in more linear, snake-like patterns.
- **Eller's**: Memory-efficient, row-by-row generation. Builds the maze one row at a time while maintaining only one row in memory. Creates mazes with a good balance of straight passages and random connections between rows. Particularly efficient for generating large mazes.

## 🚀 Getting Started

1. Clone the repository
```bash
git clone https://github.com/yourusername/path-finding-visualizer.git
```

2. Install dependencies
```bash
cd path-finding-visualizer
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open the provided localhost URL in your browser (typically http://localhost:5173)

The project uses Vite for development and building, which provides:
- Hot Module Replacement (HMR)
- Fast development server
- Optimized production builds

### Additional Scripts
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 🎨 Customization

Modify constants in main.js to customize:
- Cell size
- Grid padding
- Animation speeds
- Colors and styles (via CSS)

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📝 License

MIT License - feel free to use and modify for your own projects!
