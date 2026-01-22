import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		react()
	],
	server: {
		host: '::',
		port: 3000,
		proxy: {
			'/api': {
				target: 'http://localhost:5000',
				changeOrigin: true,
				secure: false
			}
		}
	},
	resolve: {
		extensions: ['.jsx', '.js', '.tsx', '.ts', '.json'],
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
});