<script setup lang="ts">
import type { Sizes } from '@/ui-kit/commonTypes';

const { icon = 'mdi-rhombus-outline' } = defineProps<{
  icon?: string;
  size?: Sizes | number | string;
  color?: string;
}>();
</script>

<template>
  <v-icon :icon="icon" :size="size" :color="color"></v-icon>
</template>

<style scoped lang="scss"></style>
