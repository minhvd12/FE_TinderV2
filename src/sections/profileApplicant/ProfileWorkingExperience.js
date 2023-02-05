import PropTypes from 'prop-types';
// @mui
import axios from 'axios';
import { useEffect, useState } from 'react';

import { Card, CardHeader, Stack } from '@mui/material';
import ProfileWorking from './profileWorking';

// ----------------------------------------------------------------------

ProfileWorkingExperience.propTypes = {
  profile: PropTypes.object,
};

export default function ProfileWorkingExperience({ profile }) {
 
  return (
    <Card>
      <CardHeader title="Kinh nghiệm làm việc" />

      <Stack spacing={2} sx={{ p: 3 }}>
        {profile.working_experiences &&
          profile.working_experiences.map((workinge) => <ProfileWorking key={workinge.id} workinge={workinge} />)}
      </Stack>
    </Card>
  );
}
