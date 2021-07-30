import { Control } from '../helpers/control.js'
import { CustomWeakMap } from '../data structures/CustomWeakMap.js'
import { Stack } from '../data structures/stack.js'
import { Queue } from '../data structures/queue.js'
import { randomProperty } from '../helpers/misc.js'
import { getAnimate, getPerfectMaze } from '../components/toggle.js'
import { setGrid, hideSaveBtn, revealSaveBtn } from '../components/save-btn.js'

class Algorithms {

    static RUN = false
    static FINISHED = false

    static CYCLE_WAIT_TIME = 25  // 25 ms
    static END_OF_CYCLE_WAIT_TIME = 1000  // 1000ms or 1 second

    // ------------------------ GENERATION ALGORITHM ------------------------

    /**
     * Randomized Depth-First Search (DFS) iterative implementation
     * @param {Cell} currentCell                Current cell object being considered by algorithm 
     * @param {CanvasRenderingContext2D} ctx    HTML5 Canvas Context
     * @param {Grid} grid                       Grid object modelling the grid
     * @param {Function} update                 The update function required to re-draw the state of the maze
     * @param {HTML Div} playbtn                Play Button used to update button state once algorithm finished
     */
    static randomizedDFS(currentCell, ctx, grid, update, playbtn=null) {

        let animate = getAnimate()

        // Create stack
        let stack = new Stack()  
            
        // Mark current cell as visited and push to stack
        currentCell.visitedCell(ctx) 
        stack.push(currentCell);

        const newIteration = async () => {
            while (!stack.isEmpty()) {

                if (animate) {
                    await Control.sleep(Algorithms.CYCLE_WAIT_TIME)
                }

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
                    if (!Algorithms.RUN) {
                        break
                    }                    

                    chosenCell.selectCell(ctx)

                    if (animate) {
                        update(true)
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
              
            if (animate) {
                await Control.sleep(Algorithms.END_OF_CYCLE_WAIT_TIME)
            }

            if (stack.isEmpty && Algorithms.RUN && playbtn) {
                Algorithms.finishedGenerate(playbtn, update, grid)
            }
        }

        if (Algorithms.RUN) {
            newIteration().then(() => {
                if (!getPerfectMaze() && Algorithms.RUN) {
                    this.createLoops(grid, update)
                } else {
                    update(false)
                }
            })
        }

    }

    /**
     * Randomized Prim's Algorithm iterative implementation using a custom weak map
     * @param {Grid} grid                       Grid object modelling the grid
     * @param {Function} update                 The update function required to re-draw the state of the maze
     * @param {Boolean} restart                 If true, the algorithm is running in the solve screen so it won't be set to finish
     */
    static randomizedPrim(grid, update, restart, ignoreAnimate=false) {

        let animate

        if (!ignoreAnimate) animate = getAnimate()
        else animate = false

        let wallList = new CustomWeakMap()

        // Pick a cell, mark it as part of the maze
        let startCell = grid.getRandom()
        startCell.visitedCell()

        // Add walls of the cell to the wall list
        wallList.set(startCell, startCell.getCellWalls(grid))

        const newIteration = async () => {

            // While there are walls in the list...
            while (!wallList.isEmpty()) {

                if (animate) {
                    await Control.sleep(10)
                }

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

                        // Check if algorithm was stopped
                        if (!this.RUN) {
                            break
                        }   

                        nextCell.selectCell()

                        if (animate) {
                            update(true)  
                        }

                        // Mark unvisited cell as part of the maze
                        nextCell.visitedCell()

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
            
            if (animate) {
                await Control.sleep(Algorithms.END_OF_CYCLE_WAIT_TIME)
            }

            if (wallList.isEmpty() && this.RUN && !restart) {
                this.finishedGenerate(playbtn, update, grid)
            } else {
                this.restart(playbtn)
            }
        }

        if (Algorithms.RUN) {
            // Call new iteration and then clear grid once finished
            newIteration().then(() => {
                if (!getPerfectMaze() && Algorithms.RUN) {
                    this.createLoops(grid, update)
                } else {
                    update(false)
                }
            })

        } 
    }

    /**
     * Function that creates loops in a perfect maze so as to make it imperfect.
     * By doing this, the maze will have multiple solutions
     * @param {Grid} grid                       Grid object modelling the maze 
     */
    static createLoops(grid, update) {

        // If we randomly delete walls in the y = -x line, we will
        // artificially create loops in the maze, making it imperfect

        let numberWalls = Math.floor(Math.random() * grid.getLength()["x"])
        
        for (let i = 0; i < numberWalls; i++) {
            let selectedIndex = Math.floor(Math.random() * (grid.getLength()["x"]-1))
            let selectedCell = grid.getCell(selectedIndex, selectedIndex)

            selectedCell.deleteRandomWall(grid)
        }

        update(false)

    }

    // --------------------------------------------------------------------

    // ------------------------ SOLVING ALGORITHMS ------------------------

    static depthFirstSearch(grid, update, playbtn) {

        let animate = getAnimate()

        let startCell = grid.getCell(0, 0)
        let endCell = grid.getCell(grid.getLength()["x"]-1, grid.getLength()["y"]-1)
        let stack = new Stack()

        let endOfAlgorithm = false

        grid.resetGrid()

        // Push start node into the stack
        stack.push(startCell)

        // While there is a node to be handled in the stack...
        const newIteration = async () => {
            while (!stack.isEmpty()) {

                if (animate) {
                    await Control.sleep(Algorithms.CYCLE_WAIT_TIME)
                }
                
                // Pop the node on the top of the stack and retrieve unvisited neighbours
                let currentCell = stack.pop()
                currentCell.selectCell()
                
                if (!Algorithms.RUN) {
                    break
                } 

                if (animate) {
                    update(true)
                }

                // If the current node is the end node, terminate the program
                if (currentCell == endCell) {
                    endOfAlgorithm = true
                    break
                } 

                // Take unvisited neighbours in order (N, E, S, W)
                // Mark current node's parent, mark it as visited and add to stack
                let neighbours = currentCell.getUnvisitedNeighbours(grid, false)
                Object.keys(neighbours).forEach((direction) => {
                    neighbours[direction].visitedCell()
                    neighbours[direction].parent = currentCell
                    stack.push(neighbours[direction])
                })
            }

            // Walk back from the end using the parent attribute and display this path
            if (Algorithms.RUN) {

                let lastPathCell = endCell
                while (lastPathCell != startCell) {
                    lastPathCell.solvedPathCell()
                    lastPathCell = lastPathCell.parent
                    if (animate) {
                        await Control.sleep(Algorithms.CYCLE_WAIT_TIME)
                        update(true)
                    }
                }
                startCell.solvedPathCell()
                update(true)

                if (animate) {
                    await Control.sleep(Algorithms.END_OF_CYCLE_WAIT_TIME)
                }

            }

            if (endOfAlgorithm && this.RUN) {
                this.finishedSolve(playbtn)
            }
        }

        if (Algorithms.RUN) {
            newIteration()
        }
    }

    static breadthFirstSearch(grid, update, playbtn) {

        let animate = getAnimate()

        let startCell = grid.getCell(0, 0)
        let endCell = grid.getCell(grid.getLength()["x"]-1, grid.getLength()["y"]-1)
        let queue = new Queue()
        let endOfAlgorithm = false
        let currentCell

        grid.resetGrid()  // Reset the state of the grid's cells

        // Add start node in the queue and mark it as visited
        queue.enqueue(startCell)
        startCell.visitedCell()

        // While there is a node in the queue...
        const newIteration = async () => {
            while (!queue.isEmpty()) {

                if (animate) {
                    await Control.sleep(Algorithms.CYCLE_WAIT_TIME)
                }

                // Take the node at the front of the queue
                currentCell = queue.dequeue()
                currentCell.selectCell()

                if (!Algorithms.RUN) {
                    break
                } 

                if (animate) {
                    update(true)
                }

                if (currentCell == endCell) {
                    endOfAlgorithm = true
                    break
                }

                // Add all available neighbours to the queue
                // Not parents
                // Mark the neighbours as visited
                let neighbours = currentCell.getUnvisitedNeighbours(grid, false)
                Object.keys(neighbours).forEach((direction) => {
                    neighbours[direction].visitedCell()
                    neighbours[direction].parent = currentCell
                    queue.enqueue(neighbours[direction])
                })

            }

            // Backtrack from goal to start using parent link to get shortest path
            if (Algorithms.RUN) {

                let lastPathCell = endCell
                while (lastPathCell != startCell) {
                    lastPathCell.solvedPathCell()
                    lastPathCell = lastPathCell.parent
                    if (animate) {
                        await Control.sleep(Algorithms.CYCLE_WAIT_TIME)
                        update(true)
                    }
                }
                startCell.solvedPathCell()
                update(true)

                if (animate) {
                    await Control.sleep(Algorithms.END_OF_CYCLE_WAIT_TIME)
                }

            }

            if (endOfAlgorithm && this.RUN) {
                this.finishedSolve(playbtn)
            }
        }

        if (Algorithms.RUN) {
            newIteration()
        }




    }

    // --------------------------------------------------------------------

    // ------------------------ CONTROL FUNCTIONS -------------------------

    /**
     * Function to stop algorithm that is currently being executed
     */
    static stopAlgorithm() {
        this.RUN = false
        hideSaveBtn()
    }

    /**
     * Function to replay algorithm that previously paused
     */
    static playAlgorithm() {
        this.RUN = true
        hideSaveBtn()
    }

    /**
     * Getter function to determine whether the algorithm that is currently running has finished
     * @returns {Boolean}       True if the algorithm has finished, false otherwise
     */
    static isFinished() {
        return this.FINISHED;
    }

    /**
     * Function to update play button once algorithm execution is finished.
     * Used for generate screen.
     * @param {HTML Div}    playbtn         Element representing the button in the HTML
     * @param {Function}    update          Function used to update the grid
     * @param {Grid}        grid            Grid object modelling the maze
     */
    static finishedGenerate(playbtn, update, grid) {
        this.FINISHED = true  // Update finished to true
        this.stopAlgorithm()  // Stop the algorithm
        setGrid(grid)
        update(false)
        revealSaveBtn()

        playbtn.style.backgroundImage = "url('../../public/img/Repeat\ Icon.png')"
    }

    /**
     * Function to update play button once algorithm execution is finished.
     * Used for solve screen.
     * @param {HTML Div}    playbtn         Element representing the button in the HTML
     * @param {Function}    update          Update function used to update the maze
     */
    static finishedSolve(playbtn) {
        this.FINISHED = true  // Update finished to true
        this.stopAlgorithm()  // Stop the algorithm
        revealSaveBtn()

        playbtn.style.backgroundImage = "url('../../public/img/Repeat\ Icon.png')"
    }

    /**
     * Function to restart all algorithm variables, used in solve screen
     */
    static restart(playbtn) {
        this.RUN = false
        this.FINISHED = false
        playbtn.style.backgroundImage = "url('../../public/img/Play\ Icon.png')"
    }

    // ----------------------------------------------------------------------

}

export { Algorithms };