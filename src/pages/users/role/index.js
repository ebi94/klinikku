import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import toast from "react-hot-toast";
import PageHeader from "src/@core/components/page-header";
import RolesCards from "src/views/users/role/RoleCards";
import { listRole } from "src/services/roles";
import SpinnerLoadData from "src/@core/components/spinner-load-data";

const TypographyStyled = styled(Typography)(({ theme }) => ({
  textDecoration: "none",
  fontWeight: 800,
  color: theme.palette.primary.main,
}));

const UsersRole = ({ apiData }) => {
  const [loading, setLoading] = useState(true);
  const [dataList, setDataList] = useState([]);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen);

  const fetchDataList = async () => {
    const res = await listRole();
    if (+res?.result?.status === 200) {
      const data = res?.result?.data !== null ? res?.result?.data : [];

      const mappingDataList = data.map((item) => {
        return {
          id: item?.role_id,
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
    <Grid container spacing={6}>
      <PageHeader
        title="Roles List"
        subtitle="A role provided access to predefined menus and features so that depending on assigned role an administrator can have access to what he need"
      />
      <Grid item xs={12} sx={{ mb: 4 }}>
        {loading ? (
          <SpinnerLoadData />
        ) : (
          <RolesCards dataList={dataList} onRefresh={fetchDataList} />
        )}
      </Grid>
    </Grid>
  );
};

export default UsersRole;
