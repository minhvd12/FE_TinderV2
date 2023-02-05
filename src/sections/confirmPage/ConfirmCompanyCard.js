import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';
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
  Snackbar,
  Alert,
  Tooltip,
} from '@mui/material';
import ModalImage from 'react-modal-image';
// components
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

ConfirmCompanyCard.propTypes = {
  post: PropTypes.object,
  onDeleteRow: PropTypes.func,
  onErrorRow: PropTypes.func,
  onRejectRow: PropTypes.func,
};

export default function ConfirmCompanyCard({ post, onDeleteRow, onErrorRow,onRejectRow }) {
  const [openDialogDetail, setOpenDialogDetail] = useState(false);
  // const [openAlert, setOpenAlert] = useState(false);
  const [openDialogAccept, setOpenDialogAccept] = useState(false);
  const [openDialogReject, setOpenDialogReject] = useState(false);
  const [user, setUser] = useState('');
  const handleCloseDialogDetail = () => {
    setOpenDialogDetail(false);
  };
  const handleCloseDialogAccept = () => {
    setOpenDialogAccept(false);
  };
  const handleCloseDialogReject = () => {
    setOpenDialogReject(false);
  };

  // console.log(post)
  

  const handleAccept = () => {
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/emails/accept/email?email=${post.email}`,
      method: 'get',
      headers: {
        //  "Content-Type": "multipart/form-data" 
         'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    },
    })
      .then((response) => {
        onDeleteRow();
      })
      .catch(error => {
        onErrorRow();
        console.log(error);

      });
   
  };
  const handleReject = () => {
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/emails/reject/email?email=${post.email}`,
      method: 'get',
      headers: {
        //  "Content-Type": "multipart/form-data" 
         'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    },
    })
      .then((response) => {
        // setOpenAlert(true);
        // setSeverity('success');
        // setMessageAlert('Từ chối thành công!!!');
        // console.log(response);
        onRejectRow()
      })
      .catch((error) => {
        onErrorRow();
        console.log(error);

      });
  
  };

  return (
    <Card>
      <CardHeader
        disableTypography
        avatar={
          <Avatar
            alt={post.id}
            src={post.logo}
            // href={setOpenViewImage(true)}
            // onClick={
            //   setOpenViewImage(true)
            // }
            sx={{
              width: 120,
              height: 120,
              zIndex: 11,
              // left: 0,
              // right: 0,
              // bottom: 65,
              mx: 'auto',
              position: 'relative',
            }}
          />
        }
        title={
          <Link to="#" variant="subtitle2" color="text.primary" component={RouterLink}>
            {post.name}
          </Link>
        }
        subheader={
          <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
            {post.email}
          </Typography>
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
        {/* <Typography>{post.description}</Typography> */}

        {/* <ModalImage small={post.business_registration} large={post.business_registration} />; */}
        {/* <Image alt="post media" src={post.business_registration} ratio="16/9" sx={{ borderRadius: 1 }} /> */}
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
            name="name"
            value={post.name}
            label="Tên công ty"
          />

          {/* <TextField
            InputProps={{
              readOnly: true,
            }}
            name="email"
            value={post.email}
            label="Email"
          /> */}
          <TextField
            InputProps={{
              readOnly: true,
            }}
            name="phoneNumber"
            value={post.phone}
            label="Số điện thoại"
          />

          {/* <TextField
            InputProps={{
              readOnly: true,
            }}
            name="website"
            value={post.website}
            label="Website"
          /> */}

          <TextField
            InputProps={{
              readOnly: true,
            }}
            name="state"
            value={post.company_type === 0 ? 'Product' : 'Outsourcing'}
            label="Loại công ty"
          />
          <TextField
            InputProps={{
              readOnly: true,
            }}
            name="tax"
            value={post.tax_code}
            label="Mã số thuế"
          />
        </Box>
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
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title">Thông tin công ty</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ p: 3 }}>

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
                    name="name"
                    value={post.name}
                    label="Tên công ty"
                  />
                  <TextField
                    InputProps={{
                      readOnly: true,
                    }}
                    name="email"
                    value={post.email}
                    label="Email"
                  />
                  <TextField
                    InputProps={{
                      readOnly: true,
                    }}
                    name="phoneNumber"
                    value={post.phone}
                    label="Số điện thoại"
                  />

                  <TextField
                    InputProps={{
                      readOnly: true,
                    }}
                    name="website"
                    value={post.website}
                    label="Website"
                  />

                  <TextField
                    InputProps={{
                      readOnly: true,
                    }}
                    name="state"
                    value={post.company_type === 0 ? 'Product' : 'Outsourcing'}
                    label="Loại công ty"
                  />
                   <TextField
            InputProps={{
              readOnly: true,
            }}
            name="tax"
            value={post.tax_code}
            label="Mã số thuế"
          />
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ p: 3 }}>
                <Typography variant="caption">Giới thiệu</Typography>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  • {post.description}
                </Typography>
              </Card>
            </Grid>
            <Grid container item xs={12} spacing={3}>
              <Grid item xs={5}>
                <Typography variant="caption">Logo</Typography>
                {/* <Image alt="post media" src={post.logo} ratio="16/9" sx={{ borderRadius: 1 }} /> */}
                <ModalImage small={post.logo} large={post.logo} />
              </Grid>

            </Grid>
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
              // onDeleteRow();
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
  );
}
