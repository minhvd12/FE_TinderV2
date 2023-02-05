// @mui
import { Card, Stack, ImageListItem, ImageList } from '@mui/material';
import ModalImage from 'react-modal-image';

// ----------------------------------------------------------------------

export default function ProfileFollowInfo(profile) {

console.log(profile.profile.album_images)

  return (
    
      <Stack direction="row">
                  <ImageList variant="standard" cols={2} gap={8}>
                    {profile.profile.album_images &&
                      profile.profile.album_images.map((item) => (
                        <ImageListItem key={item.id}>
                          {item.url_image && <ModalImage small={item.url_image} large={item.url_image} />}
                        </ImageListItem>
                      ))}
                  </ImageList>
                </Stack>
 
    
  );
}
