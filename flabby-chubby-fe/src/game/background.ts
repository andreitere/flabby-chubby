import { Game } from "./game"

export class Background {
	game: Game
	constructor(game: Game) {
		this.game = game
	}

	update() {
		// this.game.context.fillStyle = "#87CEEB"
		// this.game.context.fillRect(0, 0, this.game.width, this.game.height)
	}

	render() {
		this.game.context.fillStyle = "#87CEEB"
		this.game.context.fillRect(0, 0, this.game.width, this.game.height)
	}
}
