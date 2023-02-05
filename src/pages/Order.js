import { useEffect, useState } from 'react';
import {useNavigate, Link as RouterLink } from 'react-router-dom';
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
LinearProgress
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
import {  OrderTableRow } from '../sections/order';
import { api } from '../constants';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Số', align: 'left' },
  { id: 'name', label: 'Người đổi', align: 'left' },
  { id: 'product', label: 'Sản phẩm', align: 'left' },
  { id: 'time', label: 'Thời gian', align: 'left' },
  { id: '' }];

// ----------------------------------------------------------------------

export default function Order() {
  const [tableData, setTableData] = useState([]);
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
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/transactions?typeOfTransaction=Reward%20exchange`,
      method: 'get',
    })
      .then((response) => {
        setTableData(response.data.data);setLoadingData(false);
        // console.log(response.data.data);
      })
      .catch((error) => console.log(error));
  }, []);

  const { themeStretch } = useSettings();


 
  const dataFiltereds = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
   
  });

  const dataFiltered = dataFiltereds.map((user, i)=> ({ 'No': i + 1, ...user }))

  const denseHeight = dense ? 52 : 72;

  const isNotFound = !dataFiltered.length 

  return (
    <Page title="Danh sách đổi thưởng">
      <Container maxWidth={themeStretch ? false : 'lg'}>
      <HeaderBreadcrumbs
          heading="Danh sách đổi thưởng"
          links={[
            { name: 'Trang chủ', href: PATH_DASHBOARD.root },
            { name: 'Sản Phẩm', href: PATH_DASHBOARD.general.product },
            { name: 'Danh sách đổi thưởng', href: PATH_DASHBOARD.general.orders },
          ]}
        
        />
        <Card>
          <Divider />

         
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
                    <OrderTableRow
                      key={row.id}
                      row={row}
                    
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
     
    </Page>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({ tableData, comparator }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);


  return tableData;
}
