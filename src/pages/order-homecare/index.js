import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import PageHeader from "src/@core/components/page-header";
import Icon from "src/@core/components/icon";
import CustomChip from "src/@core/components/mui/chip";
import TableHeader from "src/views/order-homecare/TableHeader";
import { listOrderHomecare } from "src/services/orderHomecare";
import { requestSearch } from "src/@core/utils/request-search";
import { selectColor } from "src/utils/helpers";
import AddOrderDrawer from "src/views/order-homecare/AddOrderDrawer";

/* eslint-enable */
const OrderHomecare = () => {
  // ** State
  const [dataList, setDataList] = useState([]);
  const [dataListSearch, setDataListSearch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState("");
  const [drawerCreate, setDrawerCreate] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const breadCrumbs = [
    { id: 1, path: "/dashboards", name: "Home" },
    { id: 2, path: "/order-homecare", name: "Order Homecare List" },
  ];

  const handleFilter = (val) => {
    setValue(val);
    const filteredData = requestSearch(val, dataList);
    setDataListSearch(filteredData);
  };

  const columns = [
    {
      flex: 0.1,
      minWidth: 150,
      field: "id",
      headerName: "Kode Booking",
      renderCell: ({ row }) => (
        <Link
          href={`/order-homecare/detail/${row?.order_id}`}
        >{`#${row?.booking_code}`}</Link>
      ),
    },
    {
      flex: 0.1,
      field: "name",
      minWidth: 200,
      headerName: "Nama Pasien",
      renderCell: ({ row }) => {
        const { patient } = row;
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* {renderClient(row)} */}
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                noWrap
                variant="body2"
                sx={{ color: "text.primary", fontWeight: 600 }}
              >
                {patient?.name}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "inline-flex" }}>
                <Typography noWrap variant="caption">
                  {patient?.gender === "Male" ? "Laki-laki" : "Wanita"}
                </Typography>
                <Typography sx={{ marginLeft: 1 }} variant="body2">
                  | {patient?.age}
                </Typography>
              </Box>
            </Box>
          </Box>
        );
      },
    },
    {
      flex: 0.15,
      minWidth: 150,
      field: "complete_address",
      headerName: "Alamat",
      renderCell: ({ row }) => (
        <Tooltip title={`${row?.complete_address}`}>
          <Typography
            variant="body2"
            sx={{
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {row?.complete_address}
          </Typography>
        </Tooltip>
      ),
    },
    {
      flex: 0.12,
      minWidth: 150,
      field: "bookingDate",
      headerName: "Tanggal Booking",
      renderCell: ({ row }) => (
        <Typography variant="body2">{row?.date}</Typography>
      ),
    },
    {
      flex: 0.08,
      minWidth: 100,
      field: "status",
      headerName: "Status",
      renderCell: ({ row }) => (
        <CustomChip
          size="small"
          skin="dark"
          color={selectColor(row?.status)}
          label={`${row?.status}`}
          sx={{ "& .MuiChip-label": { textTransform: "capitalize" } }}
        />
      ),
    },
    {
      flex: 0.1,
      minWidth: 100,
      sortable: false,
      field: "actions",
      headerName: "Aksi",
      renderCell: ({ row }) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="View Detail Order">
            <IconButton
              size="small"
              component={Link}
              href={`/order-homecare/detail/${row?.order_id}`}
            >
              <Icon icon="mdi:eye-outline" fontSize={20} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const fetchDataList = async () => {
    const res = await listOrderHomecare();
    if (+res?.result?.status === 200) {
      const data = res?.result?.data !== null ? res?.result?.data : [];

      const mappingDataList = data.map((item) => {
        return {
          id: item?.order_id,
          ...item?.patient,
          ...item,
        };
      });
      setDataList(mappingDataList);
      setLoading(false);
    } else {
      toast.error(`Status Code : ${res?.error}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataList();
  }, []);

  return (
    <>
      <Grid container spacing={6}>
        <PageHeader
          breadCrumbs={breadCrumbs}
          title="Order Homecare List"
          subtitle="List of Customer Order Homecare using KlinikKu Apps"
        />
        <Grid item xs={12}>
          <Card>
            <TableHeader
              value={value}
              onClicCreate={() => setDrawerCreate(true)}
              selectedRows={selectedRows}
              handleFilter={handleFilter}
            />
            <DataGrid
              autoHeight
              pagination
              disableColumnMenu
              rows={value ? dataListSearch : dataList}
              columns={columns}
              loading={loading}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              onRowSelectionModelChange={(rows) => setSelectedRows(rows)}
            />
          </Card>
        </Grid>
      </Grid>
      <AddOrderDrawer
        open={drawerCreate}
        onRefresh={fetchDataList}
        onClose={() => setDrawerCreate(false)}
      />
    </>
  );
};

export default OrderHomecare;
