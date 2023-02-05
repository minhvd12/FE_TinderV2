import PropTypes from 'prop-types';
import { useState } from 'react';

import axios from 'axios';
// @mui
import {
  Grid,
  TextField,
  TableRow,
  TableCell,
  Typography,
  MenuItem,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
// components
import Iconify from '../../components/Iconify';
import { TableMoreMenu } from '../../components/table';
import { api } from '../../constants';
// ----------------------------------------------------------------------

WorkingStyleTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onEditRowError: PropTypes.func,
};

export default function WorkingStyleTableRow({ row, selected, onEditRow,  onDeleteRow, onEditRowError }) {
  // const { id, name } = row;
  const [openDialogEdit, setOpenDialogEdit] = useState(false);
  const [openMenu, setOpenMenuActions] = useState(null);
  const [namess, setName] = useState(row.name);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const handleChange = (event) => {
    setName(event.target.value);
  };
  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };
  const handleCloseDialogEdit = () => {
    setOpenDialogEdit(false);
  };
  const handleCloseDialogDelete = () => {
    setOpenDialogDelete(false);
  };

  const onSubmit = () => {
    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_WORKINGSTYLE}?id=${row.id}`,
      method: 'put',
      headers: {
        //  "Content-Type": "multipart/form-data" 
         'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    },
      data: {
        id: row.id,
        name: namess,
      },
    })
      .then((response) => {
        if (response?.status === 200) {
          handleCloseDialogEdit();
          onEditRow();
          
        }
      })
      .catch((error) => {
        console.log(error);
        
        setOpenDialogEdit(false);
        onEditRowError();
      });
  };
  return (
    <TableRow hover selected={selected}>
      {/* <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell> */}
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle2" noWrap>
          {row.No}
        </Typography>
      </TableCell>
      <TableCell align="left">{row.name}</TableCell>

      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem
                onClick={() => {
                  setOpenDialogEdit(true);

                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:edit-fill'} />
                Sửa thông tin
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setOpenDialogDelete(true);
                  handleCloseMenu();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon={'eva:trash-2-outline'} />
                Xoá
              </MenuItem>
            </>
          }
        />
      </TableCell>
      <Dialog
        open={openDialogEdit}
        onClose={handleCloseDialogEdit}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id="alert-dialog-title">Sửa loại hình công việc</DialogTitle>
        <DialogContent>
          <Grid container spacing={52}>
            <Grid item xs={12}>
              <TextField
                id="outlined-name"
                label="Loại hình công việc"
                value={namess}
                onChange={handleChange}
                fullWidth
                variant="standard"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit" onClick={handleCloseDialogEdit}>Huỷ</Button>
          <Button variant="contained" color="primary" onClick={onSubmit}>Lưu</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDialogDelete}
        onClose={handleCloseDialogDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-title">Bạn có chắc chắn muốn xoá ?</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDialogDelete} variant="outlined" color="inherit"> 
            Huỷ
          </Button>
          <Button
            onClick={() => {
              onDeleteRow();
              handleCloseDialogDelete();
            }}
            variant="contained" color="primary"
          >
            Xoá
          </Button>
        </DialogActions>
      </Dialog>
    </TableRow>
  );
}
