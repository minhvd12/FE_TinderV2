import PropTypes from 'prop-types';
// @mui
// import { styled } from '@mui/material/styles';
import { Card, Typography, CardHeader, Stack } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import ProfileProjects from './cardProject';
// components
// import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

ProfileProject.propTypes = {
  profile: PropTypes.object,
};

export default function ProfileProject({ profile }) {
 
  return (
    <Card>
      <CardHeader title="Dự án" />

      <Stack spacing={2} sx={{ p: 3 }}>
        {profile.projects && profile.projects.map((projects) => <ProfileProjects key={projects.id} projects={projects} />)}
      </Stack>
    </Card>
  );
}
