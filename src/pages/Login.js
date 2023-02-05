import { capitalCase } from 'change-case';

// @mui
import { styled } from '@mui/material/styles';
import { Box,  Stack,  Alert, Tooltip, Container, Typography } from '@mui/material';

// hooks
import useAuth from '../hooks/useAuth';
// import useResponsive from '../hooks/useResponsive';
// components
import Page from '../components/Page';

import Image from '../components/Image';
// sections
import { LoginForm } from '../sections/login';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));



const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Login() {
  const { method } = useAuth();


  return (
    <Page title="Đăng nhập">
      <RootStyle>
       
       

        <Container maxWidth="sm">
          <ContentStyle>
            <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                  Đăng nhập trang Admin 
                </Typography>
                 </Box>

              <Tooltip title={capitalCase(method)} placement="right">
                <>
                  <Image
                    disabledEffect
                    src={`https://minimal-assets-api-dev.vercel.app/assets/icons/auth/ic_${method}.png`}
                    sx={{ width: 32, height: 32 }}
                  />
                </>
              </Tooltip>
            </Stack>

            {/* <Alert severity="info" sx={{ mb: 3 }}>
              Use account : <strong>admin</strong> / password :<strong> 123456</strong>
            </Alert> */}

            <LoginForm />

          
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
