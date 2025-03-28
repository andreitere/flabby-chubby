<template>
	<!-- Canvas dimensions are set via width/height attributes for accurate rendering -->
	<div class="w-full h-dvh max-h-dvh" ref="canvasElWrapper">
		<canvas ref="canvasEl" class="w-full h-full" @click="handleClick" @touchstart.prevent="handleClick"></canvas>
		<canvas ref="canvasEl2" id="canvasEl2" class="hidden" @click="handleClick"
			@touchstart.prevent="handleClick"></canvas>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, shallowRef, useTemplateRef, nextTick, computed } from 'vue';
import { useEventListener, useRafFn, useElementSize, watchDeep, watchOnce, useDebounceFn, useFps, onKeyStroke, useMouse } from '@vueuse/core'; // Using @vueuse/core
import birdieImage from '/birdie-tere.png';
import { useGameLogic } from '@/composables/useGameLogic';


const canvasEl = useTemplateRef('canvasEl')
const canvasElWrapper = useTemplateRef('canvasElWrapper')
const canvasSize = useElementSize(canvasElWrapper)
const gameLogic = useGameLogic();
const fps = useFps()
const canvasElSize = useElementSize(canvasElWrapper)
const fpsMultiplier = computed(() => {
	return fps.value / 60;
})

watchDeep([canvasElSize.height, canvasElSize.width], () => {
	console.log('canvasElSize', canvasElSize.height.value, canvasElSize.width.value)
	if (canvasElWrapper.value) {
		gameLogic.resizeCanvas();
	}
})

// Handle one-time initialization
watchOnce(canvasEl, (newCanvas) => {
	if (newCanvas) {
		gameLogic.init(newCanvas, canvasElSize.width.value, canvasElSize.height.value, fpsMultiplier.value)

	}
})

const handleClick = () => {

	gameLogic.onUserClick()
}


</script>

<style scoped>
canvas {
	display: block;
}
</style>
