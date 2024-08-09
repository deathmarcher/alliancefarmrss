#!/usr/bin/env python3

from flask import Flask, render_template, request, jsonify
import sys
import getopt
import json

app = Flask(__name__)

data_file = "data.json"
admin_password = "default_password"
port = 5000  # Default port

def load_data():
    try:
        with open(data_file, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {"alliances": []}

def save_data(data):
    with open(data_file, 'w') as f:
        json.dump(data, f, indent=4)

@app.route('/')
def index():
    alliances = load_data().get('alliances', [])
    return render_template('index.html', alliances=alliances)

@app.route('/load_alliance', methods=['GET'])
def load_alliance():
    alliance_name = request.args.get('alliance')
    alliances = load_data().get('alliances', [])
    alliance = next((a for a in alliances if a['name'] == alliance_name), None)
    if alliance:
        return jsonify(alliance)
    return jsonify({}), 404

@app.route('/save_alliance', methods=['POST'])
def save_alliance():
    if request.args.get('admin') != admin_password:
        return "Unauthorized", 403

    new_alliance = request.json
    data = load_data()
    alliances = data.get('alliances', [])

    for i, alliance in enumerate(alliances):
        if alliance['name'] == new_alliance['name']:
            alliances[i] = new_alliance
            break
    else:
        alliances.append(new_alliance)

    save_data(data)
    return jsonify({"success": True})

@app.route('/create_alliance', methods=['POST'])
def create_alliance():
    if request.args.get('admin') != admin_password:
        return "Unauthorized", 403

    new_alliance = request.json
    data = load_data()
    alliances = data.get('alliances', [])

    if any(a['name'] == new_alliance['name'] for a in alliances):
        return jsonify({"error": "Alliance already exists"}), 400

    alliances.append(new_alliance)
    save_data(data)
    return jsonify({"success": True})

def main(argv):
    global data_file, admin_password, port

    try:
        opts, args = getopt.getopt(argv, "d:a:p:", ["data=", "admin-password=", "port="])
    except getopt.GetoptError:
        print('Usage: app.py -d <data_file> -a <admin_password> -p <port>')
        sys.exit(2)
    for opt, arg in opts:
        if opt in ("-d", "--data"):
            data_file = arg
        elif opt in ("-a", "--admin-password"):
            admin_password = arg
        elif opt in ("-p", "--port"):
            port = int(arg)

    app.run(debug=True, port=port)

if __name__ == "__main__":
    main(sys.argv[1:])

