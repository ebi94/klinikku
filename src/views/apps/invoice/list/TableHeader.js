// ** Next Import
import Link from "next/link";

// ** MUI Imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

const TableHeader = (props) => {
  // ** Props
  const { value, selectedRows, handleFilter } = props;

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
        placeholder="Cari No Invoice"
        onChange={(e) => handleFilter(e.target.value)}
      />
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
        {/* <Button sx={{ mb: 2 }} component={Link} variant='contained' href='/apps/invoice/add'>
          Buat Invoice
        </Button> */}
      </Box>
    </Box>
  );
};

export default TableHeader;
