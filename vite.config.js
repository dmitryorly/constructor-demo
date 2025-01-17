import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { defineConfig } from 'vite'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(resolve(__dirname, 'index.html'))

/** @type {import('vite').UserConfig} */
export default defineConfig({
	base: '/constructor-demo/',
	root: './src',
	build: {
		rollupOptions: {
			input: {
				main: './src/index.html',
				promteh: './src/promteh/index.html',
			}
		}
	}
})
