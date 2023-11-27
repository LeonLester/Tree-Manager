import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import babel from 'vite-plugin-babel';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),({
    babelConfig: {
      babelrc: false,
      configFile: false,
      plugins: ['@babel/plugin-transform-react-jsx']
    }
  }),],
  server: {
    watch: {
      usePolling: true,
    },
    host: true, // needed for the Docker Container port mapping to work
    strictPort: true,
    port: 5173, // you can replace this port with any port
  },
})
