// ** MUI Imports
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import MuiCard from "@mui/material/Card";
import InputAdornment from "@mui/material/InputAdornment";
import MuiTextField from "@mui/material/TextField";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// Styled Card component
const Card = styled(MuiCard)(({ theme }) => ({
  border: 0,
  boxShadow: "none",
  backgroundSize: "cover",
  backgroundImage: `url(/images/pages/tree-cone-cube-bg-${theme.palette.mode}.png)`,
}));

// Styled TextField component
const TextField = styled(MuiTextField)(({ theme }) => ({
  width: "100%",
  "& .MuiOutlinedInput-root": {
    backgroundColor: theme.palette.background.paper,
  },
  [theme.breakpoints.up("sm")]: {
    width: "55%",
  },
}));

const FaqHeader = (props) => {
  // ** Props
  const { searchTerm, setSearchTerm } = props;

  const handleFaqFilter = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Card>
      <CardContent
        sx={{
          pt: 23,
          textAlign: "center",
          pb: (theme) => `${theme.spacing(23)} !important`,
        }}
      >
        <Typography
          variant="h5"
          sx={{ mb: 2.5, fontWeight: 600, color: "primary.main" }}
        >
          Hello, how can we help?
        </Typography>
        <Typography variant="body2" sx={{ mb: 6.5 }}>
          or choose a category to quickly find the help you need
        </Typography>
        <TextField
          value={searchTerm}
          placeholder="Cari a question...."
          onChange={(e) => handleFaqFilter(e)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Icon icon="mdi:magnify" />
              </InputAdornment>
            ),
          }}
        />
      </CardContent>
    </Card>
  );
};

export default FaqHeader;
