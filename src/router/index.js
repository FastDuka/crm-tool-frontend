import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/auth/LoginView.vue"
import RegisterView from "@/views/auth/view/RegisterView.vue"
import TheDashboardView from "@/components/TheDashboardView.vue";
import TransactionView from "@/views/transactions/TransactionView.vue";
import ViewSingleInvoice from "@/views/invoices/ViewSingleInvoice.vue";
import InvoiceList from "@/views/invoices/InvoiceList.vue";
import CustomerList from "@/views/customers/CustomerList.vue";
import CreateEditCustomer from "@/views/customers/CreateEditCustomer.vue";
import CreateInvoice from "@/views/invoices/CreateInvoice.vue";

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
          {
            name:'invoice-create',
            path: 'invoice-create',
            component: CreateInvoice,
            meta: {
              slug: 'Create Invoice',
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
            name:'customer-edit',
            path: ':id',
            component: CreateEditCustomer,
            meta: {
              slug: 'Update Customer',
            },
          },
          {
            name:'customer-create',
            path: 'customer-create',
            component: CreateEditCustomer,
            meta: {
              slug: 'Register Customer',
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