import * as React from 'react';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
// @mui
import { useTheme } from '@mui/material/styles';
import {

  TableRow,
  TableCell,

} from '@mui/material';

// ----------------------------------------------------------------------

TransTableRow.propTypes = {
  row: PropTypes.object,
};
  


export default function TransTableRow({ row }) {
  const theme = useTheme();
  const [nameCompany, setName] = useState('');
  // const [loadingData, setLoadingData] = useState(true);
  // const [jobpost, setJobPost] = useState([]);


  // console.log(row)
  
  useEffect(() => {
     
    if(row.type_of_transaction === 'Upgrade' || row.type_of_transaction === 'Money recharge'  ) {
      
    axios({
      url: `https://itjobs.azurewebsites.net/api/v1/companies/${row.create_by}`,
      method: 'get',
    })
      .then((response) => {
        setName(response.data.data.name);
        // console.log(response.data.data);
        // onLoading();
      })
      .catch((error) => {
        console.log(error);
      });
    };

    if(row.type_of_transaction === 'Top up for job post' || row.type_of_transaction ==='Create job post' ||  row.type_of_transaction === 'Return money') {
      axios({
        url: `https://itjobs.azurewebsites.net/api/v1/job-posts/${row.create_by}`,
        method: 'get',
      })
        .then((response) => {
          // setJobPost(response.data.data);
          // console.log(response.data.data);
          axios({
            url: `https://itjobs.azurewebsites.net/api/v1/companies/${response.data.data.company_id}`,
            method: 'get',
          })
            .then((response) => {
              setName(response.data.data.name);
              // console.log(response.data.data);
              // onLoading();
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
      };
      if(row.type_of_transaction === 'Reward exchange') {
        axios({
          url: `https://itjobs.azurewebsites.net/api/v1/applicants/${row.create_by}`,
          method: 'get',
        })
          .then((response) => {
            setName(response.data.data.name);
            // console.log(response.data.data);
            // onLoading();
          })
          .catch((error) => {
            console.log(error);
          });
        }
        
}, [row.create_by])
     
    
   

  return (
   
    <TableRow hover>

      
      <TableCell align="left">{dayjs(row.create_date).format('HH:mm:ss DD/MM/YYYY')}</TableCell>
      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {nameCompany}
      </TableCell>
      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
         {(() => {
            if (row.type_of_transaction === 'Money recharge') {
              return (
              'N???p ti???n'
              );
            }
            if (row.type_of_transaction === 'Upgrade') {
              return (
                'N??ng c???p Premium'
              );
            }
            if (row.type_of_transaction === 'Top up for job post') {
              return (
                'N???p ti???n b??i tuy???n d???ng'
              );
            }
            if (row.type_of_transaction === 'Create job post') {
              return (
                'T???o b??i tuy???n d???ng'
              );
            }
            if (row.type_of_transaction === 'Reward exchange') {
              return (
                '?????i th?????ng'
              );
            }
            if (row.type_of_transaction === 'Return money') {
              return (
                'Ho??n ti???n'
              );
            }
          })()}
       
      </TableCell>
     
      <TableCell align="left">   {row.total}
       {/* {(() => {
            if (row.total !== undefined) {
              return (
              row.total
              );
            }
            if (row.total === undefined) {
              return (
                jobpost.money
              );
            }
          })()} */}
          </TableCell>


    </TableRow>



  );
}
