import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/auth/view/LoginView.vue"
import RegisterView from "@/views/auth/view/RegisterView.vue"
import TheDashboardView from "@/components/TheDashboardView.vue";
import TransactionView from "@/views/transactions/TransactionView.vue";
import ViewSingleInvoice from "@/views/invoices/ViewSingleInvoice.vue";
import InvoiceList from "@/views/invoices/InvoiceList.vue";
import CustomerList from "@/views/customers/CustomerList.vue";
import SettingsView from "@/views/settings/TheSettingsView.vue";
import Profile from "@/views/settings/Profile.vue";

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
        name:'tender',
        path: 'tender',
        component: InvoiceList,
        meta: {
          slug: 'Tenders',
        },
        children: [
          {
            name:'tender-view',
            path: ':id',
            component: ViewSingleInvoice,
            meta: {
              slug: 'Detailed Tender View',
            },
          },
          {
            name:'create-tender',
            path: 'create',
            component: ViewSingleInvoice,
            meta: {
              slug: 'Detailed Tender View',
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
            name:'customer-view',
            path: ':id',
            component: ViewSingleInvoice,
            meta: {
              slug: 'Detailed Invoice View',
            },
          },
        ]
      },
      {
        name:'school',
        path: 'school',
        component: Profile,
        meta: {
          slug: 'School Details',
        },
      },
    ]
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;