<template>
	<div class="game-container flex flex-col w-full flex-grow items-center justify-center" ref="containerEl">
		<div
			class="fixed bg-gradient-to-br from-gray-800 to-gray-600 text-white left-0 sm:left-auto top-0 right-0 px-2 py-1 md:rounded-bl-lg transform transition-transform flex items-center justify-between gap-2">
			<Button size="sm" variant="ghost" @click="onOpenScoreHistory"
				class="flex items-center gap-2 bg-transparent text-white flex items-center score-display">
				<span class="i-flowbite-star-solid"></span>
				<span class="text-2xl">{{ gameLogic.currentScore }}</span>
			</Button>
			<div class="i-radix-icons:slash"></div>
			<Button size="sm" variant="ghost" @click="sound = !sound" @touch="sound = !sound"
				class="flex items-center gap-2 bg-transparent text-white flex items-center score-display">
				<div class="i-lets-icons:sound-max-duotone h-7 w-7" v-if="sound"></div>
				<div class="i-lets-icons:sound-mute-duotone h-7 w-7" v-else></div>
			</Button>
			<div class="i-radix-icons:slash"></div>
			<Button size="sm" variant="ghost" @click="onOpenLeagueDetails" class="bg-transparent flex items-center">
				<span class="i-game-icons:champions text-white text-2xl"></span>
			</Button>
			<div class="i-radix-icons:slash"></div>
			<Button size="sm" variant="ghost" @click="gameLogic.showSettings.value = true"
				class="flex items-center gap-2 bg-transparent">
				<div v-if="gameLogic.user"
					class="flex items-center gap-2 text-white2 font-bold rounded-lg self-stretch">
					<span class="text-blue-400">{{ user?.name }}</span>
				</div>
			</Button>
		</div>
		<Dialog v-model:open="gameLogic.showLeagueDetails.value" class="">
			<DialogContent
				class="w-full max-w-full h-full md:max-h-[90vh] flex flex-col md:max-w-[max(60vw,300px)] bg-gradient-to-br from-gray-900 to-gray-800 text-white border-none shadow-2xl rounded-lg">
				<DialogHeader>
					<DialogTitle class="text-2xl md:text-4xl font-bold text-white">League Details</DialogTitle>
				</DialogHeader>
				<div class="flex flex-col justify-start h-full flex-grow gap-4">
					<div class="flex-grow space-y-4">
						<h3 class="text-lg font-medium mb-3 text-white title">Top Scores by League</h3>
						<Select v-model="selectedLeague" :default-value="leagues.at(0)">
							<SelectTrigger class="w-full bg-gray-800 border-gray-700 text-white">Select League
							</SelectTrigger>
							<SelectContent class="bg-gray-800 border-gray-700">
								<SelectItem :value="league" class="text-white hover:bg-gray-700" selected
									v-for="league in leagues">{{ league.title }}
								</SelectItem>

							</SelectContent>
						</Select>
						<div class="space-y-2">
							<div class="flex justify-between items-center py-3 px-2 mb-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/60 transition-colors"
								v-for="(user, index) in selectedLeague?.top_users" :key="user.user_id">
								<div class="flex items-center gap-2">
									<div
										class="w-6 h-6 flex items-center justify-center rounded-full bg-blue-500/70 text-white text-xs font-bold">
										{{ index + 1 }}
									</div>
									<span class="text-gray-300 font-medium">{{ user.name }}</span>
								</div>
								<span class="text-yellow-400 font-bold flex items-center gap-1">
									<span class="i-flowbite-star-solid text-yellow-400 text-sm"></span>
									{{ user.top_score }}
								</span>
							</div>
						</div>
						<div v-if="selectedLeague">
							<h3 class="text-lg font-medium mb-3 text-white title">Share League Invite</h3>
							<CopyableInput :model-value="selectedLeagueInviteLink" placeholder="League Invite URL"
								title="League Invite Link"
								text="Share this link with your friends to invite them to the league." />
						</div>
					</div>
					<div>
						<h3 class="text-lg font-medium mb-3 text-white title">Create League</h3>
						<div class="flex items-center gap-2" v-if="!gameLogic.createLeagueMeta.leagueInviteLink">
							<Input type="text" placeholder="Enter league name"
								v-model="gameLogic.createLeagueMeta.title"
								class="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400" />
							<Button class="bg-white hover:bg-gray-200 text-black"
								@click="gameLogic.createLeague">Create</Button>
						</div>
						<div class="mt-4" v-if="gameLogic.createLeagueMeta.leagueInviteLink">
							<p class="text-gray-300 text-sm mb-2">league has been created, send this link to your
								friends</p>
							<CopyableInput v-model="gameLogic.createLeagueMeta.leagueInviteLink"
								placeholder="League Invite URL" />
						</div>
					</div>
				</div>

				<DialogFooter>
					<Button class="w-full" @click="gameLogic.showLeagueDetails.value = false">Close</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
		<Dialog v-model:open="gameLogic.showSettings.value" class="">
			<DialogContent
				class="w-full max-w-full h-full md:max-h-[90vh] flex flex-col md:max-w-[max(60vw,300px)] bg-gradient-to-br from-gray-900 to-gray-800 text-white border-none shadow-2xl rounded-lg">
				<DialogHeader>
					<DialogTitle class="text-4xl font-bold text-white">Settings</DialogTitle>

				</DialogHeader>
				<div class="flex flex-col justify-start h-full flex-grow gap-4">
					<div>
						<h3 class="text-lg font-medium mb-3 text-white title">Change Name</h3>
						<div class="flex items-center gap-2">
							<Input type="text" placeholder="Enter new name" v-model="newName"
								class="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400" />
							<Button class="bg-white hover:bg-gray-200 text-black"
								@click="handleNameUpdate">Save</Button>
						</div>
					</div>
					<div class="flex flex-col space-y-6">
						<div>
							<h3 class="text-lg font-medium mb-3 text-white title">Login Token</h3>
							<div class="flex flex-col gap-4">
								<p class="text-gray-300 text-sm font-bold">Use this token to login on another device</p>
								<CopyableInput v-if="generatedLoginToken.token"
									v-model="generatedLoginToken.token as string" placeholder="Login Token"
									title="Login token copied!" text="Use this token to login on another device" />
								<CopyableInput v-if="generatedLoginToken.token"
									v-model="generatedLoginToken.url as string" placeholder="Login Token"
									title="Login url copied!" text="Use this url to login on another device" />
								<Button v-else class="bg-white hover:bg-gray-200 text-black"
									@click="loadLoginToken">Load
									Token</Button>
							</div>
						</div>
						<div class="flex flex-col gap-4">
							<p class="text-gray-300 text-sm font-bold">Connect to an existing account</p>
							<Input type="text" placeholder="Enter new name" v-model="loginToken"
								class="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400" />
							<Button class="bg-white hover:bg-gray-200 text-black"
								@click="onConnectToAccount">Save</Button>
						</div>

					</div>
				</div>
				<DialogFooter>
					<DialogClose as-child>
						<Button class="w-full" @click="gameLogic.showSettings.value = false">Close</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
		<Dialog v-model:open="gameLogic.showScoreHistory.value">
			<DialogContent
				class="w-full max-w-full h-full md:max-h-[90vh] flex flex-col md:max-w-[max(60vw,300px)] bg-gradient-to-br from-gray-900 to-gray-800 text-white border-none shadow-2xl rounded-lg">
				<DialogHeader>
					<DialogTitle class="text-3xl font-bold text-yellow-400 drop-shadow-md">
						{{ gameLogic.gameState.value === "gameOver" ? "Game Over!" : "Score History" }}
					</DialogTitle>
					<DialogDescription class="text-lg text-gray-300" v-if="gameLogic.currentScore.value">
						Your Score: <span class="text-yellow-400">{{ gameLogic.currentScore.value }}</span>
					</DialogDescription>
				</DialogHeader>
				<div class="flex flex-col justify-start h-full flex-grow gap-4 ">
					<div class=" flex-shrink flex flex-col">
						<h3 class="text-lg font-medium mb-3 text-white">Your Top Scores</h3>
						<div class="space-y-2">
							<div v-for="score in gameLogic.user_scores.value.topScores"
								:key="score.created_at.toString()"
								class="flex justify-between items-center py-2 px-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/60 transition-colors">
								<span class="text-white font-medium text-md">{{ score.score }}</span>
								<span class="text-gray-500 text-sm">{{ dayjs(score.created_at).fromNow() }}</span>
							</div>
						</div>
					</div>
					<div class=" flex-grow flex flex-col">
						<h3 class="text-lg font-medium mb-3 text-white">Recent Scores</h3>
						<div class="space-y-2 h-0 flex-grow overflow-y-auto scrollable pr-1">
							<div v-for="score in gameLogic.user_scores.value.latestScores"
								:key="score.created_at.toString()"
								class="flex justify-between items-center py-2 border-b border-gray-700">
								<span class="text-white font-medium text-md">{{ score.score }}</span>
								<span class="text-gray-500 text-sm">{{ dayjs(score.created_at).fromNow() }}</span>
							</div>
						</div>
					</div>
				</div>
				<DialogFooter class="pt-4">
					<DialogClose as-child>
						<Button v-if="gameLogic.gameState.value === 'gameOver'"
							class="bg-green-500 w-full hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
							@click="onCloseScoreHistory">Play Again</Button>
						<Button class="w-full" v-else @click="onCloseScoreHistory">Close</Button>
					</DialogClose>

				</DialogFooter>
			</DialogContent>
		</Dialog>
		<GameCanvas class="flex-grow w-full" ref="gameCanvasWrapper" />
	</div>
	<Toaster />
