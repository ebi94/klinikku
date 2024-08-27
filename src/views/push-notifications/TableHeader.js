import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const TableHeader = (props) => {
  const { handleFilter, toggle, value } = props;

  return (
    <Box
      sx={{
        p: 5,
        pb: 3,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
        <TextField
          size="small"
          value={value}
          sx={{ mr: 4, mb: 2 }}
          placeholder="Cari Notifications"
          onChange={(e) => handleFilter(e.target.value)}
        />
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
        <Button sx={{ mb: 2 }} onClick={toggle} variant="contained">
          Add New Push Notications
        </Button>
      </Box>
    </Box>
  );
};

export default TableHeader;
