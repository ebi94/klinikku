import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import format from 'date-fns/format';
import Icon from 'src/@core/components/icon';
import PreviewImage from 'src/@core/components/preview-image';
import CustomChip from 'src/@core/components/mui/chip';

// Styled Grid component
const StyledGridContent = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  [theme.breakpoints.down('md')]: {
    paddingTop: '0 !important'
  }
}));

// Styled Grid component
const StyledGridImage = styled(Grid)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

// Styled component for the image
const Img = styled('img')(({ theme }) => ({
  height: '11rem',
  borderRadius: theme.shape.borderRadius
}));

const CardBanners = (props) => {
  const { onEdit, dataDetail } = props;

  return (
    <Card sx={{ mb: 4 }}>
      <Grid container spacing={6}>
        <StyledGridImage item xs={12} md={6} lg={5}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PreviewImage
              alt={dataDetail?.name}
              src={dataDetail?.content}
              width={'100%'}
              height="auto"
            />
          </CardContent>
        </StyledGridImage>
        <StyledGridContent item xs={12} md={6} lg={7}>
          <CardContent sx={{ height: '100%', width: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {dataDetail?.name}
            </Typography>
            <Grid container spacing={3} sx={{ display: 'flex', alignItems: 'baseline' }}>
              <Grid item md={4} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body">Nama Perusahaan</Typography>
                <Typography variant="body">:</Typography>
              </Grid>
              <Grid item md={8}>
                <Typography variant="body2">{dataDetail?.company_name}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ display: 'flex', alignItems: 'baseline' }}>
              <Grid item md={4} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body">PIC</Typography>
                <Typography variant="body">:</Typography>
              </Grid>
              <Grid item md={8}>
                <Typography variant="body2">{dataDetail?.pic}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ display: 'flex', alignItems: 'baseline' }}>
              <Grid item md={4} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body">PIC Phone</Typography>
                <Typography variant="body">:</Typography>
              </Grid>
              <Grid item md={8}>
                <Typography variant="body2">{dataDetail?.pic_phone}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ display: 'flex', alignItems: 'baseline' }}>
              <Grid item md={4} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body">Range Date</Typography>
                <Typography variant="body">:</Typography>
              </Grid>
              <Grid item md={8}>
                <Typography variant="body2">
                  {format(new Date(dataDetail?.start_date), 'dd MMM yyyy | HH:mm')} -{' '}
                  {format(new Date(dataDetail?.end_date), 'dd MMM yyyy | HH:mm')}
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ display: 'flex', alignItems: 'baseline', mt: 1 }}>
              {dataDetail?.active ? (
                <Grid item>
                  <CustomChip
                    size="small"
                    skin="dark"
                    label={'Active'}
                    color={'primary'}
                    sx={{
                      height: 20,
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      '& .MuiChip-label': { lineHeight: '1.25rem' }
                    }}
                  />
                </Grid>
              ) : (
                <></>
              )}
              {dataDetail?.completed ? (
                <Grid item>
                  <CustomChip
                    size="small"
                    skin="dark"
                    label={'Completed'}
                    color={'error'}
                    sx={{
                      height: 20,
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      '& .MuiChip-label': { lineHeight: '1.25rem' }
                    }}
                  />
                </Grid>
              ) : (
                <></>
              )}
            </Grid>
          </CardContent>
          <CardActions
            className="card-action-dense"
            sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              sx={{ minWidth: 150 }}
              color="info"
              variant="contained"
              size="small"
              startIcon={<Icon icon="mdi:edit" />}
              onClick={() => onEdit()}
              disabled={dataDetail?.active || dataDetail?.completed}>
              Edit
            </Button>
          </CardActions>
        </StyledGridContent>
      </Grid>
    </Card>
  );
};

export default CardBanners;
