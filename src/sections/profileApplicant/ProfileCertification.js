import PropTypes from 'prop-types';
// @mui
// import { styled } from '@mui/material/styles';
import { Card, CardHeader, Stack,Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';


ProfileCertification.propTypes = {
  profile: PropTypes.object,
};

export default function ProfileCertification({ profile }) {
  return (
    <Card>
      <CardHeader title="Chứng chỉ" />

      <Stack spacing={2} sx={{ p: 3 }}>
        {profile.certificates && profile.certificates.map((certificate) =>
         <Typography variant="body2" key={certificate.id} >- {certificate.name} {' '}
         ({dayjs(certificate.grant_date).format('MM/YYYY')})</Typography>)}
      </Stack>
    </Card>
  );
}