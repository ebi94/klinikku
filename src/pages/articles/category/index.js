import React, { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import PageHeader from "src/@core/components/page-header";
import Icon from "src/@core/components/icon";
import { useAuth } from "src/hooks/useAuth";
import TableHeader from "src/views/articles/TableHeader";
import AddCategoryArticleDrawer from "src/views/articles/AddCategoryArticleDrawer";
import { listCategoryArticle } from "src/services/cms";

const TypographyStyled = styled(Typography)(({ theme }) => ({
  textDecoration: "none",
  fontWeight: 800,
  color: theme.palette.primary.main,
}));

const CategoryArticles = () => {
  const { logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("Add");
  const [dataDetail, setDataDetail] = useState({});
  const [dataList, setDataList] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [dialogForm, setDialogForm] = useState(false);

  const columns = [
    {
      flex: 0.1,
      field: "id",
      minWidth: 80,
      headerName: "Id",
      renderCell: ({ row }) => (
        <Typography variant="body2">{row?.id}</Typography>
      ),
    },
    {
      flex: 0.7,
      minWidth: 90,
      field: "name",
      headerName: "Category Name",
      renderCell: ({ row }) => (
        <Typography variant="body2">{row?.name}</Typography>
      ),
    },
    {
      flex: 0.2,
      minWidth: 130,
      sortable: false,
      field: "actions",
      headerName: "Aksi",
      renderCell: ({ row }) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            size="small"
            onClick={() => {
              setDataDetail(row);
              setType("Edit");
              setDialogForm(!dialogForm);
            }}
          >
            <Icon icon="mdi:pencil-outline" fontSize={20} />
          </IconButton>
        </Box>
      ),
    },
  ];

  const fetchDataList = async () => {
    const res = await listCategoryArticle();
    if (+res?.result?.status === 200) {
      const data = res?.result?.data !== null ? res?.result?.data : [];
      if (+data.length > 0) {
        setLoading(false);

        const mappingDataList = data.map((item) => {
          return {
            id: item?.article_category_id,
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
    fetchDataList();
  }, []);

  return (
    <>
      <Grid container spacing={6}>
        <PageHeader
          title={
            <TypographyStyled variant="h5">
              Category Article List
            </TypographyStyled>
          }
          subtitle={
            <Typography variant="body2">
              List of Category Articles on KlinikKu Apps
            </Typography>
          }
        />
        <Grid item xs={12}>
          <Card>
            <TableHeader
              disabledFilter
              toggle={() => {
                setType("Add");
                setDialogForm(!dialogForm);
              }}
              title={"Category"}
            />
            <DataGrid
              autoHeight
              pagination
              disableColumnMenu
              loading={loading}
              rows={dataList}
              columns={columns}
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
            />
          </Card>
        </Grid>
      </Grid>

      <AddCategoryArticleDrawer
        dataDetail={dataDetail}
        type={type}
        open={dialogForm}
        toggle={() => setDialogForm(!dialogForm)}
        onRefresh={fetchDataList}
      />
    </>
  );
};

export default CategoryArticles;
