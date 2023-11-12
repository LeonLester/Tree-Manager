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
      const response = await axios.get('http://localhost:3001/api/nodes', {"Access-Control-Allow-Origin": "*"});
      setNodes(response.data);
    } catch (error) {
      console.error('Error fetching tree data:', error);
    }
  };


  const handleAddNode = async (e) => {
    e.preventDefault();

    const isParentIdValid = nodes.some(node => node._node.id === parentId);

    if (!isParentIdValid) {
      setErrorMessage(`Error: Parent node with id ${parentId} does not exist.`);
      setTimeout(() => {
        setErrorMessage('');
      }, 2000);
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:3001/api/nodes', { parent_id: parentId, })
      console.log(response.data);
      fetchNodes();
    } catch (error) {
      console.error('Error adding node:', error)
    }
  };

  const renderTree = (parentNode, depth = 1) => {
    // Calculate font size based on the depth
    const fontSize = 16 - depth * 2; // You can adjust this formula as needed
  
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
