<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useUsers } from '../composables/useUsers';
import { useUser } from '../composables/useUser';
import { usersRepo } from '@/users/api/usersRepoImpl';
import AppPageHeading from '@/ui-kit/AppPageHeading.vue';
import AppButton from '@/ui-kit/AppButton.vue';

const route = useRoute();
const { users } = useUsers();
const { user } = useUser();

function getUser(): void {
  const res = users.value.find((item) => item.id === Number(route.params.id));

  if (!res) return;

  user.value = res;
}

async function getUsers(): Promise<void> {
  try {
    users.value = await usersRepo.getUsers();
  } catch (err) {
    console.log(err);
  }
}

const breadcrumbs = computed(() => [
  {
    title: 'Home',
    disabled: false,
    href: 'home'
  },
  {
    title: 'Users',
    disabled: false,
    href: 'users'
  },
  {
    title: `User #${user.value?.id} Details`,
    disabled: true,
    href: 'user-details'
  }
]);

onMounted(async () => {
  if (!users.value.length) {
    await getUsers();
  }
  getUser();
});
</script>

<template>
  <div class="user">
    <AppPageHeading title="User Details Page" :breadcrumbs="breadcrumbs">
      <AppButton prepend-icon="">Edit User</AppButton>
    </AppPageHeading>
    <div>User details info in progress...</div>
  </div>
</template>

<style scoped lang="scss"></style>
