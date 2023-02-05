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
  MenuItem,
  InputLabel,
  FormControl,LinearProgress
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
import { SkillsTableToolbar, SkillsTableRow } from '../sections/skills';
import { api } from '../constants';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Số', align: 'left' },
  { id: 'name', label: 'Kỹ năng', align: 'left' },
  { id: 'skillGroup', label: 'Nhóm kỹ năng', align: 'left' },
  { id: '' }];

// ----------------------------------------------------------------------

export default function Skills() {
  const [tableData, setTableData] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [names, setName] = useState('');
  const [skillgroupids, setSkillGroupIds] = useState('');
  const [severity, setSeverity] = useState('success');
  const [messageAlert, setMessageAlert] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const [listskilGroup, setlistskilGroup] = useState([]);
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
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_SKILL}`,
      method: 'get',
    })
      .then((response) => {
        setTableData(response.data.data);setLoadingData(false);
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
  useEffect(() => {
    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_SKILLGROUP}`,
      method: 'get',
    })
      .then((response) => {
        setlistskilGroup(response.data.data);
        // console.log(response.data.data);

      })
      .catch((error) => console.log(error));
  }, []);
  const handleDeleteRow = (id) => {
    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_SKILL}/${id}`,
      headers: {
        //  "Content-Type": "multipart/form-data" 
         'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    },
      method: 'delete',
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
        setMessageAlert('Kỹ năng này không tồn tại');
        } else {
          console.log(error);
          setOpenAlert(true);
          setSeverity('error');
          setMessageAlert('Kỹ năng này đang được sử dụng không thể xoá');
        }
      });
  };
  const onSubmit = () => {
    if (names.length > 0 && skillgroupids.length > 0) {
      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_SKILL}`,
        method: 'post',
        headers: {
          //  "Content-Type": "multipart/form-data" 
           'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
        data: {
          name: names,
          skill_group_id: skillgroupids
        },
      })
        .then((response) => {
          if (response?.status === 201) {
            // console.log(response);
            handleCloseDialog();
            setName('');
            setSkillGroupIds('');
            setRefreshData(!refreshData);
            setOpenAlert(true);
            setSeverity('success');
            setMessageAlert('Tạo thành công');
          }
        })
        .catch((error) => {
          console.log(error);
          setName('');
          setSkillGroupIds('');
          setOpenAlert(true);
          setSeverity('error');
          setMessageAlert('Tạo thất bại');
        });
    } else {
      setOpenAlert(true);
      setSeverity('error');
      setMessageAlert('Vui lòng điền đầy đủ');
    };
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
    setMessageAlert('Chỉnh sửa thất bại');
    setRefreshData(!refreshData);
  };
  const handleChange = (event) => {
    setName(event.target.value);
  };
  const handleChangeSkillGroup = (event) => {
    setSkillGroupIds(event.target.value);

  };
  const handleCloseDialog = () => {
    setName('');
    setSkillGroupIds('');
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
    <Page title="Nhóm kỹ năng">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách nhóm kỹ năng"
          links={[
            { name: 'Trang chủ', href: PATH_DASHBOARD.root },
            { name: 'Kỹ Năng', href: PATH_DASHBOARD.management.skills },
            { name: 'Kỹ năng' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to="#"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => {
                setOpenDialog(true);
              }}
            >
              Tạo kỹ năng
            </Button>
          }
        />

        <Card>
          <Divider />

          <SkillsTableToolbar filterName={filterName} onFilterName={handleFilterName} />
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
                // onSelectAllRows={(checked) =>
                //   onSelectAllRows(
                //     checked,
                //     tableData.map((row) => row.id)
                //   )
                // }
                />

                <TableBody>
                  {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <SkillsTableRow
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

            <FormControlLabel
              control={<Switch checked={dense} onChange={onChangeDense} />}
              label="Thu nhỏ"
              sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
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
        <DialogTitle id="alert-dialog-title" sx={{ position: 'relative' }} >Tạo kỹ năng</DialogTitle>
        <DialogContent>

          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography >
                Tên kỹ năng
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                id="outlined-name"
                label="Kỹ năng"
                value={names}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography >
                Nhóm kỹ năng
              </Typography>
            </Grid>
            <Grid item xs={12}>

              <FormControl fullWidth required>
                <InputLabel id="demo-simple-select-required-label">Nhóm kỹ năng</InputLabel>
                <Select
                  labelId="demo-simple-select-required-label"
                  id="demo-simple-select-required"
                  value={skillgroupids}
                  label="Nhóm kỹ năng"
                  onChange={handleChangeSkillGroup}
                >
                  {listskilGroup.map((el) => (
                    <MenuItem key={el.id} value={el.id}>
                      {el.name}
                    </MenuItem>
                  ))}
                </Select>

              </FormControl>
              {/* <Select
                
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Nhóm kỹ năng"
                value={skillgroupids}
                onChange={handleChangeSkillGroup}
              >
                {listskilGroup.map((el) => (
                  <MenuItem key={el.id} value={el.id}>
                    {el.name}
                  </MenuItem>
                ))}
              </Select> */}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit" onClick={handleCloseDialog}>Huỷ</Button>
          <Button variant="contained" color="primary" disabled={names.length === 0 || skillgroupids.length ===0} onClick={onSubmit}>Tạo</Button>
        </DialogActions>
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
