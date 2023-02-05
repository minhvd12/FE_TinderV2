import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Stack } from '@mui/material';

ProfileSkill.propTypes = {
  skilles: PropTypes.object,
};
export default function ProfileSkill({ skilles }) {
  const [Skillerr, setSkills] = useState([]);
  useEffect(() => {
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/skills/${skilles.skill_id}`,
      method: 'get',
    })
      .then((response) => {
        // console.log(response)
        setSkills(response.data.data);
      })
      .catch((err) => console.log(err));
  }, [skilles.skill_id]);

  return (
   
    <Stack spacing={15} direction="row">
    
    <Typography variant="body2">
      -Ngôn ngữ: {Skillerr.name} 
    </Typography>
    <Typography variant="body2">
      Trình độ : {skilles.skill_level}
    </Typography>
  </Stack>
  );
}
