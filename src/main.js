import {
	Scene,
	WebGLRenderer,
	PerspectiveCamera,
	ACESFilmicToneMapping,
	AmbientLight,
	EquirectangularReflectionMapping,
	Clock,
	MeshPhysicalMaterial
} from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Pane } from 'tweakpane'
import { mainLoop } from './modules/mainLoop.js'
import { HDRJPGLoader } from '@monogrid/gainmap-js'

main()

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

	const clock = new Clock()
	const scene = new Scene()
	const camera = new PerspectiveCamera(45, width / height, 1, 50)
	camera.position.set(0, 0, 5)
	const controls = new OrbitControls(camera, canvas)
	controls.enableDamping = true

	const ambientLight = new AmbientLight(0xffffff, 1)
	scene.add(ambientLight)

	window.addEventListener('resize', resize)
	mainLoop.add(update)

	const [model, envTexture] = await Promise.all([
		loadModel('/details.glb'),
		loadHDR('/small_empty_room_3_1k.jpg', renderer)
	])



	scene.environment = envTexture
	scene.background = envTexture
	scene.background.mapping = EquirectangularReflectionMapping

	const beltGroup = model.getObjectByName('belt')
	const bodyGroup = model.getObjectByName('body')
	hideAllExceptFirst(beltGroup.children)
	hideAllExceptFirst(bodyGroup.children)

	let beltMaterial = new MeshPhysicalMaterial({
		color: 0xeeeeee,
		metalness: 0.5,
		roughness: 0.5
	})
	beltGroup.children.forEach((mesh) => {
		mesh.material = beltMaterial
	})

	const beltVariants = {}
	beltGroup.children.forEach((belt) => {
		beltVariants[belt.name] = belt
	})

	const beltOptions = {}
	beltGroup.children.forEach((child) => {
		beltOptions[child.name.replace('belt-', '')] = child.name
	})

	let bodyMaterial = new MeshPhysicalMaterial().copy(beltMaterial)
	bodyGroup.children.forEach((mesh) => {
		mesh.material = bodyMaterial
	})

	const bodyVariants = {}
	bodyGroup.children.forEach((body) => {
		bodyVariants[body.name] = body
	})

	const bodyOptions = {}
	bodyGroup.children.forEach((child) => {
		bodyOptions[child.name.replace('body-', '')] = child.name
	})

	const params = {
		belt: { type: Object.keys(beltVariants)[0], color: '#' + beltMaterial.color.getHexString() },
		body: { type: Object.keys(bodyVariants)[0], color: '#' + bodyMaterial.color.getHexString() }
	}

	scene.add(model)

	const pane = new Pane()
	const beltsFolder = pane.addFolder({ title: 'Belts' })
	const bodiesFolder = pane.addFolder({ title: 'Bodies' })

	beltsFolder.addBinding(params.belt, 'type', {
		options: beltOptions
	}).on('change', ({ value }) => {
		beltGroup.children.forEach((belt) => {
			belt.visible = belt.name === value
		})
	})

	beltsFolder.addBinding(params.belt, 'color').on('change', ({ value }) => {
		beltMaterial.color.setStyle(value)
	})

	bodiesFolder.addBinding(params.body, 'type', {
		options: bodyOptions
	}).on('change', ({ value }) => {
		bodyGroup.children.forEach((body) => {
			body.visible = body.name === value
		})
	})

	bodiesFolder.addBinding(params.body, 'color').on('change', ({ value }) => {
		bodyMaterial.color.setStyle(value)
	})

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

function hideAllExceptFirst(arr) {
	arr.forEach((item, i) => {
		item.visible = i === 0
	})
}
