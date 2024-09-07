import { createLoop } from '../lib/createLoop.js'

export const mainLoop = createLoop()

if (!document.hidden) {
	mainLoop.start()
}

document.addEventListener('visibilitychange', (e) => {
	if (document.hidden) {
		mainLoop.stop()
	} else {
		mainLoop.start()
	}
})

if (location.hostname.indexOf('localhost') >= 0) {
	window.__loop?.stop()
	window.__loop = mainLoop
}
