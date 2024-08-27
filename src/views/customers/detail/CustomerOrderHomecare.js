// ** React Imports
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import toast from "react-hot-toast";
import Icon from "src/@core/components/icon";
import CustomChip from "src/@core/components/mui/chip";
import { listOrderHomecare } from "src/services/orderHomecare";
import { selectColor } from "src/utils/helpers";
import { requestSearch } from "src/@core/utils/request-search";

const CustomerOrderHomecare = (props) => {
  const { dataList, loading } = props;
  const router = useRouter();
  const patientId = router.query.id;
  // ** State
  const [value, setValue] = useState("");
  const [dataListSearch, setDataListSearch] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const RowOptions = ({ data }) => {
    return (
      <Link href={`/order-homecare/detail/${data?.order_id}`}>
        <IconButton size="small">
          <Icon icon="mdi:eye-outline" fontSize={20} />
        </IconButton>
      </Link>
    );
  };

  const columns = [
    {
      flex: 0.12,
      minWidth: 120,
      field: "booking_code",
      headerName: "Kode Booking",
      renderCell: ({ row }) => (
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          {row.booking_code}
        </Typography>
      ),
    },
    {
      flex: 0.16,
      minWidth: 130,
      field: "address",
      headerName: "Alamat",
      renderCell: ({ row }) => (
        <Box>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="subtitle2" sx={{ color: "text.primary" }}>
              {row.complete_address}
            </Typography>
          </Box>
          <CustomChip
            size="small"
            skin="dark"
            color={selectColor(row?.status)}
            label={`${row?.status}`}
            sx={{ "& .MuiChip-label": { textTransform: "capitalize" } }}
          />
        </Box>
      ),
    },
    {
      flex: 0.17,
      minWidth: 100,
      field: "bookingDate",
      headerName: "Tanggal Booking",
      renderCell: ({ row }) => (
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          {row.date}
        </Typography>
      ),
    },
    {
      flex: 0.1,
      minWidth: 50,
      field: "action",
      headerName: "Action",
      renderCell: ({ row }) => <RowOptions data={row} />,
    },
  ];

  const handleSearch = (val) => {
    setValue(val);
    const filteredData = requestSearch(val, dataList);
    setDataListSearch(filteredData);
  };

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
              <Box />
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
                  onChange={(e) => {
                    handleSearch(e.target.value);
                  }}
                />
              </Box>
            </Box>
          </>
        }
      />
      <CardContent>
        <DataGrid
          autoHeight
          rows={value ? dataListSearch : dataList}
          columns={columns}
          loading={loading}
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
