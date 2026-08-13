<script setup lang="ts">
type HeadingType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

const { type } = defineProps<{
  type: HeadingType;
}>();
</script>

<template>
  <component
    :is="type"
    :class="`text-${type} text-md-${type[0] + (Number(type[1]) - 1 || 1)}`"
  >
    <slot></slot>
  </component>
</template>

<style scoped lang="scss"></style>
