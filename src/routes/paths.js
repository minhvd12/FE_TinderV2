// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    one: path(ROOTS_DASHBOARD, '/one'),
    applicant: path(ROOTS_DASHBOARD, '/applicant'),
    company: path(ROOTS_DASHBOARD, '/companies'),
    approval: path(ROOTS_DASHBOARD, '/approval'),
    product: path(ROOTS_DASHBOARD, '/products'),
    transactions: path(ROOTS_DASHBOARD, '/transactions'),
    orders: path(ROOTS_DASHBOARD, '/orders'),
  },
 
  applicant: {
    root: path(ROOTS_DASHBOARD, '/applicant'),
    list: path(ROOTS_DASHBOARD, '/applicant/list'),

  },
  management: {
    jobposition: path(ROOTS_DASHBOARD, '/management/jobposition'),
    workingstyle: path(ROOTS_DASHBOARD, '/management/workingstyle'),
    
  },
  skillmanager: {
   
    skillGroup: path(ROOTS_DASHBOARD, '/skillmanager/skillGroup'),
    skills: path(ROOTS_DASHBOARD, '/skillmanager/skills'),
    skillLevel: path(ROOTS_DASHBOARD, '/skillmanager/skillLevel'),
  },
};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';
