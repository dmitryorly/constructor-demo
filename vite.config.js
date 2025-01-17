import { defineConfig } from 'vite'

/** @type {import('vite').UserConfig} */
export default defineConfig({
	base: '/constructor-demo/',
	root: './src',
	build: {
		outDir: '../dist',
		rollupOptions: {
			input: {
				main: './src/index.html',
				promteh: './src/promteh/index.html',
			}
		}
	}
})
