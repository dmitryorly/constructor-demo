import {
	Scene,
	WebGLRenderer,
	PerspectiveCamera,
	ACESFilmicToneMapping,
	PMREMGenerator,
	Clock,
	Group,
	WebGLRenderTarget,
	PlaneGeometry,
	MeshBasicMaterial,
	Mesh,
	OrthographicCamera,
	CameraHelper,
	MeshDepthMaterial,
	ShaderMaterial
} from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { HorizontalBlurShader } from 'three/addons/shaders/HorizontalBlurShader.js'
import { VerticalBlurShader } from 'three/addons/shaders/VerticalBlurShader.js'
import { Pane } from 'tweakpane'
import { HDRJPGLoader } from '@monogrid/gainmap-js'

import { mainLoop } from '../shared/modules/mainLoop.js'

import envMapUrl from '/small_empty_room_3_1k.jpg'
import modelUrl from '/bag-01-no-color.glb?url'

const PLANE_WIDTH = 2.5
const PLANE_HEIGHT = 2.5
const CAMERA_HEIGHT = 0.3

const params = {
	color: '#000000',
	backgroundColor: {},
	shadow: {
		blur: 1.5,
		darkness: 1,
		opacity: 0.5
	},
	plane: {
		color: '#ffffff',
		opacity: 1,
		y: -1.1
	}
}

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
	renderer.setClearAlpha(0)

	const clock = new Clock()
	const scene = new Scene()
	const camera = new PerspectiveCamera(45, width / height, 0.1, 50)
	camera.position.set(0, 0, 5)

	const controls = new OrbitControls(camera, canvas)
	controls.enableDamping = true

	window.addEventListener('resize', resize)

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

	// the container, if you need to move the plane just move this
	const shadowGroup = new Group()
	shadowGroup.position.y = params.plane.y
	scene.add(shadowGroup)

	// the render target that will show the shadows in the plane texture
	const renderTarget = new WebGLRenderTarget(512, 512)
	renderTarget.texture.generateMipmaps = false

	// the render target that we will use to blur the first render target
	const renderTargetBlur = new WebGLRenderTarget(512, 512)
	renderTargetBlur.texture.generateMipmaps = false

	// make a plane and make it face up
	const planeGeometry = new PlaneGeometry(PLANE_WIDTH, PLANE_HEIGHT).rotateX(Math.PI / 2)
	const planeMaterial = new MeshBasicMaterial({
		map: renderTarget.texture,
		opacity: params.shadow.opacity,
		transparent: true,
		depthWrite: false
	})
	const plane = new Mesh(planeGeometry, planeMaterial)
	// make sure it's rendered after the fillPlane
	plane.renderOrder = 1
	shadowGroup.add(plane)

	// the y from the texture is flipped!
	plane.scale.y = -1

	// the plane onto which to blur the texture
	const blurPlane = new Mesh(planeGeometry)
	blurPlane.visible = false
	shadowGroup.add(blurPlane)

	// the plane with the color of the ground
	const fillPlaneMaterial = new MeshBasicMaterial({
		color: params.plane.color,
		opacity: params.plane.opacity,
		transparent: true,
		depthWrite: false
	})
	const fillPlane = new Mesh(planeGeometry, fillPlaneMaterial)
	fillPlane.rotateX(Math.PI)
	shadowGroup.add(fillPlane)

	// the camera to render the depth material from
	const shadowCamera = new OrthographicCamera(
		-PLANE_WIDTH / 2,
		PLANE_WIDTH / 2,
		PLANE_HEIGHT / 2,
		-PLANE_HEIGHT / 2,
		0,
		CAMERA_HEIGHT
	)
	shadowCamera.rotation.x = Math.PI / 2 // get the camera to look up
	shadowGroup.add(shadowCamera)

	const cameraHelper = new CameraHelper(shadowCamera)

	// like MeshDepthMaterial, but goes from black to transparent
	const depthMaterial = new MeshDepthMaterial()
	depthMaterial.userData.darkness = { value: params.shadow.darkness }
	depthMaterial.onBeforeCompile = function (shader) {
		shader.uniforms.darkness = depthMaterial.userData.darkness
		shader.fragmentShader = /* glsl */ `
						uniform float darkness;
						${shader.fragmentShader.replace(
							'gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );',
							'gl_FragColor = vec4( vec3( 0.0 ), ( 1.0 - fragCoordZ ) * darkness );'
						)}
					`
	}

	depthMaterial.depthTest = false
	depthMaterial.depthWrite = false

	const horizontalBlurMaterial = new ShaderMaterial(HorizontalBlurShader)
	horizontalBlurMaterial.depthTest = false

	const verticalBlurMaterial = new ShaderMaterial(VerticalBlurShader)
	verticalBlurMaterial.depthTest = false

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
	backgroundFolder
		.addBinding(params.backgroundColor.stop1, 'position', {
			step: 1,
			min: -50,
			max: 150
		})
		.on('change', updateBackground)
	backgroundFolder.addBinding(params.backgroundColor.stop1, 'color').on('change', updateBackground)
	backgroundFolder
		.addBinding(params.backgroundColor.stop2, 'position', {
			step: 1,
			min: -50,
			max: 150
		})
		.on('change', updateBackground)
	backgroundFolder.addBinding(params.backgroundColor.stop2, 'color').on('change', updateBackground)
	backgroundFolder
		.addBinding(params.backgroundColor.stop3, 'position', {
			step: 1,
			min: -50,
			max: 150
		})
		.on('change', updateBackground)
	backgroundFolder.addBinding(params.backgroundColor.stop3, 'color').on('change', updateBackground)

	const shadowFolder = pane.addFolder({ title: 'Shadow' })
	shadowFolder.addBinding(params.shadow, 'blur', { min: 0, max: 15, step: 0.1 })
	shadowFolder.addBinding(params.shadow, 'darkness', { min: 1, max: 5, step: 0.1 }).on('change', () => {
		depthMaterial.userData.darkness.value = params.shadow.darkness
	})
	shadowFolder.addBinding(params.shadow, 'opacity', { min: 0, max: 1, step: 0.1 }).on('change', () => {
		plane.material.opacity = params.shadow.opacity
	})

	const planeFolder = pane.addFolder({ title: 'Plane' })
	planeFolder.addBinding(params.plane, 'color').on('change', ({ value }) => {
		fillPlane.material.color.set(value)
	})
	planeFolder.addBinding(params.plane, 'opacity', { min: 0, max: 1, step: 0.1 }).on('change', ({ value }) => {
		fillPlane.material.opacity = value
	})
	planeFolder.addBinding(params.plane, 'y', { min: -1.4, max: -1, step: 0.01 }).on('change', ({ value }) => {
		shadowGroup.position.y = value
	})

	// renderTarget --> blurPlane (horizontalBlur) --> renderTargetBlur --> blurPlane (verticalBlur) --> renderTarget
	function blurShadow(amount) {
		blurPlane.visible = true

		// blur horizontally and draw in the renderTargetBlur
		blurPlane.material = horizontalBlurMaterial
		blurPlane.material.uniforms.tDiffuse.value = renderTarget.texture
		horizontalBlurMaterial.uniforms.h.value = (amount * 1) / 256

		renderer.setRenderTarget(renderTargetBlur)
		renderer.render(blurPlane, shadowCamera)

		// blur vertically and draw in the main renderTarget
		blurPlane.material = verticalBlurMaterial
		blurPlane.material.uniforms.tDiffuse.value = renderTargetBlur.texture
		verticalBlurMaterial.uniforms.v.value = (amount * 1) / 256

		renderer.setRenderTarget(renderTarget)
		renderer.render(blurPlane, shadowCamera)

		blurPlane.visible = false
	}

	mainLoop.add(update)
	window.scene = scene

	function update() {
		controls.update(clock.getDelta())

		const initialBackground = scene.background
		scene.background = null

		// force the depthMaterial to everything
		cameraHelper.visible = false
		scene.overrideMaterial = depthMaterial

		// set renderer clear alpha
		const initialClearAlpha = renderer.getClearAlpha()
		renderer.setClearAlpha(0)

		// render to the render target to get the depths
		renderer.setRenderTarget(renderTarget)
		renderer.render(scene, shadowCamera)

		// and reset the override material
		scene.overrideMaterial = null
		cameraHelper.visible = true

		blurShadow(params.shadow.blur)

		// a second pass to reduce the artifacts
		// (0.4 is the minimum blur amount so that the artifacts are gone)
		blurShadow(params.shadow.blur * 0.4)

		// reset and render the normal scene
		renderer.setRenderTarget(null)
		renderer.setClearAlpha(initialClearAlpha)
		scene.background = initialBackground
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
