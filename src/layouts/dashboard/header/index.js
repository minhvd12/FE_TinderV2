import PropTypes from 'prop-types';
import React, { useState, useEffect } from "react";
import axios from 'axios';
// @mui
import { styled } from '@mui/material/styles';
import {  Box, Stack, AppBar, Toolbar, Typography } from '@mui/material';
// hooks
import useOffSetTop from '../../../hooks/useOffSetTop';
import useResponsive from '../../../hooks/useResponsive';
// utils
import cssStyles from '../../../utils/cssStyles';
// config
import { HEADER, NAVBAR } from '../../../config';
// components
import Logo from '../../../components/Logo';
import Label from '../../../components/Label';
import Iconify from '../../../components/Iconify';
import MenuPopover from '../../../components/MenuPopover';
import { IconButtonAnimate } from '../../../components/animate';
//

import AccountPopover from './AccountPopover';

import NotificationsPopover from './NotificationsPopover';

// ----------------------------------------------------------------------

const RootStyle = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'isCollapse' && prop !== 'isOffset' && prop !== 'verticalLayout',
})(({ isCollapse, isOffset, verticalLayout, theme }) => ({
  ...cssStyles(theme).bgBlur(),
  boxShadow: 'none',
  height: HEADER.MOBILE_HEIGHT,
  zIndex: theme.zIndex.appBar + 1,
  transition: theme.transitions.create(['width', 'height'], {
    duration: theme.transitions.duration.shorter,
  }),
  [theme.breakpoints.up('lg')]: {
    height: HEADER.DASHBOARD_DESKTOP_HEIGHT,
    width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH + 1}px)`,
    ...(isCollapse && {
      width: `calc(100% - ${NAVBAR.DASHBOARD_COLLAPSE_WIDTH}px)`,
    }),
    ...(isOffset && {
      height: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
    }),
    ...(verticalLayout && {
      width: '100%',
      height: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
      backgroundColor: theme.palette.background.default,
    }),
  },
}));

// ----------------------------------------------------------------------

DashboardHeader.propTypes = {
  onOpenSidebar: PropTypes.func,
  isCollapse: PropTypes.bool,
  verticalLayout: PropTypes.bool,
};

export default function DashboardHeader({ onOpenSidebar, isCollapse = false, verticalLayout = false }) {
  const isOffset = useOffSetTop(HEADER.DASHBOARD_DESKTOP_HEIGHT) && !verticalLayout;

  const isDesktop = useResponsive('up', 'lg');
  // const [haveMetamask, sethaveMetamask] = useState(false);
  // const [accountAddress, setAccountAddress] = useState('');
  const [accountBalance, setAccountBalance] = useState('');
  // const [isConnected, setIsConnected] = useState(false);
  // const [isChange, setIsChange] = useState(false);
  const [refreshData, setRefreshData] = useState(false);

  // const { ethereum } = window;
  // useEffect(() => {
  //   const checkMetamaskAvailability = async () => {
  //     if (!ethereum) {
  //       sethaveMetamask(false);
  //     }
  //     sethaveMetamask(true);
  //   };
  //   checkMetamaskAvailability();
  // }, [ethereum]);
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    // if (window.ethereum.chainId === '0x38') {

    //   console.log('test');

    // } else {
    //   ethereum.request({
    //     "jsonrpc": "2.0",
    //     "method": "wallet_addEthereumChain",
    //     "params": [
    //       {
    //         "chainId": "0x38",
    //         "chainName": "Binance Smart Chain Main Network (bsc-mainnet)",
    //         "rpcUrls": [
    //           "https://bsc-dataseed.binance.org/"
    //         ],
    //         "nativeCurrency": {
    //           "name": "BNB",
    //           "symbol": "BNB",
    //           "decimals": 18
    //         },
    //         "blockExplorerUrls": [
    //           "https://bscscan.com"
    //         ]
    //       }
    //     ],
    //     "id": 56
    //   })
    // }

    setOpen(event.currentTarget);
    setRefreshData(!refreshData)
  };
  const handleClose = () => {
    setOpen(null);
  };
  // const handleAddToken = () => {
  //   try {
  //     // wasAdded is a boolean. Like any RPC method, an error may be thrown.
  //     const wasAdded = ethereum.request({
  //       method: 'wallet_watchAsset',
  //       params: {
  //         type: 'ERC20', // Initially only supports ERC20, but eventually more!
  //         options: {
  //           address: '0xCd370B8ffeC2A43Ef184d17F09069468719834e3', // The address that the token is at.
  //           symbol: 'TGT', // A ticker symbol or shorthand, up to 5 chars.
  //           decimals: 18, // The number of decimals in the token
  //           image: 'https://cdn.discordapp.com/attachments/898526633802203139/1030778510991691817/LOGO_1.png', // A string url of the token logo
  //         },
  //       },
  //     });

  //     if (wasAdded) {
  //       console.log('Add success');
  //     } else {
  //       console.log('Add Fail ');
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // const connectWallet = async () => {
  //   if (!ethereum) {
  //     sethaveMetamask(false);
  //     alert("Please install MetaMask Wallet!");
  //     return;
  //   }

  //   try {
      


 
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const accounts = await ethereum.request({
  //       method: "eth_requestAccounts",
  //     });
  //     await window.ethereum.request({
  //       method: "wallet_requestPermissions",
  //       params: [
  //         {
  //           eth_accounts: {}
  //         }
  //       ]
  //     });

  // //     await ethereum.on('accountsChanged', (accountchange) => {
  // //          if(accountchange !== undefined){
  // // setAccountAddress(accountchange[0]);
  // //          } else {
  // //           setAccountAddress(accounts[0]);
  // //          }
  // //          console.log(accountchange)
  // //     });
  //     console.log(accounts[0])
  //     setAccountAddress(accounts[0]);
  //     const balance = await provider.getBalance(accounts[0]);
  //     console.log(balance)
  //     const bal = await ethers.utils.formatEther(balance);
  //     console.log(bal)
  //     setAccountBalance(bal);
  //     setIsConnected(true);
  //     console.log("Connected", accountAddress);

  //   } catch (error) {
  //     console.log(error);
  //     setIsConnected(false);
  //   }
  // }
  // console.log(accountAddress)
  
  // const getBalance = () => {
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  //   const balance =  provider.getBalance(accountAddress);
  //     const bal = ethers.utils.formatEther(balance);
      
  //     setAccountBalance(bal);
  // };
  //   ethereum.on('accountsChanged', (accountchange) => {
  //     if(accountchange !== undefined){
  // setAccountAddress(accountchange[0]);
  // console.log(accountAddress)
  // getBalance()
  //     }

  //   });
 
  // console.log(accountAddress)

  useEffect(() => {
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/transactions/system`,
      method: 'get',
    })
      .then((response) => {
        setAccountBalance(response.data.data.total_of_system);
        
        // console.log(response.data.data.total_of_system);
      })
      .catch((error) => console.log(error));
  }, [refreshData]);

  return (
    <RootStyle isCollapse={isCollapse} isOffset={isOffset} verticalLayout={verticalLayout}>
      <Toolbar
        sx={{
          minHeight: '100% !important',
          px: { lg: 5 },
        }}
      >
        {isDesktop && verticalLayout && <Logo sx={{ mr: 2.5 }} />}

        {!isDesktop && (
          <IconButtonAnimate onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary' }}>
            <Iconify icon="eva:menu-2-fill" />
          </IconButtonAnimate>
        )}


        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>

          <NotificationsPopover />
          
            <>

              <IconButtonAnimate onClick={handleOpen} sx={{ mr: 1, color: 'text.primary' }}>
                <Iconify icon="fluent:wallet-credit-card-20-filled" width="40" height="40" />
                {/* <Label color={'success'} > {accountBalance}</Label> */}
              </IconButtonAnimate>


              <MenuPopover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleClose}
                sx={{ width: 360, p: 0, mt: 1.5, ml: 0.75 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1">Ví hệ thống</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Số dư: {<Label color='success'> {accountBalance} </Label>} TC(Tagent Coin)
                    </Typography>
                  </Box>


                </Box>
              
              </MenuPopover>
            </>
          {/* ) : (
            <IconButtonAnimate onClick={connectWallet} sx={{ mr: 1, color: 'text.primary' }}>
              <Iconify icon="fluent:wallet-credit-card-20-filled" />
              <Label color={'default'} > Kết nối ví</Label>
            </IconButtonAnimate>
          )} */}

          <AccountPopover />
        </Stack>
      </Toolbar>
    </RootStyle>
  );
}
