/* eslint-disable consistent-return */
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
// @mui
// import { useTheme } from '@mui/material/styles';
import {
  TableRow,
  TableCell,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,Tooltip
} from '@mui/material';
// components
import Label from '../../components/Label';
import Iconify from '../../components/Iconify';

import { Profile } from '../profile';

// ----------------------------------------------------------------------

UserProfileRow.propTypes = {
  rows: PropTypes.object,
};

export default function UserProfileRow({ rows }) {
  // const theme = useTheme();
  const [openDialogDetail, setOpenDialogDetail] = useState(false);
  const [WorkingStyle, setWorkingStyle] = useState('');
  const [JobPosition, setJobPosition] = useState('');
  const handleCloseDialogDetail = () => {
    setOpenDialogDetail(false);
  };
  useEffect(() => {
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/working-styles/${rows.working_style_id}`,
      method: 'get',
    })
      .then((response) => {
        // console.log(response)
        setWorkingStyle(response.data.data);
      })
      .catch((err) => console.log(err));
  }, [rows.working_style_id]);
  useEffect(() => {
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/job-positions/${rows.job_position_id}`,
      method: 'get',
    })
      .then((response) => {
        // console.log(response)
        setJobPosition(response.data.data);
      })
      .catch((err) => console.log(err));
  }, [rows.job_position_id]);
  
  return (
    <TableRow>
      <TableCell align="center">{dayjs(rows.create_date).format('DD-MM-YYYY')}</TableCell>
      <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
        {rows.job_position.name}
      </TableCell>
      <TableCell align="center">{rows.working_style.name}</TableCell>
      <TableCell align="center"> {(() => {
            if (rows.status === 0) {
              return (
                <Label
                  
                  color={'success'}
                  sx={{ textTransform: 'capitalize' }}
                >
                  Hoạt động
                </Label>
              );
            }
            if (rows.status === 1) {
              return (
                <Label
                 
                  color={'primary'}
                  sx={{ textTransform: 'capitalize' }}
                >
                  Ẩn
                </Label>
              );
            }
            if (rows.status === 2) {
              return (
                <Label
                
                  color={'warning'}
                  sx={{ textTransform: 'capitalize' }}
                >
                  Hết hạn
                </Label>
              );
            }
          })()}</TableCell>
     

      <TableCell align="right">
      <Tooltip title="Xem chi tiết">
        <IconButton
          onClick={() => {
            setOpenDialogDetail(true);
          }}
          color="info"
        >
          <Iconify icon={'carbon:view-filled'} color="success" width={20} height={20} />
        </IconButton>
        </Tooltip>
      </TableCell>
      <Dialog
        open={openDialogDetail}
        onClose={handleCloseDialogDetail}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title">Thông tin hồ sơ</DialogTitle>
        <DialogContent>
          <Profile myProfile={rows} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogDetail} variant="contained">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </TableRow>
  );
}
