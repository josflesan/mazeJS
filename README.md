# MazeJS
> An Interactive Visual Maze Algorithm Tool
> Live demo [_here_](https://maze-js.herokuapp.com/#menu)

![Logo](https://github.com/josflesan/mazeJS/blob/main/public/img/Screenshots/mazeJS.png)

## Table of Contents
* [General Info](#general-information)
* [Technologies Used](#technologies-used)
* [Features](#features)
* [Screenshots](#screenshots)
* [Setup](#setup)
* [Usage](#usage)
* [Project Status](#project-status)
* [Room for Improvement](#room-for-improvement)
* [Acknowledgements](#acknowledgements)
* [Contact](#contact)


## General Information
- mazeJS provides a playground to explore and visualize different maze generation and maze solving algorithms.
- The tool includes visualization screens to explore each algorithm's functionality as well as a playground in which you can build and solve your own mazes

- This was a personal project aimed towards improving my knowledge of maze generation and maze solving algorithms as well as my javascript skills. Throughout the course of its development, I have learned about a range of different data structures, algorithm efficiency and promises.


## Technologies Used
- JavaScript (ES6), SCSS, Figma (asset design) - version 1.0

## Features

### Generate Screen
![Generate Screen](https://github.com/josflesan/mazeJS/blob/main/public/img/Screenshots/Generate%20Screen.png)
- Generate Mazes (5x5, 10x10, 15x15, 20x20, 25x25, 30x30)
- Various algorithms: Randomized DFS, Randomized Prim's Algorithm
- Visualize Maze Generation Algorithm using Animate Toggle
- Generate perfect (single solution) or imperfect (multiple solutions) mazes using Perfect Toggle
- Save Generated Mazes to the server

### Solve Screen
![Solve Screen](https://github.com/josflesan/mazeJS/blob/main/public/img/Screenshots/Solve%20Screen.png)
- Solve Mazes (5x5, 10x10, 15x15, 20x20, 25x25, 30x30)
- Various algorithms: BFS, DFS
- Visualize Maze Solving Algorithm using Animate Toggle
- Load saved mazes from the server and solve them

### Build Screen
![Build Screen](https://github.com/josflesan/mazeJS/blob/main/public/img/Screenshots/Build%20Screen.png)
- Build custom mazes (5x5, 10x10, 15x15, 20x20, 25x25, 30x30)
- Various algorithms: DFS, BFS
- Add custom starting and ending cell positions
- Visualize custom maze solution (if present) using animate toggle


## Screenshots
![Landing Page](https://github.com/josflesan/mazeJS/blob/main/public/img/Screenshots/Landing%20Page.png)
![Screenshot 2](https://github.com/josflesan/mazeJS/blob/main/public/img/Screenshots/Generate%20Screen%202.png)


## Setup
- npm (v6.14.11 used in project)
- express
`npm install express`


## Usage
In order to run the program, just start a local nodeJS server
`node app.js`

The server will start in port 3000, so heading over to `localhost:3000` to view the website! :)


## Project Status
Project is: _in progress_


## Room for Improvement

Room for improvement:
- Improvement to the UI can be made
- Any other suggestions are appreciated :)

To do:
- Add more algorithms
- Feature to be added 2


## Acknowledgements
- This project was inspired by Clément Mihailescu's Pathfinding Visualizer Tool


## Contact
Created by [@josflesan](josue.fle.sanc@gmail.com) - feel free to contact me!
