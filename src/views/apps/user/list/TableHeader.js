// ** MUI Imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "next/link";

// ** Icon Imports
import Icon from "src/@core/components/icon";

const TableHeader = (props) => {
  // ** Props
  const { handleFilter, value } = props;

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
      <Button
        sx={{ mr: 4, mb: 2 }}
        color="secondary"
        variant="outlined"
        startIcon={<Icon icon="mdi:export-variant" fontSize={20} />}
      >
        Export
      </Button>
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
        <TextField
          size="small"
          value={value}
          sx={{ mr: 4, mb: 2 }}
          placeholder="Cari User"
          onChange={(e) => handleFilter(e.target.value)}
        />
        <Link href="/users/new">
          <Button sx={{ mb: 2 }} variant="contained">
            Tambah User
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default TableHeader;
