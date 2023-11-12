# app.py
from flask import Flask, jsonify, request
import mysql.connector
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)

# MySQL database configuration
db_config = {
    'host': 'localhost',
    'user': 'leo',
    'password': 'root',
    'database': 'tree',
}

@app.route('/api/nodes', methods=['GET', 'POST'])
def manage_nodes():
    if request.method == 'GET':
        # Fetch initial tree data
        try:
            connection = mysql.connector.connect(**db_config)
            cursor = connection.cursor(dictionary=True)
            cursor.execute('SELECT * FROM Node')
            rows = cursor.fetchall()
            tree_data = transform_data(rows)
            cursor.close()
            connection.close()
            return jsonify(tree_data)
        except Exception as e:
            print(f'Error fetching tree data: {e}')
            return jsonify(error='Internal Server Error'), 500

    elif request.method == 'POST':
        # Add a new child node
        try:
            data = request.json
            parent_id = data.get('parent_id')
            node_name = data.get('name')

            connection = mysql.connector.connect(**db_config)
            cursor = connection.cursor(dictionary=True)

            # Insert the new node
            cursor.execute('INSERT INTO Node (parent_ID) VALUES (%s)', (parent_id,))
            connection.commit()

            # Fetch the inserted node for response
            cursor.execute('SELECT * FROM Node WHERE ID = LAST_INSERT_ID()')
            new_node = cursor.fetchone()

            cursor.close()
            connection.close()

            return jsonify(new_node), 201
        except Exception as e:
            print(f'Error adding node: {e}')
            return jsonify(error='Internal Server Error'), 500


# Helper function to transform database rows into tree structure
def transform_data(rows):
    # Your transformation logic here
    # Example: assuming your database structure is similar to your provided example
    nodes = [{'id': row['ID'], 'name': f'Node {row["ID"]}', 'parent_id': row['parent_ID']} for row in rows]
    tree = build_tree(nodes)
    return tree

# Helper function to build a tree from a flat list
def build_tree(nodes):
    tree_map = {node['id']: {'_node': node, 'children': []} for node in nodes}
    root_nodes = []

    for node_id, node_info in tree_map.items():
        parent_id = node_info['_node']['parent_id']
        if parent_id is None:
            root_nodes.append(node_info)
        else:
            parent_info = tree_map[parent_id]
            parent_info['children'].append(node_info)

    return root_nodes

if __name__ == '__main__':
    app.run(port=3001)
