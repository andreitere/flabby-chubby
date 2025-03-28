export class AudioManager {
	constructor() {
		this.audioContext = new AudioContext()
		this.loadSounds()
	}
	private audioContext: AudioContext
	private birdFlapBuffer: AudioBuffer | null = null
	private birdCrashBuffer: AudioBuffer | null = null

	public muted: boolean = false

	public async loadSounds() {
		try {
			this.birdFlapBuffer = await this.loadSound("/sounds/wing-flap-1.mp3")
			this.birdCrashBuffer = await this.loadSound("/sounds/bird-crash-1.mp3")
		} catch (error) {
			console.error("Error loading sounds:", error)
		}
	}

	private async loadSound(url: string): Promise<AudioBuffer> {
		const response = await fetch(url)
		const arrayBuffer = await response.arrayBuffer()
		return await this.audioContext.decodeAudioData(arrayBuffer)
	}

	private playSound(buffer: AudioBuffer | null) {
		if (buffer) {
			const source = this.audioContext.createBufferSource()
			source.buffer = buffer
			source.connect(this.audioContext.destination)
			source.start(0) // Play immediately
		}
	}



	public playBirdFlap() {
		if (this.muted) return
		this.playSound(this.birdFlapBuffer)
	}

	public playBirdCrash() {
		if (this.muted) return
		this.playSound(this.birdCrashBuffer)
	}
}
