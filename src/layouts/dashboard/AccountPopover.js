import { Avatar, Box, Divider, IconButton, MenuItem, Stack, Typography } from '@mui/material';
// @mui
import { alpha } from '@mui/material/styles';
import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// components
import MenuPopover from '../../components/MenuPopover';
import { unSubscribeToTopic } from '../../utils/firebase';
import { reset as resetCompany } from '../../slices/companySlice';
import { reset as resetPremium } from '../../slices/premiumSlice';
import { reset as resetMoney } from '../../slices/moneySlice';

// ----------------------------------------------------------------------

let MENU_OPTIONS = [
  {
    label: 'Thông tin nhân viên',
    icon: 'eva:home-fill',
    linkTo: '/employee/information',
  },
  {
    label: 'Thông tin công ty',
    icon: 'eva:person-fill',
    linkTo: '/profile',
  },
  {
    label: 'Đổi mật khẩu',
    icon: 'eva:person-fill',
    linkTo: '/change-password',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover({ company }) {
  const dispatch = useDispatch();
  const anchorRef = useRef(null);

  const [open, setOpen] = useState(null);

  const navigate = useNavigate();

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const role = localStorage.getItem('role');

  useEffect(() => {
    if (role === 'COMPANY') {
      MENU_OPTIONS = [
        {
          label: 'Thông tin công ty',
          icon: 'eva:person-fill',
          linkTo: '/profile',
        },
        {
          label: 'Đổi mật khẩu',
          icon: 'eva:person-fill',
          linkTo: '/change-password',
        },
      ];
    }
  }, [role]);

  return (
    <>
      <IconButton
        ref={anchorRef}
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
        <Avatar src={company?.logo} alt="photoURL" />
      </IconButton>

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
        {localStorage.getItem('company_id') && (
          <>
            <Box sx={{ my: 1.5, px: 2.5 }}>
              <Typography variant="subtitle2" noWrap>
                {company?.name}
              </Typography>
              {/* <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                    {company.email}
                  </Typography> */}
            </Box>
            <Divider sx={{ borderStyle: 'dashed' }} />
          </>
        )}

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} to={option.linkTo} component={RouterLink} onClick={handleClose}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={() => {

          unSubscribeToTopic(`${localStorage.getItem('company_id')}`);
          localStorage.clear();
          let action = resetCompany();
          dispatch(action);
          action = resetPremium();
          dispatch(action);
          action = resetMoney();
          dispatch(action);
          navigate('/login');
        }} sx={{ m: 1 }}>
          Đăng xuất
        </MenuItem>
      </MenuPopover>
    </>
  );
}
