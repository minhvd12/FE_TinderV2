
import '../../utils/style.css';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import {
  TextField,
  Link,
  Card,
  Stack,
  Avatar,
  Typography,
  CardHeader,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Box,
  DialogActions,
  Button,
  Snackbar, ImageList, ImageListItem,
  Alert, Tooltip
} from '@mui/material';
import ModalImage from 'react-modal-image';
// components
import Iconify from '../../components/Iconify';

import { ProfileApplicant } from '../profileApplicant';



// ----------------------------------------------------------------------

ConfirmApplicantCard.propTypes = {
  applicant: PropTypes.object,
  onDeleteRow: PropTypes.func,
  onErrorRow: PropTypes.func,
  onRejectRow: PropTypes.func,
};

export default function ConfirmApplicantCard({ applicant, onDeleteRow, onErrorRow,onRejectRow }) {
  const [openDialogDetail, setOpenDialogDetail] = useState(false);
  const [listProfileApplicant, setListProfileApplicant] = useState([]);
  const [listImageApplicant, setListImageApplicant] = useState([]);
  const [openDialogAccept, setOpenDialogAccept] = useState(false);
  const [openDialogReject, setOpenDialogReject] = useState(false);
  const handleCloseDialogDetail = () => {
    setOpenDialogDetail(false);
  };
  const handleCloseDialogAccept = () => {
    setOpenDialogAccept(false);
  };
  const handleCloseDialogReject = () => {
    setOpenDialogReject(false);
  };
  useEffect(() => {
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/profile-applicants?page-size=50&applicantId=${applicant.id}`,
      method: 'get',
    })
      .then((response) => {
        setListProfileApplicant(response.data.data);
        // console.log(response.data.data);
      })
      .catch((error) => console.log(error));
  }, [applicant.id]);
  useEffect(() => {
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/album-images?page-size=50&applicantId=${applicant.id}`,
      method: 'get',
    })
      .then((response) => {
        setListImageApplicant(response.data.data);
        // console.log(response.data.data);
      })
      .catch((error) => console.log(error));
  }, [applicant.id]);
  const handleAccept = () => {
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/applicants/update?id=${applicant.id}`,
      method: 'put',    
      headers: {
        //  "Content-Type": "multipart/form-data" 
         'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    },  
      data: {
        id: applicant.id,
        earn_money: 1,
      }
    }).then((response) => {
      // console.log(response);
      if (response?.status === 200) {
        onDeleteRow();
     
      }
    }).catch(error => {
      onErrorRow();
      console.log(error);
    });
  };
  const handleReject = () => {
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/applicants/update?id=${applicant.id}`,
      method: 'put',      
      headers: {
        //  "Content-Type": "multipart/form-data" 
         'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }, 
      data: {
        id: applicant.id,
        earn_money: 0,
      }
    }).then((response) => {
      if (response?.status === 200) {
        onRejectRow();
      }
    }).catch(error => {
      onErrorRow();
      console.log(error);
     
    });
  };
  return (
    <>
    <Card>
      <CardHeader
        // disableTypography
        avatar={
          <Avatar
            alt={applicant.name}
            src={applicant.avatar}
            sx={{
              width: 120,
              height: 120,
              zIndex: 11,
              mx: 'auto',
              position: 'relative',
            }}
          />
        }
        title={
          <Link to="#" variant="h5" color="text.primary" component={RouterLink}>
            {applicant.name}
          </Link>
        }
        action={
          <Tooltip title="Xem chi tiết">
            <IconButton
              onClick={() => {
                setOpenDialogDetail(true);
              }}
              color="info"
            >
              <Iconify icon={'carbon:view-filled'} color="success" width={40} height={40} />
            </IconButton>
          </Tooltip>
        }
      />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'grid',
            columnGap: 2,
            rowGap: 3,
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
          }}
        >
          <TextField
            InputProps={{
              readOnly: true,
            }}
            name="email"
            value={applicant.email}
            label="Email"
          />
          <TextField
            InputProps={{
              readOnly: true,
            }}
            name="phoneNumber"
            value={applicant.phone}
            label="Số điện thoại"
          />

          <TextField
            InputProps={{
              readOnly: true,
            }}
            name="dob"
            value={dayjs(applicant.dob).format('DD/MM/YYYY')}
            label="Ngày sinh"
          />

          <TextField
            InputProps={{
              readOnly: true,
            }}
            name="gender"
            value={applicant.gender === 0 ? 'Nữ' : 'Nam'}
            label="Giới tính"
          />
        </Box>
        <TextField
          InputProps={{
            readOnly: true,
          }}
          name="address"
          value={applicant.address}
          label="Địa chỉ"
        />
        <Typography>CMND/CCCD</Typography>
        <Box
          sx={{
            display: 'grid',
            columnGap: 2,

            // gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
          }}
        >
          <ImageList variant="quilted" cols={2} gap={8}>
            {listImageApplicant &&
              listImageApplicant.map((item) => (
                <ImageListItem key={item.id}>
                  {item.url_image &&


                    <ModalImage
                      small={`${item.url_image}?w=164&h=164&fit=crop&auto=format`} medium={item.url_image} className="modal-image"
                    />
                  }
                </ImageListItem>
              ))}
          </ImageList>
        </Box>

        {/* <Typography>{post.description}</Typography> */}

      

        <Grid container>
          <Grid item xs={1}>
            <Typography variant="subtitle2" noWrap>
              &nbsp;
            </Typography>
          </Grid>
          <Grid item xs={4}>
            {/* <Button onClick={() => {
             handleAccept()
            }} variant="contained" color="success">
            Duyệt
          </Button> */}
            <Button
              fullWidth
              onClick={() => {
                setOpenDialogAccept(true)
              }}
              variant="contained"
              endIcon={<Iconify icon={'eva:checkmark-circle-2-fill'} />}
            >
              Duyệt
            </Button>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="subtitle2" noWrap>
              &nbsp;
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Button
              fullWidth
              onClick={() => {
                setOpenDialogReject(true)
              }}
              variant="contained"
              color="error"
              endIcon={<Iconify icon={'eva:close-circle-fill'} />}
            >
              Từ chối
            </Button>
            {/* <Button
            onClick={() => {
              handleReject()
            }}
            variant="contained" color="warning">
          
            Từ chối
          </Button> */}
          </Grid>
          <Grid item xs={1}>
            <Typography variant="subtitle2" noWrap>
              &nbsp;
            </Typography>
          </Grid>
        </Grid>
      </Stack>

      <Dialog
        open={openDialogDetail}
        onClose={handleCloseDialogDetail}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="xl"
      >
        <DialogTitle id="alert-dialog-title">Hồ sơ ứng viên</DialogTitle>
        <DialogContent>
          <Grid container>
            {listProfileApplicant &&
              listProfileApplicant.map((user, index) => (
                <ProfileApplicant key={user.id} myProfile={user} index={index} />
              ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogDetail} variant="contained">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
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
     
    </Card>
   </>
  );
}
