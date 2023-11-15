# app.py
from flask import Flask, jsonify, request
import mysql.connector
from flask_cors import CORS
import sys
app = Flask(__name__)
CORS(app)

# MySQL database configuration
db_config = {
    'host': 'mysql',
    'user': 'leo',
    'password': 'root',
    'database': 'tree',
}


@app.route('/api/nodes', methods=['GET', 'POST'])
def manage_nodes():
    print("in manage_nodes",file=sys.stderr)
    if request.method == 'GET':
        print(f"{request.method=} {request.endpoint=}", file=sys.stderr)
        # Fetch initial tree data
        try:
            with mysql.connector.connect(**db_config) as connection, connection.cursor(dictionary=True) as cursor:
                cursor.execute('SELECT * FROM Node')
                rows = cursor.fetchall()
                print(rows)
                tree_data = transform_data(rows)
            
            return jsonify(tree_data), 200
        except Exception as e:
            print(f'Error fetching tree data: {e}', file=sys.stderr)
            return jsonify(error='Internal Server Error'), 500

    elif request.method == 'POST':
        # Add a new child node or truncate the table
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
                elif data.get('truncate') == True:
                    # Truncate the Node table
                    cursor.execute('TRUNCATE TABLE Node')
                    connection.commit()
                    return jsonify(message='Table Node truncated successfully'), 200
                else:
                    return jsonify({'error': 'Either ID, parent_ID, or truncate must be provided'}), 400

                # Insert the new node
                cursor.execute(query, values)
                connection.commit()

                # Fetch the inserted node for response
                cursor.execute('SELECT * FROM Node WHERE ID = LAST_INSERT_ID()')
                new_node = cursor.fetchone()

            return jsonify(new_node), 200

        except Exception as e:
            print(f'Error adding node: {e}', file=sys.stderr)
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
    app.run(host='0.0.0.0', port=5050)
