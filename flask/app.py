# app.py
from flask import Flask, jsonify, request
import mysql.connector
from flask_cors import CORS
import sys
import os
import logging
from dotenv import load_dotenv
app = Flask(__name__)
CORS(app)

# Load environment variables from the .env file
load_dotenv()

# Access individual environment variables

db_config = {
    "host": os.getenv("MYSQL_HOST"),
    "user": os.getenv("MYSQL_USER"),
    "password": os.getenv("MYSQL_PASSWORD"),
    "database": os.getenv("MYSQL_DATABASE"),
}

# Route to fetch the tree data
@app.route('/api/nodes', methods=['GET'])
def get_nodes():
    try:
        with mysql.connector.connect(**db_config) as connection, connection.cursor(dictionary=True) as cursor:
            cursor.execute('SELECT * FROM Node')
            rows = cursor.fetchall()
            logging.debug("Got database cursor")
            tree_data = transform_data(rows)
        return jsonify(tree_data), 200
    except Exception as e:
        print(f'Error fetching tree data: {e}', file=sys.stderr)
        return jsonify(error='Failed to fetch tree data'), 500

# Route to add a node 
@app.route('/api/nodes', methods=['POST'])
def add_node():
    try:
        data = request.json
        id = data.get('ID')
        parent_ID = data.get('parent_ID')

        with mysql.connector.connect(**db_config) as connection, connection.cursor(dictionary=True) as cursor:
            if id:
                query = 'INSERT INTO Node (ID) VALUES (%s)'
                values = (id,)
            elif parent_ID:
                query = 'INSERT INTO Node (parent_ID) VALUES (%s)'
                values = (parent_ID,)
            else:
                return jsonify({'error': 'Either ID or parent_ID must be provided'}), 400

            cursor.execute(query, values)
            connection.commit()

            # Fetch the inserted node for response
            cursor.execute('SELECT * FROM Node WHERE ID = LAST_INSERT_ID()')
            new_node = cursor.fetchone()

        return jsonify(new_node), 200

    except mysql.connector.Error as e:
        print(f'Database Error: {e}', file=sys.stderr)
        error_message = str(e)

        # Check specific MySQL error codes and provide custom error messages
        if "foreign key constraint fails" in error_message:
            return jsonify(error='Parent node does not exist'), 400
        else:
            return jsonify(error='Failed to add node. Database error'), 500

    except Exception as e:
        print(f'Error adding node: {e}', file=sys.stderr)
        return jsonify(error='Failed to add node'), 500
    

# Route to clear the whole tree
@app.route('/api/nodes/truncate', methods=['POST'])
def truncate_table():
    try:
        with mysql.connector.connect(**db_config) as connection, connection.cursor() as cursor:
            # Truncate the Node table
            cursor.execute('TRUNCATE TABLE Node')
            connection.commit()

        return jsonify(message='Table Node truncated successfully'), 200

    except Exception as e:
        print(f'Error truncating table: {e}', file=sys.stderr)
        return jsonify(error='Failed to truncate table'), 500



# Helper function to transform database rows into tree structure
def transform_data(rows):
    nodes = [{'id': row['ID'], 'name': f'Node {row["ID"]}', 'parent_id': row['parent_ID']} for row in rows]
    tree = build_tree(nodes)
    return tree

# Helper function to build a tree from a flat list
def build_tree(nodes):
    tree_map = {node['id']: {'_node': node, 'children': []} for node in nodes}
    root_nodes = []

    for _, node_info in tree_map.items():
        parent_id = node_info['_node']['parent_id']
        if parent_id is None:
            root_nodes.append(node_info)
        else:
            parent_info = tree_map[parent_id]
            parent_info['children'].append(node_info)

    return root_nodes

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.getenv("FLASK_PORT"))
