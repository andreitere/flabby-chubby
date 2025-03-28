import type { Game } from "./game"

export class PipePair {
	game: Game
	xPosition: number
	gapPosition: number
	scored: boolean = false

	constructor(game: Game, xPosition: number, gapPosition: number) {
		this.game = game
		this.xPosition = xPosition
		this.gapPosition = gapPosition
	}

	get top() {
		const x = this.xPosition
		const h = this.game.height * this.gapPosition
		const y = 0
		const y1 = y + h
		const x1 = x + this.game.pipeWidth
		return { x, y, y1, h, x1, w: this.game.pipeWidth }
	}

	get bottom() {
		const x = this.xPosition
		const h = this.game.height - this.top.h - this.game.pipesHandler.yGap
		const y = this.top.y1 + this.game.pipesHandler.yGap
		const y1 = y + h
		const x1 = x + this.game.pipeWidth
		return { x, y, y1, h, x1, w: this.game.pipeWidth }
	}

	pipeGradient() {
		const grad = this.game.context.createLinearGradient(this.xPosition, 0, this.xPosition + this.game.pipeWidth, 0)

		grad.addColorStop(0.0, "rgba(4,4,4,0.8)")
		grad.addColorStop(0.01, "rgba(9,9,121,0.8)")
		grad.addColorStop(0.02, "rgba(32,129,8,1)")
		grad.addColorStop(0.16, "rgba(125,140,28,1)")
		grad.addColorStop(0.31, "rgba(132,153,69,1)")
		grad.addColorStop(0.6, "rgba(177,226,29,1)")
		grad.addColorStop(0.98, "rgba(177,226,29,1)")
		grad.addColorStop(0.99, "rgba(9,9,121,1)")
		grad.addColorStop(1.0, "rgba(0,0,0,1)")
		return grad
	}

	render() {
		//render two pipes with a gap.
		this.game.context.fillStyle = this.pipeGradient()
		this.game.context.fillRect(this.xPosition, this.top.y, this.game.pipeWidth, this.top.h)
		// this.game.context.fillRect(this.xPosition - this.game.bird.radius * 0.4, this.top.y1 - 10, this.game.pipeWidth + this.game.bird.radius * 0.8, 10)
		this.game.context.fillRect(this.xPosition, this.bottom.y, this.game.pipeWidth, this.bottom.h)
		// this.game.context.fillStyle = "white"
		// this.game.context.fillRect(0, this.top.y1, this.game.width, 10)
		// this.game.context.fillStyle = "rgba(255, 0, 0, 0.5)" // red with alpha
		// this.game.context.fillRect(0, this.bottom.y - this.game.bird.radius * 0.3, this.game.width, this.game.bird.radius * 0.3)
		// draw a rectangle to show the collision area
		// this.game.context.fillRect(this.top.x, this.top.y, this.game.pipeWidth, this.top.h)
		// this.game.context.fillRect(this.bottom.x, this.bottom.y, this.game.pipeWidth, this.bottom.h)
	}
	update() {
		this.xPosition -= this.game.speed * this.game.timeDelta
	}
}

export class PipesHandler {
	game: Game
	pipes: Array<PipePair> = []
	yGap: number = 100
	xGap: number = 3
	constructor(game: Game) {
		this.game = game
		// Calculate gap based on screen height and bird size
		this.yGap = this.game.bird.radius * 2 * 5 // Increased from 0.15 to 0.25 (25% of screen height)
		this.xGap = Math.floor(this.game.pipeWidth * 5) // Increased from 3 to 5 pipe widths between pipes
	}

	reset() {
		this.pipes = []
	}

	shouldCreatePipe() {
		if (this.pipes.length === 0) {
			return true
		}
		if (this.pipes.at(-1)!.xPosition <= this.game.width - this.xGap) {
			return true
		}
		return false
	}

	getGapPosition() {
		if (this.pipes.length === 0) {
			return 0.5
		}
		return Math.random() * 0.55 + 0.15
	}

	createPipe() {
		let xPosition = 0
		if (this.pipes.length > 0) {
			xPosition = Math.floor(this.pipes.at(-1)!.xPosition + this.xGap)
		} else if (this.pipes.length === 0) {
			xPosition = this.game.width
		}

		const pipe = new PipePair(this.game, xPosition, this.getGapPosition())
		this.pipes.push(pipe)
	}

	update() {
		if (this.game.state !== "playing") {
			return
		}
		if (this.shouldCreatePipe()) {
			this.createPipe()
		}
		this.pipes.forEach((pipe) => {
			pipe.update()
		})
		// Remove pipes that have moved off screen
		this.pipes = this.pipes.filter((pipe) => pipe.xPosition + this.game.pipeWidth > 0)
	}
	render() {
		if (this.game.state !== "playing" && this.game.state !== "gameOver") {
			return
		}
		this.pipes.forEach((pipe) => {
			pipe.render()
		})
	}
}
