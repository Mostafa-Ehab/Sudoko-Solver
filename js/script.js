let cells = document.querySelectorAll("#board input")
let Solutions = []
let current = 0

/*
** Board Class
*/
class Board {
    constructor(board) {
        this.board = board
    }

    show() {
        for (let i = 0; i < 81; i++) {
            cells[i].value = this.board[i]
        }
    }
}

/*
** Solve | Unsolve Button
*/
function solve() {
    /*
    ** If All Values Exist [make Unsolve]
    */
    if (makeBoard()[0] == true) {
        for (let i = 0; i < 81; i++) {
            if (cells[i].classList.contains("blue")) {
                cells[i].value = ""
                cells[i].classList.remove("blue")
            }
        }
        Solutions = []
        currentSolution(0, 0)
        document.querySelector("#solve").innerHTML = "Solve"
    }
    /*
    ** If Some Value not Exist [make Solve]
    */
    else {
        for (let i = 0; i < 81; i++) {
            if (cells[i].value == "") {
                cells[i].classList.add("blue")
            }
        }
        Solutions = []
        let solver = new Solver()
        document.querySelector("#solve").innerHTML = "Solving..."
        solver.solve(makeBoard()[1])
        let results = solver.getSolutions()
        if (results.length != 0) {
            for (let i = 0, len = results.length; i < len; i++) {
                Solutions.push(new Board(results[i]))
            }
            Solutions[0].show()
            currentSolution(0, Solutions.length)
            console.log("Results found")
            document.querySelector("#solve").innerHTML = "Unsolve"
        } else {
            console.log("Check your Input")
            showError("Please, check your inputs")
            document.querySelector("#solve").innerHTML = "Solve"
        }
    }
}

/*
** Reset Button
*/
function reset() {
    for (let i = 0; i < 81; i++) {
        cells[i].value = ""
        cells[i].classList.remove("blue")
    }
    currentSolution(0, 0)
    document.querySelector("#solve").innerHTML = "Solve"
}

/*
** Show Previous Solution
*/
document.querySelector("#prev").addEventListener("click", function (event) {
    if (current == 0) {
        current = (Solutions.length - 1)
    } else {
        current--
    }
    Solutions[current].show()
    currentSolution(current, Solutions.length)
})

/*
** Show Next Solution
*/
document.querySelector("#next").addEventListener("click", function (event) {
    if (current == (Solutions.length - 1)) {
        current = 0
    } else {
        current++
    }
    Solutions[current].show()
    currentSolution(current, Solutions.length)
})

/*
** Make Board and userInput
*/
function makeBoard() {
    let board = []
    let solved = true
    for (let i = 0, len = cells.length; i < len; i++) {
        if (cells[i].value == "") {
            board[i] = ""
            solved = false
        } else {
            board[i] = parseInt(cells[i].value)
        }
    }
    // return [solved, JSON.stringify(board)]
    return [solved, board]
}

/*
** Show Current Solution
*/
function currentSolution(i, len) {
    if (len != 0) {
        i++;
    }
    if (len > 1) {
        document.querySelector("#prev").style.display = "inline-block"
        document.querySelector("#next").style.display = "inline-block"
    }
    else {
        document.querySelector("#prev").style.display = "none"
        document.querySelector("#next").style.display = "none"
    }
    document.querySelector("#num").innerHTML = i + " of " + len
}

/*
** Show Error Message
*/
function showError(msg) {
    const container = document.querySelector(".error")
    container.querySelector(".error-msg").innerHTML = msg

    container.classList.add("active")
    setTimeout(() => {
        container.classList.remove("active")
    }, 2000)
}
