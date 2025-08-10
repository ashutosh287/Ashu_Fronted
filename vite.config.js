import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'




// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   server: {
//     host: true,
//     port: 5173,
//     proxy: {
//       '/api': {
//         target: '',
//         changeOrigin: true,
//         secure: false,
//         rewrite: (path) => path.replace(/^\/api/, '')
//       },
      
//     }
//   }
// });


export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://ashu-backend.vercel.app/',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    }
  }
});




