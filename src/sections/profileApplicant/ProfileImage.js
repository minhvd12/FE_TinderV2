// @mui
import { Card, Stack, ImageListItem, ImageList } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
// ----------------------------------------------------------------------

export default function ProfileFollowInfo(profile) {
  const [listImage, setListImage] = useState([]);
  useEffect(() => {
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/album-images?page-size=50&profileApplicantId=${profile.profile.id}`,
      method: 'get',
    })
      .then((response) => {
        // console.log(response);
        setListImage(response.data.data);
      })
      .catch((err) => console.log(err));
  }, [profile.profile.id]);

  return (
    <Card>
      <Stack spacing={2} sx={{ p: 4 }}>
        <ImageList variant="standard" cols={2} gap={8}>
          {profile.profile.album_images && profile.profile.album_images.map((item) => (
            <ImageListItem key={item.id} >
              {item.url_image && (
                <img
                  src={item.url_image}
                  srcSet={item.url_image}
                  alt={item.title}
                  style={{ height: 300, width: '100%' ,objectFit: 'stretch' }}
                  loading="lazy"
                />
              )}
            </ImageListItem>
          ))}
        </ImageList>
      </Stack>
 
    </Card>
  );
}
