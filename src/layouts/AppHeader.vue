<script setup lang="ts">
import { onMounted } from 'vue';
import { useTheme } from 'vuetify';
import { useNavbar } from '@/layouts/useNavbar';
import { useRouter } from 'vue-router';
import { useAuth } from '@/auth/composables/useAuth';
import { useNotification } from '@/ui-kit/appNotification/useNotification';
import { authRepo } from '@/auth/api/authRepoImpl';
import { apiErrors } from '@/infrastructure/utils/apiErrors';
import AppIconButton from '@/ui-kit/AppIconButton.vue';
import AppLogo from '@/ui-kit/AppLogo.vue';
import LogoutView from '@/auth/views/LogoutView.vue';

const router = useRouter();
const theme = useTheme();
const { toggleNavbar } = useNavbar();
const { currentUser } = useAuth();
const { showNotification } = useNotification();

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
  localStorage.setItem(
    'theme',
    theme.global.current.value.dark ? 'dark' : 'light'
  );
}

async function getUser(): Promise<void> {
  try {
    currentUser.value = await authRepo.getCurrentUser();
  } catch (error) {
    showNotification(apiErrors(error), 'error');
  }
}

onMounted(async () => {
  await getUser();
});
</script>

<template>
  <v-app-bar class="header" elevation="1">
    <template #prepend>
      <v-app-bar-nav-icon @click.stop="toggleNavbar" />
    </template>
    <v-toolbar-title>
      <AppLogo />
    </v-toolbar-title>
    <template #append>
      <div class="pr-2 d-flex align-center ga-1">
        <span class="d-none d-md-inline-block">{{
          currentUser?.username
        }}</span>
        <AppIconButton
          icon="mdi-account-outline"
          density="comfortable"
          size="x-large"
          @click="() => router.push({ name: 'account' })"
        ></AppIconButton>
        <AppIconButton
          icon="mdi-theme-light-dark"
          density="comfortable"
          size="x-large"
          @click="toggleTheme"
        ></AppIconButton>
        <LogoutView />
      </div>
    </template>
  </v-app-bar>
</template>

<style scoped lang="scss"></style>
