// ** React Imports
import { useState, useEffect } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import { DataGrid } from "@mui/x-data-grid";
import LinearProgress from "@mui/material/LinearProgress";

// ** Third Party Imports
import axios from "axios";

const Img = styled("img")(({ theme }) => ({
  width: 34,
  height: 34,
  borderRadius: "50%",
  marginRight: theme.spacing(3),
}));

const columns = [
  {
    flex: 0.3,
    minWidth: 230,
    field: "projectTitle",
    headerName: "Project",
    renderCell: ({ row }) => (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Img src={row.img} alt={`project-${row.projectTitle}`} />
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="subtitle2" sx={{ color: "text.primary" }}>
            {row.projectTitle}
          </Typography>
          <Typography variant="caption">{row.projectType}</Typography>
        </Box>
      </Box>
    ),
  },
  {
    flex: 0.15,
    minWidth: 100,
    field: "totalTask",
    headerName: "Total Tasks",
    renderCell: ({ row }) => (
      <Typography variant="body2" sx={{ color: "text.primary" }}>
        {row.totalTask}
      </Typography>
    ),
  },
  {
    flex: 0.15,
    minWidth: 200,
    headerName: "Progress",
    field: "progressValue",
    renderCell: ({ row }) => (
      <Box sx={{ width: "100%" }}>
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          {row.progressValue}%
        </Typography>
        <LinearProgress
          variant="determinate"
          value={row.progressValue}
          color={row.progressColor}
          sx={{ height: 6, borderRadius: "5px" }}
        />
      </Box>
    ),
  },
  {
    flex: 0.15,
    minWidth: 100,
    field: "hours",
    headerName: "Hours",
    renderCell: ({ row }) => (
      <Typography variant="body2" sx={{ color: "text.primary" }}>
        {row.hours}
      </Typography>
    ),
  },
];

const InvoiceListTable = () => {
  // ** State
  const [value, setValue] = useState("");
  const [data, setData] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 7,
  });
  useEffect(() => {
    axios
      .get("/apps/users/project-list", {
        params: {
          q: value,
        },
      })
      .then((res) => setData(res.data));
  }, [value]);

  return (
    <Card>
      <CardHeader title="Projects List" />
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Typography variant="body2" sx={{ mr: 2 }}>
            Cari:
          </Typography>
          <TextField
            size="small"
            placeholder="Cari Project"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </Box>
      </CardContent>
      <DataGrid
        autoHeight
        rows={data}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={[7, 10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </Card>
  );
};

export default InvoiceListTable;