</template>

<script setup lang="ts">
import GameCanvas from '@/components/GameCanvas.vue';
import { useGameLogic } from '@/composables/useGameLogic';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { computed, onMounted, reactive, ref } from 'vue';
import type { League } from './apiClient';
import dayjs from 'dayjs';
import { Toaster } from '@/components/ui/sonner'
import CopyableInput from '@/components/CopyableInput.vue';

const gameLogic = useGameLogic();
const { user, createUser, sound, leagues, loadLeagues, checkJoinLeague, loadUserScores, updateUserName, getUserLoginToken, healthCheck } = gameLogic;
const selectedLeague = ref<League & { top_users: { user_id: string; name: string; top_score: number }[] } | null>(null);
const newName = ref("");
const containerEl = ref<HTMLElement | null>(null);
const generatedLoginToken = reactive<{
	token: string | null,
	url: string | null,
}>({
	token: null,
	url: null,
})

const loginToken = ref<string>("")



const handleNameUpdate = async () => {
	if (!newName.value.trim()) return;
	await updateUserName(newName.value.trim());
	newName.value = "";
};

const loadLoginToken = async () => {
	generatedLoginToken.token = await getUserLoginToken()
	generatedLoginToken.url = `${window.location.protocol}//${window.location.host}/login/${generatedLoginToken.token}`
}

