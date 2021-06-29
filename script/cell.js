class Cell {

    constructor(x, y, column, row, size, gridSize) {
        this.x = x
        this.y = y
        this.column = column
        this.row = row
        this.size = size

        this.visited = false;

        // Walls: Top, Right, Bottom, Left. By default, all walls present
        this.walls = {
            "top": true,
            "right": this.column == gridSize-3? true:false,
            "bottom": this.row == gridSize-3? true:false,
            "left": true
        }
    }

    deleteWall(wall, neighbours) {
        this.walls[wall] = false

        // Remove neighbour's wall if neighbour exists
        if (neighbours[wall] != false) {
                
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

    toString() {
        return `Row: ${this.row},\nColumn: ${this.column}\n`
    }

    displayCellWalls(ctx, grid) {

        ctx.beginPath();

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

    isVisited() {
        return this.visited;
    }

    // Fill cell in yellow colour when selected
    selectCell(ctx) {
        ctx.fillStyle = '#effd5f'
        ctx.fillRect(this.x+5, this.y+5, this.size-10, this.size-10)
    }

    // Fill cell in blue colour is visited
    visitedCell(ctx) {
        ctx.fillStyle = '#AAD6F0'
        ctx.fillRect(this.x+5, this.y+5, this.size-10, this.size-10)
        this.visited = true;
    }


}