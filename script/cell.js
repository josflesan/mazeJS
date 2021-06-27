class Cell {

    constructor(x, y, column, row, size) {
        this.x = x
        this.y = y
        this.column = column
        this.row = row
        this.size = size
        // Walls: Top, Right, Bottom, Left. By default, all walls present
        this.walls = {
            "top": true,
            "right": true,
            "bottom": true,
            "left": true
        }
    }

    deleteWall(wall, neighbours) {
        this.walls[wall] = false

        // Remove neighbour's wall if neighbour exists
        if (neighbours[wall] != false) {
                
            switch (wall) {
                case "top":
                    neighbours["top"].walls["bottom"] = false
                    break
                
                case "right":
                    neighbours["right"].walls["left"] = false
                    break
                
                case "bottom":
                    neighbours["bottom"].walls["top"] = false
                    break
                
                case "left":
                    neighbours["left"].walls["right"] = false
                    break
            }

        }

    }

    displayCellWalls(ctx) {

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

    // Fill cell in yellow colour when selected
    selectCell(ctx) {
        ctx.fillStyle = '#effd5f'
        ctx.fillRect(this.x, this.y, this.size, this.size)
    }

    // Fill cell in blue colour is visited
    visitedCell(ctx) {
        ctx.fillStyle = '#4548A3'
        ctx.fillRect(this.x, this.y, this.size, this.size)
    }


}