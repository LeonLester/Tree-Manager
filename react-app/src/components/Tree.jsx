// src/components/Tree.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const Tree = () => {
  const [nodes, setNodes] = useState([]);
  const [parentId, setParentId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    fetchNodes();
   }, []);

  const fetchNodes = async () => {
    try {
      const response = await axios.get('http://localhost:5050/api/nodes', {"Access-Control-Allow-Origin": "*"});
      setNodes(response.data);
    } catch (error) {
      console.error('Error fetching tree data:', error);
    }
  };

  const handleEmptyTree = async () => {
    console.log("AAAAAAAAAA")
    try {
      const response = await axios.post('http://localhost:5050/api/nodes', {truncate: true})
      await fetchNodes();
    } catch (error) {
      console.error('Error adding node:', error)
    }
    return;
  }

  const addNode = async (root) => {
    const data = root ? {ID: parentId} : { parent_ID: parentId }
    console.log("data is:", data);
    try {
      const response = await axios.post('http://localhost:5050/api/nodes', data)
      await fetchNodes();
    } catch (error) {
      console.error('Error adding node:', error)
    }
    return;
  }
  
  const handleAddNodeRecursive = async (e, currentNode, parentID) => {
    fetchNodes();
    e.preventDefault();
    var root = false;
  
    if (!currentNode && nodes.length === 0) {
      // If currentNode is undefined, initialize it as the root node
      root = true;
      currentNode = { _node: { id: null }, children: nodes };
    }
  
    if (currentNode?._node.id === parentID) {
      // Case 1: The current node is the parent node.
      addNode(root);
      return;
    }
  
    // Case 2: Check if the parent ID exists in the children of the current node.
    for (const childNode of currentNode.children || []) {
      await handleAddNodeRecursive(e, childNode, parentID);
    }
  };
  

  const renderTree = (parentNode, depth = 1) => {
    // Calculate font size based on the depth
    const fontSize = 12; //- depth * 2;
  
    return (
      <div key={parentNode._node.id} style={{ maxWidth: '50%', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: `${fontSize}px`, color: "#7C90A0"}}>{parentNode._node.name}</h2>
        {parentNode.children && parentNode.children.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            {parentNode.children.map((childNode) => (
              <div key={childNode._node.id} style={{ margin: '0 10px' }}>
                {renderTree(childNode, depth + 1)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
    <div name="Tree">
      {nodes.map(node => renderTree(node))}
    </div>
      <form className="button_form" onSubmit={(e) => handleAddNodeRecursive(e)}>
          <input
            type="text"
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
          />
          <button onClick={handleAddNodeRecursive}>Add Node</button>
      <button type="button" onClick={handleEmptyTree} >Clear Tree</button>

      </form>
    {errorMessage && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px', background: 'rgb(204, 45, 45)', color: 'white', borderRadius: '5px' }}>
          {errorMessage}
        </div>
      )}
    </>
  );
};

export default Tree;
