import { useState, Fragment } from 'react';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Icon from 'src/@core/components/icon';
import { useAuth } from 'src/hooks/useAuth';
import { getInitials } from 'src/@core/utils/get-initials';
import CustomAvatar from 'src/@core/components/mui/avatar';

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}));

const UserDropdown = (props) => {
  // ** Props
  const { settings } = props;

  // ** States
  const [anchorEl, setAnchorEl] = useState(null);

  // ** Hooks
  const router = useRouter();
  const { logout } = useAuth();
  const auth = useAuth();
  const userData = auth?.user?.data;

  // ** Vars
  const { direction } = settings;

  const handleDropdownOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = (url) => {
    if (url) {
      router.push(url);
    }
    setAnchorEl(null);
  };

  const styles = {
    py: 2,
    px: 4,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      mr: 2,
      fontSize: '1.375rem',
      color: 'text.primary'
    }
  };

  const handleLogout = () => {
    logout();
    handleDropdownClose();
  };

  return (
    <Fragment>
      <Badge
        overlap="circular"
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}>
        <CustomAvatar
          skin="dark"
          color={'warning'}
          sx={{ fontSize: '1rem', width: '2rem', height: '2rem', fontWeight: 600 }}>
          {getInitials(userData?.name ?? userData?.username)}
        </CustomAvatar>
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, mt: 4 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}>
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap="circular"
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}>
              <CustomAvatar
                skin="dark"
                color={'warning'}
                sx={{ fontSize: '1rem', width: '2rem', height: '2rem', fontWeight: 600 }}>
                {getInitials(userData?.name ?? userData?.username)}
              </CustomAvatar>
            </Badge>
            <Box sx={{ display: 'flex', ml: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 600 }}>
                {userData?.name ?? userData?.username}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                {userData?.role?.name}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mt: '0 !important' }} />
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/my-profile')}>
          <Box sx={styles}>
            <Icon icon="mdi:account-outline" />
            Profile
          </Box>
        </MenuItem>
        <Divider />
        {/* <MenuItem
          sx={{ p: 0 }}
          onClick={() => handleDropdownClose('/pages/account-settings/account')}>
          <Box sx={styles}>
            <Icon icon="mdi:cog-outline" />
            Settings
          </Box>
        </MenuItem>
        <Divider /> */}
        <MenuItem
          onClick={handleLogout}
          sx={{ py: 2, '& svg': { mr: 2, fontSize: '1.375rem', color: 'text.primary' } }}>
          <Icon icon="mdi:logout-variant" />
          Logout
        </MenuItem>
      </Menu>
    </Fragment>
  );
};

export default UserDropdown;
