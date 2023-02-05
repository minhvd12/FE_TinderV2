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
  LinearProgress,Tabs,Tab
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
import { CompanyTableToolbar, CompanyTableRow } from '../sections/company';
import { api } from "../constants";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: ''},
  // { id: 'name', label: 'Bài tuyển dụng', align: 'left' },
  { id: 'name', label: 'Tên', align: 'left' },
  { id: 'phone', label: 'Điện thoại', align: 'left' },
  { id: 'website', label: 'Website', align: 'left' },
  { id: 'company_type', label: 'Loại công ty', align: 'left' },
  { id: 'premium', label: 'Gói cước', align: 'center' },
  { id: 'status', label: 'Trạng thái', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function PageThree() {
  const [tableData, setTableData] = useState([]);
  const [severity, setSeverity] = useState('success');
  const [messageAlert, setMessageAlert] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const { currentTab: filterStatus, onChangeTab: onFilterStatus } = useTabs(4);
  const [refreshdata, setRefreshData] = useState(false);
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
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/companies?sort-key=Status&sort-order=DESC`,
      method: 'get',
    })
      .then((response) => {
        setTableData(response.data.data);setLoadingData(false);
        setRefreshData(false)
        // console.log(response.data.data);
      })
      .catch((error) => console.log(error));
  }, [refreshdata]);

  const { themeStretch } = useSettings();

  const [filterName, setFilterName] = useState('');

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRow = (id) => {
  
    const deleteRow = tableData.filter((row) => row.id !== id);
    setSelected([]);
    setTableData(deleteRow);
    setOpenAlert(true);
    setSeverity('success');
    setMessageAlert('Khoá công ty thành công');
    setRefreshData(true)
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus
  });

  const getLengthByStatus = (status) => tableData.filter((item) => item.status === status).length;
  
  const TABS = [
    { value: 4, label: 'Tất cả', color: 'info', count: tableData.length },
   
    { value: 1, label: 'Hoạt động', color: 'success', count: getLengthByStatus(1) },
    { value: 2, label: 'Chờ duyệt', color: 'warning', count: getLengthByStatus(2) },
    { value: 3, label: 'Đang xác thực', color: 'success', count: getLengthByStatus(3) },
    { value: 0, label: 'Ngưng hoạt động', color: 'error', count: getLengthByStatus(0) },
   
  
  ];

  useEffect(() => {
    setPage(0);
  }, [filterStatus]);

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };

  const denseHeight = dense ? 52 : 72;

  const isNotFound = !dataFiltered.length && !!filterName || dataFiltered.length === 0 ;

  return (
    <Page title="Công ty">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách Công ty"
          links={[
            { name: 'Trang chủ', href: PATH_DASHBOARD.general.one },
            { name: 'Công ty', href: PATH_DASHBOARD.applicant.list },
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

          <CompanyTableToolbar filterName={filterName} onFilterName={handleFilterName} />
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
                    <CompanyTableRow
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
      <Snackbar open={openAlert} autoHideDuration={5000} onClose={handleCloseAlert} anchorOrigin={{ horizontal: 'right', vertical: 'top' }}>
        <Alert onClose={handleCloseAlert} severity={severity} sx={{ width: '100%' }} variant='filled'>
          {messageAlert}
        </Alert>
      </Snackbar>
    </Page>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({ tableData, filterName ,filterStatus}) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  // stabilizedThis.sort((a, b) => {
  //   const order = comparator(a[0], b[0]);
  //   if (order !== 0) return order;
  //   return a[1] - b[1];
  // });

  tableData = stabilizedThis.map((el) => el[0]);
  if (filterStatus !== 4) {
    tableData = tableData.filter((item) => item.status === filterStatus);
  }
  if (filterName) {
    tableData = tableData.filter((item) => item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  return tableData;
}
//--------------------------------------------------------------------------
