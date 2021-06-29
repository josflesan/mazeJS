class Cell {

    visitedColour = '#aad6f0'
    selectedColour = '#effd5f'

    /**
     * Constructor that initializes the position, size and walls of a
     * Cell object
     * @param {int} x   The x coordinate of the Cell object
     * @param {*} y     The y coordinate of the Cell object
     * @param {*} column The column of the grid in which the Cell object resides
     * @param {*} row   The row of the grid in which the Cell object resides
     * @param {*} size  The size of the Cell object (assuming square for grid)
     * @param {*} gridSize The size of the grid (assuming square)
     */
    constructor(x, y, column, row, size, gridSize) {
        this.x = x
        this.y = y
        this.column = column
        this.row = row
        this.size = size

        this.visited = false;

        // Walls: Top, Right, Bottom, Left
        /*
            Only edge cells have right and bottom walls.
            All other cells' right walls are right neighbours' left walls
            All other cells' bottom walls are bottom neighbours' top walls
            This prevents wall from overlapping.
        */
        this.walls = {
            "top": true,
            "right": this.column == gridSize-3? true:false,
            "bottom": this.row == gridSize-3? true:false,
            "left": true
        }
    }

    /**
     * Function that displays each Cell's walls when rendering
     * the grid, depending on the neighbours present and the flags 
     * that each Cell has set in the walls attribute
     * @param {CanvasRenderingContext2D} ctx    HTML5 Canvas 2D Context 
     * @param {Grid} grid   The Grid object modelling the grid
     */
    displayCellWalls(ctx, grid) {

        ctx.beginPath();

        // Unpack each of the objects in the walls attribute to facilitate looping
        for (const [key, val] of Object.entries(this.walls)) {

            // If wall exists, check which one it is and draw it
            if (val) {

                switch (key) {

                    case "top":
                        ctx.moveTo(this.x, this.y);
                        ctx.lineTo(this.x+this.size, this.y)
                        ctx.stroke();
                        break;
                    
                    case "right":
                        ctx.moveTo(this.x+this.size, this.y);
                        ctx.lineTo(this.x+this.size, this.y+this.size);
                        ctx.stroke();
                        break;

                    case "bottom":
                        ctx.moveTo(this.x, this.y+this.size);
                        ctx.lineTo(this.x+this.size, this.y+this.size);
                        ctx.stroke();
                        break;
                    
                    case "left":
                        ctx.moveTo(this.x, this.y);
                        ctx.lineTo(this.x, this.y+this.size);
                        ctx.stroke();
                        break;

                }

            }
        }
    }

    /**
     * Function that deletes a Cell's walls in the grid 
     * @param {String} wall         String representation of the wall to be deleted (top, right, bottom, left)
     * @param {Object} neighbours   Dictionary of the current cell's neighbours 
     */
    deleteWall(wall, neighbours) {
        this.walls[wall] = false

        // Remove neighbour's wall if neighbour exists     
        if (Object.keys(neighbours).includes(wall)) {
            switch (wall) {
                case "top":
                    neighbours[wall].walls["bottom"] = false
                    break
                
                case "right":
                    neighbours[wall].walls["left"] = false
                    break
                
                case "bottom":
                    neighbours[wall].walls["top"] = false
                    break
                
                case "left":
                    neighbours[wall].walls["right"] = false
                    break
            }
        }

    }

    /**
     *  Function that returns the different neighbouring cells of a particular
     *  Cell object.
     * @param {Grid} grid   Grid object modelling the grid
     * @returns {Object}    Object containing the different neighbours of the cell
     */
    getNeighbours(grid) {
        // Neighbours: [Top, Right, Bottom, Left]
        let top = this.row - 1
        let bottom = this.row + 1
        let left = this.column - 1
        let right = this.column + 1

        let neighbours = {}

        neighbours.top = top>=0? grid.getCell(top, this.column):null
        neighbours.bottom = bottom<grid.getLength().y? grid.getCell(bottom, this.column):null
        neighbours.left = left>=0? grid.getCell(this.row, left):null
        neighbours.right = right<grid.getLength().x? grid.getCell(this.row, right):null

        for (const [key, value] of Object.entries(neighbours)) {
            if (value === null) {
                delete neighbours[key]
            }
        }

        return neighbours
    
    }

    /**
     * Function that filters the output of getNeighbours() to include
     * only Cell objects that have not been visited yet
     * @param {Grid} grid   Grid object modelling the grid
     * @returns {Object}    Filtered object containing the list of unvisited neighbours
     */
    getUnvisitedNeighbours(grid) {
        let dict = this.getNeighbours(grid);
        let filtered = Object.keys(dict).reduce(function (filtered, key) {
            if (!dict[key].isVisited()) filtered[key] = dict[key];
            return filtered;
        }, {});
    
        return filtered;
    }

    /**
     * Function that determines whether a Cell object has an unvisited
     * neighbour.
     * @param {Grid} grid   Grid object modelling the grid
     * @returns {Boolean}   True if cell has unvisited neighbours, else false
     */
    hasUnvisitedNeighbours(grid) {
        return Object.entries(this.getUnvisitedNeighbours(grid)).length > 0;
    }

    /**
     * Function that determines whether a cell has been visited or not
     * @returns {Boolean}   True of cell visited attribute is true, else false
     */
    isVisited() {
        return this.visited;
    }

    /**
     * Function that colours in a Cell in the grid using a yellow colour
     * when the cell is selected by the algorithm
     * @param {CanvasRenderingContext2D} ctx    The HTML5 Canvas Context
     */
    selectCell(ctx) {
        ctx.fillStyle = this.selectedColour
        ctx.fillRect(this.x+5, this.y+5, this.size-10, this.size-10)
    }

    /**
     * Function that colours in a Cell in the grid using a blue colour
     * when the cell is marked as visited by the algorithm
     * @param {CanvasRenderingContext2D} ctx    The HTML5 Canvas Context
     */
    visitedCell(ctx) {
/*         ctx.fillStyle = this.visitedColour
        ctx.fillRect(this.x+5, this.y+5, this.size-10, this.size-10) */
        this.visited = true;
    }

}

export { Cell };