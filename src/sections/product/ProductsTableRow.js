import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import ModalImage from 'react-modal-image';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
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
  Stack, Box
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components

import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../components/hook-form';
import Iconify from '../../components/Iconify';

import { TableMoreMenu } from '../../components/table';
import { api } from '../../constants';
// ----------------------------------------------------------------------

ProductsTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onEditRowError: PropTypes.func,
};

export default function ProductsTableRow({ row, selected, onEditRow, onDeleteRow, onEditRowError }) {
  // const { id, name } = row;



  const [openDialogEdit, setOpenDialogEdit] = useState(false);
  const [openMenu, setOpenMenuActions] = useState(null);


  const [openDialogDelete, setOpenDialogDelete] = useState(false);


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


  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Tên bắt buộc'),
    price: Yup.number().required('Giá bắt buộc'),
    quantity: Yup.number().required('Số lượng sản phẩm bắt buộc'),
    image: Yup.mixed().test('required', 'Image is required', (value) => value !== ''),
  });




  const defaultValues = useMemo(
    () => ({
      id: row?.id,
      name: row?.name,
      image: row?.image,
      price: row?.price,
      quantity: row?.quantity,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [row]
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
  const onSubmit = async (data) => {
    formData.append('id', data.id);
    formData.append('name', data.name);
    formData.append('price', data.price);
    formData.append('quantity', data.quantity);
    formData.append('status', 1);
    if (data.image) {
      formData.append('uploadFile', data.image);
    }


    // console.log(data)
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/products/${row.id}`,
      method: 'put',
      headers: {
        //  "Content-Type": "multipart/form-data" 
         'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    },
      data: formData
    })
      .then((response) => {

        // console.log(response)
        handleCloseDialogEdit();
        onEditRow();

      })
      .catch((error) => {
        console.log(error);
        setOpenDialogEdit(false);
        onEditRowError();
      });
  };
  // const onSubmit = () => {




  return (
    <TableRow hover selected={selected}>



      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>

        <Box
          sx={{
            height: 50, width: 50, borderRadius: '16px'
          }}
        >
          <ModalImage style={{ height: 50, width: '100%', objectFit: 'stretch' }} small={`${row.image}?w=16&h=16&fit=crop&auto=format`} large={row.image} />
        </Box>

        <Typography variant="subtitle2" noWrap>
          &nbsp; {row.name}
        </Typography>
      </TableCell>

      <TableCell align="left">{row.price}</TableCell>
      <TableCell align="center">{row.quantity}</TableCell>

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
        <DialogTitle id="alert-dialog-title">Sửa sản phẩm</DialogTitle>
        <DialogContent>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
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
                  Giá sản phẩm
                </Typography>
                <RHFTextField name="price" />

              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" noWrap>
                  Số lượng sản phẩm
                </Typography>
                <RHFTextField name="quantity" />

              </Grid>
            </Grid>
            <Stack direction="row" spacing={5} sx={{ mt: 3 }}>
              <Button variant="contained" color="inherit" onClick={handleCloseDialogEdit}>Huỷ</Button>

              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Lưu
              </LoadingButton>
            </Stack>

          </FormProvider>
        </DialogContent>

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
          <Button color="inherit" onClick={handleCloseDialogDelete} variant="outlined">
            Huỷ
          </Button>
          <Button
            onClick={() => {
              onDeleteRow();
              handleCloseDialogDelete();
            }}
            variant="contained"
            color="primary"
          >
            Xoá
          </Button>
        </DialogActions>
      </Dialog>
    </TableRow>
  );
}
