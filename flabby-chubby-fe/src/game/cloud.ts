import type { Game } from "./game"

export class Cloud {
	game: Game
	yOffset: number = 0
	xOffset: number = 0
	xSpeed: number = -100
	ySpeed: number = 0.001
	image: HTMLImageElement
	scale: number = 1
	xPosition: number = 0
	yPosition: number = 0
	maxYCycle: number = 0
	constructor(game: Game, yOffsetPercent: number, xOffsetPercent: number, asset: string, scale: number = 1, xSpeed: number = -100, ySpeed: number = 0.001) {
		this.game = game
		this.yOffset = (yOffsetPercent / 100) * game.height
		this.xOffset = (xOffsetPercent / 100) * game.width
		this.xSpeed = xSpeed
		this.ySpeed = ySpeed
		this.xPosition = this.xOffset
		this.yPosition = this.yOffset
		this.scale = scale
		this.image = new Image()
		this.image.src = asset
		this.image.onload = () => {
			this.maxYCycle = this.image.height * 0.005

			this.game.context.drawImage(this.image, this.xOffset, this.yOffset, this.image.width * scale, this.image.height * scale)
		}
	}

	updateX() {
		this.xPosition += this.xSpeed * this.game.timeDelta
		this.yPosition += this.ySpeed * this.game.timeDelta

		if (this.xPosition + this.image.width * this.scale < -250) {
			this.xPosition = this.game.width + 250
		}
	}

	updatey() {
		this.yPosition += this.ySpeed * this.game.timeDelta

		const centerY = this.game.height * 0.2
		if (this.yPosition > centerY + this.maxYCycle) {
			this.ySpeed = -Math.abs(this.ySpeed)
		} else if (this.yPosition < centerY - this.maxYCycle) {
			this.ySpeed = Math.abs(this.ySpeed)
		}
	}

	update() {
		this.updateX()
		this.updatey()
	}

	render() {
		this.game.context.drawImage(this.image, this.xPosition, this.yPosition, this.image.width * this.scale, this.image.height * this.scale)
	}
}
