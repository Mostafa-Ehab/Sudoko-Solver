NEIGHBORS = [[0, 1, 2, 9, 10, 11, 18, 19, 20],
             [3, 4, 5, 12, 13, 14, 21, 22, 23],
             [6, 7, 8, 15, 16, 17, 24, 25, 26],
             [27, 28, 29, 36, 37, 38, 45, 46, 47],
             [30, 31, 32, 39, 40, 41, 48, 49, 50],
             [33, 34, 35, 42, 43, 44, 51, 52, 53],
             [54, 55, 56, 63, 64, 65, 72, 73, 74],
             [57, 58, 59, 66, 67, 68, 75, 76, 77],
             [60, 61, 62, 69, 70, 71, 78, 79, 80]]


class Solver:
    def __init__(self):
        self.Solutions = []

    def get_solution(self):
        return self.Solutions

    def solve(self, board):
        if len(self.Solutions) >= 500:
            return True
        # ------------------------------------
        # --------- Validaty of Rows ---------
        # ------------------------------------
        for x in range(0, 81, 9):
            row = set(board[cell] for cell in range(x, x + 9))
            if (None not in row) and len(row) != 9:
                return

        # ------------------------------------
        # --------- Validaty of Cols ---------
        # ------------------------------------
        for y in range(9):
            col = set(board[cell] for cell in range(y, 81, 9))
            if (None not in col) and len(col) != 9:
                return

        # ------------------------------------
        # ------ Validaty of Neighbors -------
        # ------------------------------------
        for neighbor in NEIGHBORS:
            neigh = set(board[cell] for cell in neighbor)
            if (None not in neigh) and len(neigh) != 9:
                return

        all_values = range(1, 10)
        while True:
            # ------------------------------------
            # -------- Create TEMP Board ---------
            # ------------------------------------
            knowledge = {}

            changed = False
            for cell in range(81):
                removed = []
                if board[cell] == None:
                    # ------------------------------------
                    # ------------ Check Rows ------------
                    # ------------------------------------
                    for x in range(0,  81, 9):
                        if cell in range(x, x + 9):
                            for j in range(x, x + 9):
                                if board[j] != None:
                                    removed.append(board[j])

                    # ------------------------------------
                    # ------------ Check Cols ------------
                    # ------------------------------------
                    for y in range(9):
                        if cell in range(y, 81, 9):
                            for j in range(y, 81, 9):
                                if board[j] != None:
                                    removed.append(board[j])

                    # ------------------------------------
                    # --------- Check Neighbors ----------
                    # ------------------------------------
                    for neighbor in NEIGHBORS:
                        if cell in neighbor:
                            for j in neighbor:
                                if board[j] != None:
                                    removed.append(board[j])
                    prob = [l for l in all_values if l not in removed]
                    if len(prob) == 0:
                        return False
                    if len(prob) == 1:
                        board[cell] = prob[0]
                        changed = True
                    else:
                        knowledge[cell] = prob
            if changed:
                continue

            # ------------------------------------
            # ----------- Loop in Rows -----------
            # ------------------------------------
            for x in range(0,  81, 9):
                data = {}
                for i in all_values:
                    data[i] = []
                    for j in range(x, x + 9):
                        if board[j] == None and i in knowledge[j]:
                            data[i].append(j)

                for d in data:
                    if len(data[d]) == 1:
                        changed = True
                        board[data[d][0]] = d
            if changed:
                continue

            # ------------------------------------
            # ----------- Loop in Cols -----------
            # ------------------------------------
            for y in range(9):
                data = {}
                for i in all_values:
                    data[i] = []
                    for j in range(y, 81, 9):
                        if board[j] == None and i in knowledge[j]:
                            data[i].append(j)

                for d in data:
                    if len(data[d]) == 1:
                        changed = True
                        board[data[d][0]] = d
            if changed:
                continue

            # ------------------------------------
            # --------- Loop in Neighbors --------
            # ------------------------------------
            for neighbor in NEIGHBORS:
                data = {}
                for i in all_values:
                    data[i] = []
                    for j in neighbor:
                        if board[j] == None and i in knowledge[j]:
                            data[i].append(j)
                for d in data:
                    if len(data[d]) == 1:
                        changed = True
                        board[data[d][0]] = d
            if changed:
                continue

            break

        if self.end(board) == False:
            for p in knowledge:
                for i in knowledge[p]:
                    new_board = board.copy()
                    new_board[p] = i
                    self.solve(new_board)
                return
        else:
            self.Solutions.append(board)

    def end(self, board):
        for i in board:
            if i == None:
                return False
        return True
