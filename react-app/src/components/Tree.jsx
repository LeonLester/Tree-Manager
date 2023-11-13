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

  const handleAddNode = async (e) => {
    fetchNodes();
    e.preventDefault();
    var root = false;
    if (nodes.length === 0) {
      root = true;
      // If the list is empty, you can add the node without checking for the parent's existence.
      addNode(root);
      return;
    }

    console.log(parentId);
    const isParentIdValid = nodes.some(node => {
    console.log(node._node.id);

    if (node._node.id == parentId) {
      // Case 1: The parent node exists.
      return true;
    }

    console.log(node.children);
    // Case 2: Check if the parent ID exists in the children of the current node. childNode._node.id === parentId
    return node.children.some(childNode => childNode._node.id == parentId );
    });

    console.log(isParentIdValid);
    console.log(nodes);
    if (!isParentIdValid) {
      setErrorMessage(`Error: Parent node with id ${parentId} does not exist.`);
      setTimeout(() => {
        setErrorMessage('');
      }, 2000);
      return;
    }
  
    addNode(root);
  };

  const renderTree = (parentNode, depth = 1) => {
    // Calculate font size based on the depth
    const fontSize = 16 - depth * 2;
  
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
      <form className="button_form" onSubmit={(e) => handleAddNode(e)}>
          <input
            type="text"
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
          />
          <button onClick={handleAddNode}>Add Node</button>
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
