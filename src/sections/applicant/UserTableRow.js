import * as React from 'react';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Grid,
  Avatar,
  Box,
  TableRow,
  TableCell,
  Typography,
  MenuItem,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Collapse,
  Table,
  TableHead,
  TableBody,
  DialogContentText,
  TextField,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// components
import Label from '../../components/Label';

import Iconify from '../../components/Iconify';
import { TableMoreMenu } from '../../components/table';
import { api } from '../../constants';
import UserProfileRow from './UserProfileRow';
// ----------------------------------------------------------------------

UserTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onDeleteRow: PropTypes.func,
};

export default function UserTableRow({ row, selected, onDeleteRow }) {
  const theme = useTheme();

  const { id, name, phone, avatar, email, gender, dob, status, address } = row;
  const [openDialogDetail, setOpenDialogDetail] = useState(false);
  const [openMenu, setOpenMenuActions] = useState(null);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [open, setOpen] = useState(false);
  const [profileData, setProfileData] = useState([]);
  const [reasons, setReason] = useState('');
  const [balance, setBalance] = useState('');


  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };
  const handleCloseDialogDetail = () => {
    setOpenDialogDetail(false);
  };

  const handleCloseDialogDelete = () => {
    setOpenDialogDelete(false);
  };

  const handleChange = (event) => {
    setReason(event.target.value);
  };
  useEffect(() => {
    // setLoadingButton(true)
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/profile-applicants?applicantId=${row.id}`,
      method: 'get',
    })
      .then((response) => {
        setProfileData(response.data.data);
      // console.log(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
      axios({
        url: `https://stg-api-itjob.unicode.edu.vn/api/v1/wallets?applicantId=${row.id}`,
        method: 'get',
      })
        .then((response) => {
          setBalance(response.data.data[0].balance);
        // console.log(response.data.data[0].balance);
        })
        .catch((error) => {
          console.log(error);
        });
  }, [row.id]);
  const handleDeleteRow = () => {
    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_APPLICANTS}/${row.id}`,
      method: 'delete',
      headers: {
        //  "Content-Type": "multipart/form-data" 
         'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    },
      data: {
        reason: reasons,
      }
    })
      .then((response) => {
        console.log(response);
        // if (response?.status === 204) {
          
        onDeleteRow()
          
        // }
      }).catch((error) => 
      {
        console.log(error);
      });
      
  
};
  return (
    <>
      <TableRow hover>
        {/* <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell> */}
        <TableCell>
        {(() => {
            if (row.status === 1) {
              return (
                <IconButton aria-label="expand row" size="small"
             disabled={profileData === undefined}
                onClick={() => setOpen(!open)}>
                  {open ? <KeyboardArrowUpIcon color={profileData !== undefined ? 'primary' : 'error'} /> : <KeyboardArrowDownIcon color={profileData !== undefined ? 'primary' : 'inherit'} />}
                </IconButton>
              );
            }
          })()}
        </TableCell>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={name} src={avatar} sx={{ mr: 2 }} />
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </TableCell>

        <TableCell align="left">{phone}</TableCell>
        <TableCell align="left">{dayjs(dob).format('DD/MM/YYYY')}</TableCell>
        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {email}
        </TableCell>

        <TableCell align="center">
          {(() => {
            if (gender === 0) {
              return (
                <Label
                  variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                  color={'primary'}
                  sx={{ textTransform: 'capitalize' }}
                >
                  Nữ
                </Label>
              );
            }
            if (gender === 1) {
              return (
                <Label
                  variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                  color={'success'}
                  sx={{ textTransform: 'capitalize' }}
                >
                  Nam
                </Label>
              );
            }
            if (gender === 2) {
              return (
                <Label
                  variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                  color={'warning'}
                  sx={{ textTransform: 'capitalize' }}
                >
                  Khác
                </Label>
              );
            }
            if (gender === undefined) {
              return (
                <Label
                  variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                  color={'warning'}
                  sx={{ textTransform: 'capitalize' }}
                >
                  Không xác định
                </Label>
              );
            }
          })()}
        </TableCell>

        <TableCell align="left">
          {(() => {
            if (status === 0) {
              return (
                <Label
                  variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                  color={'error'}
                  sx={{ textTransform: 'capitalize' }}
                >
                  Ngưng hoạt động
                </Label>
              );
            }
            if (status === 1) {
              return (
                <Label
                  variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                  color={'success'}
                  sx={{ textTransform: 'capitalize' }}
                >
                  Hoạt động
                </Label>
              );
            }
            if (status === 2) {
              return (
                <Label
                  variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                  color={'warning'}
                  sx={{ textTransform: 'capitalize' }}
                >
                  Đang xác thực
                </Label>
              );
            }
          })()}
        </TableCell>

        <TableCell align="right">
          <TableMoreMenu
            open={openMenu}
            onOpen={handleOpenMenu}
            onClose={handleCloseMenu}
            actions={
              <>
                <MenuItem
                  onClick={() => {
                    // onViewRow();
                    setOpenDialogDetail(true);
                    handleCloseMenu();
                  }}
                  sx={{ color: 'primary.main' }}
                >
                  <Iconify icon={'carbon:user-profile'} />
                  Xem thông tin
                </MenuItem>
              {(() => {
           
            if (status !== 0) {
              return (
                <MenuItem
                onClick={() => {
                  setOpenDialogDelete(true);
                  handleCloseMenu();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon={'eva:trash-2-outline'} />
                Khoá tài khoản
              </MenuItem>
              );
            }
          })()}
               
              </>
            }
          />
        </TableCell>
        <Dialog
          open={openDialogDetail}
          onClose={handleCloseDialogDetail}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          maxWidth="md"
        >
          <DialogTitle id="alert-dialog-title">Thông tin Ứng viên</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Avatar
                  alt={name}
                  src={avatar}
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
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    ml: { md: 46 },
                    mt: { xs: 1, md: 0 },
                    mx: 'auto',
                    // color: 'common.white',
                    textAlign: { xs: 'center', md: 'left' },
                    position: 'relative',
                  }}
                >
                  <Typography variant="h4">{name}</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <h4>Ngày Sinh:</h4>
                <h4 style={{ fontWeight: 'normal' }}>{dayjs(dob).format('DD/MM/YYYY')}</h4>
              </Grid>
              <Grid item xs={6}>
                <h4>Giới tính:</h4>
                <h4 style={{ fontWeight: 'normal' }}>
                {(() => {
            if (gender === 0) {
              return (
               
                <h4 style={{ fontWeight: 'normal' }}>Nữ</h4>
              );
            }
            if (gender === 1) {
              return (
                <h4 style={{ fontWeight: 'normal' }}>Nam</h4>
              );
            }
            if (gender === 2) {
              return (
                <h4 style={{ fontWeight: 'normal' }}>Khác</h4>
              );
            }
            if (gender === undefined) {
              return (
                <h4 style={{ fontWeight: 'normal' }}>Không xác định</h4>
              );
            }
          })()}
                </h4>
              </Grid>

              <Grid item xs={6}>
                <h4>Địa chỉ:</h4>
                <h4 style={{ fontWeight: 'normal' }}>{address}</h4>
              </Grid>
              <Grid item xs={6}>
                <h4 style={{ marginRight: 10 }}>Số điện thoại:</h4>
                <h4 style={{ fontWeight: 'normal' }}>{phone}</h4>
              </Grid>

              <Grid item xs={6}>
                <h4>Email:</h4>
                <h4 style={{ fontWeight: 'normal' }}>{email}</h4>
              </Grid>
              <Grid item xs={6}>
                <h4>Trạng thái: </h4>
                <h4 style={{ fontWeight: 'normal' }}>  {(() => {
            if (status === 0) {
              return (
                <Label
                  variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                  color={'error'}
                  sx={{ textTransform: 'capitalize' }}
                >
                  Ngưng hoạt động
                </Label>
              );
            }
            if (status === 1) {
              return (
                <Label
                  variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                  color={'success'}
                  sx={{ textTransform: 'capitalize' }}
                >
                  Hoạt động
                </Label>
              );
            }
            
            if (status === 2) {
              return (
                <Label
                  variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                  color={'warning'}
                  sx={{ textTransform: 'capitalize' }}
                >
                  Đang xác thực
                </Label>
              );
            }
          
            
          })()}</h4>
              </Grid>
              {(() => {
           
           if (row.reason !== undefined) {
             return (
              <Grid item xs={6}>
              <h4>Lí do khoá : </h4>
              <h4 style={{ fontWeight: 'normal' }}>{row.reason}</h4>
            </Grid>
             );
           }
         })()}
          {(() => {
           
           if (row.earn_money === 1) {
             return (
              <Grid item xs={6}>
              <h4>Số dư ví : </h4>
              <h4 style={{ fontWeight: 'normal' }}>{balance} (Tagent coin)</h4>
            </Grid>
             );
           }
         })()}
         
              
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialogDetail} variant="contained">
              Đóng
            </Button>
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
          <DialogTitle id="alert-dialog-title">Bạn có chắc chắn muốn khoá ?</DialogTitle>
          <DialogContent sx={{ pt: 2 }} >
          <DialogContentText id="alert-dialog-slide-description">
          &nbsp;
          </DialogContentText>
              <TextField
                id="outlined-name"
                label="Lý do"
                value={reasons}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialogDelete} variant="outlined" color="inherit">
              Huỷ
            </Button>
            <Button
              onClick={() => {
                // onDeleteRow();
                handleDeleteRow()
                handleCloseDialogDelete();
              }}
              variant="contained"
              color="primary"
              disabled={reasons.length === 0}
            >
              Khoá
            </Button>
          </DialogActions>
        </Dialog>
      </TableRow>
      
      <TableRow hover>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            
              <Typography variant="h6" gutterBottom component="div">
                Hồ sơ
              </Typography>
              <Table size="small" >
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Ngày tạo</TableCell>
                    <TableCell align="center" >Vị trí</TableCell>
                    <TableCell align="center" >Hình thức</TableCell>
                    <TableCell align="center" >Trạng thái</TableCell>
                    <TableCell > {'    '} </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {profileData && profileData.map((data, index) => <UserProfileRow key={index} rows={data} />)}
                </TableBody>
              </Table>
            
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
