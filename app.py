from flask import Flask, render_template, request, jsonify
import csv
import os

app = Flask(__name__)
DATA_FILE = r'./supplier.csv'

# Ensure CSV exists with headers
def initialize_csv():
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['Supplier', 'Product', 'Supplier Manager', 'Company', 'Contract Start Date'])

# Read CSV data
def read_data():
    with open(DATA_FILE, newline='') as f:
        reader = csv.DictReader(f)
        return list(reader)

# Write all rows to CSV
def write_data(rows):
    with open(DATA_FILE, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=['Supplier', 'Product', 'Supplier Manager', 'Company', 'Contract Start Date'])
        writer.writeheader()
        writer.writerows(rows)

@app.route('/')
def index():
    initialize_csv()
    data = read_data()
    return render_template('index.html', data=data)

@app.route('/add', methods=['POST'])
def add_row():
    new_entry = request.get_json()
    rows = read_data()
    rows.append(new_entry)
    write_data(rows)
    return jsonify({'success': True})

@app.route('/edit', methods=['POST'])
def edit_row():
    updated_entry = request.get_json()
    index = int(updated_entry.pop('index'))
    rows = read_data()
    rows[index] = updated_entry
    write_data(rows)
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True)
