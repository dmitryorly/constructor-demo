import {
	Scene,
	WebGLRenderer,
	PerspectiveCamera,
	ACESFilmicToneMapping,
	PMREMGenerator,
	Clock
} from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Pane } from 'tweakpane'
import { mainLoop } from '../shared/modules/mainLoop.js'
import { HDRJPGLoader } from '@monogrid/gainmap-js'
import envMapUrl from '/small_empty_room_3_1k.jpg'
import modelUrl from '/bag-01-no-color.glb?url'

main()

const params = {
	color: '#000000',
	backgroundColor: {}
}

async function main() {
	const container = document.querySelector('#container')
	const canvas = document.querySelector('#canvas')

	let width = container.offsetWidth
	let height = container.offsetHeight

	const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true })
	renderer.setSize(width, height)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
	renderer.toneMapping = ACESFilmicToneMapping
	renderer.toneMappingExposure = 1
	renderer.setClearAlpha(0)

	const clock = new Clock()
	const scene = new Scene()
	const camera = new PerspectiveCamera(45, width / height, 0.1, 50)
	camera.position.set(0, 0, 5)
	const controls = new OrbitControls(camera, canvas)
	controls.enableDamping = true

	window.addEventListener('resize', resize)
	mainLoop.add(update)

	const [model, envTexture] = await Promise.all([loadModel(modelUrl), loadHDR(envMapUrl, renderer)])

	const pmremGenerator = new PMREMGenerator(renderer)
	scene.environment = pmremGenerator.fromEquirectangular(envTexture).texture

	scene.add(model)

	model.traverse((node) => {
		if (node.isMesh) {
			if (node.name !== 'Фурнитура') {
				node.material.color.set(params.color)
			}
		}
	})

	const pane = new Pane()

	pane.addBinding(params, 'color').on('change', ({ value }) => {
		model.traverse((node) => {
			if (!node.isMesh) return
			if (node.name !== 'Фурнитура') {
				node.material.color.set(value)
			}
		})
	})

	const getProp = (name, fallback) => getComputedStyle(container).getPropertyValue(name) || fallback

	params.backgroundColor = {
		stop1: { position: parseFloat(getProp('--p-1', '0')), color: getProp('--bg-1', '#ffffff') },
		stop2: { position: parseFloat(getProp('--p-2', '50')), color: getProp('--bg-2', '#ffffff') },
		stop3: { position: parseFloat(getProp('--p-3', '100')), color: getProp('--bg-3', '#ffffff') }
	}

	const backgroundFolder = pane.addFolder({ title: 'Background' })
	backgroundFolder.addBinding(params.backgroundColor.stop1, 'position', { step: 1, min: -50, max: 150 }).on('change', updateBackground)
	backgroundFolder.addBinding(params.backgroundColor.stop1, 'color').on('change', updateBackground)
	backgroundFolder.addBinding(params.backgroundColor.stop2, 'position', { step: 1, min: -50, max: 150 }).on('change', updateBackground)
	backgroundFolder.addBinding(params.backgroundColor.stop2, 'color').on('change', updateBackground)
	backgroundFolder.addBinding(params.backgroundColor.stop3, 'position', { step: 1, min: -50, max: 150 }).on('change', updateBackground)
	backgroundFolder.addBinding(params.backgroundColor.stop3, 'color').on('change', updateBackground)

	function update() {
		controls.update(clock.getDelta())
		renderer.render(scene, camera)
	}

	function resize() {
		width = container.offsetWidth
		height = container.offsetHeight

		camera.aspect = width / height
		camera.updateProjectionMatrix()
		renderer.setSize(width, height)
	}

	function updateBackground() {
		Object.values(params.backgroundColor).forEach(({ position, color }, i) => {
			container.style.setProperty(`--p-${i + 1}`, position + '%')
			container.style.setProperty(`--bg-${i + 1}`, color)
		})
	}
}

async function loadHDR(url, renderer) {
	const loader = new HDRJPGLoader(renderer)
	const result = await loader.loadAsync(url)
	return result.renderTarget.texture
}

async function loadModel(url) {
	const loader = new GLTFLoader()
	const result = await loader.loadAsync(url)
	return result.scene
}
