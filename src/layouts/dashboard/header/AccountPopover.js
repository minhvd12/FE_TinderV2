import { useState } from 'react';
// import { useSnackbar } from 'notistack';
import {  useNavigate } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar } from '@mui/material';
// components
import MenuPopover from '../../../components/MenuPopover';
import { IconButtonAnimate } from '../../../components/animate';
import { unSubscribeToTopic } from '../../../utils/firebase';


// routes
import {  PATH_AUTH , PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';


// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMountedRef = useIsMountedRef();
  // const { enqueueSnackbar } = useSnackbar();
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };
// console.log(user);
  const handleClose = () => {
    setOpen(false);
  };
  const handleLogout = async () => {
    try {
      await logout();
      navigate(PATH_AUTH.login, { replace: true });

      if (isMountedRef.current) {
        handleClose();
      }
    } catch (error) {
      console.error(error);
      // enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };

  return (
    <>
      <IconButtonAnimate
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBR2vtxnpTjzekzVKQuZ4WkOg56D-YIkX4d4ur4twXlP8joRmFEPrttwHCNqHCXMaPnZA&usqp=CAU" alt="Rayan Moran" />
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
          {user?.email}
          </Typography>
          
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
        <MenuItem onClick={() => {
          handleClose(); 
          navigate(PATH_DASHBOARD.root)
         } }>
        Trang chủ
            </MenuItem>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem 
        onClick={() => {
          
          (async () => {
            unSubscribeToTopic(`${user.user.IdUser}`);

          })();

          handleLogout();

        }}
        sx={{ m: 1 }}>Đăng xuất</MenuItem>
      </MenuPopover>
    </>
  );
}
