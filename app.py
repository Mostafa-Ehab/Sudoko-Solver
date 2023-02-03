from flask import Flask, render_template, request
from sudoko import Solver
import json
from Camera.analyze import analyze
import numpy as np

# Configure application
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True


@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        board = json.loads(request.form.get('board'))
        for i in range(81):
            if board[i] == "":
                board[i] = None

        solve = Solver()
        solve.solve(board)
        solution = solve.get_solution()

        return json.dumps(solution)
    else:
        return render_template("index.html")


@app.route("/img", methods=["POST"])
def imgBoard():
    if request.method == "POST":
        img = json.loads(request.form.get('img'))
        width = int(request.form.get("width"))
        height = int(request.form.get("height"))

        # try:
        #     print("Analyzing with model 6")
        #     Board1 = analyze(img, width, height, "model6.h5").reshape(-1)
        # except:
        #     Board1 = np.zeros((81))

        try:
            print("Analyzing with model 7")
            Board2 = analyze(img, width, height, "model7.h5").reshape(-1)
        except:
            Board2 = np.zeros((81))

        # print("Comparing two models")
        # board = np.zeros(81)
        # for i in range(81):
        #     if Board1[i] == Board2[i]:
        #         board[i] = Board1[i]

        return json.dumps(Board2.tolist())
        # try:
        #     return json.dumps(analyze(img, width, height).reshape(-1).tolist())
        # except:
        #     return json.dumps(np.zeros((9, 9)))


if __name__ == "__main__":
    app.run()  # ssl_context='adhoc')
