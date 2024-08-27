import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { EditorState } from "draft-js";
import { EditorWrapper } from "src/@core/styles/libs/react-draft-wysiwyg";
import EditorControlled from "src/views/forms/form-elements/editor/EditorControlled";
import PageHeader from "src/@core/components/page-header";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const TypographyStyled = styled(Typography)(({ theme }) => ({
  textDecoration: "none",
  fontWeight: 800,
  color: theme.palette.primary.main,
}));

const CardHeaderStyled = styled(CardHeader)(({ theme }) => ({
  backgroundColor: theme.palette.customColors.tableHeaderBg,
  "&.MuiCardHeader-root": {
    padding: "1rem 1.25rem !important",
  },
  "&.MuiCardHeader-title": {
    fontSize: "1rem",
    color: theme.palette.customColors.darkBg,
  },
}));

const exampleData = [
  {
    id: 1,
    question: "Lorem ipsum doret amet apalaj aja wkwkkw",
    answer: "Lorem ipsum doret amet apalaj aja wkwkkw",
  },
  {
    id: 2,
    question: "Lorem ipsum doret amet apalaj aja wkwkkw",
    answer: "Lorem ipsum doret amet apalaj aja wkwkkw",
  },
];

const Banners = () => {
  const [editTnc, setEditTnc] = useState(false);
  const [dialogFaq, setDialogFaq] = useState(false);
  const [addNewFaq, setAddNewFaq] = useState(true);
  const [dialogSaveTnc, setDialogSaveTnc] = useState(false);
  const [dialogCancelTnc, setDialogCancelTnc] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [valueTnc, setValueTnc] = useState(EditorState.createEmpty());

  const columns = [
    {
      flex: 0.5,
      minWidth: 90,
      field: "question",
      headerName: "Question",
      renderCell: ({ row }) => (
        <Typography variant="body2">{row?.question ?? "-"}</Typography>
      ),
    },
    {
      flex: 0.5,
      minWidth: 90,
      field: "answwer",
      headerName: "Answer",
      renderCell: ({ row }) => (
        <Typography variant="body2">{row?.answer ?? "-"}</Typography>
      ),
    },
  ];

  return (
    <>
      <Grid container spacing={6} className="match-height">
        <PageHeader title="TnC & FAQ" />
        <Grid item md={12} sm={12} xs={12}>
          <Card>
            <CardHeaderStyled title="Terms and Conditions (TnC)" />
            <Divider sx={{ my: "0 !important" }} />
            <CardContent>
              <Box sx={{ mt: 4, width: "100%" }}>
                {editTnc ? (
                  <EditorWrapper>
                    <EditorControlled />
                  </EditorWrapper>
                ) : (
                  <>Lorem ipsum doret amet</>
                )}
              </Box>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 4,
                }}
              >
                {editTnc ? (
                  <>
                    <Button
                      sx={{ minWidth: 150, mr: 2 }}
                      variant="contained"
                      onClick={() => setDialogCancelTnc(true)}
                      size="small"
                      color="warning"
                    >
                      Cancel
                    </Button>
                    <Button
                      sx={{ minWidth: 150 }}
                      variant="contained"
                      onClick={() => setDialogSaveTnc(true)}
                      size="small"
                      color="info"
                    >
                      Save
                    </Button>
                  </>
                ) : (
                  <Button
                    sx={{ minWidth: 150 }}
                    variant="contained"
                    onClick={() => setEditTnc(true)}
                    size="small"
                  >
                    Edit
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item md={12} sm={12} xs={12}>
          <Card>
            <CardHeaderStyled title="Frequenlty Ask Questions (FAQ)" />
            <Divider sx={{ my: "0 !important" }} />
            <CardContent>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 4,
                  mb: 4,
                }}
              >
                <Button
                  sx={{ minWidth: 150 }}
                  variant="contained"
                  onClick={() => {
                    setDialogFaq(true), setAddNewFaq(true);
                  }}
                  size="small"
                >
                  Tambah FAQ
                </Button>
              </Box>
              <Card>
                <DataGrid
                  autoHeight
                  pagination
                  rows={exampleData}
                  columns={columns}
                  disableRowSelectionOnClick
                  pageSizeOptions={[10, 25, 50]}
                  paginationModel={paginationModel}
                  onRowClick={() => {
                    setDialogFaq(true), setAddNewFaq(false);
                  }}
                  onPaginationModelChange={setPaginationModel}
                  onRowSelectionModelChange={(rows) => setSelectedRows(rows)}
                />
              </Card>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Dialog
        maxWidth="xs"
        fullWidth
        open={dialogSaveTnc}
        onClose={() => setDialogSaveTnc(false)}
      >
        <DialogTitle>
          Are you sure you want to confirm and proceed with the changes?
        </DialogTitle>
        <DialogActions
          sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
        >
          <Button
            color="error"
            sx={{ width: "100%" }}
            onClick={() => setDialogSaveTnc(false)}
            variant="contained"
            size="small"
          >
            Tidak
          </Button>
          <Button
            color="success"
            sx={{ width: "100%" }}
            onClick={() => {
              setDialogSaveTnc(false), setEditTnc(false);
            }}
            variant="contained"
            size="small"
          >
            Iya
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        maxWidth="xs"
        fullWidth
        open={dialogCancelTnc}
        onClose={() => setDialogCancelTnc(false)}
      >
        <DialogTitle>
          Are you sure you want to cancel and discard the changes?
        </DialogTitle>
        <DialogActions
          sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
        >
          <Button
            color="error"
            sx={{ width: "100%" }}
            onClick={() => setDialogCancelTnc(false)}
            variant="contained"
            size="small"
          >
            Tidak
          </Button>
          <Button
            color="success"
            sx={{ width: "100%" }}
            onClick={() => {
              setDialogCancelTnc(false), setEditTnc(false);
            }}
            variant="contained"
            size="small"
          >
            Iya
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        maxWidth="sm"
        fullWidth
        open={dialogFaq}
        onClose={() => setDialogFaq(false)}
      >
        <DialogTitle>{addNewFaq ? "Add New" : "Edit"} FAQ</DialogTitle>
        <DialogContent>
          <form>
            <TextField
              id="questionId"
              label="Question"
              sx={{ mt: 4, width: "100%" }}
            />
            <TextField
              rows={4}
              multiline
              id="answerId"
              label="Answer"
              sx={{ mt: 4, width: "100%" }}
            />
          </form>
        </DialogContent>
        <DialogActions
          sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
        >
          <Button
            color="warning"
            sx={{ width: 150 }}
            onClick={() => setDialogFaq(false)}
            variant="contained"
            size="small"
          >
            Cancel
          </Button>
          <Button
            color="success"
            sx={{ width: 150 }}
            onClick={() => setDialogFaq(false)}
            variant="contained"
            size="small"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Banners;
