import { Game } from "./game"

export class GroundPiece {
	game: Game
	x: number
	y: number
	width: number
	height: number
	image: HTMLImageElement
	spriteWidth: number = 336
	spriteHeight: number = 112
	spriteAspectRatio: number = 3
	constructor(game: Game, x: number) {
		this.game = game
		this.x = x
		this.height = this.spriteHeight * (this.game.height / this.spriteHeight) * 0.01
		this.width = this.height * this.spriteAspectRatio
		this.y = this.game.height - this.height
		this.image = new Image()
		this.image.src = "/ground.png"
	}

	update() {
		this.x -= this.game.speed * this.game.timeDelta
	}

	render() {
		if (this.image.complete) {
			this.game.context.drawImage(this.image, this.x, this.y, this.width, this.height)
		}
	}

	isOffScreen() {
		return this.x + this.width < 0
	}

	isAlmostVisible() {
		return this.x + this.width < this.game.width + this.width
	}
}

export class Ground {
	game: Game
	pieces: GroundPiece[] = []
	height: number
	constructor(game: Game) {
		this.game = game
		this.initializePieces()
		this.height = this.game.height * 0.03
	}

	initializePieces() {
		// Create initial pieces to cover the screen
		let x = 0
		while (x < this.game.width + this.game.width) {
			this.pieces.push(new GroundPiece(this.game, x))
			x += this.game.width
		}
	}

	shouldCreatePiece() {
		if (this.pieces.length === 0) return true
		const lastPiece = this.pieces[this.pieces.length - 1]
		return lastPiece.isAlmostVisible()
	}

	createPiece() {
		const lastPiece = this.pieces[this.pieces.length - 1]
		const newX = lastPiece.x + lastPiece.width
		this.pieces.push(new GroundPiece(this.game, newX))
	}

	update() {
		if (this.shouldCreatePiece()) {
			this.createPiece()
		}

		this.pieces.forEach((piece) => {
			piece.update()
		})

		// Remove pieces that have moved off screen
		this.pieces = this.pieces.filter((piece) => !piece.isOffScreen())
	}

	render() {
		const gradient = this.game.context.createLinearGradient(0, this.game.height - this.height, 0, this.game.height)

		// Add color stops similar to CSS percentages
		gradient.addColorStop(0.0, "#3fa34d") // Grass green
		gradient.addColorStop(0.15, "#3fa34d") // Still grass
		gradient.addColorStop(0.15, "#b97a57") // Flat ground starts
		gradient.addColorStop(0.3, "#b97a57") // Flat ground ends
		gradient.addColorStop(0.3, "#6f4e37") // Below ground starts
		gradient.addColorStop(1.0, "#4b3621") // Deeper soil

		this.game.context.fillStyle = gradient
		this.game.context.fillRect(0, this.game.height - this.height, this.game.width, this.height)
	}
}
