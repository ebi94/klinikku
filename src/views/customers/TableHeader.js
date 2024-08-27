import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const TableHeader = (props) => {
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
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
        <TextField
          size="small"
          value={value}
          sx={{ mr: 4, mb: 2 }}
          placeholder="Cari Pasien"
          onChange={(e) => handleFilter(e.target.value)}
          fullWidth
        />
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }} />
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
        <Link href="/customers/new">
          <Button sx={{ mb: 2 }} variant="contained" size="small" fullWidth>
            Tambah Pasien
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default TableHeader;
