
import sqlite3
from sqlite3 import Error

def create_connection():
    """ create a database connection to a SQLite database """
    conn = None
    try:
        conn = sqlite3.connect('iot_devices.db')
        print(f"Successfully connected to SQLite with version {sqlite3.version}")
    except Error as e:
        print(e)
    return conn

def create_table(conn):
    """ create a table from the create_table_sql statement """
    try:
        c = conn.cursor()
        c.execute("""
            CREATE TABLE IF NOT EXISTS devices (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                longitude REAL NOT NULL,
                latitude REAL NOT NULL,
                device_status TEXT NOT NULL,
                obstacle TEXT
            );
        """)
        print("Table created successfully")
    except Error as e:
        print(e)

def add_device(conn, device):
    """
    Create a new device into the devices table
    :param conn:
    :param device:
    :return: device id
    """
    sql = ''' INSERT INTO devices(longitude,latitude,device_status,obstacle)
              VALUES(?,?,?,?) '''
    cur = conn.cursor()
    cur.execute(sql, device)
    conn.commit()
    return cur.lastrowid

def get_all_devices(conn):
    """
    Query all rows in the devices table
    :param conn: the Connection object
    :return:
    """
    cur = conn.cursor()
    cur.execute("SELECT * FROM devices")
    rows = cur.fetchall()
    return rows

def update_device_status(conn, id, status):
    """
    update status of a device
    :param conn:
    :param id:
    :param status:
    :return: project id
    """
    sql = ''' UPDATE devices
              SET device_status = ?
              WHERE id = ?'''
    cur = conn.cursor()
    cur.execute(sql, (status, id))
    conn.commit()

def delete_device(conn, id):
    """
    Delete a device by device id
    :param conn:  Connection to the SQLite database
    :param id: id of the device
    :return:
    """
    sql = 'DELETE FROM devices WHERE id=?'
    cur = conn.cursor()
    cur.execute(sql, (id,))
    conn.commit()

def main():
    conn = create_connection()
    if conn is not None:
        create_table(conn)

        # Add a new device
        device_1 = (10.123, 20.456, 'active', 'none')
        device_id = add_device(conn, device_1)
        print(f"Device added with id: {device_id}")

        # Get all devices
        print("All devices:")
        devices = get_all_devices(conn)
        for device in devices:
            print(device)

        # Update a device's status
        update_device_status(conn, device_id, 'inactive')
        print(f"Device {device_id} status updated.")

        # Get all devices again to see the change
        print("All devices after update:")
        devices = get_all_devices(conn)
        for device in devices:
            print(device)

        # Delete the device
        delete_device(conn, device_id)
        print(f"Device {device_id} deleted.")

        # Get all devices again to see the change
        print("All devices after deletion:")
        devices = get_all_devices(conn)
        for device in devices:
            print(device)

        conn.close()
    else:
        print("Error! cannot create the database connection.")

if __name__ == '__main__':
    main()
