// ** Next Import
import Link from "next/link";

// ** MUI Components
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import { styled, useTheme } from "@mui/material/styles";
import MuiCard from "@mui/material/Card";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Configs
import themeConfig from "src/configs/themeConfig";

// ** Layout Import
import BlankLayout from "src/@core/layouts/BlankLayout";

// ** Demo Imports
import FooterIllustrationsV1 from "src/views/pages/auth/FooterIllustrationsV1";

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up("sm")]: { width: "28rem" },
}));

const LinkStyled = styled(Link)(({ theme }) => ({
  display: "flex",
  fontSize: "0.875rem",
  alignItems: "center",
  textDecoration: "none",
  justifyContent: "center",
  color: theme.palette.primary.main,
}));

const ForgotPasswordV1 = () => {
  // ** Hook
  const theme = useTheme();

  return (
    <Box className="content-center">
      <Card sx={{ zIndex: 1 }}>
        <CardContent
          sx={{ p: (theme) => `${theme.spacing(12, 9, 7)} !important` }}
        >
          <Box
            sx={{
              mb: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="/images/example-logo.png"
              alt="KlinikKu"
              height={35}
              width={35}
            />
            <Typography
              variant="h6"
              sx={{
                ml: 3,
                lineHeight: 1,
                fontWeight: 600,
                textTransform: "uppercase",
                fontSize: "1.5rem !important",
              }}
            >
              {themeConfig.templateName}
            </Typography>
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1.5 }}>
              Forgot Password? 🔒
            </Typography>
            <Typography variant="body2">
              Enter your email and we&prime;ll send you instructions to reset
              your password
            </Typography>
          </Box>
          <form
            noValidate
            autoComplete="off"
            onSubmit={(e) => e.preventDefault()}
          >
            <TextField
              autoFocus
              type="email"
              label="Email"
              sx={{ display: "flex", mb: 4 }}
            />
            <Button
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              sx={{ mb: 5.25 }}
            >
              Send reset link
            </Button>
            <Typography
              variant="body2"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LinkStyled href="/pages/auth/login-v1">
                <Icon icon="mdi:chevron-left" />
                <span>Back to login</span>
              </LinkStyled>
            </Typography>
          </form>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  );
};
ForgotPasswordV1.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;

export default ForgotPasswordV1;
