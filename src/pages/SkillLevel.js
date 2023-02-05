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
  Alert,LinearProgress
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
// hooks

import useSettings from '../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../hooks/useTable';

// components
import Page from '../components/Page';

import Scrollbar from '../components/Scrollbar';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData } from '../components/table';
// sections
import { SkillLevelTableToolbar, SkillLevelTableRow } from '../sections/skillLevel';
import { api } from '../constants';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Số', align: 'left' },
  { id: 'name', label: 'Nhóm Kỹ năng', align: 'left' },
  { id: 'skillLevel', label: 'Cấp bậc', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function SkillsLevel() {
  const [tableData, setTableData] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
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
    onSelectRow,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  useEffect(() => {
    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_SKILLGROUP}`,
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

  const handleEditRow = () => {
    setOpenAlert(true);
    setSeverity('success');
    setMessageAlert('Chỉnh sửa thành công');
    setRefreshData(!refreshData);
  };
  const handleEditRowError = () => {
    setOpenAlert(true);
    setSeverity('success');
    setMessageAlert('Không có thay đổi mới');
    setRefreshData(!refreshData);
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
    <Page title="Trình độ kỹ năng">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách Trình độ kỹ năng"
          links={[
            { name: 'Trang chủ', href: PATH_DASHBOARD.root },
            { name: 'Kỹ Năng', href: PATH_DASHBOARD.management.skills },
            { name: 'Trình độ kỹ năng' },
          ]}
        />

        <Card>
          <Divider />

          <SkillLevelTableToolbar filterName={filterName} onFilterName={handleFilterName} />
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
                    <SkillLevelTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id)}
                      onEditRow={() => handleEditRow()}
                      onSelectRow={() => onSelectRow(row.id)}
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