const onCloseScoreHistory = () => {
	console.log('onCloseScoreHistory');
	gameLogic.showScoreHistory.value = false;
	gameLogic.reset();
}

const onOpenLeagueDetails = async () => {
	gameLogic.showLeagueDetails.value = true;
	await gameLogic.loadLeagues()
	//@ts-ignore
	selectedLeague.value = leagues.value.at(0) ?? null
}

const onOpenScoreHistory = () => {
	gameLogic.showScoreHistory.value = true;
	gameLogic.loadUserScores()
}


const onConnectToAccount = async () => {
	if (!loginToken.value.trim()) return;

	await createUser(loginToken.value.trim());
	loginToken.value = "";
}

const selectedLeagueInviteLink = computed(() => {
	return `${window.location.protocol}//${window.location.host}/league/${selectedLeague.value?.league_id}`
})

onMounted(async () => {
	// Function to determine the device type
	await createUser()
	await healthCheck()
	await loadLeagues()
	await checkJoinLeague()
	await loadUserScores()
})
</script>


<style>
@import url('https://fonts.googleapis.com/css2?family=Jersey+25&family=Inter:wght@400;500;600;700&display=swap');

/* Global styles or scoped styles in App.vue */
body,
html,
body,
font-normal {
	@apply w-screen h-screen;
	font-family: 'Inter', sans-serif;
}

#app {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
}

/* Add game-style font for headings */

.game-title,
.score-display,
.title {
	font-family: 'Jersey 25', monospace;
	font-size: 1.2em;
	letter-spacing: 0.5px;
}

.game-container {
	position: relative;
	/* Needed for absolute positioning of score/message */
	/* Use max-width/max-height to constrain the container */



	/* box-shadow: 0 5px 20px rgba(0, 0, 0, 0.4); */
	display: flex;
	/* Use flexbox to center canvas */
	justify-content: center;
	align-items: center;
	background-color: #333;
	/* Background behind canvas if it doesn't fill */
	overflow: hidden;
	/* Ensure canvas doesn't overflow container */
}

/* Ensure canvas itself doesn't add extra margins/paddings */
canvas {
	display: block;
	/* Let the GameCanvas component manage width/height attributes */
	/* Style width/height can cause scaling issues if not careful */
	max-width: 100%;
	max-height: 100%;
}

:root {
	--vh: 1vh;
}

* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

html,
body {
	width: 100%;
	height: 100%;
	overflow: hidden;
	background-color: #4EC0CA;
}

.game-container {
	width: 100%;
	height: 100vh;
	/* Fallback for browsers that do not support custom properties */
	height: calc(var(--vh, 1vh) * 100);
	display: flex;
	justify-content: center;
	align-items: center;
	padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
}

canvas {
	max-width: 100%;
	max-height: 100%;
	object-fit: contain;
}
</style>
