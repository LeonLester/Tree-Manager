<template>
    <div>
        <!-- v-for is for iteration, like React's map -->
      <div v-for="node in nodes" :key="node._node.id">
        <div v-html="renderTree(node)"></div>
      </div>
      <form class="button_form" @submit.prevent="addNode">
        <!-- v-model is for two-way data binding like onChange of react states -->
        <input v-model="parentId" type="text" />
        <!-- @ is the event listener, so @click === onClick -->
        <button type="submit">Add Node</button>
        <button type="button" @click="handleEmptyTree">Clear Tree</button>
      </form>
      <!-- if is if. pretty self-explanatory -->
      <div v-if="errorMessage" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 20px; background: rgb(204, 45, 45); color: white; borderRadius: 5px">
        {{errorMessage}}
      </div>
    </div>
  </template>
  
<script>
//   ref is like useState
// onMounted is the equivalent to useEffect
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  export default {
    setup() {
      const nodes = ref([]);
      const parentId = ref('');
      const errorMessage = ref('');
    //   TODO: Move to .env file on vue app root dir
      const backend_location = 'http://localhost:3001';

      const fetchNodes = async () => {
        try {
          const response = await axios.get(`${backend_location}/api/nodes`, {"Access-Control-Allow-Origin": "*"});
          nodes.value = response.data;
        } catch (error) {
          console.error('Error fetching tree data:', error);
        }
      };
  
      const handleEmptyTree = async () => {
        try {
          await axios.post(`${backend_location}/api/nodes/truncate`)
          await fetchNodes();
        } catch (error) {
          console.error('Error adding node:', error);
        }
      };
  
      const addNode = async () => {
        const data = nodes.value.length === 0
        ? { ID: parentId.value }
        : { parent_ID: parentId.value };
        try {
          await axios.post(`${backend_location}/api/nodes`, data)
          await fetchNodes();
        } catch (error) {
          console.error('Error adding node:', error);
          if (error.response && error.response.status === 400) {
            errorMessage.value = `Error: Parent node with ID ${parentId.value} does not exist.`;
          } else {
            errorMessage.value = 'Error: Failed to add node.';
          }
  
          setTimeout(() => {
            errorMessage.value = '';
          }, 2000);
        }
      };
  
      onMounted(fetchNodes);
  
      return { nodes, parentId, errorMessage, fetchNodes, handleEmptyTree, addNode };
    },
    // in methods we define the methods, instead of inside the component as functions in React
    methods: {
      renderTree(parentNode, depth = 1) {
          const fontSize = 12;
          return `
              <div style="max-width: 50%; margin: 0 auto; text-align: center;">
                <h2 style="font-size: ${fontSize}px; color: #7C90A0;">${parentNode._node.name}</h2>
                ${parentNode.children && parentNode.children.length > 0 ? `
                  <div style="display: flex; flex-direction: row; justify-content: center;">
                    ${parentNode.children.map(childNode => `
                      <div style="margin: 0 10px;">
                        ${this.renderTree(childNode, depth + 1)}
                      </div>
                    `).join('')}
                  </div>
                ` : ''}
              </div>
            `;
            },
            },
  };
</script>
  