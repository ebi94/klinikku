import React, { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useAuth } from "src/hooks/useAuth";
import Icon from "src/@core/components/icon";
import PageHeader from "src/@core/components/page-header";
import TableHeader from "src/views/articles/TableHeader";
import { listArticle } from "src/services/cms";
import AddArticleDrawer from "src/views/articles/AddArticleDrawer";
import CustomChip from "src/@core/components/mui/chip";
import "react-photo-view/dist/react-photo-view.css";
import DetailArticleDrawer from "src/views/articles/DetailArticleDrawer";

const TypographyStyled = styled(Typography)(({ theme }) => ({
  textDecoration: "none",
  fontWeight: 800,
  color: theme.palette.primary.main,
}));

const Articles = () => {
  const { logout } = useAuth;

  const [value, setValue] = useState("");
  const [dataList, setDataList] = useState([]);
  const [dataListSearch, setDataListSearch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeForm, setTypeForm] = useState("Add");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [dataDetail, setDataDetail] = useState({});
  const [dialogAddArticle, setDialogAddArticle] = useState(false);
  const [dialogDetailArticle, setDialogDetailArticle] = useState(false);

  const requestSearch = (value) => {
    const searchRegex = new RegExp(`.*${value}.*`, "ig");

    const filteredRows = dataList.filter((o) => {
      return Object.keys(o).some((k) => {
        return searchRegex.test(o[k].toString());
      });
    });

    setDataListSearch(filteredRows);
  };

  const columns = [
    {
      flex: 0.05,
      field: "id",
      minWidth: 80,
      headerName: "Id",
      renderCell: ({ row }) => (
        <Typography variant="body2">{row?.id}</Typography>
      ),
    },
    {
      flex: 0.25,
      minWidth: 90,
      field: "title",
      headerName: "Title",
      renderCell: ({ row }) => {
        const plainString = row?.content.replace(/(<[^>]+>)|&nbsp;/g, "");

        return (
          <>
            <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  minWidth: "60px",
                }}
              >
                <PhotoProvider>
                  <PhotoView src={row?.media?.image}>
                    <img
                      src={row?.media?.image}
                      alt={row?.media?.name}
                      height={40}
                      sx={{ maxWidth: "60px" }}
                    />
                  </PhotoView>
                </PhotoProvider>
              </Box>
              <Box
                sx={{
                  mx: 4,
                  flex: "1 1",
                  display: "flex",
                  overflow: "hidden",
                  flexDirection: "column",
                }}
              >
                {row?.is_highlighted ? (
                  <Badge
                    badgeContent=" "
                    color="info"
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  >
                    <Typography variant="body2">{row?.title}</Typography>
                  </Badge>
                ) : (
                  <Typography variant="body2">{row?.title}</Typography>
                )}
                <Typography variant="caption" sx={{ color: "text.disabled" }}>
                  {plainString}
                </Typography>
              </Box>
            </Box>
          </>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 90,
      field: "name",
      headerName: "Category",
      renderCell: ({ row }) => (
        <Typography variant="body2">{row?.category?.name}</Typography>
      ),
    },
    {
      flex: 0.15,
      minWidth: 90,
      field: "created_at",
      headerName: "Created At",
      renderCell: ({ row }) => (
        <Typography variant="body2">{row?.created_at}</Typography>
      ),
    },
    {
      flex: 0.1,
      minWidth: 90,
      field: "active",
      headerName: "Status",
      renderCell: ({ row }) => {
        if (row?.active) {
          return (
            <CustomChip
              size="small"
              skin="light"
              color="primary"
              label="Active"
              sx={{ height: 20, fontSize: "0.75rem", fontWeight: 600 }}
            />
          );
        } else {
          return (
            <CustomChip
              size="small"
              skin="light"
              color="error"
              label="Not Active"
              sx={{ height: 20, fontSize: "0.75rem", fontWeight: 600 }}
            />
          );
        }
      },
    },
    {
      flex: 0.05,
      minWidth: 130,
      sortable: false,
      field: "actions",
      headerName: "Aksi",
      renderCell: ({ row }) => (
        <Grid container spacing={3}>
          <Grid item>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="View Detail Article">
                <IconButton
                  size="small"
                  onClick={() => {
                    setDialogDetailArticle(!dialogDetailArticle);
                    setDataDetail(row);
                  }}
                >
                  <Icon icon="mdi:eye-outline" fontSize={20} />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
          <Grid item>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="Edit Article">
                <IconButton
                  size="small"
                  onClick={() => {
                    setDialogAddArticle(!dialogAddArticle);
                    setTypeForm("Edit");
                    setDataDetail(row);
                  }}
                >
                  <Icon icon="mdi:pencil-outline" fontSize={20} />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      ),
    },
  ];

  const handleFilter = useCallback((val) => {
    setValue(val);
  }, []);

  const fetchDataList = async () => {
    const res = await listArticle();
    if (+res?.result?.status === 200) {
      const data = res?.result?.data !== null ? res?.result?.data : [];

      if (+data.length > 0) {
        setLoading(false);

        const mappingDataList = data.map((item) => {
          return {
            id: item?.article_id,
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
    requestSearch(value);
  }, [value]);

  useEffect(() => {
    fetchDataList();
  }, []);

  return (
    <>
      <Grid container spacing={6}>
        <PageHeader
          title="Article List"
          subtitle={
            <Typography variant="body2">
              List of Articles on KlinikKu Apps
            </Typography>
          }
        />
        <Grid item xs={12}>
          <Card>
            <TableHeader
              value={value}
              handleFilter={handleFilter}
              toggle={() => {
                setDialogAddArticle(!dialogAddArticle);
                setTypeForm("Add");
              }}
              title={"Article"}
            />
            <DataGrid
              autoHeight
              pagination
              disableColumnMenu
              loading={loading}
              rows={value ? dataListSearch : dataList}
              columns={columns}
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
            />
          </Card>
        </Grid>
      </Grid>
      <AddArticleDrawer
        open={dialogAddArticle}
        toggle={() => setDialogAddArticle(!dialogAddArticle)}
        type={typeForm}
        dataDetail={dataDetail}
        onRefresh={fetchDataList}
      />
      <DetailArticleDrawer
        open={dialogDetailArticle}
        toggle={() => setDialogDetailArticle(!dialogDetailArticle)}
        toggleEdit={() => {
          setDialogDetailArticle(!dialogDetailArticle);
          setTypeForm("Edit");
          setDialogAddArticle(!dialogAddArticle);
        }}
        dataDetail={dataDetail}
      />
    </>
  );
};

export default Articles;
