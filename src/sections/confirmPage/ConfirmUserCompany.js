import PropTypes from 'prop-types';
import {  Card, Table, TableContainer, TableBody, Snackbar, Alert } from '@mui/material';
import { useEffect, useState } from 'react';
import UserCompanyTableRow from './UserCompanyTableRow';
// components
import { TableEmptyRows, TableHeadCustom, TableNoData } from '../../components/table';
import Scrollbar from '../../components/Scrollbar';


ConfirmUserCompany.propTypes = {
  user: PropTypes.array,
  onRefresh: PropTypes.func,
  
};

export default function ConfirmUserCompany({user, onRefresh}) {
  const [listUserCompany, setUserCompany] = useState(user);
  const [openAlert, setOpenAlert] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [messageAlert, setMessageAlert] = useState('');

  // console.log(user);
  const TABLE_HEAD = [
    { id: 'name', label: 'Số điện thoại', align: 'left' },
    { id: 'phone', label: 'Email', align: 'left' },
    { id: 'website', label: 'Công ty', align: 'left' },
    { id: 'aaa', label: 'Liên hệ công ty', align: 'left' },
    { id: 'abc', label: 'Hành động', align: 'center' },
  ];
  const handleUserCompanyRow = (id) => {

    // console.log(response.status);
   
      const deleteRow = user.filter((row) => row.id !== id);
      
      setUserCompany(deleteRow);
      setOpenAlert(true);
      setSeverity('success');
      setMessageAlert('Duyệt tài khoản thành công!!!');
      onRefresh();
  };
  const handleRejectUserCompanyRow = (id) => {

    // console.log(response.status);
   
      const deleteRow = user.filter((row) => row.id !== id);
      
      setUserCompany(deleteRow);
      setOpenAlert(true);
        setSeverity('success');
        setMessageAlert('Từ chối tham gia công ty thành công!!!');
        onRefresh();
  };
  const handleError = (id) => {

    // console.log(response.status);
   
     
      setOpenAlert(true);
        setSeverity('error');
        setMessageAlert('Đã có lỗi xảy ra');
        onRefresh();
  };
  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };

  return (
  <>
    <Card>
      <Scrollbar>
    <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
    <Table size="medium">
      <TableHeadCustom headLabel={TABLE_HEAD} rowCount={user.length} />

      <TableBody>
        {listUserCompany && listUserCompany.map((data) => 
        <UserCompanyTableRow 
        key={data.id} 
        rows={data} 
        onDeleteRow={() => handleUserCompanyRow(data.id)} 
        onReject={() => handleRejectUserCompanyRow(data.id)} 
        onError={() => handleError(data.id)}/>)}
        </TableBody>
    </Table>
    </TableContainer>
    </Scrollbar>
   
    </Card>
    <Snackbar open={openAlert} autoHideDuration={5000} onClose={handleCloseAlert} anchorOrigin={{ horizontal: 'right', vertical: 'top' }}>
    <Alert onClose={handleCloseAlert} severity={severity} sx={{ width: '100%' }} variant='filled'>
      {messageAlert}
    </Alert>
  </Snackbar>
  </>
  );
}
