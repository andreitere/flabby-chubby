<template>
	<div class="flex items-center gap-2">
		<Input type="text" :placeholder="placeholder" readonly :model-value="modelValue"
			class="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400" />
		<Button class="bg-white hover:bg-gray-200 text-black" @click="onCopy">Copy</Button>
	</div>
</template>

<script setup lang="ts">
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'vue-sonner';

const props = defineProps<{
	modelValue: string;
	placeholder?: string;
	text?: string
	title?: string
}>();

const onCopy = () => {
	navigator.clipboard.writeText(props.modelValue);
	toast(props.title || 'Link has been copied to clipboard', {
		description: props.text || 'Share with your friends',
	});
};
</script>
