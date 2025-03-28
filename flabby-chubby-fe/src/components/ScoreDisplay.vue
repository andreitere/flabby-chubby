<template>
	<div class="score-display">Score: {{ score }}</div>
</template>

<script setup>
defineProps({
	score: {
		type: Number,
		required: true,
		default: 0
	}
});
</script>

<style scoped>
.score-display {
	position: absolute;
	top: 15px;
	left: 15px;
	font-size: clamp(18px, 4vw, 28px);
	/* Responsive font size */
	font-weight: bold;
	color: white;
	text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
	z-index: 10;
	user-select: none;
	/* Prevent text selection */
}
</style>
