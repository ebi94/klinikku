import React from 'react';
import Box from '@mui/material/Box';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

const PreviewImage = (props) => {
  const { src, alt, width, height } = props;

  return (
    <Box sx={{ cursor: 'pointer', '& img': { borderRadius: 1 } }}>
      <PhotoProvider>
        <PhotoView src={src}>
          <img src={src} alt={alt} width={width} height={height} />
        </PhotoView>
      </PhotoProvider>
    </Box>
  );
};

export default PreviewImage;
