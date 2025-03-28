<template>
  <div class="debug-overlay">
    <div class="debug-item">
      <span class="label">Ratio:</span>
      <span class="value">{{ game?.widthRatio.toFixed(4) }}</span>
    </div>
    <div class="debug-item">
      <span class="label">Bird Radius:</span>
      <span class="value">{{ game?.bird.radius.toFixed(2) }}</span>
    </div>
    <div class="debug-item">
      <span class="label">Lift:</span>
      <span class="value">{{ game?.lift.toFixed(2) }}</span>
    </div>
    <div class="debug-item">
      <span class="label">Gravity:</span>
      <span class="value">{{ game?.gravity.toFixed(4) }}</span>
    </div>
    <div class="debug-item">
      <span class="label">Speed:</span>
      <span class="value">{{ game?.speed.toFixed(2) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Game } from '@/game/game'

defineProps<{
  game: Game | null
}>()
</script>

<style scoped>
.debug-overlay {
  position: fixed;
  top: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 10px;
  border-radius: 5px;
  font-family: monospace;
  font-size: 12px;
  z-index: 1000;
}

.debug-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.debug-item:last-child {
  margin-bottom: 0;
}

.label {
  margin-right: 10px;
  color: #aaa;
}

.value {
  color: #fff;
}
</style>
