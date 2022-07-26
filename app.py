from flask import Flask, render_template, request
from sudoko import Solver
import json

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


if __name__ == "__main__":
    app.run()  # ssl_context='adhoc')
