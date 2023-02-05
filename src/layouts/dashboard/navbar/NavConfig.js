// components
import SvgIconStyle from '../../../components/SvgIconStyle';
import Iconify from '../../../components/Iconify';
// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  user: getIcon('ic_user'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  settings: getIcon('ic_settings'),
  about: getIcon('ic_about'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'Admin Dashboard',
    items: [
      { title: 'Trang chủ', path: '/dashboard/one', icon: ICONS.dashboard },
      { title: 'Ứng viên', path: '/dashboard/applicant', icon: ICONS.user },
      { title: 'Công ty', path: '/dashboard/companies', icon: ICONS.analytics},
      { title: 'Xét duyệt', path: '/dashboard/approval', icon: <Iconify icon={'fluent-mdl2:document-approval'} width={20} height={20} />},
      { title: 'Sản Phẩm', path: '/dashboard/products', icon: <Iconify icon={'fluent-mdl2:product-catalog'} width={20} height={20} />},
      { title: 'Giao dịch', path: '/dashboard/transactions', icon: <Iconify icon={'ant-design:transaction-outlined'} width={20} height={20} />},
      // { title: 'Đổi quà', path: '/dashboard/orders', icon: <Iconify icon={'ant-design:transaction-outlined'} width={20} height={20} />},
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'Cấu hình',
    items: [
      {
        title: 'Công việc',
        path: '/dashboard/management',
        icon: ICONS.user,
        children: [
          { title: 'Loại hình làm việc', path: '/dashboard/management/workingstyle' },
          { title: 'Vị trí công việc', path: '/dashboard/management/jobposition' },
          
        ],
      },
      {
        title: 'Kỹ Năng',
        path: '/dashboard/skillmanager',
        icon: <Iconify icon={'game-icons:skills'} width={20} height={20} />,
        children: [
          { title: 'Nhóm kỹ năng', path: '/dashboard/skillmanager/skillGroup' },
          { title: 'Kỹ năng', path: '/dashboard/skillmanager/skills' },
          { title: 'Trình độ kỹ năng', path: '/dashboard/skillmanager/skillLevel' },
        ],
      },
    ],
    
  },
];

export default navConfig;
