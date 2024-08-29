import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/auth/LoginView.vue"
import RegisterView from "@/views/auth/view/RegisterView.vue"
import TheDashboardView from "@/components/TheDashboardView.vue";
import TransactionView from "@/views/transactions/TransactionView.vue";
import ViewSingleInvoice from "@/views/invoices/ViewSingleInvoice.vue";
import InvoiceList from "@/views/invoices/InvoiceList.vue";
import CustomerList from "@/views/customers/CustomerList.vue";

const routes = [
  {
    name:'register',
    path: '/register',
    component: RegisterView,
    requiresAuth: true,
    roles: [],
    meta: {
      slug: 'User Registration',
      requiresAuth: false,
    },
  },
  {
    name:'login',
    path: '/',
    component: LoginView,
    meta: {
      slug: 'Login',
      requiresAuth: false,
    },
  },
  {
    name:'dashboard',
    path: '/dashboard',
    component: TheDashboardView,
    meta: {
      requiresAuth: true,
      slug: 'Dashboard',
    },
    children : [
      {
        name:'transaction',
        path: 'transaction',
        component: TransactionView,
        meta: {
          slug: 'Transactions',
        },
      },
      {
        name:'invoice',
        path: 'invoice',
        component: InvoiceList,
        meta: {
          slug: 'Invoices',
        },
        children: [
          {
            name:'invoice-view',
            path: ':id',
            component: ViewSingleInvoice,
            meta: {
              slug: 'Detailed Invoice View',
            },
          },
        ]
      },
      {
        name:'customer',
        path: 'customer',
        component: CustomerList,
        meta: {
          slug: 'Customers',
        },
        children: [
          {
            name:'invoice-view',
            path: ':id',
            component: ViewSingleInvoice,
            meta: {
              slug: 'Detailed Invoice View',
            },
          },
        ]
      },
    ]
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;