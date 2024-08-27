// ** MUI Imports
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import { useAuth } from 'src/hooks/useAuth';

// Styled Grid component
const StyledGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    order: -1,
    display: 'flex',
    justifyContent: 'center'
  }
}));

// Styled component for the image
const Img = styled('img')(({ theme }) => ({
  right: 13,
  bottom: 0,
  height: 185,
  position: 'absolute',
  [theme.breakpoints.down('sm')]: {
    height: 165,
    position: 'static'
  }
}));

const EcommerceCongratulations = () => {
  const auth = useAuth();
  const userData = auth?.user?.data;

  const Greetings = () => {
    let myDate = new Date();
    let hours = myDate.getHours();
    let greet;
    if (hours < 11) greet = 'Morning ☀️';
    else if (hours >= 11 && hours <= 17) greet = 'Afternoon ☀️';
    else if (hours >= 17 && hours <= 24) greet = 'Evening 🌙';

    return `Good ${greet}`;
  };

  return (
    <Card sx={{ position: 'relative', overflow: 'visible', mt: { xs: 0, sm: 7.5, md: 0 } }}>
      <CardContent sx={{ p: (theme) => `${theme.spacing(8.25, 7.5, 6.25, 7.5)} !important` }}>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h5" sx={{ mb: 6.5 }}>
              {Greetings()}{' '}
              <Box component="span" sx={{ fontWeight: 'bold' }}>
                {userData?.name}
              </Box>
            </Typography>
            <Typography variant="body2">Have a great day ! 😊</Typography>
            <Typography variant="body2">Check your activity 🗓️ today.</Typography>
          </Grid>
          <StyledGrid item xs={12} sm={6}>
            <Img alt="Congratulations John" src="/images/pages/setup.svg" />
          </StyledGrid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default EcommerceCongratulations;
