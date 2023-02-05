import { useEffect, useState, useMemo, useCallback } from 'react';
import * as Yup from 'yup';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import ModalImage from 'react-modal-image';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
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
  FormControlLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Snackbar,
  Alert,
  Typography,
  Select,
  Stack,
  InputLabel,
  FormControl, LinearProgress, TableHead, TableRow, TableCell
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
// hooks

import useSettings from '../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../hooks/useTable';

// components
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../components/hook-form';

import Page from '../components/Page';
import Iconify from '../components/Iconify';
import Scrollbar from '../components/Scrollbar';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData } from '../components/table';
// sections
import { ProductsTableToolbar, ProductsTableRow } from '../sections/product';
import { api } from '../constants';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  //   { id: 'id', label: 'Số', align: 'left' },
  { id: 'name', label: 'Sản phẩm', align: 'left' },
  { id: 'price', label: 'Giá(đồng)', align: 'left' },
  { id: 'quantity', label: 'Số lượng', align: 'center' },
  { id: '' }];

// ----------------------------------------------------------------------

export default function Product() {
  const [tableData, setTableData] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  // const [openDialogOrder, setOpenDialogOrder] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [messageAlert, setMessageAlert] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const navigate = useNavigate();
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


  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Tên sản phẩm bắt buộc').max(100,'Tối đa 100 kí tự'),
    price: Yup.number().required('Giá bắt buộc'),
    quantity: Yup.number().required('Số lượng sản phẩm bắt buộc'),
    image: Yup.mixed().test('required', 'Hình ảnh bắt buộc', (value) => value !== ''),
  });

  


  const defaultValues = useMemo(
    () => ({  
      name: '',
      image: '',
      price: '',
      quantity: '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps

  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;



  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'image',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );
  const formData = new FormData();
  const onSubmitCreate = (data) => {

    formData.append('id', data.id);
    formData.append('name', data.name);
    formData.append('price', data.price);
    formData.append('quantity', data.quantity);
    formData.append('status', 1);
    if(data.image){
    formData.append('uploadFile', data.image);
    }
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/products`,
      method: 'post',
      headers: {
        //  "Content-Type": "multipart/form-data" 
         'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    },
      data: formData
    })
      .then((response) => {

        // console.log(response)
        handleCloseDialog();

        setRefreshData(!refreshData);
        setOpenAlert(true);
        setSeverity('success');
        setMessageAlert('Tạo sản phẩm thành công');
        reset()
      })
      .catch((error) => {
        console.log(error);
        setOpenAlert(true);
        setSeverity('error');
        setMessageAlert('Tạo thất bại đã xảy ra lỗi');
        reset()
      });
  };

  useEffect(() => {
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/products?status=1`,
      method: 'get',
    })
      .then((response) => {
        setTableData(response.data.data); setLoadingData(false);
        // console.log(response.data.data);
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
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/products/${id}`,
      method: 'delete',
      headers: {
        //  "Content-Type": "multipart/form-data" 
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
          setMessageAlert('Xoá sản phẩm thành công');
        }
      })
      .catch((error) => {
        console.log(error);
        setOpenAlert(true);
        setSeverity('error');
        setMessageAlert('Sản phẩm không tồn tại');
      });
  };
  
  const handleEditRow = () => {
    setOpenAlert(true);
    setSeverity('success');
    setMessageAlert('Chỉnh sửa sản phẩm thành công');
    setRefreshData(!refreshData);
  };
  const handleEditRowError = () => {
    setOpenAlert(true);
    setSeverity('error');
    setMessageAlert('Chỉnh sửa sản phẩm thất bại');
    setRefreshData(!refreshData);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    reset()
  };
  
  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };
  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  //   const dataFiltered = dataFiltereds.map((user, i)=> ({ 'No': i + 1, ...user }))

  const denseHeight = dense ? 52 : 72;

  const isNotFound = !dataFiltered.length && !!filterName;

  return (
    <Page title="Sản phẩm">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách sản phẩm"
          links={[
            { name: 'Trang chủ', href: PATH_DASHBOARD.root },
            { name: 'Sản phẩm', href: PATH_DASHBOARD.general.product },

          ]}
          action={
            <>
            <Stack spacing={2} direction="row">
            <Button
              variant="contained"
              component={RouterLink}
              to="#"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => {
                setOpenDialog(true);
              }}
            >
              Tạo sản phẩm
            </Button>

            <Button
            
              variant="contained"
              // component={RouterLink}
              to="#"
              // startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => {
                navigate(PATH_DASHBOARD.general.orders)
              }}
            >
              Lịch sử đổi quà
            </Button>
            </Stack>
            </>
          }
        />

        <Card>
          <Divider />

          <ProductsTableToolbar filterName={filterName} onFilterName={handleFilterName} />
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
                      <ProductsTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onEditRow={() => handleEditRow()}
                        onSelectRow={() => onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRowError={() => handleEditRowError()}
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
        <DialogTitle id="alert-dialog-title" sx={{ position: 'relative' }} >Tạo sản phẩm</DialogTitle>
        <DialogContent>

          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitCreate)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ mb: 5 }}>
                  <RHFUploadAvatar
                    name="image"

                    onDrop={handleDrop}
                    helperText={
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 2,
                          mx: 'auto',
                          display: 'block',
                          textAlign: 'center',
                          color: 'text.secondary',
                        }}
                      >
                        Hình ảnh sản phẩm
                      </Typography>

                    }
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" noWrap>
                  Tên sản phẩm
                </Typography>
                <RHFTextField name="name" />
              
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" noWrap>
                  Giá sản phẩm(Đồng)
                </Typography>
                <RHFTextField name="price" type="number"/>
              
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" noWrap>
                  Số lượng sản phẩm
                </Typography>
                <RHFTextField name="quantity" type="number"/>
               
              </Grid>
            </Grid>
            <Stack direction="row" spacing={5} sx={{ mt: 3 }}>
              <Button variant="contained" color="inherit" onClick={handleCloseDialog}>Huỷ</Button>

              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Tạo
              </LoadingButton>
            </Stack>

          </FormProvider>
        </DialogContent>

      </Dialog>
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
