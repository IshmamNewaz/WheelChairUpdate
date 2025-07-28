from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

def db_connection():
    conn = None
    try:
        conn = sqlite3.connect('iot_devices.db')
    except sqlite3.error as e:
        print(e)
    return conn

@app.route('/devices', methods=['GET'])
def get_devices():
    conn = db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM devices")
    devices = [
        dict(zip([key[0] for key in cursor.description], row))
        for row in cursor.fetchall()
    ]
    conn.close()
    return jsonify(devices)

@app.route('/devices', methods=['POST'])
def add_device():
    conn = db_connection()
    cursor = conn.cursor()
    data = request.get_json()
    longitude = data['longitude']
    latitude = data['latitude']
    device_status = data['device_status']
    obstacle = data['obstacle']
    cursor.execute("INSERT INTO devices (longitude, latitude, device_status, obstacle) VALUES (?, ?, ?, ?)",
                     (longitude, latitude, device_status, obstacle))
    conn.commit()
    return jsonify({'message': 'Device added successfully'}), 201

@app.route('/devices/<int:device_id>', methods=['GET'])
def get_device_by_id(device_id):
    conn = db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM devices WHERE id = ?", (device_id,))
    device = cursor.fetchone()
    conn.close()
    if device:
        return jsonify(dict(zip([key[0] for key in cursor.description], device)))
    else:
        return jsonify({'message': 'Device not found'}), 404

@app.route('/devices/<int:device_id>', methods=['PUT'])
def update_device(device_id):
    conn = db_connection()
    cursor = conn.cursor()
    data = request.get_json()
    longitude = data['longitude']
    latitude = data['latitude']
    device_status = data['device_status']
    obstacle = data['obstacle']
    cursor.execute("UPDATE devices SET longitude = ?, latitude = ?, device_status = ?, obstacle = ? WHERE id = ?",
                     (longitude, latitude, device_status, obstacle, device_id))
    conn.commit()
    return jsonify({'message': 'Device updated successfully'})

@app.route('/devices/<int:device_id>', methods=['DELETE'])
def delete_device(device_id):
    conn = db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM devices WHERE id = ?", (device_id,))
    conn.commit()
    return jsonify({'message': 'Device deleted successfully'})

if __name__ == '__main__':
    app.run(debug=True)
