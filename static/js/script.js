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
        document.querySelector("#solve").value = "Solve"
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
        let xhttp = new XMLHttpRequest()
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let results = JSON.parse(this.response)
                if (results.length != 0) {
                    for (let i = 0, len = results.length; i < len; i++) {
                        Solutions.push(new Board(results[i]))
                    }
                    Solutions[0].show()
                    currentSolution(0, Solutions.length)
                    document.querySelector("#solve").value = "Unsolve"
                } else {
                    console.log("Check your Input")
                    alert("Check your Input")
                    document.querySelector("#solve").value = "Solve"
                }
            }
        }
        xhttp.open("POST", "/", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("board=" + makeBoard()[1])
        document.querySelector("#solve").value = "Solving..."
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
    document.querySelector("#solve").value = "Solve"
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
    return [solved, JSON.stringify(board)]
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
