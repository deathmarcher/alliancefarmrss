#!/usr/bin/env python3

from flask import Flask, send_from_directory
import sys
import getopt

app = Flask(__name__)

port = 5000  # Default port

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/script.js')
def script():
    return send_from_directory('.', 'script.js')

def main(argv):
    global port

    try:
        opts, args = getopt.getopt(argv, "p:", ["port="])
    except getopt.GetoptError:
        print('Usage: app.py -p <port>')
        sys.exit(2)
    for opt, arg in opts:
        if opt in ("-p", "--port"):
            port = int(arg)

    app.run(debug=True, port=port)

if __name__ == "__main__":
    main(sys.argv[1:])

