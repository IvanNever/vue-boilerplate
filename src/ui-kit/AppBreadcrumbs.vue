<script setup lang="ts">
const { items, divider = '/' } = defineProps<{
  items: {
    title: string;
    disabled: boolean;
    href: string;
  }[];
  divider?: string;
}>();
</script>

<template>
  <v-breadcrumbs class="pa-0" :items="items" :divider="divider">
    <template #item="{ item, index }">
      <span v-if="index === items.length - 1" class="breadcrumbs__current">{{
        item.title
      }}</span>
      <router-link v-else class="breadcrumbs__link" :to="{ name: item.href }">{{
        item.title
      }}</router-link>
    </template>
  </v-breadcrumbs>
</template>

<style scoped lang="scss">
.breadcrumbs {
  &__current {
    font-weight: 300;
    opacity: 0.5;
  }
  &__link {
    text-decoration: none;
    color: inherit;
  }
}
</style>
