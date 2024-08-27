// ** MUI Imports
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Icon from "src/@core/components/icon";
import Head from "next/head";

const TypographyStyled = styled(Typography)(({ theme }) => ({
  textDecoration: "none",
  fontWeight: 800,
  color: theme.palette.primary.main,
}));

const PageHeader = (props) => {
  // ** Props
  const {
    title,
    subtitle,
    breadCrumbs = [{ id: 1, path: "/dashboards", name: "Home" }],
  } = props;

  return (
    <>
      <Head>
        <title>{title} | KlinikKu</title>
      </Head>
      <Grid item xs={12}>
        <Breadcrumbs
          aria-label="breadcrumb"
          separator={<Icon icon="mdi:chevron-right" fontSize={17} />}
          sx={{
            "& .MuiBreadcrumbs-separator": {
              marginLeft: 1,
              marginRight: 1,
            },
          }}
        >
          {breadCrumbs?.length > 0 &&
            breadCrumbs.map((item) => (
              <Link key={item?.id} color="inherit" href={item?.path}>
                <Typography variant="caption" sx={{ display: "flex" }}>
                  {item?.name}
                </Typography>
              </Link>
            ))}
        </Breadcrumbs>
        {title && <TypographyStyled variant="h5">{title}</TypographyStyled>}
        {subtitle && <Typography variant="body2">{subtitle}</Typography>}
      </Grid>
    </>
  );
};

export default PageHeader;
