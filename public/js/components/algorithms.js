import { Control } from '../helpers/control.js';
import { CustomWeakMap } from '../data structures/CustomWeakMap.js';
import { Stack } from './stack.js'
import { randomProperty } from '../helpers/misc.js'

class Algorithms {

    RUN = false
    FINISHED = false

    /**
     * Randomized Depth-First Search (DFS) iterative implementation
     * @param {Cell} currentCell                Current cell object being considered by algorithm 
     * @param {CanvasRenderingContext2D} ctx    HTML5 Canvas Context
     * @param {Grid} grid                       Grid object modelling the grid
     * @param {Function} update                 The update function required to re-draw the state of the maze
     * @param {HTML Div} playbtn                Play Button used to update button state once algorithm finished
     */
    static randomizedDFS(currentCell, ctx, grid, update, playbtn) {

        // Create stack
        let stack = new Stack()  
        
        // Mark current cell as visited and push to stack
        currentCell.visitedCell(ctx) 
        stack.push(currentCell);

        const newIteration = async () => {

            while (!stack.isEmpty() && this.RUN) {

                await Control.sleep(50)
    
                // Pop cell from stack and make it current
                let currentCell = stack.pop();
    
                // If current cell has any unvisited neighbours
                if (currentCell.hasUnvisitedNeighbours(grid)) {
    
                    // Push current cell
                    stack.push(currentCell);
    
                    // Choose one of the unvisited neighbours
                    let unvisited = currentCell.getUnvisitedNeighbours(grid)
                    let directions = Object.keys(unvisited)
                    let chosenDirection = directions[Math.floor(Math.random() * directions.length)]
                    let chosenCell = unvisited[chosenDirection]
                    
                    // Check if algorithm was stopped
                    if (!this.RUN) {
                        break
                    }                    

                    chosenCell.selectCell(ctx)

                    update(true)
                    
                    // Remove wall between current and chosen cells
                    currentCell.deleteWall(chosenDirection, currentCell.getNeighbours(grid))
                    
                    // Mark chosen cell as visited and push it to the stack
                    chosenCell.visitedCell(ctx)
                    stack.push(chosenCell)
    
                } else {
                    currentCell.deadEndCell()
                    update(true)
                }
            
            } 

            if (stack.isEmpty && this.RUN) {
                this.finished(playbtn)
            }

            await Control.sleep(1000)

        }

        if (this.RUN) {
            // Call new iteration and then clear grid once finished
            newIteration().then(() => update(false))
        }

    }

    static randomizedPrim(grid, update) {

        let wallList = new CustomWeakMap()

        // Pick a cell, mark it as part of the maze
        let startCell = grid.getRandom()
        startCell.visitedCell()

        // Add walls of the cell to the wall list
        wallList.set(startCell, startCell.getCellWalls(grid))

        // While there are walls in the list...
        while (!wallList.isEmpty()) {

            // Pick random wall from the list
            let randomCell = Math.floor(Math.random() * (wallList.length()-1))
            let selectedCell = wallList.keys()[randomCell]
            let randomWall = randomProperty(wallList.get(selectedCell))
            let wallPosition = Object.keys(randomWall)[0]

            let nextCell = selectedCell.getNeighbours(grid)[wallPosition]

            // If only one of the cells that the wall divides is visited
            if (!nextCell.isVisited()) {

                    // Make wall a passage (ie. break wall)
                    selectedCell.deleteWall(wallPosition, selectedCell.getNeighbours(grid))

                    // Mark unvisited cell as part of the maze
                    nextCell.visitedCell()
                    
                    update(true)

                    // Add neighbouring walls of the cell to wall list
                    wallList.set(selectedCell, selectedCell.getCellWalls(grid))  // Update previous cell walls
                    wallList.set(nextCell, nextCell.getCellWalls(grid))

            }

            // Remove wall from the list
            let neighbourWall = (wall) => {
                switch(wall) {
                    case "top":
                        return "bottom"

                    case "right":
                        return "left"
                    
                    case "bottom":
                        return "top"

                    case "left":
                        return "right"
                }
            }

            delete wallList.get(selectedCell)[wallPosition]

            if (wallList.get(nextCell)) {
                delete wallList.get(nextCell)[neighbourWall(wallPosition)]
            }

            // If cell in map is empty, delete entry
            wallList.keys().forEach((key) => {
                if (wallList.get(key) && Object.keys(wallList.get(key)).length == 0) {
                    wallList.delete(key)
                }
            })

        }

        update(false)

    }

    /**
     * Function to stop algorithm that is currently being executed
     */
    static stopAlgorithm() {
        this.RUN = false
    }

    /**
     * Function to replay algorithm that previously paused
     */
    static playAlgorithm() {
        this.RUN = true
    }

    /**
     * Function to update play button once algorithm execution is finished
     * @param {HTML Div}    Div element representing the button in the HTML
     */
    static finished(playbtn) {
        this.FINISHED = true  // Update finished to true
        this.stopAlgorithm()  // Stop the algorithm

        playbtn.style.backgroundImage = "url('../../public/img/Repeat\ Icon.png')"
    }

}

export { Algorithms };