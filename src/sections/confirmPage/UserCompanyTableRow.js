/* eslint-disable consistent-return */
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import axios from 'axios';
// @mui
import {
  TableRow,
  TableCell,
  Tooltip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  Snackbar,
  Alert,

} from '@mui/material';
import ModalImage from 'react-modal-image';
// components

import Iconify from '../../components/Iconify';
import { api } from '../../constants';

// ----------------------------------------------------------------------

UserCompanyTableRow.propTypes = {
  rows: PropTypes.object,
  onDeleteRow: PropTypes.func,
  onReject: PropTypes.func,
  onError: PropTypes.func,
};

export default function UserCompanyTableRow({ rows, onDeleteRow, onReject, onError }) {
  const [openDialogAccept, setOpenDialogAccept] = useState(false);
  const [openDialogReject, setOpenDialogReject] = useState(false);
  const [company, setCompany] = useState('');
  const handleCloseDialogAccept = () => {
    setOpenDialogAccept(false);
  };
  const handleCloseDialogReject = () => {
    setOpenDialogReject(false);
  };

// console.log(rows)
  useEffect(() => {
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/companies/${rows.company_id}`,
      method: 'get',
    })
      .then((response) => {
        setCompany(response.data.data);
        // console.log(response.data.data);
      })
      .catch((error) => console.log(error));
  }, []);
  // console.log(rows)
  const handleAccept = () => {

    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/emails/accept/join?email=${rows.email}`,
      method: 'get',
    })
      .then((response) => {
     
        onDeleteRow();
      })
      .catch((error) => {
        onError();
        console.log(error);

      });


  };

  const handleReject = () => {
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/emails/reject/join?email=${rows.email}`,
      method: 'get',
    })
      .then((response) => {
      
        onReject();
      }).catch(error => {
      console.log(error);
      onError()

    });
  };

  return (
    <>
      <TableRow>
        <TableCell align="left">{rows.phone}</TableCell>
        <TableCell align="left">{rows.email}</TableCell>
        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {company.name}
        </TableCell>
        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {company.phone}
        </TableCell>


        <TableCell align="right">
          <Tooltip title="Duyệt">
            <IconButton
              onClick={() => {
                setOpenDialogAccept(true);
              }}
              color="info"
            >
              <Iconify icon={'line-md:circle-twotone-to-confirm-circle-twotone-transition'} color={'lawngreen'} width={20} height={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Từ chối">
            <IconButton
              onClick={() => {
                setOpenDialogReject(true);
              }}
              color="info"
            >
              <Iconify icon={'bx:block'} color="#EE4B2B" width={20} height={20} />
            </IconButton>
          </Tooltip>
        </TableCell>

      </TableRow>
      <Dialog
        open={openDialogAccept}
        onClose={handleCloseDialogAccept}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id="alert-dialog-title"> Xác nhận duyệt</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDialogAccept} variant="outlined" color="inherit">
            Huỷ
          </Button>
          <Button
            onClick={() => {

              handleAccept();
              handleCloseDialogAccept();
            }}
            variant="contained"
            color="primary"
          >
            Duyệt
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDialogReject}
        onClose={handleCloseDialogReject}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id="alert-dialog-title"> Xác nhận từ chối</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDialogReject} variant="outlined" color="inherit">
            Huỷ
          </Button>
          <Button
            onClick={() => {

              handleReject();
              handleCloseDialogReject();
            }}
            variant="contained"
            color="primary"
          >
            Từ chối
          </Button>
        </DialogActions>
      </Dialog>

    </>
  );
}
