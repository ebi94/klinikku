// ** MUI Imports
import Grid from '@mui/material/Grid';

// ** Demo Components Imports
import CustomerViewLeft from 'src/views/customers/detail/CustomerViewLeft';
import CustomerViewRight from 'src/views/customers/detail/CustomerViewRight';

const CustomerView = ({ tab, invoiceData }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={5} lg={4}>
        <CustomerViewLeft />
      </Grid>
      <Grid item xs={12} md={7} lg={8}>
        <CustomerViewRight />
      </Grid>
    </Grid>
  );
};

export default CustomerView;
