#!/usr/bin/env python3

from flask import Flask, render_template
import sys
import getopt

app = Flask(__name__)

def main(argv):
    port = 5000  # Default port
    try:
        opts, args = getopt.getopt(argv, "p:", ["port="])
    except getopt.GetoptError:
        print('Usage: app.py -p <port>')
        sys.exit(2)
    for opt, arg in opts:
        if opt in ("-p", "--port"):
            port = int(arg)
    
    app.run(debug=True, port=port)

@app.route('/')
def index():
	return render_template('index.html')

if __name__ == "__main__":
	main(sys.argv[1:])

