import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { DataGrid } from "@mui/x-data-grid";
import Icon from "src/@core/components/icon";
import PageHeader from "src/@core/components/page-header";
import CardStatisticsHorizontal from "src/@core/components/card-statistics/card-stats-horizontal";
import axios from "axios";
import toast from "react-hot-toast";
import TableHeader from "src/views/clinic/TableHeader";
import { requestSearch } from "src/@core/utils/request-search";
import { listClinic } from "src/services/clinics";

const LinkStyled = styled(Link)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "1rem",
  cursor: "pointer",
  textDecoration: "none",
  color: theme.palette.text.secondary,
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

const Customers = ({ apiData }) => {
  // ** State
  const [dataHeader, setDataHeader] = useState([
    {
      stats: 1,
      title: "New Clinic",
      color: "info",
      icon: "mdi:office-building-outline",
    },
    {
      stats: 0,
      color: "success",
      title: "Total Clinics",
      icon: "mdi:office-building-outline",
    },
  ]);
  const [dataList, setDataList] = useState([]);
  const [dataListSearch, setDataListSearch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState("");
  const [addClinicOpen, setAddClinicOpen] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const breadCrumbs = [
    { id: 1, path: "/dashboards", name: "Home" },
    { id: 2, path: "#", name: "Clinic List" },
  ];

  const handleFilter = (val) => {
    setValue(val);
    const filteredData = requestSearch(val, dataList);
    setDataListSearch(filteredData);
  };

  const RowOptions = ({ data }) => {
    return (
      <>
        <LinkStyled href={`/clinic/detail/${data?.id}`}>
          <IconButton size="small">
            <Icon icon="mdi:eye-outline" fontSize={20} />
          </IconButton>
        </LinkStyled>
      </>
    );
  };

  const columns = [
    {
      flex: 0.2,
      minWidth: 200,
      field: "name",
      headerName: "Nama Klinik",
      renderCell: ({ row }) => {
        const { id, name, code } = row;
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                flexDirection: "column",
              }}
            >
              <LinkStyled href={`/clinic/detail/${id}`}>{name}</LinkStyled>
              <Typography noWrap variant="caption">
                {code}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      flex: 0.3,
      minWidth: 200,
      field: "complete_address",
      headerName: "Alamat",
      renderCell: ({ row }) => {
        return (
          <Tooltip title={`${row?.complete_address}`}>
            <Typography noWrap variant="body2">
              {row.complete_address}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 200,
      field: "phone",
      headerName: "No Telepon",
      renderCell: ({ row }) => {
        return (
          <Typography noWrap variant="body2">
            {row?.phone ?? "-"}
          </Typography>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 50,
      sortable: false,
      field: "actions",
      headerName: "Aksi",
      renderCell: ({ row }) => <RowOptions data={row} />,
    },
  ];

  // ** Hooks
  const fetchDataList = async () => {
    const res = await listClinic();
    if (+res?.result?.status === 200) {
      const data = res?.result?.data !== null ? res?.result?.data : [];
      let tempDataHeader = [...dataHeader];
      tempDataHeader[1].stats = `${data?.length}`;
      setDataHeader(tempDataHeader);
      const mappingDataList = data.map((item) => {
        return {
          id: item?.clinic_id,
          ...item,
        };
      });
      setDataList(mappingDataList);
      setLoading(false);
    } else {
      toast.error(`Opps ! Something Wrong : ${res?.error}`);
      setLoading(false);
    }
  };

  const toggleAddClinicDrawer = () => setAddClinicOpen(!addClinicOpen);

  useEffect(() => {
    fetchDataList();
  }, []);

  return (
    <Grid container spacing={6}>
      <PageHeader
        breadCrumbs={breadCrumbs}
        title="Clinic List"
        subtitle="List of Clinic using KlinikKu Apps"
      />
      <Grid item xs={12}>
        <Grid container spacing={6}>
          {dataHeader.map((item, index) => {
            return (
              <Grid item xs={12} md={6} sm={6} key={index}>
                <CardStatisticsHorizontal
                  {...item}
                  icon={<Icon icon={item.icon} />}
                />
              </Grid>
            );
          })}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Card>
          {/* <CardHeader title="Cari Filters" /> */}
          {/* <CardContent>
            <Grid container spacing={6}>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel id="role-select">Select Role</InputLabel>
                  <Select
                    fullWidth
                    value={role}
                    id="select-role"
                    label="Select Role"
                    labelId="role-select"
                    onChange={handleRoleChange}
                    inputProps={{ placeholder: 'Select Role' }}>
                    <MenuItem value="">Select Role</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="author">Author</MenuItem>
                    <MenuItem value="editor">Editor</MenuItem>
                    <MenuItem value="maintainer">Maintainer</MenuItem>
                    <MenuItem value="subscriber">Subscriber</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel id="plan-select">Select Plan</InputLabel>
                  <Select
                    fullWidth
                    value={plan}
                    id="select-plan"
                    label="Select Plan"
                    labelId="plan-select"
                    onChange={handlePlanChange}
                    inputProps={{ placeholder: 'Select Plan' }}>
                    <MenuItem value="">Select Plan</MenuItem>
                    <MenuItem value="basic">Basic</MenuItem>
                    <MenuItem value="company">Company</MenuItem>
                    <MenuItem value="enterprise">Enterprise</MenuItem>
                    <MenuItem value="team">Team</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel id="status-select">Select Status</InputLabel>
                  <Select
                    fullWidth
                    value={status}
                    id="select-status"
                    label="Select Status"
                    labelId="status-select"
                    onChange={handleStatusChange}
                    inputProps={{ placeholder: 'Select Role' }}>
                    <MenuItem value="">Select Role</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent> */}
          <Divider />
          <TableHeader value={value} handleFilter={handleFilter} />
          <DataGrid
            autoHeight
            rows={value ? dataListSearch : dataList}
            loading={loading}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>
    </Grid>
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

export default Customers;
