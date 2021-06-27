;(function() {

    let canvas, ctx, cellSize, numColumns
    let grid = []

    // intial setup of config variables
    function init() {
        canvas = document.getElementById('gameCanvas')
        ctx = canvas.getContext('2d')
        numColumns = 20
        cellSize = canvas.height/numColumns

        createGrid()
        drawGrid()
        randomizedDFS()
    }

    function createGrid() {

        for (var y = cellSize; y < canvas.height-cellSize; y+=cellSize) {
            let cellRow = []
            for (var x = cellSize; x < canvas.width-cellSize; x+=cellSize) {
                let cell = new Cell(x, y, cellRow.length, grid.length, cellSize)
                cellRow.push(cell)  // Add cell to row
            }
            grid.push(cellRow)  // Add row to grid
        }

    }

    function drawGrid() {

        // Clear grid
        // ctx.clearRect(0, 0, canvas.width, canvas.height)

        for (var y = 0; y < grid.length; y++) {
            for (var x = 0; x < grid[0].length; x++) {
                let cell = grid[y][x]
                cell.displayCellWalls(ctx)
            }
        }

    }

    function getNeighbours(cell) {
        // Neighbours: [Top, Right, Bottom, Left]
        let up = cell.row - 1
        let down = cell.row + 1
        let left = cell.column - 1
        let right = cell.column + 1

        return {
            "up": up>0? grid[up][cell.column]:false,
            "down": down<grid.length? grid[down][cell.column]:false,
            "left": left>0? grid[cell.row][left]:false,
            "right": right<grid[0].length? grid[cell.row][right]:false
        }

    }

    function randomizedDFS() {
        
        let startCell = grid[0][0]
        startCell.deleteWall("right", getNeighbours(startCell))  // Delete wall from start cell

        startCell.visitedCell(ctx)

        drawGrid()


    }

    // wait for HTML to load
    document.addEventListener('DOMContentLoaded', init)
    
})()