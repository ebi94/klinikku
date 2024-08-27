// ** Next Import
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const TableHeader = (props) => {
  // ** Props
  const { value, selectedRows, onClicCreate, handleFilter } = props;

  return (
    <Box
      sx={{
        p: 5,
        pb: 3,
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <TextField
        size="small"
        value={value}
        sx={{ mr: 4, mb: 2 }}
        placeholder="Cari Order"
        onChange={(e) => handleFilter(e.target.value)}
      />
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
        <Button
          sx={{ mb: 2 }}
          variant="contained"
          size="small"
          onClick={onClicCreate}
        >
          Buat Order
        </Button>
      </Box>
    </Box>
  );
};

export default TableHeader;
