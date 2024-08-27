import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import CircularProgress from "@mui/material/CircularProgress";

const DialogConfirm = (props) => {
  const { open, toggle, onSubmit, data, loading } = props;

  return (
    <Dialog maxWidth="xs" fullWidth open={open} onClose={() => toggle()}>
      <DialogTitle>{data?.title}</DialogTitle>
      <DialogActions
        sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
      >
        <Button
          color="error"
          sx={{ width: "100%" }}
          onClick={() => toggle()}
          variant="contained"
          disabled={loading}
          size="small"
        >
          Tidak
        </Button>
        <Button
          color="success"
          sx={{ width: "100%" }}
          onClick={() => onSubmit()}
          variant="contained"
          disabled={loading}
          size="small"
        >
          {!loading ? "Ya, Yakin" : <CircularProgress size={25} />}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogConfirm;
