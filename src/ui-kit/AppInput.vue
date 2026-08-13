<script setup lang="ts">
import { ref } from 'vue';

type InputVariants =
  | 'filled'
  | 'underlined'
  | 'outlined'
  | 'plain'
  | 'solo'
  | 'solo-inverted'
  | 'solo-filled';

type InputDensity = 'default' | 'comfortable' | 'compact';

const { label, placeholder, type, variant, density, errorMessages } =
  defineProps<{
    modelValue?: string | number;
    label?: string;
    placeholder?: string;
    type?: string;
    variant?: InputVariants;
    density?: InputDensity;
    errorMessages?: string;
  }>();

const inputRef = ref();
defineExpose({
  inputRef
});
</script>

<template>
  <v-text-field
    ref="inputRef"
    :model-value="modelValue"
    :label="label"
    :placeholder="placeholder"
    :type="type"
    :variant="variant"
    :density="density"
    :error-messages="errorMessages"
    @update:model-value="(value) => $emit('update:model-value', value)"
  ></v-text-field>
</template>

<style scoped lang="scss"></style>
