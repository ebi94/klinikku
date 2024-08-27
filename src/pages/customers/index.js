import { useState, useEffect } from "react";
import { useRouter } from "next/router";
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
import CustomAvatar from "src/@core/components/mui/avatar";
import CardStatisticsHorizontal from "src/@core/components/card-statistics/card-stats-horizontal";
import { getInitials } from "src/@core/utils/get-initials";
import axios from "axios";
import toast from "react-hot-toast";
import TableHeader from "src/views/customers/TableHeader";
import { requestSearch } from "src/@core/utils/request-search";
import { listCustomer } from "src/services/customers";

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
  const router = useRouter();
  // ** State
  const [dataHeader, setDataHeader] = useState([
    {
      stats: "5",
      title: "New Customers",
      icon: "mdi:account-outline",
    },
    {
      stats: "",
      color: "success",
      title: "Total Customers",
      icon: "mdi:account-multiple-outline",
    },
    {
      color: "info",
      stats: "19",
      title: "Customers Active",
      icon: "mdi:account-check-outline",
    },
    {
      stats: "3",
      color: "error",
      icon: "mdi:account-remove-outline",
      title: "Customers Not Active",
    },
  ]);
  const [dataList, setDataList] = useState([]);
  const [dataListSearch, setDataListSearch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState("");
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const breadCrumbs = [
    { id: 1, path: "/dashboards", name: "Home" },
    { id: 2, path: "#", name: "Customers List" },
  ];

  const handleFilter = (val) => {
    setValue(val);
    const filteredData = requestSearch(val, dataList);
    setDataListSearch(filteredData);
  };

  // ** renders client column
  const renderClient = (row) => {
    if (row?.avatar?.length) {
      return (
        <CustomAvatar src={row?.avatar} sx={{ mr: 3, width: 30, height: 30 }} />
      );
    } else {
      return (
        <CustomAvatar
          skin="light"
          color={row.avatarColor || "primary"}
          sx={{ mr: 3, width: 30, height: 30, fontSize: ".875rem" }}
        >
          {getInitials(row?.fullName ? row?.fullName : "John Doe")}
        </CustomAvatar>
      );
    }
  };

  const RowOptions = ({ data }) => {
    return (
      <LinkStyled href={`/customers/detail/${data?.patient_id}`}>
        <IconButton size="small">
          <Icon icon="mdi:eye-outline" fontSize={20} />
        </IconButton>
      </LinkStyled>
    );
  };

  const columns = [
    {
      flex: 0.2,
      minWidth: 200,
      field: "fullName",
      headerName: "Nama Pasien",
      renderCell: ({ row }) => {
        const { fullName, gender, age, patient_id } = row;

        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {renderClient(row)}
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                flexDirection: "column",
              }}
            >
              <LinkStyled href={`/customers/detail/${patient_id}`}>
                {fullName}
              </LinkStyled>
              <Typography noWrap variant="caption">
                {gender === "Male" ? "Laki-laki" : "Wanita"} | {age}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 200,
      field: "email",
      headerName: "Email",
      renderCell: ({ row }) => (
        <Tooltip title={`${row?.email}`}>
          <Typography
            variant="body2"
            sx={{
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {row?.email}
          </Typography>
        </Tooltip>
      ),
    },
    {
      flex: 0.2,
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
    // {
    //   flex: 0.15,
    //   field: "role",
    //   minWidth: 150,
    //   headerName: "Registration Source",
    //   renderCell: ({ row }) => {
    //     return (
    //       <Box
    //         sx={{
    //           display: "flex",
    //           alignItems: "center",
    //           "& svg": {
    //             mr: 3,
    //             color: userRoleObj[row?.registered_with]?.color,
    //           },
    //         }}
    //       >
    //         <Icon
    //           icon={userRoleObj[row?.registered_with]?.icon}
    //           fontSize={20}
    //         />
    //         <Typography
    //           noWrap
    //           sx={{ color: "text.secondary", textTransform: "capitalize" }}
    //         >
    //           {row.source}
    //         </Typography>
    //       </Box>
    //     );
    //   },
    // },
    {
      flex: 0.2,
      minWidth: 100,
      headerName: "No MR",
      field: "currentPlan",
      renderCell: ({ row }) => {
        return (
          <Typography noWrap sx={{ textTransform: "capitalize" }}>
            {row?.mr ?? "-"}
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
    const res = await listCustomer();
    if (+res?.result?.status === 200) {
      const data = res?.result?.data !== null ? res?.result?.data : [];
      let tempDataHeader = [...dataHeader];
      tempDataHeader[1].stats = data?.length;
      setDataHeader(tempDataHeader);

      const checkSource = (source) => {
        switch (source) {
          case "GOOGLE":
            return "Google";
          case "PHONE NUMBER":
            return "Phone";
        }
      };

      const mappingDataList = data.map((item) => {
        return {
          id: item?.user_id,
          fullName: item?.name,
          age: item?.date_of_birth,
          source: checkSource(item?.registered_with),
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

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen);

  useEffect(() => {
    fetchDataList();
  }, []);

  return (
    <Grid container spacing={6}>
      <PageHeader
        breadCrumbs={breadCrumbs}
        title="Customers List"
        subtitle="List of Customer using KlinikKu Apps"
      />
      <Grid item xs={12}>
        <Grid container spacing={6}>
          {dataHeader.map((item, index) => {
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
      </Grid>
      <Grid item xs={12}>
        <Card>
          <Divider />
          <TableHeader
            value={value}
            handleFilter={handleFilter}
            toggle={toggleAddUserDrawer}
          />
          <DataGrid
            autoHeight
            rows={value ? dataListSearch : dataList}
            columns={columns}
            loading={loading}
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
