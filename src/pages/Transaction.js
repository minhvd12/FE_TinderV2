import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
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
 LinearProgress,
 Tabs, Tab, Typography, Stack
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
import Iconify from '../components/Iconify';
import Scrollbar from '../components/Scrollbar';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData } from '../components/table';
// sections
import { TransTableRow, TransTableToolbar } from '../sections/transaction';
import { api } from '../constants';


// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'date', label: 'Thời gian', align: 'left' },
    { id: 'create by', label: 'Người tạo', align: 'left' },
    { id: 'type', label: 'Loại giao dịch', align: 'left' },
    { id: 'số đồng', label: 'Tagent coin', align: 'left' },
    
    { id: '' },
  ];

// ----------------------------------------------------------------------

export default function Transaction() {
  
  const [tableData, setTableData] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const { currentTab: filterStatus, onChangeTab: onFilterStatus } = useTabs(3);
  const [filterStartDate, setFilterStartDate] = useState(null);
  const [refeshdata, setrefeshdata] = useState(false);
  const [filterEndDate, setFilterEndDate] = useState(null);
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,

    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const [accountBalance, setAccountBalance] = useState('');
  useEffect(() => {
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/transactions/system`,
      method: 'get',
    })
      .then((response) => {
        setAccountBalance(response.data.data.total_of_system);
        
        // console.log(response.data.data.total_of_system);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (filterStartDate === null || filterEndDate === null){
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/transactions`,
      method: 'get',
    })
      .then((response) => {
        setTableData(response.data.data);
        setLoadingData(false);
        setrefeshdata(false)
        // console.log(response.data.data);
      })
      .catch((error) => console.log(error));
    } 
    if (filterStartDate !== null && filterEndDate !== null) {
      
      axios({
        url: `https://stg-api-itjob.unicode.edu.vn/api/v1/transactions?fromDate=${dayjs(filterStartDate).format('YYYY-MM-DD')}&toDate=${dayjs(filterEndDate).add(1, 'day').format('YYYY-MM-DD')}`,
        method: 'get',
      })
        .then((response) => {
        
          console.log(response);
          if(response.status === 204){
            setTableData([]);
            setLoadingData(false);
            setrefeshdata(false)
          }
          if(response.status === 200){
            setTableData(response.data.data);
            setLoadingData(false);
            setrefeshdata(false)
          }
          
        })
        .catch((error) => console.log(error));
    }
            
  }, [refeshdata]);
// console.log(dayjs(filterStartDate).format('YYYY-MM-DD'))
// console.log(dayjs(filterEndDate).format('YYYY-MM-DD'))
  const { themeStretch } = useSettings();

  const TABS = [
    { value: 3, label: 'Tất cả', color: 'info'  },
    { value: 1, label: 'Nâng cấp premium', color: 'success'},
    { value: 2, label: 'Tạo bài tuyển dụng', color: 'warning'},
    { value: 0, label: 'Nạp tiền', color: 'error' },
    { value: 4, label: 'Đổi thưởng', color: 'error'},
    { value: 5, label: 'Hoàn tiền' },
    { value: 6, label: 'Nạp tiền bài tuyển dụng' }
  ];

  useEffect(() => {
    setPage(0);
  }, [filterStatus]);
 

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterStatus,
  });


  const denseHeight = dense ? 52 : 72;

  const isNotFound =
  (!dataFiltered.length && !!filterStatus) ||
  (!dataFiltered.length && !!filterEndDate) ||
  (!dataFiltered.length && !!filterStartDate) || tableData === undefined ;

  return (
    <Page title="Giao dịch">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Giao dịch"
          links={[
            { name: 'Trang chủ', href: PATH_DASHBOARD.root },
            { name: 'Giao dịch', href: PATH_DASHBOARD.general.transactions },
          ]}
         action={
          <Typography variant="subtitle2" noWrap >
            Ví hệ thống: {<Label color='success'> {accountBalance} </Label>} Tagent Coin
          </Typography>
          
         }
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
              
                label={tab.label}
              />
            ))}
          </Tabs>
          <Divider />
          <TransTableToolbar    
          filterStartDate={filterStartDate}
            filterEndDate={filterEndDate}  
            onFilterStartDate={(newValue) => {
              setFilterStartDate(newValue);
            }}
            onFilterEndDate={(newValue) => {
              setFilterEndDate(newValue);
            }} 
            onReset={() => {
              setTableData([]);
              setrefeshdata(true);
              setLoadingData(true);
            }} 
            onClear={() => {

              setFilterStartDate(null);
              setFilterEndDate(null);
              setLoadingData(true);
              setrefeshdata(true);
            }} 
            />
         
        
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
                    <TransTableRow
                      key={row.id}
                      row={row}   
                      // onLoading={() => setLoadingData(true)}
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
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
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
     
    </Page>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({ tableData, comparator , filterStatus }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterStatus === 0) {
    tableData = tableData.filter((item) => item.type_of_transaction === 'Money recharge');
  }
  if (filterStatus === 1) {
    tableData = tableData.filter((item) => item.type_of_transaction === 'Upgrade');
  }
  if (filterStatus === 2) {
    tableData = tableData.filter((item) => item.type_of_transaction === 'Top up for job post');
  }
  if (filterStatus === 4) {
    tableData = tableData.filter((item) => item.type_of_transaction === 'Reward exchange');
  }
  if (filterStatus === 5) {
    tableData = tableData.filter((item) => item.type_of_transaction === 'Return money');
  }
  if (filterStatus === 6) {
    tableData = tableData.filter((item) => item.type_of_transaction === 'Create job post');
  }
 
  return tableData;
}
