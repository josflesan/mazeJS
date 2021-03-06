import { Cell } from './cell.js'

class Grid {

    grid = []

    /**
     * Class constructor that initializes and creates a grid by populating it with
     * Cell objects
     * @param {int} gridSize    Size of the grid (assuming it's a square)
     * @param {int} cellSize    Size of a cell in the grid  
     * @param {int} canvasH     Height of the HTML5 Canvas
     * @param {int} canvasW     Width of the HTML5 Canvas
     */
    constructor(gridSize, cellSize, canvasH, canvasW) {
        this.gridSize = gridSize
        this.cellSize = cellSize

        this.totalHeight = canvasH
        this.totalWidth = canvasW

        // Before displaying the grid, we have to populate the grid 2D array with Cell objects
        for (var y = 0; y.toFixed(2) < canvasH; y+=cellSize) {
            let cellRow = []
            for (var x = 0; x.toFixed(2) < canvasW; x+=cellSize) {
                let cell = new Cell(x, y, cellRow.length, this.grid.length, this.cellSize, this.gridSize)
                cellRow.push(cell)  // Add cell to row
            }
            this.grid.push(cellRow)  // Add row to grid
        }
    }   

    /**
     * Function that selects and returns a specified cell in the grid
     * @param {int} row     The row the cell is in
     * @param {int} col     The column the cell is in
     * @returns {Cell}      The Cell object at that position
     */
    getCell(row, col) {
        return this.grid[row][col]
    }

    /**
     * Function to return a random cell in the grid using Math.random()
     * @returns {Cell}  Random cell object in grid
     */
    getRandom() {
        return this.getCell(Math.floor(Math.random() * (this.getLength()["y"]-1)), 
                        Math.floor(Math.random() * (this.getLength()["x"]-1)))
    }

    /**
     * Function that returns the length of the grid in the x and y directions
     * @returns {Object}    Object containing the horizontal and vertical lengths
     * @returns {Object}    Object.x contains the width of the grid
     * @returns {Object}    Object.y contais the height of the grid
     */
    getLength() {
        return {
            "x": this.grid[0].length,
            "y": this.grid.length
        }
    }

    changeStartCell(cell) {

        for (var y = 0; y < this.getLength()["y"]; y++) {
            for (var x = 0; x < this.getLength()["x"]; x++) {

                // If there is already a start cell in the grid, remove it
                if (this.getCell(y, x).startCell) {
                    this.getCell(y, x).startCell = false
                }

            }
        }

        cell.startCell = true
    }

    changeEndCell(cell) {

        for (var y = 0; y < this.getLength()["y"]; y++) {
            for (var x = 0; x < this.getLength()["x"]; x++) {

                // If there is already a end cell in the grid, remove it
                if (this.getCell(y, x).endCell) {
                    this.getCell(y, x).endCell = false
                }

            }
        }

        cell.endCell = true
    }

    /**
     * Function that draws the grid on the canvas
     * @param {CanvasRenderingContext2D} ctx    Context of HTML5 Canvas 
     */
    draw(ctx, color) {

        // We need to re-draw the whole state of the grid each time
        for (var y = 0; y < this.getLength()["y"]; y++) {
            for (var x = 0; x < this.getLength()["x"]; x++) {
                let cell = this.getCell(y, x)
                cell.displayCellWalls(ctx, this.grid)

                if (color) {
                    cell.colorCell(ctx)
                }
            }
        }

    }

    /**
     * Function to clear the grid and reset all its cells
     * @param {CanvasRenderingContext2D} ctx    Context of HTML5 Canvas 
     */
    clear(ctx) {
        // We need to re-draw the whole state of the grid each time
        for (var y = 0; y < this.getLength()["y"]; y++) {
            for (var x = 0; x < this.getLength()["x"]; x++) {
                let cell = this.getCell(y, x)
                cell.resetCell()
                cell.displayCellWalls(ctx, this.grid)
            }
        }

    }

    /**
     * Function that clears all the cell walls in the grid
     * @param {CanvasRenderingContext2D} ctx    Context of HTML5 Canvas
     */
    clearAllWalls() {

        for (var y = 0; y < this.getLength()["y"]; y++) {
            for (var x = 0; x < this.getLength()["x"]; x++) {
                let cell = this.getCell(y, x)
                cell.wallCell = false
                cell.startCell = false
                cell.endCell = false
                cell.deleteAllCellWalls()
            }
        }

    }

    /**
     * Function to reset all the cells in the grid
     */
    resetGrid(keepPath=false) {
        for (var y = 0; y < this.getLength()["y"]; y++) {
            for (var x = 0; x < this.getLength()["x"]; x++) {
                let cell = this.getCell(y, x)
                cell.resetCellFlags(keepPath)
            }
        }
    }

}

export { Grid };