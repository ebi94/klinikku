// ** MUI Components
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled, useTheme } from '@mui/material/styles';

// Styled Components
const MaskImg = styled('img')(() => ({
  bottom: 0,
  zIndex: -1,
  width: '100%',
  position: 'absolute'
}));

const FooterIllustrations = () => {
  // ** Props\

  // ** Hook
  const theme = useTheme();

  // ** Vars
  const hidden = useMediaQuery(theme.breakpoints.down('md'));
  if (!hidden) {
    return (
      <>
        <MaskImg alt="mask" src={`/images/pages/misc-mask-${theme.palette.mode}.png`} />
      </>
    );
  } else {
    return null;
  }
};

export default FooterIllustrations;
