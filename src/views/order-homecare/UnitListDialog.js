import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Tooltip from "@mui/material/Tooltip";
import CustomChip from "src/@core/components/mui/chip";
import { listClinic, listNurse } from "src/services/global";
import { Typography } from "@mui/material";

const UnitListDialog = (props) => {
  const { bookingData, open, toggle, submitNurse, loading } = props;

  const [unitOptions, setUnitOptions] = useState([]);
  const [nurseOptions, setNurseOptions] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedNurse, setSelectedNurse] = useState(null);

  const fetchDataClinic = async () => {
    const res = await listClinic();
    if (+res?.result?.status === 200) {
      const data = res?.result?.data !== null ? res?.result?.data : [];

      const mappingDataList = data.map((item) => {
        return {
          id: item?.clinic_id,
          ...item,
        };
      });
      setUnitOptions(mappingDataList);
    } else {
      toast.error(`Status Code : ${res?.error}`);
    }
  };

  const fetchDataNurse = async (id) => {
    setNurseOptions([]);
    const res = await listNurse(id, bookingData?.order_id);
    if (+res?.result?.status === 200) {
      const data = res?.result?.data !== null ? res?.result?.data : [];

      const mappingDataList = data.map((item) => {
        return {
          id: item?.clinic_id,
          ...item,
        };
      });
      setNurseOptions(mappingDataList);
    } else {
      console.error(res);
      toast.error(`Status Code : ${res?.error}`);
    }
  };

  useEffect(() => {
    if (selectedUnit === null) setSelectedNurse(null);
  }, [selectedUnit]);

  useEffect(() => {
    fetchDataClinic();
  }, []);

  return (
    <Dialog maxWidth="xs" fullWidth open={open} onClose={() => toggle()}>
      <DialogTitle>Pilih Klinik/Unit & Perawat</DialogTitle>
      <DialogContent>
        <form>
          <Autocomplete
            sx={{ mt: 2, mb: 2, width: "100%" }}
            disabled={loading}
            id="select-unit"
            fullWidth
            size="small"
            options={unitOptions}
            onChange={(e, val) => {
              setSelectedUnit(val);
              fetchDataNurse(val?.clinic_id);
            }}
            autoHighlight
            getOptionLabel={(option) => option.name}
            renderOption={(props, option) => (
              <Grid
                container
                component="li"
                sx={{ mr: 2, flexShrink: 0 }}
                {...props}
              >
                <Grid item md={9}>
                  <Typography sx={{ fontSize: "12px", fontWeight: 600 }}>
                    {option?.name} ({option?.code})
                  </Typography>
                  <Typography sx={{ fontSize: "10px", width: "100%" }} noWrap>
                    {option?.complete_address}
                  </Typography>
                </Grid>
                <Grid item md={3}>
                  <Typography variant="body2" sx={{ textAlign: "end" }}>
                    {(+option?.distance / 1000).toFixed(2)} Km
                  </Typography>
                </Grid>
              </Grid>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                fullWidth
                label="Pilih Unit"
                sx={{ mt: 2, mb: 2, width: "100%" }}
                disabled={loading}
                inputProps={{
                  ...params.inputProps,
                }}
              />
            )}
          />
          <Autocomplete
            sx={{ mt: 2, mb: 2, width: "100%" }}
            id="select-unit"
            fullWidth
            size="small"
            options={nurseOptions}
            onChange={(e, val) => {
              setSelectedNurse(val);
            }}
            autoHighlight
            disabled={selectedUnit === null}
            getOptionDisabled={(option) => !option.available}
            getOptionLabel={(option) => option.name}
            renderOption={(props, option) => (
              <Grid
                container
                component="li"
                sx={{ mr: 2, flexShrink: 0 }}
                {...props}
              >
                <Grid item md={6}>
                  <Typography sx={{ fontSize: "12px", fontWeight: 600 }}>
                    {option?.name}
                  </Typography>
                  <Typography sx={{ fontSize: "10px", width: "100%" }} noWrap>
                    {option?.complete_address}
                  </Typography>
                </Grid>
                <Grid item md={6}>
                  <Typography variant="body2" sx={{ textAlign: "end" }}>
                    <CustomChip
                      size="small"
                      skin="dark"
                      color={!option?.available ? "error" : "success"}
                      label={option?.available ? "Tersedia" : "Tidak Tersedia"}
                      sx={{
                        "& .MuiChip-label": { textTransform: "capitalize" },
                      }}
                    />
                  </Typography>
                </Grid>
              </Grid>
            )}
            renderInput={(params) => (
              <Tooltip
                title={
                  selectedUnit === null ? "Silahkan Pilih Klinik/Unit" : ""
                }
                placement="bottom"
              >
                <TextField
                  {...params}
                  sx={{ mt: 2, mb: 2, width: "100%" }}
                  disabled={loading || nurseOptions?.length === 0}
                  size="small"
                  fullWidth
                  label="Pilih perawat"
                  inputProps={{
                    ...params.inputProps,
                  }}
                />
              </Tooltip>
            )}
          />
        </form>
      </DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "space-between" }}>
        <Grid container>
          <Grid item xs={5} md={3}>
            <Button
              color="warning"
              fullWidth
              onClick={() => toggle()}
              variant="contained"
              size="small"
              disabled={loading}
            >
              Batal
            </Button>
          </Grid>
          <Grid item xs={2} md={6}></Grid>
          <Grid item xs={5} md={3}>
            <Button
              color="success"
              fullWidth
              onClick={() => submitNurse(selectedUnit, selectedNurse)}
              variant="contained"
              size="small"
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : "Pilih"}
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

export default UnitListDialog;
