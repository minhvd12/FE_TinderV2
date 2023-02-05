import { useEffect, useState } from 'react';
import axios from 'axios';
// @mui
import { Container, Grid, Stack, Typography, Tab, Tabs, Box, Alert, IconButton,Snackbar, } from '@mui/material';
// hooks
import useTabs from '../hooks/useTabs';
import useSettings from '../hooks/useSettings';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Iconify from '../components/Iconify';
import ConfirmCompanyCard from '../sections/confirmPage/ConfirmCompanyCard';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import EmptyContent from '../components/EmptyContent';
import ConfirmApplicantCard from '../sections/confirmPage/ConfirmApplicantCard';
import ConfirmJobPostCard from '../sections/confirmPage/ConfirmJobPostCard';
import ConfirmUserCompany from '../sections/confirmPage/ConfirmUserCompany';
// sections
import { api } from '../constants';

// ----------------------------------------------------------------------

export default function Approval() {
  const { themeStretch } = useSettings();
  const [listCompany, setListCompany] = useState([]);
  const [listApplicant, setListApplicant] = useState([]);
  const [severity, setSeverity] = useState('success');
  const [messageAlert, setMessageAlert] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const [listJobPost, setListJobPost] = useState([]);
  const [listUser, setListUser] = useState([]);
  const { currentTab, onChangeTab } = useTabs('company');
  const [visible, setVisible] = useState(false);
  const [refreshDataCompany, setRefreshDataCompany] = useState(false);
  const [refreshDataApplicant, setRefreshDataApplicant] = useState(false);
  const [refreshDataJobPost, setRefreshDataJobPost] = useState(false);
  const [refreshDataJoin, setRefreshDataJoin] = useState(false);
  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setVisible(true);
    } else if (scrolled <= 300) {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  window.addEventListener('scroll', toggleVisible);
  useEffect(() => {
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/companies?status=2`,
      method: 'get',
    })
      .then((response) => {
        setListCompany(response.data.data);
        // console.log(response.data.data);
      })
      .catch((error) => console.log(error));
      setRefreshDataCompany(false);
  }, [currentTab === 'company', refreshDataCompany]);

  useEffect(() => {
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/applicants?earnMoney=2`,
      method: 'get',
    })
      .then((response) => {
        setListApplicant(response.data.data);
        // console.log(response.data.data);
      })
      .catch((error) => console.log(error));
      setRefreshDataApplicant(false)
  }, [currentTab === 'applicant', refreshDataApplicant]);

 
  const handleCompanyRow = (id) => {
       
          const deleteRow = listCompany.filter((row) => row.id !== id);
          
          setListCompany(deleteRow);
          setOpenAlert(true);
          setSeverity('success');
          setMessageAlert('Xác nhận duyệt công ty thành công');
          if(listCompany.length === 0){
            setRefreshDataCompany(true);
            onChangeTab('company')
          }
     
  };
  const handleUserRow = (id) => {

    // console.log(response.status);
   
      const deleteRow = listApplicant.filter((row) => row.id !== id);
      
      setListApplicant(deleteRow);
      setOpenAlert(true);
      setSeverity('success');
      setMessageAlert('Xác nhận duyệt ứng viên kiếm tiền thành công');
      if(listApplicant.length === 0){
        setRefreshDataApplicant(true);
        onChangeTab('applicant')
      }
 
};

  const handleError = () => {

      setOpenAlert(true);
      setSeverity('error');
      setMessageAlert('Đã xảy ra lỗi.Vui lòng thử lại');
      // handleRefresh();
      // setRefreshData(!refreshData);
      setRefreshDataCompany(true);
      setRefreshDataJoin(true)
      setRefreshDataApplicant(true)
      setRefreshDataJobPost(true)
};
 

