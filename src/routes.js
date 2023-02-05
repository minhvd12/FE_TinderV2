import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
import Block from './pages/Block';
import CompanyJobPost from './pages/CompanyJobPost';
import ChangePassword from './pages/ChangePassword';
import CreateCompany from './pages/CreateCompany';
import CreateJobPost from './pages/CreateJobPost';
import DashboardApp from './pages/DashboardApp';
import Deposit from './pages/Deposit';
import DetailJobPost from './pages/DetailJobPost';
import HistoryMatching from './pages/HistoryMatching';
import HistoryTransaction from './pages/HistoryTransaction';
import UserCard from './pages/JobApply';
import JobPost from './pages/JobPost';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Profile from './pages/Profile';
import ProfileApplicant from './pages/ProfileApplicant';
import UserProfile from './pages/ProfileApply';
import Register from './pages/Register';
import { ShowInformationCreateCompany, ShowInformationJoinCompany } from './pages/ShowInformation';
import User from './pages/Employee';
import Approval from './pages/Approval';
import EmployeeInformation from './pages/EmployeeInformation';

// ----------------------------------------------------------------------

function PrivateRoute() {
  // let auth = false;
  if (localStorage.getItem('token')) {
    const role = localStorage.getItem('role');
    switch (role) {
      case 'EMPLOYEE':
        return <Navigate to='/employee/dashboard' />;
      case 'COMPANY':
        return <Navigate to='/company/dashboard' />;
      default:
        return <Navigate to='/login' />;
    }
  }
  return <Navigate to='/login' />;
}

export default function Router() {
  return useRoutes([
    // {
    //   path: '/dashboard',
    //   element: <DashboardLayout />,
    //   children: [
    //     { path: 'app', element: <DashboardApp /> },
    //     { path: 'employee', element: <User /> },
    //     { path: 'products', element: <Products /> },
    //     { path: 'blog', element: <Blog /> },
    //     { path: 'profile', element: <Profile /> },
    //     { path: 'job-post', element: <JobPost /> },
    //     { path: 'productsdetail', element: <UserProfile /> },
    //     { path: 'applyjob', element: <UserCard /> },
    //     { path: 'profile-applicant', element: <ProfileApplicant /> },
    //     { path: 'job-post/detail/:id', element: <DetailJobPost /> },
    //     { path: 'change-password', element: <ChangePassword /> },
    //     { path: 'deposit', element: <Deposit /> },
    //     { path: 'block', element: <Block /> },
    //     { path: 'job-post/create', element: <CreateJobPost /> },
    //     { path: 'job-post/edit/:id', element: <CreateJobPost /> },
    //     { path: 'job-post/create/:id', element: <CreateJobPost /> },
    //     { path: 'history-matching', element: <HistoryMatching /> },
    //     { path: 'history-transaction', element: <HistoryTransaction /> },
    //     { path: 'create-company', element: <CreateCompany /> },
    //     { path: 'show-information-create', element: <ShowInformationCreateCompany /> },
    //     { path: 'show-information-join', element: <ShowInformationJoinCompany /> }
    //   ],
    // },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <PrivateRoute /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
        { path: 'show-information', element: <ShowInformationCreateCompany /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" /> },
    {
      path: '/employee',
      element: <DashboardLayout />,
      children: [
        { path: 'dashboard', element: <DashboardApp /> },
        { path: 'job-post', element: <JobPost /> },
        { path: 'job-post/detail/:id', element: <DetailJobPost /> },
        { path: 'job-post/create', element: <CreateJobPost /> },
        { path: 'job-post/edit/:id', element: <CreateJobPost /> },
        { path: 'job-post/create/:id', element: <CreateJobPost /> },
        { path: 'information', element: <EmployeeInformation /> }
      ]
    },
    {
      path: '/company',
      element: <DashboardLayout />,
      children: [
        { path: 'dashboard', element: <DashboardApp /> },
        { path: 'employee', element: <User /> },
        { path: 'deposit', element: <Deposit /> },
        { path: 'history-matching', element: <HistoryMatching /> },
        { path: 'history-transaction', element: <HistoryTransaction /> },
        { path: 'job-post', element: <CompanyJobPost /> },
      ]
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        { path: '/profile', element: <Profile /> },
        { path: '/change-password', element: <ChangePassword /> },
      ]
    }
  ]);
}
