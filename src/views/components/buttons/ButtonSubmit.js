import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

const ButtonSubmit = (props) => {
  const { loading } = props;
  return (
    <Button
      size="small"
      fullWidth
      disabled={loading}
      type="submit"
      variant="contained"
    >
      {!loading ? "Simpan" : <CircularProgress size={25} />}
    </Button>
  );
};

export default ButtonSubmit;
