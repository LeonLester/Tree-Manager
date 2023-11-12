// src/components/Tree.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import AddNode from './'

const Tree = () => {
  const [nodes, setNodes] = useState([]);
  const [parentId, setParentId] = useState('');

  const fetchNodes = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/nodes', {"Access-Control-Allow-Origin": "*"});
      setNodes(response.data);
    } catch (error) {
      console.error('Error fetching tree data:', error);
    }
  };

  useEffect(() => {
    fetchNodes();
   }, []);

   const handleAddNode = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/nodes', { parent_id: parentId,})
      console.log(response.data);
      fetchNodes();
    } catch (error){
      console.error('Error adding node:', error)
    }
  };


  const renderTree = (parentNode) => {
    return (
      <div key={parentNode._node.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2>{parentNode._node.name}</h2>
        {parentNode.children && parentNode.children.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            {parentNode.children.map((childNode) => (
              <div key={childNode._node.id} style={{ margin: '0 10px' }}>
                {renderTree(childNode)}
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
    <div>
      <input
        type="text"
        value={parentId}
        onChange={(e) => setParentId(e.target.value)}
      />
      <button onClick={handleAddNode}>Add Node</button>
    </div>
    </>
  );
};

export default Tree;
