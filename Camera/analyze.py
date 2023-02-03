from Camera.puzzle import find_board
from Camera.puzzle import extract_digit
from keras.utils import img_to_array
from keras.models import load_model
import numpy as np
import cv2
import imutils


def analyze(img, width, height, model):
    model = load_model(f"Camera/models/{model}")
    img = np.array(img, np.uint8).reshape(height, width, 4)
    img = cv2.cvtColor(img, cv2.COLOR_RGBA2BGR)
    # img = cv2.imread("Camera/img2.jpg")
    # cv2.imshow("Image", img)
    # cv2.waitKey(0)

    img = imutils.resize(img, width=600)
    (puzzle, warped) = find_board(img)
    # cv2.imshow("Board", warped)
    # cv2.waitKey(0)

    # initialize our 9x9 Sudoku board
    board = np.zeros((9, 9), dtype="int")

    # a Sudoku puzzle is a 9x9 grid (81 individual cells), so we can
    # infer the location of each cell by dividing the warped image
    # into a 9x9 grid
    stepX = warped.shape[1] // 9
    stepY = warped.shape[0] // 9

    # loop over the grid locations
    for y in range(0, 9):
        # initialize the current list of cell locations
        for x in range(0, 9):
            # compute the starting and ending (x, y)-coordinates of the
            # current cell
            startX = x * stepX
            startY = y * stepY
            endX = (x + 1) * stepX
            endY = (y + 1) * stepY

            # crop the cell from the warped transform image and then
            # extract the digit from the cell
            cell = warped[startY:endY, startX:endX]
            digit = extract_digit(cell)
            # verify that the digit is not empty
            if digit is not None:
                # resize the cell to 28x28 pixels and then prepare the
                # cell for classification
                roi = cv2.resize(digit, (28, 28))
                # cv2.imshow("Digit", roi)
                # cv2.waitKey(0)
                roi = roi.astype("float") / 255.0
                roi = img_to_array(roi)
                roi = np.expand_dims(roi, axis=0)

                # classify the digit and update the Sudoku board with the
                # prediction
                pred = model.predict(roi).argmax(axis=1)[0]

                board[y, x] = pred

    print(board)
    return board
