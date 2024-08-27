import React from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import CustomChip from 'src/@core/components/mui/chip';
import Icon from 'src/@core/components/icon';

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}));

const DetailArticleDrawer = (props) => {
  // ** Props
  const { open, toggle, toggleEdit, dataDetail } = props;

  const handleClose = () => {
    toggle();
  };

  const handleEdit = () => {
    toggleEdit();
  };

  return (
    <>
      <Drawer
        open={open}
        anchor="right"
        variant="persistent"
        onClose={handleClose}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 'calc(100vw - 270px)' } } }}>
        <Header>
          <Typography variant="h6">Detail Article</Typography>
          <IconButton size="small" onClick={handleClose} sx={{ color: 'text.primary' }}>
            <Icon icon="mdi:close" fontSize={20} />
          </IconButton>
        </Header>
        <Box sx={{ p: 5 }}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={8}>
              <Box
                fullWidth
                disabled
                sx={{
                  '& .Mui-disabled': {
                    '-webkit-text-fill-color': 'rgba(58, 53, 65, 0.87) !important'
                  },
                  mb: 6
                }}>
                <InputLabel>Title</InputLabel>
                <Input disabled fullWidth value={dataDetail?.title} />
              </Box>
              <Box
                fullWidth
                disabled
                sx={{
                  '& .Mui-disabled': {
                    '-webkit-text-fill-color': 'rgba(58, 53, 65, 0.87) !important'
                  },
                  mb: 6
                }}>
                <InputLabel>Meta Description</InputLabel>
                <Input disabled fullWidth value={dataDetail?.meta_description} />
              </Box>
              <Box
                fullWidth
                disabled
                sx={{
                  '& .Mui-disabled': {
                    '-webkit-text-fill-color': 'rgba(58, 53, 65, 0.87) !important'
                  },
                  mb: 6
                }}>
                <InputLabel>Slug</InputLabel>
                <Input disabled fullWidth value={dataDetail?.slug} />
              </Box>
              <Box
                fullWidth
                disabled
                sx={{
                  '& .Mui-disabled': {
                    '-webkit-text-fill-color': 'rgba(58, 53, 65, 0.87) !important'
                  },
                  mb: 6
                }}>
                <InputLabel>Category</InputLabel>
                <Input disabled fullWidth value={dataDetail?.category?.name} />
              </Box>
              <Grid container spacing={6}>
                <Grid item>
                  {dataDetail?.active ? (
                    <CustomChip
                      size="small"
                      skin="light"
                      color="primary"
                      label="Active"
                      sx={{ height: 20, fontSize: '0.75rem', fontWeight: 600 }}
                    />
                  ) : (
                    <CustomChip
                      size="small"
                      skin="light"
                      color="error"
                      label="Not Active"
                      sx={{ height: 20, fontSize: '0.75rem', fontWeight: 600 }}
                    />
                  )}
                  {dataDetail?.is_highlighted ? (
                    <CustomChip
                      size="small"
                      skin="light"
                      color="info"
                      label="Highlighted"
                      sx={{ height: 20, fontSize: '0.75rem', fontWeight: 600, marginLeft: '5px' }}
                    />
                  ) : (
                    <></>
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth sx={{ mb: 6 }} size="small">
                <Card sx={{ pointer: 'cursor' }}>
                  <CardContent>
                    <img
                      src={dataDetail?.media?.image ?? '/images/pages/empty-image.svg'}
                      alt="empty image"
                      height="auto"
                      width={'100%'}
                    />
                  </CardContent>
                </Card>
              </FormControl>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }} />
          <Grid container spacing={3} sx={{ mt: 3 }}>
            <Grid item>
              <Card>
                <CardContent>
                  <div dangerouslySetInnerHTML={{ __html: dataDetail?.content }} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid container spacing={3} sx={{ mt: 3 }}>
            <Grid item xs={12} md={3}>
              <Button
                size="small"
                variant="contained"
                color="warning"
                onClick={handleClose}
                fullWidth>
                Close
              </Button>
            </Grid>
            <Grid item xs={12} md={6} />
            <Grid item xs={12} md={3}>
              <Button size="small" variant="contained" onClick={handleEdit} fullWidth>
                Edit Article
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Drawer>
    </>
  );
};

export default DetailArticleDrawer;
