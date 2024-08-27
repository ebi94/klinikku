import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const TableHeader = (props) => {
  const { handleFilter, toggle, value, title, disabledFilter = false } = props;

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
      {!disabledFilter ? (
        <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
          <TextField
            size="small"
            value={value}
            sx={{ mr: 4, mb: 2 }}
            placeholder={`Cari ${title}`}
            onChange={(e) => handleFilter(e.target.value)}
          />
        </Box>
      ) : (
        <>
          <Box
            sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}
          />
        </>
      )}
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
        <Button
          sx={{ mb: 2 }}
          onClick={toggle}
          variant="contained"
          size="small"
        >
          Add New {title}
        </Button>
      </Box>
    </Box>
  );
};

export default TableHeader;
