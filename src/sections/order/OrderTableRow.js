import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
// @mui
import {
  TableRow,
  TableCell,
  Typography,

} from '@mui/material';

// ----------------------------------------------------------------------

OrderTableRow.propTypes = {
  row: PropTypes.object,
};

export default function OrderTableRow({ row }) {
  // const { id, name } = row;
  const [product, setProduct] = useState('');
  const [applicant, setApplicant] = useState('');


  useEffect(() => {
    
        axios({
            url: `https://stg-api-itjob.unicode.edu.vn/api/v1/applicants/${row.create_by}`,
            method: 'get',
          })
            .then((response) => {
                setApplicant(response.data.data.name);
            //   console.log(response.data.data);
              // onLoading();
            })
            .catch((error) => {
              console.log(error);
            });
  }, [row.create_by]);

  // useEffect(()  => {
  //   axios({
  //     url: `https://stg-api-itjob.unicode.edu.vn/api/v1/products/${row.product_id}`,
  //     method: 'get',
  //   })
  //     .then((response) => {
  //       setProduct(response.data.data.name);
  //       // console.log(response.data.data);
        
  //     })
  //     .catch((error) => console.log(error));
  // }, []);

  return (
    <TableRow hover >
   
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle2" noWrap>
          {row.No}
        </Typography>
      </TableCell>
      <TableCell align="left">{applicant}</TableCell>
      <TableCell align="left">{row.product.name}</TableCell>
      <TableCell align="left">{dayjs(row.create_date).format('DD/MM/YYYY')}{'  '}{dayjs(row.create_date).format("HH:mm:ss")}</TableCell>
    </TableRow>
  );
}
