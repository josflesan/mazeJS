import { Control } from '../helpers/control.js';
import { Stack } from './stack.js'

class Algorithms {

    /**
     * Randomized Depth-First Search (DFS) iterative implementation
     * @param {Cell} currentCell                Current cell object being considered by algorithm 
     * @param {CanvasRenderingContext2D} ctx    HTML5 Canvas Context
     * @param {Grid} grid                       Grid object modelling the grid
     */
    static randomizedDFS(currentCell, ctx, grid, update) {

        // Create stack
        let stack = new Stack()  

        // Mark current cell as visited and push to stack
        currentCell.visitedCell(ctx) 
        stack.push(currentCell);

        const newIteration = async () => {

            while (!stack.isEmpty()) {

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

            await Control.sleep(1000)

        }

        // Call new iteration and then clear grid once finished
        newIteration().then(() => update(false))

    }

}

export { Algorithms };