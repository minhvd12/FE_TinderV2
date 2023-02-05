
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
// @mui
import {
  Box,
  Card,
  Table,
  Switch,
  Button,
  Divider,
  TableBody,
  Container,
  TextField,
  TableContainer,
  TablePagination,
  FormControlLabel,Dialog, DialogActions, DialogContent, DialogTitle,Grid,Snackbar,Alert,LinearProgress
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
// hooks

import useSettings from '../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../hooks/useTable';

// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import Scrollbar from '../components/Scrollbar';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData } from '../components/table';
// sections
import { JobPositionTableToolbar, JobPositionTableRow } from '../sections/jobPosition';
import { api } from "../constants";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'No', label: 'Số', align: 'left' },
  { id: 'name', label: 'Tên', align: 'left' },
 
  { id: '' },
];

// ----------------------------------------------------------------------

export default function PageFour() {
  const [tableData, setTableData] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [names, setName] = useState('');
  const [severity, setSeverity] = useState('success');
  const [messageAlert, setMessageAlert] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  useEffect(() => {
    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_JOBPOSITION}`,
      method: 'get',
    })
      .then((response) => {
        setTableData(response.data.data);
        setLoadingData(false);
      })
      .catch((error) => console.log(error));
  }, [refreshData]);

  const { themeStretch } = useSettings();

  const [filterName, setFilterName] = useState('');

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRow = (id) => {
    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_JOBPOSITION}/${id}`,
      method: 'delete',
      headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
    })
      .then((response) => {
        if (response?.status === 204) {
          const deleteRow = tableData.filter((row) => row.id !== id);
          setSelected([]);
          setTableData(deleteRow);
          setOpenAlert(true);
          setSeverity('success');
          setMessageAlert('Xoá thành công');
        }
      })
      .catch((error) => {
        if (error?.message === 'Please enter the correct information!!! ') {
          console.log(error);
        setOpenAlert(true);
        setSeverity('error');
        setMessageAlert('Vị trí công việc này không tồn tại');
        } else {
          console.log(error);
          setOpenAlert(true);
          setSeverity('error');
          setMessageAlert('Vị trí công việc này đang được sử dụng không thể xoá');
        }
      } 
      );
  };
  const onSubmit = () => {

    
      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_JOBPOSITION}`,
        method: 'post',
        headers: {
          //  "Content-Type": "multipart/form-data" 
           'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
        data: {
          name: names,
        }
      }).then((response) => {
        if (response?.status === 201) {
        // console.log(response);
        handleCloseDialog();
        setName('');
        setRefreshData(!refreshData);
        setOpenAlert(true);
          setSeverity('success');
          setMessageAlert('Tạo thành công');
        }
        
      }).catch(error => {
        console.log(error);
        setName('');
        setOpenAlert(true);
        setSeverity('error');
        setMessageAlert('Vị trí công việc này không tồn tại');

      });


  };

  const handleEditRow = () => {
    setOpenAlert(true);
          setSeverity('success');
          setMessageAlert('Chỉnh sửa thành công');
    setRefreshData(!refreshData);
  }; 
  const handleEditRowError = () => {
    setOpenAlert(true);
          setSeverity('error');
          setMessageAlert('Vị trí công việc này không tồn tại');
    setRefreshData(!refreshData);
  };
  const handleChange = (event) => {
    setName(event.target.value);
  };
  const handleCloseDialog = () => {
    // setName('') ;
    setOpenDialog(false);
  };
  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };
  const dataFiltereds = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,

  });
  const dataFiltered = dataFiltereds.map((user, i)=> ({ 'No': i + 1, ...user }))

  const denseHeight = dense ? 52 : 72;

  const isNotFound = !dataFiltered.length && !!filterName;
  
  return (
    <Page title="Vị trí công việc">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách vị trí công việc"
          links={[
            { name: 'Trang chủ', href: PATH_DASHBOARD.root },
            { name: 'Công việc', href: PATH_DASHBOARD.management.jobposition },
            { name: 'Vị trí công việc' },
          ]}
          action={
            <Button variant="contained" component={RouterLink} to="#" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => {
            
              setOpenDialog(true);
            }}>
              Tạo vị trí công việc
            </Button>
          }
        />

        <Card>
          <Divider />

          <JobPositionTableToolbar filterName={filterName} onFilterName={handleFilterName} />
          {loadingData ? (
            <LinearProgress fullwidth="true" />
          ) : (
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              

              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  
                 
                />

                <TableBody>
                  {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <JobPositionTableRow
                      key={row.id}
                      
                      row={row}
                      selected={selected.includes(row.id)}
                      onEditRow={() => handleEditRow()}
                      onSelectRow={() => onSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      onEditRowError={() => handleEditRowError()}
                      enableRowNumbers
                    />
                  ))}

                  <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
 )}
          <Box sx={{ position: 'relative' }}>
            <TablePagination
            labelRowsPerPage={"Số hàng mỗi trang"}
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} trong ${count} `}
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={dataFiltered.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />

         
          </Box>
        </Card>
      </Container>
      <Dialog
    open={openDialog}
    onClose={handleCloseDialog}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    fullWidth
    maxWidth="xs"
    >
    <DialogTitle id="alert-dialog-title">
      Tạo vị trí công việc
    </DialogTitle>
    <DialogContent>
      <Grid container spacing={52}>
      
         <Grid item xs={12}>
         <TextField
  id="outlined-name"
  label="Vị trí công việc"
  value={names}
  onChange={handleChange}
  fullWidth
            variant="standard"
/>
        </Grid>
        
      </Grid>
    </DialogContent>
    <DialogActions>
    
          <Button variant="contained" color="inherit" onClick={handleCloseDialog}>Huỷ</Button>
          <Button variant="contained" color="primary" onClick={onSubmit} >Tạo</Button>
    </DialogActions>
    </Dialog>
    <Snackbar open={openAlert} autoHideDuration={5000} onClose={handleCloseAlert} anchorOrigin={{ horizontal: 'right', vertical: 'top' }}>
        <Alert onClose={handleCloseAlert} severity={severity} sx={{ width: '100%' }} variant='filled'>
          {messageAlert}
        </Alert>
      </Snackbar>
    </Page>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({ tableData, comparator, filterName }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter((item) => item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  return tableData;
}