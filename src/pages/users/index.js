import { useState, useEffect, useCallback, use } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { DataGrid } from "@mui/x-data-grid";
import Icon from "src/@core/components/icon";
import PageHeader from "src/@core/components/page-header";
import { useAuth } from "src/hooks/useAuth";
import CustomChip from "src/@core/components/mui/chip";
import CustomAvatar from "src/@core/components/mui/avatar";
import { getInitials } from "src/@core/utils/get-initials";
import TableHeader from "src/views/users/list/TableHeader";
import { listUser } from "src/services/users";
import { requestSearch } from "src/@core/utils/request-search";

const userStatusObj = {
  active: "success",
  inactive: "secondary",
};

const LinkStyled = styled(Link)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "0.80rem",
  cursor: "pointer",
  textDecoration: "none",
  color: theme.palette.text.secondary,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

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
        color={row?.avatarColor || "primary"}
        sx={{ mr: 3, width: 30, height: 30, fontSize: ".875rem" }}
      >
        {getInitials(row?.name ? row?.name : "John Doe")}
      </CustomAvatar>
    );
  }
};

const RowOptions = ({ data }) => {
  return (
    <LinkStyled href={`/users/detail/${data?.user_id}`}>
      <IconButton size="small">
        <Icon icon="mdi:eye-outline" fontSize={20} />
      </IconButton>
    </LinkStyled>
  );
};

const UsersList = () => {
  // ** State

  const [loading, setLoading] = useState(true);
  const [dataList, setDataList] = useState([]);
  const [dataListSearch, setDataListSearch] = useState([]);
  const [value, setValue] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const breadCrumbs = [
    { id: 1, path: "/dashboards", name: "Home" },
    { id: 2, path: "#", name: "Users List" },
  ];

  // ** Hooks
  const { logout } = useAuth();

  const handleFilter = useCallback((val) => {
    setValue(val);
    const filteredData = requestSearch(val, dataList);
    setDataListSearch(filteredData);
  }, []);

  const columns = [
    {
      flex: 0.15,
      field: "name",
      headerName: "User Name",
      renderCell: ({ row }) => {
        const { name, username, gender } = row;

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
              <LinkStyled href="/apps/user/view/overview/">{name}</LinkStyled>
              <Typography noWrap variant="caption">
                {`@${username}`} |{" "}
                {gender === "Male" ? "Laki-laki" : "Perempuan"}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      flex: 0.15,
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
      flex: 0.07,
      field: "role",
      headerName: "Role",
      renderCell: ({ row }) => {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography
              noWrap
              sx={{ color: "text.primary", textTransform: "capitalize" }}
              variant="caption"
            >
              {row?.role?.name}
            </Typography>
          </Box>
        );
      },
    },
    {
      flex: 0.1,
      field: "created",
      headerName: "Created At",
      renderCell: ({ row }) => {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              flexDirection: "column",
            }}
          >
            <Typography
              noWrap
              sx={{ color: "text.primary", textTransform: "capitalize" }}
              variant="caption"
            >
              by: {row?.created_by}
            </Typography>
            <Typography
              noWrap
              sx={{ color: "text.primary", textTransform: "capitalize" }}
              variant="caption"
            >
              {row?.created_at}
            </Typography>
          </Box>
        );
      },
    },
    {
      flex: 0.07,
      field: "status",
      headerName: "Status",
      renderCell: ({ row }) => {
        return (
          <CustomChip
            skin="light"
            size="small"
            label={row?.is_active ? "Active" : "Inactive"}
            color={userStatusObj[row?.is_active ? "active" : "inactive"]}
            sx={{ textTransform: "capitalize" }}
          />
        );
      },
    },
    {
      flex: 0.07,
      sortable: false,
      field: "actions",
      headerName: "Aksi",
      renderCell: ({ row }) => <RowOptions data={row} />,
    },
  ];

  const fetchUserslist = async () => {
    setLoading(true);
    const res = await listUser();
    if (+res?.result?.status === 200) {
      const data = res?.result?.data !== null ? res?.result?.data : [];

      if (+data.length > 0) {
        setLoading(false);

        const mappingDataList = data.map((item) => {
          return {
            id: item?.user_id,
            ...item,
          };
        });
        setDataList(mappingDataList);
      } else {
        setLoading(false);
        setDataList([]);
      }
    } else {
      setLoading(false);
      toast.error(`Opps ! ${res?.error} ${res?.status}`);
      if (+res?.status === 401) {
        logout();
      }
    }
  };

  useEffect(() => {
    fetchUserslist();
  }, []);

  return (
    <Grid container spacing={6}>
      <PageHeader
        title="Users List"
        breadCrumbs={breadCrumbs}
        subtitle="List of Users using KlinikKu Backoffice"
      />
      <Grid item xs={12}>
        <Card>
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

export default UsersList;
