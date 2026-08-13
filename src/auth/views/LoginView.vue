<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/auth/composables/useAuth';
import { useNotification } from '@/ui-kit/appNotification/useNotification';
import { apiErrors } from '@/infrastructure/utils/apiErrors';
import { authContext } from '@/auth/infrastructure/context';
import { emailRegex } from '@/infrastructure/utils/emailRegex';
import AppHeading from '@/ui-kit/AppHeading.vue';
import AppCard from '@/ui-kit/AppCard.vue';
import AppInput from '@/ui-kit/AppInput.vue';
import AppForm from '@/ui-kit/AppForm.vue';
import AppButton from '@/ui-kit/AppButton.vue';
import AppLogo from '@/ui-kit/AppLogo.vue';

import type { AuthRepo } from '@/auth/domain/AuthRepo';

const authRepo = authContext.get<AuthRepo>('AuthRepo');
const router = useRouter();
const { token, currentUser } = useAuth();
const { showNotification } = useNotification();
const emailInput = useTemplateRef('emailInput');

const isLoading = ref(false);
const showPassword = ref<boolean>(false);

const errors = ref({
  email: '',
  password: ''
});

const isErrorsExist = computed<boolean>(() => {
  return !!(errors.value.email || errors.value.password);
});

const email = ref<string>('');
function handleEmailUpdate(value: string) {
  if (!value) {
    errors.value.email = 'This field is required';
  } else {
    errors.value.email = '';
  }
  email.value = value;
}

const password = ref<string>('');
function handlePasswordUpdate(value: string) {
  if (!value) {
    errors.value.password = 'This field is required';
  } else {
    errors.value.password = '';
  }
  password.value = value;
}

async function handleSubmit() {
  if (!email.value) {
    errors.value.email = 'This field is required';
  } else if (!emailRegex.test(email.value)) {
    errors.value.email = 'Please enter a valid email address';
  }

  if (!password.value) {
    errors.value.password = 'This field is required';
  }

  if (isErrorsExist.value) return;

  try {
    isLoading.value = true;
    const res = await authRepo.signIn({
      email: email.value,
      password: password.value
    });

    currentUser.value = res.user;
    token.value = res.token;
    localStorage.setItem('token', res.token);

    await router.push({ name: 'home' });
  } catch (error) {
    showNotification(apiErrors(error), 'error');
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  emailInput.value?.inputRef?.focus();
});
</script>

<template>
  <div
    class="d-flex flex-column align-center justify-center ma-auto h-100 ga-8 px-6 w-100 w-md-50 w-xl-33"
  >
    <AppLogo is-login-page />
    <AppHeading class="text-center" type="h1">
      Log in to your account
    </AppHeading>
    <AppCard class="w-100 pa-6 pa-md-10 mt-4">
      <AppForm
        class="d-flex flex-column align-center ga-2 ga-md-6"
        @submit="handleSubmit"
      >
        <AppInput
          ref="emailInput"
          :model-value="email"
          :error-messages="errors.email"
          class="w-100"
          label="E-mail"
          placeholder="Email address..."
          type="email"
          variant="outlined"
          autocomplete="email"
          @update:model-value="handleEmailUpdate"
        />
        <AppInput
          :model-value="password"
          :error-messages="errors.password"
          class="w-100"
          label="Password"
          placeholder="Password..."
          variant="outlined"
          autocomplete="current-password"
          :type="showPassword ? 'text' : 'password'"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showPassword = !showPassword"
          @update:model-value="handlePasswordUpdate"
        />
        <AppButton
          class="w-md-50 w-100"
          color="info"
          size="large"
          type="submit"
          :loading="isLoading"
        >
          Log in
        </AppButton>
      </AppForm>
    </AppCard>
  </div>
</template>
