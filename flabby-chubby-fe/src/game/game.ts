import { AudioManager } from "./audioManager"
import { Background } from "./background"
import { Bird } from "./bird"
import { Cloud } from "./cloud"
import { Ground } from "./ground"
import { PipePair, PipesHandler } from "./pipesHandler"
export class Game {
	canvas: HTMLCanvasElement
	context: CanvasRenderingContext2D
	baseWidth: number = 390
	baseHeight: number = 844
	widthRatio: number = 1
	heightRatio: number = 1
	background: Background
	bird: Bird
	ground: Ground
	clouds: Cloud[] = []
	width: number = this.baseWidth
	height: number = this.baseHeight
	baseGravity: number = 2500
	baseLift: number = -700
	gravity: number
	lift: number
	baseSpeed: number = 300
	speed: number = 250
	timeDelta: number = 0.0016
	lastFrameTime: number = 0
	timeFactor: number = 1
	state: "ready" | "playing" | "gameOver" = "ready"
	score: number = 0
	pipesHandler: PipesHandler
	pipeWidth: number = 100
	pipeSpeed: number = 0.01
	audioManager: AudioManager

	onGameOver: (score: number) => void
	onScoreChange: (score: number) => void
	constructor(canvas: HTMLCanvasElement, onGameOver: (score: number) => void, onScoreChange: (score: number) => void) {
		this.canvas = canvas
		this.onScoreChange = onScoreChange
		this.canvas.width = this.canvas.clientWidth * window.devicePixelRatio
		this.canvas.height = this.canvas.clientHeight * window.devicePixelRatio
		this.context = canvas.getContext("2d") as CanvasRenderingContext2D
		this.width = this.canvas.clientWidth * window.devicePixelRatio
		this.height = this.canvas.clientHeight * window.devicePixelRatio
		this.widthRatio = Math.floor(this.width / this.baseWidth)
		this.heightRatio = Math.floor(this.height / this.baseHeight)
		const scaleFactor = Math.min(this.widthRatio, this.heightRatio)
		this.gravity = this.baseGravity * scaleFactor
		this.lift = this.baseLift * scaleFactor
		this.speed = this.baseSpeed * scaleFactor

		this.lastFrameTime = performance.now()
		this.background = new Background(this)
		this.ground = new Ground(this)
		this.clouds = [
			new Cloud(this, 20, 55, "/cloud-2.png", 1.2, -90, 2),
			new Cloud(this, 2, 25, "/cloud-1.png", 1.4, -60, 3),
			new Cloud(this, 15, 40, "/cloud-3.png", 0.8, -70, 3),
			new Cloud(this, 20, 8, "/cloud-4.png", 0.6, -90, 4),
		]
		this.bird = new Bird(this)
		this.timeFactor = 1
		this.pipeWidth = 100 * scaleFactor
		this.pipesHandler = new PipesHandler(this)
		this.onGameOver = onGameOver
		this.audioManager = new AudioManager()
	}

	_onGameOver() {
		this.audioManager.playBirdCrash()
		this.state = "gameOver"

		this.onGameOver?.call(this, this.score)
	}

	update() {
		this.background.update()

		this.pipesHandler.update()
		this.bird.update()
		this.clouds.forEach((cloud) => {
			cloud.update()
		})
		this.ground.update()
		this.checkScoring()
		this.checkCollisions()
	}

	doesCollideWithTopPipe(pipe: PipePair) {
		if (this.bird.x + this.bird.radius * 2 < pipe.xPosition - this.bird.radius * 0.4 || this.bird.x > pipe.xPosition + this.pipeWidth + this.bird.radius * 0.4) {
			return false
		}

		// INSERT_YOUR_CODE
		const collides = this.bird.x > pipe.top.x - this.bird.radius * 2 + this.bird.radius * 0.3 && this.bird.y < pipe.top.y1 - this.bird.radius * 0.3
		if (collides) {
			return true
		}
		return false
	}

	doesCollideWithBottomPipe(pipe: PipePair) {
		if (this.bird.x + this.bird.radius * 2 < pipe.xPosition - this.bird.radius * 0.4 || this.bird.x > pipe.xPosition + this.pipeWidth + this.bird.radius * 0.4) {
			return false
		}

		// INSERT_YOUR_CODE
		const collides = this.bird.x > pipe.bottom.x - this.bird.radius * 2 + this.bird.radius * 0.3 && this.bird.y + this.bird.radius * 2 > pipe.bottom.y + this.bird.radius * 0.3
		if (collides) {
			return true
		}
		return false
	}

	checkCollisions() {
		if (this.state !== "playing") return

		// Check ground collision
		if (this.bird.y + this.bird.radius * 0.3 > this.height) {
			this._onGameOver()
			return
		}

		// Check ceiling collision
		if (this.bird.y - this.bird.radius * 0.3 < 0) {
			this._onGameOver()
			return
		}

		let pipe = this.pipesHandler.pipes.at(0)
		// Check pipe collisions
		if (pipe) {
			// Check collision with top pipe
			if (this.doesCollideWithTopPipe(pipe)) {
				this._onGameOver()
				return
			}

			// Check collision with bottom pipe
			if (this.doesCollideWithBottomPipe(pipe)) {
				this._onGameOver()
				return
			}
		}
	}

	checkScoring() {
		if (this.state !== "playing") return
		const pipe = this.pipesHandler.pipes.at(0)
		if (!pipe) return

		if (pipe.xPosition + this.pipeWidth < this.bird.x && !pipe.scored) {
			pipe.scored = true
			this.score++

			this.onScoreChange?.call(this, this.score)
		}
	}

	resize(width: number, height: number) {
		console.log("resize", width, height)
		this.width = width
		this.height = height
		this.widthRatio = Math.floor(this.width / this.baseWidth)
		this.heightRatio = Math.floor(this.height / this.baseHeight)
		this.context.scale(this.widthRatio, this.heightRatio)
		this.canvas.width = this.width
		this.canvas.height = this.height
	}

	render() {
		this.background.render()
		this.clouds.forEach((cloud) => {
			cloud.render()
		})
		this.pipesHandler.render()
		this.ground.render()
		this.bird.render()

		if (this.state === "ready") {
			this.context.fillStyle = "rgba(0, 0, 0, 0.5)"
			this.context.fillRect(0, 0, this.width, this.height)

			this.context.fillStyle = "white"
			this.context.font = `${48 * this.widthRatio}px Arial`
			this.context.textAlign = "center"
			this.context.textBaseline = "middle"
			this.context.fillText("Tap to Start", this.width / 2, this.height / 2)
		}
	}

	loop() {
		const currentTime = performance.now()
		this.timeDelta = Math.min((currentTime - this.lastFrameTime) / 1000, 0.33)
		this.lastFrameTime = currentTime
		this.update()
		this.render()
	}

	reset() {
		this.state = "ready"
		this.score = 0
		this.onScoreChange?.(0)
		this.bird.reset()
		this.pipesHandler.reset()
		// this.clouds.forEach(cloud => cloud.reset())
		// this.ground.reset()
		// this.background.reset()
	}
}
