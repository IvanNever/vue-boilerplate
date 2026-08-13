import { createRouter, createWebHistory } from 'vue-router';
import { usersRoutes } from '@/users/infrastructure/routes';
import { useAuth } from '@/auth/composables/useAuth';
import AppLayout from '@/layouts/AppLayout.vue';
import AppNotFound from '@/common/views/AppNotFound.vue';
import DashboardView from '@/dashboard/views/DashboardView.vue';
import ProductsView from '@/products/views/ProductsView.vue';
import CategoriesView from '@/categories/views/CategoriesView.vue';
import OrdersView from '@/orders/views/OrdersView.vue';
import EmptyLayout from '@/layouts/EmptyLayout.vue';
import LoginView from '@/auth/views/LoginView.vue';
import AccountView from '@/auth/views/AccountView.vue';

const { token } = useAuth();

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: AppLayout,
      redirect: { name: 'dashboard' },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: DashboardView
        },
        {
          path: 'products',
          name: 'products',
          component: ProductsView
        },
        {
          path: 'categories',
          name: 'categories',
          component: CategoriesView
        },
        {
          path: 'orders',
          name: 'orders',
          component: OrdersView
        },
        {
          path: 'users',
          name: 'users',
          redirect: { name: 'users-list' },
          children: usersRoutes
        },
        {
          path: 'account',
          name: 'account',
          component: AccountView
        },
        {
          path: '/:pathMatch(.*)*',
          name: 'notFound',
          component: AppNotFound
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: EmptyLayout,
      redirect: {
        name: 'login-page'
      },
      children: [
        {
          path: '',
          name: 'login-page',
          component: LoginView
        }
      ]
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  const currentAuth = localStorage.getItem('token');
  if (currentAuth) {
    token.value = currentAuth;
  }

  if (to.name === 'login-page' && token.value) {
    next({ name: 'home' });
    return;
  }

  if (to.name !== 'login-page' && !token.value) {
    next({ name: 'login' });
  } else {
    next();
  }
});
export default router;
