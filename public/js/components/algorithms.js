import { Control } from '../helpers/control.js';
import { Stack } from './stack.js'

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
    
                    chosenCell.selectCell(ctx)

                    update(true)

                    // Check if algorithm was stopped
                    if (!this.RUN) {
                        break
                    }
    
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
        // this.stopAlgorithm()  // Stop the algorithm

        playbtn.style.backgroundImage = "url('../../public/img/Repeat\ Icon.png')"
    }

}

export { Algorithms };