const handleRejectCompanyRow = (id) => {

  // console.log(response.status);
 
    const deleteRow = listCompany.filter((row) => row.id !== id);
    
    setListCompany(deleteRow);
    setOpenAlert(true);
    setSeverity('success');
    setMessageAlert('Xác nhận từ chối công ty thành công');
    if(listCompany.length === 0){
      setRefreshDataCompany(true)
      onChangeTab('company')
    }

};
const handleRejectApplicantRow = (id) => {

  // console.log(response.status);
 
    const deleteRow = listApplicant.filter((row) => row.id !== id);
    
    setListApplicant(deleteRow);
    setOpenAlert(true);
    setSeverity('success');
    setMessageAlert('Xác nhận từ chối ứng viên kiếm tiền thành công');
    if(listApplicant.length === 0){
      setRefreshDataApplicant(true)
      onChangeTab('applicant')
    }

};


  const TABS = [
    {
      value: 'company',
      label: 'Công ty',
      count: listCompany === undefined ? 0 : listCompany.length,
      color:  (listCompany === undefined || listCompany.length === 0 ) ? 'info' : 'error',
      icon: <Iconify icon={'la:industry'} width={20} height={20} />,
      component:
      
        (listCompany === undefined || listCompany.length === 0 ) ? (
          <Stack spacing={3}>
            <EmptyContent
              title="Không có đơn xét duyệt mới"
              sx={{
                '& span.MuiBox-root': { height: 160 },
              }}
            />
          </Stack>
        ) : (
          
            <Stack spacing={3}>
              {listCompany.map((company) => (
                <ConfirmCompanyCard key={company.id} post={company} 
                onDeleteRow={() => handleCompanyRow(company.id)}
                onErrorRow={() => handleError(company.id) }
                onRejectRow={() => handleRejectCompanyRow(company.id) }
                />
              ))}
            </Stack>
          
        ),
    },

    {
      value: 'applicant',
      label: 'Ứng viên',
      count: listApplicant === undefined ? 0 : listApplicant.length,
      color: (listApplicant === undefined || listApplicant.length === 0 ) ? 'info' : 'error',
      icon: <Iconify icon={'carbon:user-avatar'} width={20} height={20} />,
      component:
        (listApplicant === undefined || listApplicant.length === 0 ) ? (
          <Stack spacing={3}>
            <EmptyContent
              title="Không có đơn xét duyệt mới"
              sx={{
                '& span.MuiBox-root': { height: 160 },
              }}
            />
          </Stack>
        ) : (
          <Stack spacing={3}>
            {listApplicant.map((applicant) => (
              <ConfirmApplicantCard key={applicant.id} applicant={applicant}
               onDeleteRow={() => handleUserRow(applicant.id)} 
               onErrorRow={() => handleError(applicant.id)}
                onRejectRow={() => handleRejectApplicantRow(applicant.id) }
                />
            ))}
          </Stack>
        ),
    },
  

  ];

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };

  return (
    <Page title="Xét Duyệt">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Xét Duyệt"
          links={[
            { name: 'Trang chủ', href: PATH_DASHBOARD.general.one },
            { name: 'Xét Duyệt', href: PATH_DASHBOARD.general.confirmCompany },
          ]}
        />

        <Grid container spacing={3}>
          <Grid item xs>
            <Typography variant="subtitle2" noWrap>
              &nbsp;
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Tabs
              allowScrollButtonsMobile
              variant="scrollable"
              scrollButtons="auto"
              value={currentTab}
              onChange={onChangeTab  
            }
            
            >
              {TABS.map((tab) => (
                <Tab
                  disableRipple
                  key={tab.value}
                  value={tab.value}
                  icon={
                    <Label color={tab.color}>
                      {' '}
                      {tab.icon} &nbsp; {tab.count}{' '}
                    </Label>
                  }
                  label={tab.label}
                />
              ))}
            </Tabs>
            {TABS.map((tab) => {
              const isMatched = tab.value === currentTab;
              return isMatched && <Box key={tab.value}>{tab.component}</Box>;
            })}
          </Grid>
          <Grid item xs>
            <Typography variant="subtitle2" noWrap>
              &nbsp;
            </Typography>
          </Grid>
        </Grid>
        <IconButton
          style={{
            position: 'fixed',
            bottom: 25,
            right: 25,
            display: visible ? 'block' : 'none',
          }}
          onClick={scrollToTop}
        >
         <Iconify icon={'cil:arrow-circle-top'} color="success" width={40} height={40} />
        </IconButton>
      </Container>
      <Snackbar
        open={openAlert}
        autoHideDuration={5000}
        onClose={handleCloseAlert}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <Alert onClose={handleCloseAlert} severity={severity} sx={{ width: '100%' }} variant="filled">
          {messageAlert}
        </Alert>
      </Snackbar>
    </Page>
  );
}
