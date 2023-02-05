import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
// import RoleBasedGuard from '../guards/RoleBasedGuard';
// config
import { PATH_AFTER_LOGIN } from '../config';
// components
import LoadingScreen from '../components/LoadingScreen';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  return (
    <Suspense fallback={<LoadingScreen isDashboard={pathname.includes('/dashboard')} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },

        { path: 'login-unprotected', element: <Login /> },
      ],
    },
    {
      path: '/dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'one', element: <PageOne /> },
        { path: 'applicant', element: <Applicant /> },
        { path: 'companies', element: <Company /> },
        { path: 'approval', element: <Approval /> },
        { path: 'products', element: <Product /> },
        { path: 'transactions', element: <Transactions /> },
        { path: 'orders', element: <Order /> },
        {
          path: 'management',
          children: [
            { element: <Navigate to="/dashboard/management/jobposition" replace />, index: true },
            { path: 'jobposition', element: <JobPosition /> },
            { path: 'workingstyle', element: <WorkingStyle /> },
            { path: 'skillGroup', element: <SkillGroup /> },
            { path: 'skills', element: <Skills /> },
            { path: 'skillLevel', element: <SkillsLevel /> },
          ],
        },
        {
          path: 'skillmanager',
          children: [
            { element: <Navigate to="/dashboard/skillmanager/skillGroup" replace />, index: true },

            { path: 'skillGroup', element: <SkillGroup /> },
            { path: 'skills', element: <Skills /> },
            { path: 'skillLevel', element: <SkillsLevel /> },
          ],
        },
      ],
    },
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    {
      path: '/',
      element: <Navigate to="/auth/login" replace />},

    { path: '*', element: <Navigate to="404" replace /> },
  ]);
}

// Dashboard
const PageOne = Loadable(lazy(() => import('../pages/Dashboard')));
const Applicant = Loadable(lazy(() => import('../pages/Applicant')));
const Transactions = Loadable(lazy(() => import('../pages/Transaction')));
const Order = Loadable(lazy(() => import('../pages/Order')));
const Product = Loadable(lazy(() => import('../pages/Product')));
const Company = Loadable(lazy(() => import('../pages/Company')));
const Approval = Loadable(lazy(() => import('../pages/Approval')));
const JobPosition = Loadable(lazy(() => import('../pages/JobPosition')));
const WorkingStyle = Loadable(lazy(() => import('../pages/WorkingStyle')));
const SkillGroup = Loadable(lazy(() => import('../pages/SkillGroup')));
const SkillsLevel = Loadable(lazy(() => import('../pages/SkillLevel')));
const Skills = Loadable(lazy(() => import('../pages/Skills')));
const Login = Loadable(lazy(() => import('../pages/Login')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
