// ** React Imports
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

const columns = [
  {
    flex: 0.1,
    minWidth: 100,
    field: "id",
    headerName: "ID",
    renderCell: ({ row }) => (
      <Typography variant="body2" sx={{ color: "text.primary" }}>
        {row.totalTask}
      </Typography>
    ),
  },
  {
    flex: 0.2,
    minWidth: 130,
    field: "unit",
    headerName: "Alamat",
    renderCell: ({ row }) => (
      <Box sx={{ display: "flex", alignItems: "center" }}>
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
    field: "bookingDate",
    headerName: "Tanggal Booking",
    renderCell: ({ row }) => (
      <Typography variant="body2" sx={{ color: "text.primary" }}>
        {row.totalTask}
      </Typography>
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

const CustomerOrderHomecare = () => {
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
      <CardHeader
        title={
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6">Order Homecare List</Typography>
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
                  placeholder="Cari Order"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </Box>
            </Box>
          </>
        }
      />
      <CardContent>
        <DataGrid
          autoHeight
          rows={data}
          columns={columns}
          disableRowSelectionOnClick
          pageSizeOptions={[7, 10, 25, 50]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </CardContent>
    </Card>
  );
};

export default CustomerOrderHomecare;
