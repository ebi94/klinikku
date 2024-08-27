import React from 'react';
import Link from 'next/link';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import CustomChip from 'src/@core/components/mui/chip';
import { selectColor } from 'src/utils/helpers';

const TypographyStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  fontWeight: 800,
  color: theme.palette.primary.main
}));

const CardOrder = (props) => {
  const { dataItem } = props;

  return (
    <Card sx={{ mb: 4 }}>
      <CardHeader
        title={
          <Grid container direction="row" justifyContent="space-between" alignItems="center">
            <Grid item md={6}>
              <TypographyStyled
                href={`order-${dataItem?.type}/detail/${dataItem?.order_id}`}>{`#${dataItem?.booking_code}`}</TypographyStyled>
            </Grid>
            <Grid item md={6}>
              <CustomChip
                size="small"
                skin="dark"
                label={dataItem?.status}
                color={selectColor(dataItem?.status)}
                sx={{
                  height: 20,
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  float: 'right',
                  '& .MuiChip-label': { lineHeight: '1.25rem' }
                }}
              />
            </Grid>
          </Grid>
        }
      />
      <CardContent>
        <Typography variant="body2" sx={{ mb: 0.25 }}>
          {dataItem?.description}
        </Typography>
        <Typography variant="body2">{dataItem?.date}</Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'end' }}>
        <Link href={`order-${dataItem?.type}/detail/${dataItem?.order_id}`}>
          <Button variant="outlined" color="info" size="small">
            View Detail
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
};

export default CardOrder;
