import { Game } from "./game"

export class Bird {
	game: Game
	x: number
	y: number = 0
	spriteWidth: number = 25
	spriteHeight: number = 40
	radius: number
	speedY: number = 20
	velocity: number = 0 //positive goes down, negative goes up
	state: "alive" | "dead" | "ready" = "alive"
	image: HTMLImageElement

	constructor(game: Game) {
		this.game = game
		this.x = this.game.width * 0.15 // Adjusted from 0.06 for better positioning
		this.resize()
		this.velocity = this.game.lift * 4
		// Use both width and height ratios for better scaling
		const scaleFactor = Math.min(this.game.widthRatio, this.game.heightRatio)
		this.radius = this.spriteWidth * scaleFactor
		this.y = this.game.height * 0.5 - this.radius * 2

		// this.y = this.game.height / 2 - this.radius / 2

		// Load the bird image
		this.image = new Image()
		this.image.src = "/birdie-3.png"
	}

	flap(initialFlap: boolean = false) {
		this.game.audioManager.playBirdFlap()
		this.velocity = this.game.lift
		if (initialFlap) {
			this.velocity = this.game.lift
		}
	}

	resize() {
		// this.radius = this.spriteWidth
		// this.y = this.game.height / 2 - this.radius
	}

	update() {
		// if (this.state === "dead") {
		// 	return
		// }
		if (this.game.state !== "playing") {
			return
		}
		this.velocity += this.game.gravity * this.game.timeDelta
		this.y = this.y + this.velocity * this.game.timeDelta
	}

	reset() {
		this.y = this.game.height * 0.5 - this.radius * 2
		this.velocity = this.game.lift * 4
	}

	render() {
		this.game.context.save()
		if (this.image.complete) {
			// Draw the image instead of a rectangle
			this.game.context.drawImage(
				this.image,
				this.x - this.radius * 0.1, // Adjust for scaling
				this.y - this.radius * 0.1, // Adjust for scaling
				this.radius * 2.6, // Adjusted width for scaling
				this.radius * 2.6 // Adjusted height for scaling
			)
		} else {
			// Fallback to rectangle if image hasn't loaded
			this.game.context.fillStyle = this.state === "alive" ? "blue" : "red"
			this.game.context.fillRect(this.x, this.y, this.radius * 2, this.radius * 2)
		}
		// this.game.context.fillStyle = "red"
		// this.game.context.fillRect(this.x, this.y, this.radius*2, this.radius*2)
		this.game.context.restore()
	}
	die() {
		// this.state = "dead"
		// this.game.onGameOver()
	}
}
