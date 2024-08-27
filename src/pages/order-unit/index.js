import { useState, useEffect } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import Icon from "src/@core/components/icon";
import CardStatisticsHorizontal from "src/@core/components/card-statistics/card-stats-horizontal";
import PageHeader from "src/@core/components/page-header";
import CustomChip from "src/@core/components/mui/chip";
import TableHeader from "src/views/order-unit/TableHeader";
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
import { listOrderUnit } from "src/services/orderUnit";
import axios from "axios";
import toast from "react-hot-toast";
import { selectColor } from "src/utils/helpers";
import { requestSearch } from "src/@core/utils/request-search";
import AddOrderDrawer from "src/views/order-unit/AddOrderDrawer";

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  color: theme.palette.primary.main,
}));

/* eslint-enable */
const OrderUnit = ({ apiData }) => {
  // ** State
  const [dataList, setDataList] = useState([]);
  const [dataListSearch, setDataListSearch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState("");
  const [drawerCreate, setDrawerCreate] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const breadCrumbs = [
    { id: 1, path: "/dashboards", name: "Home" },
    { id: 2, path: "#", name: "Order Unit List" },
  ];
  // ** Hooks

  const handleFilter = (val) => {
    setValue(val);
    const filteredData = requestSearch(val, dataList);
    setDataListSearch(filteredData);
  };

  const handleToggle = () => {
    setDrawerCreate(!drawerCreate);
  };

  const columns = [
    {
      flex: 0.1,
      field: "id",
      minWidth: 150,
      headerName: "Kode Booking",
      renderCell: ({ row }) => (
        <LinkStyled
          href={`/order-unit/detail/${row?.order_id}`}
        >{`#${row?.booking_code}`}</LinkStyled>
      ),
    },
    {
      flex: 0.15,
      field: "name",
      minWidth: 250,
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
      flex: 0.2,
      minWidth: 140,
      field: "unit",
      headerName: "Unit",
      renderCell: ({ row }) => (
        <Typography variant="body2">{row?.unit}</Typography>
      ),
    },
    {
      flex: 0.15,
      minWidth: 125,
      field: "bookingDate",
      headerName: "Tanggal Booking",
      renderCell: ({ row }) => (
        <Typography variant="body2">{row?.date}</Typography>
      ),
    },
    {
      flex: 0.1,
      minWidth: 90,
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
      minWidth: 130,
      sortable: false,
      field: "actions",
      headerName: "Aksi",
      renderCell: ({ row }) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="View Detail Order">
            <IconButton
              size="small"
              component={Link}
              href={`/order-unit/detail/${row?.order_id}`}
            >
              <Icon icon="mdi:eye-outline" fontSize={20} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const fetchDataList = async () => {
    const res = await listOrderUnit();
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
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <PageHeader
          breadCrumbs={breadCrumbs}
          title="Order Unit List"
          subtitle="List of Customer Order Unit using KlinikKu Apps"
        />
        <Grid item xs={12}>
          {apiData && (
            <Grid container spacing={6}>
              {apiData.statsOrderHorizontal.map((item, index) => {
                return (
                  <Grid item xs={12} md={3} sm={6} key={index}>
                    <CardStatisticsHorizontal
                      {...item}
                      icon={<Icon icon={item.icon} />}
                    />
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Grid>
        <Grid item xs={12}>
          <Card>
            <TableHeader
              value={value}
              handleFilter={handleFilter}
              toggle={handleToggle}
            />
            <DataGrid
              autoHeight
              pagination
              disableColumnMenu
              loading={loading}
              rows={value ? dataListSearch : dataList}
              columns={columns}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
            />
          </Card>
        </Grid>
      </Grid>
      <AddOrderDrawer
        open={drawerCreate}
        onRefresh={fetchDataList}
        onClose={() => setDrawerCreate(false)}
      />
    </DatePickerWrapper>
  );
};

export const getStaticProps = async () => {
  const res = await axios.get("/cards/statistics");
  const apiData = res.data;

  return {
    props: {
      apiData,
    },
  };
};

export default OrderUnit;
