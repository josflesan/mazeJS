;(function() {

    let canvas, ctx, cellSize, gridSize, stack, visited
    let grid = []

    // intial setup of config variables
    function init() {
        canvas = document.getElementById('gameCanvas')
        ctx = canvas.getContext('2d')
        gridSize = 20  // 20x20 grid
        cellSize = canvas.height/gridSize

        stack = new Stack()

        createGrid()

        // Declare starting cell, remove wall 
        let startCell = grid[Math.floor(Math.random() * grid.length)][Math.floor(Math.random() * grid[0].length)]
        grid[0][0].deleteWall("left", getNeighbours(startCell))  // Delete wall from start cell
        let endCell = grid[grid.length-1][gridSize-3]
        endCell.deleteWall("right", getNeighbours(endCell))
        
        drawGrid()
        // test()
        randomizedDFS(startCell)

    }

    function test() {
        let startCell = grid[0][0]
        startCell.deleteWall("left", getNeighbours(startCell))
        startCell.visitedCell(ctx)
        drawGrid()
        startCell.deleteWall("bottom", getNeighbours(startCell))
        grid[0][1].visitedCell(ctx)
        drawGrid()

        getUnvisitedNeighbours(grid[1][1])

        drawGrid()
    }

    function createGrid() {

        for (var y = cellSize; y < canvas.height-cellSize; y+=cellSize) {
            let cellRow = []
            for (var x = cellSize; x < canvas.width-cellSize; x+=cellSize) {
                let cell = new Cell(x, y, cellRow.length, grid.length, cellSize, gridSize)
                cellRow.push(cell)  // Add cell to row
            }
            grid.push(cellRow)  // Add row to grid
        }

    }

    function drawGrid() {

        // Clear grid
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        for (var y = 0; y < grid.length; y++) {
            for (var x = 0; x < grid[0].length; x++) {
                let cell = grid[y][x]
                cell.displayCellWalls(ctx, grid)

                if (cell.isVisited()) {
                    cell.visitedCell(ctx)
                }
            }
        }

    }

    function hasUnvisitedNeighbours(cell) {
        return Object.values(getNeighbours(cell)).filter(neighbour => (neighbour != false) && (!neighbour.isVisited())).length > 0;
    }

    function getUnvisitedNeighbours(cell) {
        let dict = getNeighbours(cell);
        console.log(dict)
        let filtered = Object.keys(dict).reduce(function (filtered, key) {
            if (dict[key] != false && !dict[key].isVisited()) filtered[key] = dict[key];
            return filtered;
        }, {});

        return filtered;
    }

    function getNeighbours(cell) {
        // Neighbours: [Top, Right, Bottom, Left]
        let up = cell.row - 1
        let down = cell.row + 1
        let left = cell.column - 1
        let right = cell.column + 1

        return {
            "top": up>=0? grid[up][cell.column]:false,
            "bottom": down<grid.length? grid[down][cell.column]:false,
            "left": left>=0? grid[cell.row][left]:false,
            "right": right<grid[0].length? grid[cell.row][right]:false
        }

    }

    function randomizedDFS(currentCell) {

        currentCell.visitedCell(ctx) // Mark current cell as visited
        stack.push(currentCell);  // Add starting Cell to stack

        while (!stack.isEmpty()) {

            // Pop cell from stack and make it current
            let currentCell = stack.pop();

            // If current cell has any unvisited neighbours
            if (hasUnvisitedNeighbours(currentCell)) {

                // Push current cell
                stack.push(currentCell);

                // Visit neighbours and choose one of the unvisited neighbours
                let unvisited = getUnvisitedNeighbours(currentCell)
                let directions = Object.keys(unvisited)
                let chosenDirection = directions[Math.floor(Math.random() * directions.length)]
                let chosenCell = unvisited[chosenDirection]

                chosenCell.selectCell(ctx)

                // Remove wall between current and chosen cells
                currentCell.deleteWall(chosenDirection, getNeighbours(currentCell))

                // Mark chosen cell as visited and push it to the stack
                chosenCell.visitedCell(ctx)
                stack.push(chosenCell)

            } 
          
            drawGrid()
        
        } 

    }

    // wait for HTML to load
    document.addEventListener('DOMContentLoaded', init)
    
})()