import { Grid } from './components/grid.js'
import { Algorithms } from './components/algorithms.js'


;(function() {

    let canvas, ctx, cellSize, gridSize, grid

    /**
     * Function for intial setup of config variables
     */
    function init() {
        canvas = document.getElementById('gameCanvas')
        ctx = canvas.getContext('2d')
        gridSize = 20  // 20x20 grid
        cellSize = canvas.height/gridSize

        grid = new Grid(gridSize, cellSize, canvas.height, canvas.width)
        grid.draw(ctx)  // Draw grid

        // Declare starting cell, remove wall 
        let startCell = grid.getRandom()
        grid.getCell(0, 0).deleteWall("left", startCell.getNeighbours(grid))  // Delete wall from start cell
        let endCell = grid.getCell(gridSize-3, gridSize-3)
        endCell.deleteWall("right", endCell.getNeighbours(grid))
        
        grid.draw(ctx)
        
        Algorithms.randomizedDFS(startCell, ctx, grid)

    }

    // wait for HTML to load
    document.addEventListener('DOMContentLoaded', init)
    
})()