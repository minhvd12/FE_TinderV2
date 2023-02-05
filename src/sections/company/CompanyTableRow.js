/* eslint-disable consistent-return */
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import axios from 'axios';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Grid,
  Avatar,
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
// components
import Label from '../../components/Label';
import Iconify from '../../components/Iconify';
import { TableMoreMenu } from '../../components/table';
import CompanyJobPostRow from './ComapnyJobPostRow';
import { api } from '../../constants';
// ----------------------------------------------------------------------

CompanyTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onDeleteRow: PropTypes.func,
};

export default function CompanyTableRow({ row, selected, onDeleteRow }) {
  const theme = useTheme();

  const { id, name, phone, logo, email, description, status, website } = row;
  const [openDialogDetail, setOpenDialogDetail] = useState(false);
  const [openMenu, setOpenMenuActions] = useState(null);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDialogJobPost, setOpenDialogJobPost] = useState(false);
  const [jobPostData, setJobPostData] = useState([]);
  const [reasons, setReason] = useState('');
  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };
  const handleChange = (event) => {
    setReason(event.target.value);
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
  const handleCloseDialogJobPost = () => {
    setOpenDialogJobPost(false);
  };
  useEffect(() => {
    // setLoadingButton(true)
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/job-posts?sort-key=CreateDate&companyId=${row.id}`,
      method: 'get',
    })
      .then((response) => {
        setJobPostData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [row.id]);

  const handleDeleteRow = () => {
  
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/companies/${row.id}`,
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
        onDeleteRow()
        // console.log(response.status);
      
      })
      .catch((error) => {
        console.log(error);
      
      }
        );
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell>
          {(() => {
            if (row.status === 1) {
              return (
                <IconButton aria-label="expand row" size="small"
                  // disabled={jobPostData === undefined}
                  onClick={() => setOpenDialogJobPost(true)}>
                  {jobPostData === undefined ? <Label
                    
                    color={'default'}
                    
                  >
                    0
                  </Label> : <Label
                   
                    color={'default'}
                   
                  >
                    {jobPostData.length}
                  </Label>}

                </IconButton>
              );
            }
          })()}
        </TableCell>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={name} src={logo} sx={{ mr: 2 }} />
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </TableCell>

        <TableCell align="left">{phone}</TableCell>
        <TableCell align="left">{website}</TableCell>
        {/* <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {email}
      </TableCell> */}

        <TableCell align="center">
          {row.company_type  === 1 ? (
            <Label
              variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
              color={'primary'}
              sx={{ textTransform: 'capitalize' }}
            >
              outsource
            </Label>
          ) : (
            <Label
              variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
              color={'warning'}
              sx={{ textTransform: 'capitalize' }}
            >
              product
            </Label>
          )}
        </TableCell>

        <TableCell align="center">
          {row.is_premium === true ? (
            <Label
              variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
              color={'success'}
              sx={{ textTransform: 'capitalize' }}
            >
              Premium
            </Label>
          ) : (
            <Label
              variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
              color={'default'}
              sx={{ textTransform: 'capitalize' }}
            >
              Cơ bản
            </Label>
          )}
        </TableCell>
        <TableCell align="center">
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
                  Chờ xét duyệt
                </Label>
              );
            }
            if (status === 3) {
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
                {/* <MenuItem
                onClick={() => {
                  onEditRow();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:edit-fill'} />
                Sửa thông tin
              </MenuItem> */}
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
          <DialogTitle id="alert-dialog-title">Thông tin công ty</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Avatar
                  alt={name}
                  src={logo}
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
                <h4>Tên công ty:</h4>
                <h4 style={{ fontWeight: 'normal' }}>{name}</h4>
              </Grid>
              <Grid item xs={12}>
                <h4>Giới thiệu:</h4>
                <h4 style={{ fontWeight: 'normal' }}>{description}</h4>
              </Grid>
              <Grid item xs={6}>
                <h4>Website:</h4>
                <h4 style={{ fontWeight: 'normal' }}>{website}</h4>
              </Grid>
              <Grid item xs={6}>
                <h4>Gói cước</h4>
                <h4 style={{ fontWeight: 'normal' }}>{row.is_premium === false ? 'Cơ bản' : 'Premium'}</h4>
              </Grid>

              <Grid item xs={6}>
                <h4 style={{ marginRight: 10 }}>Số điện thoại:</h4>
                <h4 style={{ fontWeight: 'normal' }}>{phone}</h4>
              </Grid>
              <Grid item xs={6}>
                <h4>Loại công ty:</h4>
                <h4 style={{ fontWeight: 'normal' }}>{row.company_type === 0 ? 'Outsource' : 'Product'}</h4>
              </Grid>

              <Grid item xs={6}>
                <h4>Email:</h4>
                <h4 style={{ fontWeight: 'normal' }}>{email}</h4>
              </Grid>
              <Grid item xs={6}>
                <h4>Trạng thái: </h4>
                <h4 style={{ fontWeight: 'normal' }}>
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
                  Chờ xét duyệt
                </Label>
              );
            }
            if (status === 3) {
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
                  </h4>
              </Grid>
              {(() => {
           
           if (row.reason !== undefined) {
             return (
              <Grid item xs={12}>
              <h4>Lí do khoá : </h4>
              <h4 style={{ fontWeight: 'normal' }}>{row.reason}</h4>
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
          <DialogTitle id="alert-dialog-title">Bạn có chắc chắn muốn khoá?</DialogTitle>
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
              Đóng
            </Button>
            <Button
              onClick={() => {
                handleDeleteRow();
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
      <Dialog
        open={openDialogJobPost}
        onClose={handleCloseDialogJobPost}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle id="alert-dialog-title">Thông tin bài tuyển dụng</DialogTitle>
        <DialogContent>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center">Ngày tạo</TableCell>
                <TableCell align="center">Tiêu đề</TableCell>
                <TableCell align="center">Số lượng tuyển</TableCell>
                <TableCell align="center">Vị trí</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
                <TableCell> {'    '} </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobPostData && jobPostData.map((data) => <CompanyJobPostRow key={data.id} rows={data} />)}
            </TableBody>
          </Table>


        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogJobPost} variant="contained">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

    

    </>
  );
}
