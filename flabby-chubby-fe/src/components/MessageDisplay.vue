<template>
	<div v-if="message" class="message-display">
		{{ message }}
	</div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
	gameState: {
		type: String,
		required: true
	},
	score: {
		type: Number,
		required: true
	}
});

const message = computed(() => {
	switch (props.gameState) {
		case 'ready':
			return 'Click, Tap, or Press Space to Start';
		case 'gameOver':
			return `Game Over! Score: ${props.score}. Click to Restart`;
		case 'playing':
		default:
			return ''; // No message during play
	}
});
</script>

<style scoped>
.message-display {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	padding: 15px 25px;
	background-color: rgba(0, 0, 0, 0.65);
	color: white;
	font-size: clamp(16px, 4vw, 24px);
	/* Responsive font size */
	font-weight: bold;
	text-align: center;
	border-radius: 8px;
	text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
	z-index: 10;
	white-space: nowrap;
	/* Prevent line breaks on smaller messages */
	user-select: none;
}
</style>