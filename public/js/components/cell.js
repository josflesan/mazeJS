class Cell {

    VISITED_COLOUR = '#CCCCC3'
    SELECTED_COLOUR = '#FCE196'
    NO_NEIGHBOUR_COLOUR = '#7E8054'
    PATH_COLOUR = '#22ABFA'
    HOVERED_COLOUR = '#aea4a4'
    WALL_CELL_COLOUR = '#000000'
    START_CELL_COLOUR = '#fea947'
    END_CELL_COLOUR = '#477ffe'
    OPEN_CELL_COLOUR = '#69F45D'
    CLOSED_CELL_COLOUR = '#FC1008'

    GRID_SIZE = null

    /**
     * Constructor that initializes the position, size and walls of a
     * Cell object
     * @param {int} x     The x coordinate of the Cell object
     * @param {int} y     The y coordinate of the Cell object
     * @param {int} column The column of the grid in which the Cell object resides
     * @param {int} row   The row of the grid in which the Cell object resides
     * @param {int} size  The size of the Cell object (assuming square for grid)
     * @param {int} gridSize The size of the grid with vertical and horizontal keys
     */
    constructor(x, y, column, row, size, gridSize) {
        this.x = x
        this.y = y
        this.column = column
        this.row = row
        this.size = size

        this.visited = false;
        this.selected = false;
        this.deadEnd = false;
        this.pathCell = false;
        this.hoveredCell = false;
        this.wallCell = false;
        this.startCell = false;
        this.endCell = false;
        this.open = false;
        this.closed = false;

        this.parent = null;

        this.GRID_SIZE = gridSize

        // Walls: Top, Right, Bottom, Left
        /*
            Only edge cells have right and bottom walls.
            All other cells' right walls are right neighbours' left walls
            All other cells' bottom walls are bottom neighbours' top walls
            This prevents wall from overlapping.
        */
        this.walls = {
            "top": true,
            "right": this.column == gridSize-1? true:false,
            "bottom": this.row == gridSize-1? true:false,
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
     * Function that randomly deletes one of the cell's walls
     * @param {Grid} grid           The Grid object modelling the maze
     * @param {Object} neighbours   The Dictionary of the current cell's neighbours
     */
    deleteRandomWall(grid) {
        let possibleWalls = this.getCellWalls(grid)
        let randomWall = Object.keys(possibleWalls)[Math.floor(Math.random() * Object.keys(possibleWalls).length)]
        this.deleteWall(randomWall, this.getNeighbours(grid))
    }

    /**
     * Function that deletes all the cell's walls
     */
    deleteAllCellWalls() {
        this.walls = {
            "top": false,
            "right": false,
            "bottom": false,
            "left": false
        }
    }

    /**
     * Function that returns the different neighbouring cells of a particular
     * Cell object.
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
     * Function that returns all the active walls for a particular cell in the maze,
     * taking into account the lack of double walls
     * @param {Grid} grid   The grid object modelling the maze
     */
    getCellWalls(grid) {

        /* 
            Every cell is given a top and left wall, so just return their current value.
            Only bottom row row cells given a bottom wall.
            Only last column cells given a right wall.
            This is to avoid double walls.
            Therefore, if corresponding neighbour has a wall, it also counts as cell's wall.
        */

        let neighbours = this.getNeighbours(grid)

        let walls = {
            "top" : (this.row == 0)? false:this.walls.top,
            "right" : (this.column == this.GRID_SIZE-1 || (neighbours.right && !neighbours.right.walls["left"]))? false:true,
            "bottom" : (this.row == this.GRID_SIZE-1 || (neighbours.bottom && !neighbours.bottom.walls["top"]))? false:true,
            "left" : (this.column == 0)? false:this.walls.left,
        }

        Object.keys(walls).forEach((key) => {
            if (!walls[key]) {
                delete walls[key]
            }
        })

        return walls
    }

    /**
     * Function that returns the walls of the cell taking into account the maze is empty
     * to start off with (as in the build screen)
     * @returns {Object}        The hashmap containing the information on which cell walls are active 
     */
    getCellWallsEmpty() {

        let walls = this.walls

        Object.keys(walls).forEach((key) => {
            if (!walls[key]) {
                delete walls[key]
            }
        })

        return walls
    }

    /**
     * Function that filters the output of getNeighbours() to include
     * only Cell objects that have not been visited yet
     * @param {Grid} grid   Grid object modelling the grid
     * @returns {Object}    Filtered object containing the list of unvisited neighbours
     */
    getUnvisitedNeighbours(grid, bypassWalls=true, gridEmpty=false) {
        let dict = this.getNeighbours(grid);
        let currentCellWalls
        if (gridEmpty) {
            currentCellWalls = Object.keys(this.getCellWallsEmpty())
        } else {
            currentCellWalls = Object.keys(this.getCellWalls(grid))
        }
        let filtered;

        if (!bypassWalls) {
            filtered = Object.keys(dict).reduce(function (filtered, key) {
                if (!dict[key].isVisited() && !currentCellWalls.includes(key)) filtered[key] = dict[key];
                return filtered;
            }, {})

        }
        else {
            filtered = Object.keys(dict).reduce(function (filtered, key) {
                if (!dict[key].isVisited()) filtered[key] = dict[key];
                return filtered;
            }, {});
        }
    
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
     * @returns {Boolean}   True if cell visited attribute is true, else false
     */
    isVisited() {
        return this.visited;
    }

    /**
     * Function that determines whether a cell has been selected or not
     * @returns {Boolean}   True if cell selected attribute is true, else false
     */
     isSelected() {
        return this.selected;
    }

    /**
     * Function that selects a Cell in the grid by flagging its selected attribute
     * when the cell is selected by the algorithm
     */
    selectCell() {
        this.selected = true;
    }

    /**
     * Function that turns the cell in the grid into a wall if clicked on by setting flag
     */
    clickCell() {

        this.walls = {
            "top": true,
            "right": true,
            "bottom": true,
            "left": true
        }
        this.wallCell = true

        this.hoveredCell = false
        this.startCell = false
        this.endCell = false
    }

    /**
     * Function that turns a wall to a cell in the grid
     */
    rightClickCell() {
        this.walls = {
            "top": false,
            "right": false,
            "bottom": false,
            "left": false
        }

        this.wallCell = false
        this.hoveredCell = false
    }

    /**
     * Function that colours the cell in if the mouse is hovered over it
     */
    hoverCell() {
        this.hoveredCell = true
    }

    /**
     * Function that marks a Cell in the grid as visited by flagging its
     * visited attribute when the cell is marked as visited by the algorithm
     */
    visitedCell() {
        this.visited = true;
        this.selected = false;
    }

    /**
     * Function that marks a Cell in the grid as part of the path by flagging its
     * pathCell attribute when the cell is marked as part of the path by the algorithm
     */
    solvedPathCell() {
        this.pathCell = true;
        this.visited = false;
        this.selected = false;
    }

    /**
     * Function that marks a Cell in the grid as a dead end by flagging its
     * deadEnd attribute when the cell no longer has any unvisited neighbours
     */
    deadEndCell() {
        this.deadEnd = true;
    }

    /**
     * Function that marks Cell in the grid as open
     */
    openCell() {
        this.open = true;
        this.closed = false;
    }

    /**
     * Function that marks Cell in the grid as closed
     */
    closeCell() {
        this.closed = true;
        this.open = false;
    }

    /**
     * Function that colours a cell yellow if it is currently selected 
     * or blue if it has been visited by the algorithm
     * @param {CanvasRenderingContext2D} ctx    HTML5 Canvas Rendering Context 
     */
    colorCell(ctx) {
        if (this.selected) {
            ctx.fillStyle = this.SELECTED_COLOUR
            ctx.fillRect(this.x, this.y, this.size, this.size)
        } else if (this.visited && !this.deadEnd) {
            ctx.fillStyle = this.VISITED_COLOUR
            ctx.fillRect(this.x, this.y, this.size, this.size)
        } else if (this.deadEnd) {
            ctx.fillStyle = this.NO_NEIGHBOUR_COLOUR
            ctx.fillRect(this.x, this.y, this.size, this.size)
        } else if (this.pathCell) {
            ctx.fillStyle = this.PATH_COLOUR
            ctx.fillRect(this.x, this.y, this.size, this.size)
        } else if (this.hoveredCell) {
            ctx.fillStyle = this.HOVERED_COLOUR
            ctx.fillRect(this.x, this.y, this.size, this.size)
        } else if (this.wallCell) {
            ctx.fillStyle = this.WALL_CELL_COLOUR
            ctx.fillRect(this.x, this.y, this.size, this.size)
        } else if (this.startCell) {
            ctx.fillStyle = this.START_CELL_COLOUR
            ctx.fillRect(this.x, this.y, this.size, this.size)
        } else if (this.endCell) {
            ctx.fillStyle = this.END_CELL_COLOUR
            ctx.fillRect(this.x, this.y, this.size, this.size)
        } else if (this.closed) {
            ctx.fillStyle = this.CLOSED_CELL_COLOUR
            ctx.fillRect(this.x, this.y, this.size, this.size)
        }else if (this.open) {
            ctx.fillStyle = this.OPEN_CELL_COLOUR
            ctx.fillRect(this.x, this.y, this.size, this.size)
        } 
        
    }

    /**
     * Function to reset the colour and walls of a cell by resetting dictionary to original state
     * and resetting the flags to false
     */
    resetCell() {
        this.visited = false;
        this.selected = false;
        this.deadEnd = false;
        this.open = false;
        this.closed = false;

        this.walls = {
            "top": true,
            "right": this.column == this.GRID_SIZE-1? true:false,
            "bottom": this.row == this.GRID_SIZE-1? true:false,
            "left": true
        }
    }

    /**
     * Function to reset all the cell's flags to false while keeping its walls
     */
    resetCellFlags(keepPath=false) {
        this.visited = false;
        this.selected = false;
        this.deadEnd = false;
        this.closed = false;
        this.open = false;
        if (!keepPath) this.pathCell = false;
        this.hoveredCell = false;
    }

}

export { Cell };