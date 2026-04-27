import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then( m => m.DashboardPage)
  },
  {
    path: 'transaction',
    loadComponent: () => import('./pages/transaction/transaction.page').then( m => m.TransactionPage)
  },
  {
    path: 'savings',
    loadComponent: () => import('./pages/savings/savings.page').then( m => m.SavingsPage)
  },
  {
    path: 'loans',
    loadComponent: () => import('./pages/loans/loans.page').then( m => m.LoansPage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.page').then( m => m.ProfilePage)
  },
  {
    path: 'scan',
    loadComponent: () => import('./pages/scan/scan.page').then( m => m.ScanPage)
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup.page').then( m => m.SignupPage)
  },
  {
    path: 'header',
    loadComponent: () => import('./pages/header/header.page').then( m => m.HeaderPage)
  },
  {
    path: 'footer',
    loadComponent: () => import('./pages/footer/footer.page').then( m => m.FooterPage)
  },
];
