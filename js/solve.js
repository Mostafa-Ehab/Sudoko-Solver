let NEIGHBORS = [
    [0, 1, 2, 9, 10, 11, 18, 19, 20],
    [3, 4, 5, 12, 13, 14, 21, 22, 23],
    [6, 7, 8, 15, 16, 17, 24, 25, 26],
    [27, 28, 29, 36, 37, 38, 45, 46, 47],
    [30, 31, 32, 39, 40, 41, 48, 49, 50],
    [33, 34, 35, 42, 43, 44, 51, 52, 53],
    [54, 55, 56, 63, 64, 65, 72, 73, 74],
    [57, 58, 59, 66, 67, 68, 75, 76, 77],
    [60, 61, 62, 69, 70, 71, 78, 79, 80]
]



class Solver {
    constructor() {
        this.Solutions = []
    }

    getSolutions() {
        return this.Solutions
    }

    solve(board) {
        if (this.Solutions.length >= 1000) {
            return true
        }

        /* ---------------------------------
        --------- Validaty of Rows ---------
        --------------------------------- */
        for (let x = 0; x < 81; x += 9) {
            let row = new Set()
            for (let cell = x; cell < x + 9; cell++) {
                row.add(board[cell])
            }

            if (!row.has("") && row.size != 9) {
                return
            }
        }

        /* ---------------------------------
        -------- Validaty of Columns -------
        --------------------------------- */
        for (let y = 0; y < 9; y += 1) {
            let col = new Set()
            for (let cell = y; cell < 81; cell += 9) {
                col.add(board[cell])
            }

            if (!col.has("") && col.size != 9) {
                return
            }
        }

        /* ---------------------------------
        ------- Validaty of Neighbors ------
        --------------------------------- */
        for (let neighbor of NEIGHBORS) {
            let neigh = new Set()
            for (let cell of neighbor) {
                neigh.add(board[cell])
            }

            if (!neigh.has("") && neigh.size != 9) {
                return
            }
        }

        let all_values = Array.from({ length: 9 }, (v, i) => i + 1)
        while (true) {
            /* ---------------------------------
            --------- Create TEMP Board --------
            --------------------------------- */
            var knowledge = {}

            let changed = false
            for (let cell = 0; cell < 81; cell++) {
                let removed = []
                if (board[cell] == "") {
                    /* ---------------------------------
                    ------------ Check Rows ------------
                    --------------------------------- */
                    for (let x = 0; x < 81; x += 9) {
                        let row = []
                        for (let i = x; i < x + 9; i++) {
                            row.push(i)
                        }
                        if (row.includes(cell)) {
                            for (let i = x; i < x + 9; i++) {
                                if (board[i] != "") {
                                    removed.push(board[i])
                                }
                            }
                        }
                    }

                    /* ---------------------------------
                    ------------ Check Cols ------------
                    --------------------------------- */
                    for (let y = 0; y < 9; y++) {
                        let col = []
                        for (let j = y; j < 81; j += 9) {
                            col.push(j)
                        }
                        if (col.includes(cell)) {
                            for (let j = y; j < 81; j += 9) {
                                if (board[j] != "") {
                                    removed.push(board[j])
                                }
                            }
                        }
                    }

                    /* ---------------------------------
                    ---------- Check Neighbors ---------
                    --------------------------------- */
                    for (let neighbor of NEIGHBORS) {
                        if (neighbor.includes(cell)) {
                            for (let i of neighbor) {
                                if (board[i] != "") {
                                    removed.push(board[i])
                                }
                            }
                        }
                    }

                    /* -------------------------------------
                    ------ Get Probability of the cell -----
                    ------------------------------------- */
                    let prob = []
                    for (let i of all_values) {
                        if (!removed.includes(i)) {
                            prob.push(i)
                        }
                    }

                    if (prob.length == 0) {
                        return false
                    }

                    if (prob.length == 1) {
                        board[cell] = prob[0]
                        changed = true
                    } else {
                        knowledge[cell] = prob
                    }
                }

            }

            if (changed) {
                continue
            }

            /* -----------------------------
            --------- Loop in Rows ---------
            ----------------------------- */
            for (let x = 0; x < 81; x += 9) {
                let data = {}
                for (let i of all_values) {
                    data[i] = []
                    for (let j = x; j < x + 9; j++) {
                        if (board[j] == "" && knowledge[j].includes(i)) {
                            data[i].push(j)
                        }
                    }
                }

                for (let d of Object.keys(data)) {
                    if (data[d].length == 1) {
                        board[data[d][0]] = parseInt(d)
                        changed = true
                    }
                }
            }

            if (changed) {
                continue
            }

            /* -----------------------------
            --------- Loop in Cols ---------
            ----------------------------- */
            for (let y = 0; y < 9; y++) {
                let data = {}
                for (let i of all_values) {
                    data[i] = []
                    for (let j = y; j < 81; j += 9) {
                        if (board[j] == "" && knowledge[j].includes(i)) {
                            data[i].push(j)
                        }
                    }
                }

                for (let d of Object.keys(data)) {
                    if (data[d].length == 1) {
                        board[data[d][0]] = parseInt(d)
                        changed = true
                    }
                }
            }

            if (changed) {
                continue
            }

            /* -----------------------------
            ------- Loop in Neighbors ------
            ----------------------------- */
            for (let neighbor of NEIGHBORS) {
                let data = {}
                for (let i of all_values) {
                    data[i] = []
                    for (let j of neighbor) {
                        if (board[j] == "" && knowledge[j].includes(i)) {
                            data[i].push(j)
                        }
                    }
                }

                for (let d of Object.keys(data)) {
                    if (data[d].length == 1) {
                        board[data[d][0]] = parseInt(d)
                        changed = true
                    }
                }
            }

            if (changed) {
                continue
            }

            break
        }

        if (!this.end(board)) {
            for (let p of Object.keys(knowledge)) {
                for (let i of knowledge[p]) {
                    let new_board = [...board]
                    new_board[p] = parseInt(i)
                    this.solve(new_board)
                }
                return
            }
        } else {
            this.Solutions.push(board)
        }
    }

    end(board) {
        for (let i of board) {
            if (i == "") {
                return false
            }
        }
        return true
    }
}