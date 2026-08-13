<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '@/auth/composables/useAuth';
import { apiErrors } from '@/infrastructure/utils/apiErrors';
import { useNotification } from '@/ui-kit/appNotification/useNotification';
import { useDisplay } from 'vuetify';
import AppForm from '@/ui-kit/AppForm.vue';
import AppInput from '@/ui-kit/AppInput.vue';
import AppButton from '@/ui-kit/AppButton.vue';

const { currentUser } = useAuth();
const { showNotification } = useNotification();
const { smAndUp } = useDisplay();

const isUpdating = ref<boolean>(false);

const userName = ref<string>(currentUser.value?.username || '');
function handleUsernameUpdate(value: string): void {
  userName.value = value;
}

const email = ref<string>(currentUser.value?.email || '');
function handleEmailUpdate(value: string): void {
  email.value = value;
}

async function handleSubmit() {
  try {
    isUpdating.value = true;
  } catch (error) {
    showNotification(apiErrors(error), 'error');
  } finally {
    isUpdating.value = false;
  }
}
</script>

<template>
  <AppForm @submit="handleSubmit">
    <AppInput
      :model-value="userName"
      class="w-100"
      label="User name"
      placeholder="Enter user name..."
      type="text"
      variant="outlined"
      :density="smAndUp ? 'default' : 'compact'"
      @update:model-value="handleUsernameUpdate"
    />
    <AppInput
      :model-value="email"
      class="w-100"
      label="E-mail"
      placeholder="Email address..."
      type="email"
      variant="outlined"
      :density="smAndUp ? 'default' : 'compact'"
      @update:model-value="handleEmailUpdate"
    />
    <AppButton
      :loading="isUpdating"
      type="submit"
      :size="smAndUp ? 'large' : undefined"
      class="d-block ml-auto"
    >
      Update account
    </AppButton>
  </AppForm>
</template>
