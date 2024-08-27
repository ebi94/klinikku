import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import PageHeader from "src/@core/components/page-header";
import CardBanners from "src/views/banners/CardBanners";
import Icon from "src/@core/components/icon";
import { useAuth } from "src/hooks/useAuth";
import AddAdvertisementDrawer from "src/views/advertisements/AddAdvertisementDrawer";
import { listAdvertisement } from "src/services/advertisements";
import EmptyState from "src/views/components/empty-state/EmptyState";

const Advertisements = () => {
  const { logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [dataList, setDataList] = useState([]);
  const [dataDetail, setDataDetail] = useState({});
  const [typeForm, setTypeForm] = useState("Add");
  const [dialogAdd, setDialogAdd] = useState(false);
  const [dialogConfirm, setDialogConfirm] = useState(false);
  const [dataConfirmDialog, setDataConfirmDialog] = useState({ title: "" });

  const handleConfirmDialog = (type) => {
    if (type === "remove") {
      setDataConfirmDialog({ title: "Are you sure to remove this Banner ?" });
      setDialogConfirm(true);
    }
  };

  const fetchDataList = async () => {
    const res = await listAdvertisement();
    if (+res?.result?.status === 200) {
      const data = res?.result?.data;
      if (data !== null) {
        if (+data.length > 0 && data !== null) {
          setLoading(false);

          const mappingDataList = data.map((item) => {
            return {
              id: item?.advertisement_id,
              ...item,
            };
          });
          setDataList(mappingDataList);
        }
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

  const toggleDialog = () => {
    setDialogAdd(!dialogAdd);
    fetchDataList();
  };

  useEffect(() => {
    fetchDataList();
  }, []);

  return (
    <>
      <Grid container spacing={6}>
        <PageHeader
          title="Advertisement List"
          subtitle="List of Advertisements to using in KlinikKu Apps"
        />
        <Grid item md={12} sm={12} xs={12}>
          <Button
            sx={{ minWidth: 150, float: "right" }}
            color="success"
            variant="contained"
            size="small"
            startIcon={<Icon icon="mdi:plus" />}
            onClick={() => {
              setTypeForm("Add");
              setDialogAdd(!dialogAdd);
            }}
          >
            Tambah Baru
          </Button>
        </Grid>
        <Grid item md={12} sm={12} xs={12}>
          {dataList?.length === 0 ? (
            <>
              <EmptyState />
            </>
          ) : (
            <></>
          )}
          {loading ? (
            <Box
              sx={{
                display: "flex",
                minHeight: "50vh",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress size={50} />
            </Box>
          ) : (
            <>
              {dataList.map((item) => (
                <>
                  <CardBanners
                    dataDetail={item}
                    onEdit={() => {
                      setTypeForm("Edit");
                      setDialogAdd(!dialogAdd);
                      setDataDetail(item);
                    }}
                  />
                </>
              ))}
            </>
          )}
        </Grid>
      </Grid>
      <Dialog
        maxWidth="xs"
        fullWidth
        open={dialogConfirm}
        onClose={() => setDialogConfirm(false)}
      >
        <DialogTitle>{dataConfirmDialog?.title}</DialogTitle>
        <DialogActions
          sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
        >
          <Button
            color="error"
            sx={{ width: "100%" }}
            onClick={() => {
              setDialogConfirm(false), toggleDialog();
            }}
            variant="contained"
            size="small"
          >
            Tidak
          </Button>
          <Button
            color="success"
            sx={{ width: "100%" }}
            onClick={() => {
              setDialogConfirm(false), toggleDialog();
            }}
            variant="contained"
            size="small"
          >
            Iya
          </Button>
        </DialogActions>
      </Dialog>
      <AddAdvertisementDrawer
        open={dialogAdd}
        toggle={toggleDialog}
        type={typeForm}
        dataDetail={dataDetail}
      />
    </>
  );
};

export default Advertisements;
