import { apiClient, type User, type Score } from "@/apiClient"
import { Game } from "@/game/game"
import { getDeviceType } from "@/lib/gameUtils"
import { useRafFn, createSharedComposable, useLocalStorage } from "@vueuse/core"
import { computed, reactive, ref, watch } from "vue"

export const useGameLogic = createSharedComposable(() => {
	const showSettings = ref(false)
	const showLeagueDetails = ref(false)
	const showScoreHistory = ref(false)
	const createLeagueMeta = reactive({
		title: "",
		leagueInviteLink: "",
	})
	const user_scores = ref<{ latestScores: Score[], topScores: Score[] }>({ latestScores: [], topScores: [] })
	const leagues = ref<{ league_id: string; title: string; owner_id: string }[]>([])
	let user = useLocalStorage<User | null>("user", null, {
		shallow: true,
		serializer: {
			read: (v) => (v ? JSON.parse(v) : null),
			write: (v) => (v ? JSON.stringify(v) : ""),
		},
	})

	let sound = useLocalStorage("sound", true, {
		shallow: true,
	})
	const game = ref<Game | null>(null)
	const gameState = computed(() => game.value?.state)
	const currentScore = ref(0)

	const onGameOver = async () => {
		game.value!.state = "gameOver"
		showScoreHistory.value = true
		if (currentScore.value !== 0) {
			await apiClient.submitScore(user.value!.user_id, currentScore.value)
			await loadUserScores()
		}
		pause()
	}

	const onScoreChange = (score: number) => {
		currentScore.value = score
	}

	const init = (canvas: HTMLCanvasElement) => {
		game.value = new Game(canvas, onGameOver, onScoreChange)
		game.value.audioManager.muted = !sound.value
	}

	const resizeCanvas = () => {
		if (gameState.value === "playing") {
			return
		}
		game.value = new Game(game.value!.canvas, onGameOver, onScoreChange)
	}

	const loopGame = () => {
		if (!game.value) return
		game.value.loop()
	}

	const { pause, resume } = useRafFn(loopGame, { immediate: true })

	const reset = () => {
		if (!game.value) return
		game.value.state = "ready"
		currentScore.value = 0
		game.value.reset()
		resume()
	}

	const onUserClick = () => {
		if (gameState.value === "playing") {
			game.value?.bird.flap()
		}
		if (gameState.value === "gameOver") {
		}
		if (gameState.value === "ready") {
			game.value!.state = "playing"
			game.value?.bird.flap(true)
		}
	}

	const createUser = async (tokenOrUrlToken: string | null = null) => {
		console.log("createUser", tokenOrUrlToken)
		let loginToken = tokenOrUrlToken?.startsWith("http") ? new URL(tokenOrUrlToken).pathname.split("/login/").at(1) : tokenOrUrlToken
		console.log("loginToken", loginToken)
		if (!loginToken) {
			const url = new URL(window.location.href)
			loginToken = url.pathname.split("/login/").at(1)
		}
		console.log("loginToken", loginToken)
		if (loginToken) {
			try {
				const existingUser = await apiClient.getUserByLoginToken(loginToken)
				user.value = existingUser
				window.history.replaceState({}, "", "/")
			} catch (error) {
				console.error("Failed to login with token:", error)
			}
		}

		if (!user.value) {
			const _usr = await apiClient.createUser(getDeviceType())
			user.value = _usr
		}
	}

	const getUserLoginToken = async () => {
		if (!user.value) return null
		try {
			const { login_token } = await apiClient.getUserLoginToken(user.value.user_id)
			return login_token
		} catch (error) {
			console.error("Failed to get login token:", error)
			return null
		}
	}

	const healthCheck = async () => {
		if (!user.value) return
		try {
			const { exists } = await apiClient.checkUserExists(user.value.user_id)
			if (!exists) {
				user.value = null
			}
		} catch (error) {
			console.error("Health check failed:", error)
			user.value = null
		}
	}

	const loadLeagues = async () => {
		const res = await apiClient.getLeagues(user.value!.user_id)
		leagues.value = res
	}
	const createLeague = async () => {
		const res = await apiClient.createLeague(user.value!.user_id, createLeagueMeta.title)
		createLeagueMeta.leagueInviteLink = `${window.location.protocol}//${window.location.host}/league/${res.league_id}`
		loadLeagues()
	}
	const checkJoinLeague = async () => {
		let url = new URL(window.location.href)
		if (url.pathname.includes("/league/")) {
			const leagueId = url.pathname.split("/")[2]
			const res = await apiClient.joinLeague(user.value!.user_id, leagueId)
			if (res.success) {
				loadLeagues()
			}
			window.history.replaceState({}, "", "/")
		}
	}
	const loadUserScores = async () => {
		const res = await apiClient.getUserScores(user.value!.user_id)
		user_scores.value = res
	}

	const updateUserName = async (newName: string) => {
		if (!user.value) return
		try {
			const updatedUser = await apiClient.updateUserName(user.value.user_id, newName)
			user.value = updatedUser
		} catch (error) {
			console.error("Failed to update name:", error)
		}
	}

	watch(sound, (newVal) => {
		if (!game.value) return
		game.value.audioManager.muted = !newVal
	})
	watch(showSettings, async (newVal) => {
		if (newVal) {
			loadUserScores()
			loadLeagues()
		}
	})

	return {
		init,
		pause,
		resume,
		resizeCanvas,
		loopGame,
		onUserClick,
		currentScore,
		gameState,
		reset,
		user,
		createUser,
		healthCheck,
		sound,
		leagues,
		loadLeagues,
		createLeague,
		createLeagueMeta,
		checkJoinLeague,
		loadUserScores,
		user_scores,
		updateUserName,
		showLeagueDetails,
		showScoreHistory,
		showSettings,
		getUserLoginToken,
	}
})
