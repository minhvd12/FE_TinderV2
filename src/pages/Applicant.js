import { useEffect, useState } from 'react';

import axios from 'axios';
// @mui
import {
  Box,
  Card,
  Table,
  Switch,
  Divider,
  TableBody,
  Container,
  TableContainer,
  TablePagination,
  FormControlLabel,
  Snackbar,
  Alert,
  LinearProgress,
  Tabs,
  Tab,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
// hooks
import useTabs from '../hooks/useTabs';
import useSettings from '../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../hooks/useTable';

// components
import Label from '../components/Label';
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData } from '../components/table';
// sections
import { UserTableToolbar, UserTableRow } from '../sections/applicant';
import { api } from '../constants';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: '' },
  { id: 'name', label: 'Tên', align: 'left' },
  { id: 'phone', label: 'Điện thoại', align: 'left' },
  { id: 'dob', label: 'Ngày sinh', align: 'left' },
  { id: 'email', label: 'email', align: 'left' },
  { id: 'gender', label: 'Giới tính', align: 'center' },
  { id: 'status', label: 'Trạng thái', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function PageTwo() {
  const [tableData, setTableData] = useState([]);
  const [severity, setSeverity] = useState('success');
  const [messageAlert, setMessageAlert] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  // const [loadingButton, setLoadingButton] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [refreshdata, setRefreshData] = useState(false);
  const { currentTab: filterStatus, onChangeTab: onFilterStatus } = useTabs(3);
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
    // setLoadingButton(true)
    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_APPLICANT}`,
      method: 'get',
    })
      .then((response) => {
        setLoadingData(false);
        setTableData(response.data.data);
        setRefreshData(false)
      })
      .catch((error) => {
        console.log(error);
      });
  }, [refreshdata]);

  useEffect(() => {
    setPage(0);
  }, [filterStatus]);
  console.log(filterStatus)
  console.log(onFilterStatus)
  const { themeStretch } = useSettings();

  const [filterName, setFilterName] = useState('');

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRow = (id) => {
    const deleteRow = tableData.filter((row) => row.id !== id);
    setTableData(deleteRow);
    setOpenAlert(true);
    setSeverity('success');
    setMessageAlert('Khoá ứng viên thành công');
    setRefreshData(true)
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });
  const getLengthByStatus = (status) => tableData.filter((item) => item.status === status).length;

  const TABS = [
    { value: 3, label: 'Tất cả', color: 'info', count: tableData.length },
    { value: 1, label: 'Hoạt động', color: 'success', count: getLengthByStatus(1) },
    { value: 2, label: 'Đang xác thực', color: 'warning', count: getLengthByStatus(2) },
    { value: 0, label: 'Ngưng hoạt động', color: 'error', count: getLengthByStatus(0) },
  ];

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };

  const denseHeight = dense ? 52 : 72;

  const isNotFound = !dataFiltered.length && !!filterName || dataFiltered.length === 0 ;

  return (
    <Page title="Ứng viên">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách ứng viên"
          links={[
            { name: 'Trang chủ', href: PATH_DASHBOARD.general.one },
            { name: 'Ứng viên', href: PATH_DASHBOARD.applicant.list },
          ]}
        />

        <Card>
          <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={filterStatus}
            onChange={onFilterStatus}
            sx={{ px: 2, bgcolor: 'background.neutral' }}
          >
            {TABS.map((tab) => (
              <Tab
                disableRipple
                key={tab.value}
                value={tab.value}
                icon={<Label color={tab.color}> {tab.count} </Label>}
                label={tab.label}
              />
            ))}
          </Tabs>
          <Divider />

          <UserTableToolbar filterName={filterName} onFilterName={handleFilterName} />
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
                      <UserTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
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
              labelRowsPerPage={'Số hàng mỗi trang'}
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

function applySortFilter({ tableData, comparator, filterName, filterStatus }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  // stabilizedThis.sort((a, b) => {
  //   const order = comparator(a[0], b[0]);
  //   if (order !== 0) return order;
  //   return a[1] - b[1];
  // });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterStatus !== 3) {
    tableData = tableData.filter((item) => item.status === filterStatus);
  }

  if (filterName) {
    tableData = tableData.filter((item) => item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  return tableData;
}
//--------------------------------------------------------------------------
