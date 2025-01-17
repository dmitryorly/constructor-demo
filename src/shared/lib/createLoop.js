export const createLoop = () => {
	let frameId
	let queue = []

	return { start, stop, add, remove }

	function tick() {
		frameId = requestAnimationFrame(tick)

		for (let i = 0; i < queue.length; i++) {
			queue[i]()
		}
	}

	function start() {
		if (frameId) return
		frameId = requestAnimationFrame(tick)
	}

	function stop() {
		cancelAnimationFrame(frameId)
		frameId = null
	}

	function add(func) {
		queue.push(func)
		return func
	}

	function remove(func) {
		queue = queue.filter((f) => f !== func)
	}
}
