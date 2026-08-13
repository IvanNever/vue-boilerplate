<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDisplay } from 'vuetify';
import { useAuth } from '@/auth/composables/useAuth';
import { useNotification } from '@/ui-kit/appNotification/useNotification';
import AppButton from '@/ui-kit/AppButton.vue';
import AppForm from '@/ui-kit/AppForm.vue';
import AppInput from '@/ui-kit/AppInput.vue';

const { showNotification } = useNotification();
const { smAndUp } = useDisplay();
const { isLoading, updateCurrentUserPassword } = useAuth();

const showPassword = ref<boolean>(false);

const errors = ref({
  password: '',
  passwordConfirm: ''
});
const isErrorsExist = computed<boolean>(() => {
  return !!(errors.value.password || errors.value.passwordConfirm);
});

const password = ref<string>('');
function handlePasswordUpdate(value: string): void {
  if (!value) {
    errors.value.password = 'This field is required';
  } else {
    errors.value.password = '';
  }

  password.value = value;
}

const passwordConfirm = ref<string>('');
function handlePasswordConfirmUpdate(value: string): void {
  if (!value) {
    errors.value.passwordConfirm = 'This field is required';
  } else {
    errors.value.passwordConfirm = '';
  }

  passwordConfirm.value = value;
}

async function handleSubmit(): Promise<void> {
  if (!password.value) {
    errors.value.password = 'This field is required';
  }
  if (!passwordConfirm.value) {
    errors.value.passwordConfirm = 'This field is required';
  }

  if (isErrorsExist.value) return;

  if (password.value !== passwordConfirm.value) {
    showNotification('Passwords do not match. Please try again.', 'error');
    password.value = '';
    passwordConfirm.value = '';
    return;
  }

  await updateCurrentUserPassword(password.value);

  passwordConfirm.value = '';
  password.value = '';
}
</script>

<template>
  <AppForm @submit="handleSubmit">
    <AppInput
      :model-value="password"
      :error-messages="errors.password"
      class="w-100"
      label="New password"
      placeholder="New password..."
      variant="outlined"
      :type="showPassword ? 'text' : 'password'"
      :density="smAndUp ? 'default' : 'compact'"
      :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
      autocomplete="new-password"
      @click:append-inner="showPassword = !showPassword"
      @update:model-value="handlePasswordUpdate"
    />
    <AppInput
      :model-value="passwordConfirm"
      :error-messages="errors.passwordConfirm"
      class="w-100 mt-2"
      label="Confirm Password"
      placeholder="Confirm password..."
      variant="outlined"
      :type="showPassword ? 'text' : 'password'"
      :density="smAndUp ? 'default' : 'compact'"
      :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
      autocomplete="confirm-password"
      @click:append-inner="showPassword = !showPassword"
      @update:model-value="handlePasswordConfirmUpdate"
    />
    <AppButton
      :loading="isLoading"
      :disabled="isErrorsExist"
      type="submit"
      :size="smAndUp ? 'large' : undefined"
      class="d-block ml-auto"
    >
      Update password
    </AppButton>
  </AppForm>
</template>
