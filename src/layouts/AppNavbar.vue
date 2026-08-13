<script setup lang="ts">
import { useNavbar } from '@/layouts/useNavbar';
import AppIcon from '@/ui-kit/AppIcon.vue';
import { useDisplay } from 'vuetify';
import { onMounted } from 'vue';

const { isNavbar } = useNavbar();
const { lg, xl, xxl } = useDisplay();

const pages = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard', to: { name: 'dashboard' } },
  {
    title: 'Products',
    icon: 'mdi-package-variant-closed',
    to: { name: 'products' }
  },
  {
    title: 'Categories',
    icon: 'mdi-view-list',
    to: { name: 'categories' }
  },
  { title: 'Orders', icon: 'mdi-cart-check', to: { name: 'orders' } },
  { title: 'Users', icon: 'mdi-account-group', to: { name: 'users' } }
];

onMounted(() => {
  isNavbar.value = lg.value || xl.value || xxl.value;
});
</script>

<template>
  <v-navigation-drawer v-model="isNavbar">
    <v-list class="navbar__list">
      <v-list-item
        v-for="{ to, title, icon } in pages"
        :key="title"
        :to="to"
        link
      >
        <v-list-item-title class="d-flex align-baseline ga-3">
          <AppIcon :icon="icon" size="x-small" />
          <span>{{ title }}</span>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped lang="scss">
.navbar {
  &__list {
    margin-top: 0.5rem;
  }
}
</style>
