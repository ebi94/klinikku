import { useEffect, useState, forwardRef } from "react";
import toast from "react-hot-toast";
import CircularProgress from "@mui/material/CircularProgress";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Slide from "@mui/material/Slide";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { addUser, editUser } from "src/services/users";
import Icon from "src/@core/components/icon";
import MediaDocumentList from "src/views/media-document/MediaDocumentList";

const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field} harus diisi !`;
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`;
  } else {
    return "";
  }
};

const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(3, 4),
  justifyContent: "space-between",
  backgroundColor: theme.palette.background.default,
}));

const schema = yup.object().shape({
  name: yup
    .string()
    .min(3, (obj) => showErrors("Accessories Name", obj.value.length, obj.min))
    .required(),
  ecommerceLink: yup
    .string()
    .url()
    .min(3, (obj) => showErrors("E-Commerce Link", obj.value.length, obj.min))
    .required(),
});

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EquipmentsDrawer = (props) => {
  const { open, toggle, type, title, dataDetail, onRefresh } = props;

  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const MediaOptions = {
    id: 1,
    name: "Image",
    value: "image",
    icon: "mdi:image",
  };

  const toggleDialog = () => {
    setOpenDialog(!openDialog);
  };

  const emptyDefaultValues = {
    name: "",
    ecommerceLink: "",
  };

  const defaultValues = {
    name: dataDetail?.name ?? "",
    ecommerceLink: dataDetail?.ecommerceLink ?? "",
  };

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: type === "Add" ? emptyDefaultValues : defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onReset = () => {
    reset({ name: "", ecommerceLink: "" });
  };

  const onSubmit = async (data) => {
    setLoading(true);

    const payload = {};

    const payloadEdit = {};

    if (type === "Add") {
      const res = await addUser(payload);
      if (+res?.result?.status === 201) {
        setLoading(false);
        toast.success("Created Equipment Success");
        onReset();
        onRefresh();
        toggle();
      } else {
        setLoading(false);
        toast.error(`Opps ! ${res?.error} ${res?.status}`);
      }
    } else {
      const res = await editUser(payloadEdit);
      if (+res?.result?.status === 200) {
        setLoading(false);
        toast.success("Updated Success");
        onReset();
        onRefresh();
        toggle();
      } else {
        setLoading(false);
        toast.error(`Opps ! ${res?.error}`);
      }
    }
  };

  const handleClose = () => {
    toggle();
    onReset();
    setSelectedImage("");
  };

  const handleSelectImage = (val) => {
    const tempData = {
      imgSource: val?.link,
      ...val,
    };
    setSelectedImage(tempData);
  };

  const handleSubmitImage = () => {
    toggleDialog();
  };

  // const fetchDataList = async () => {
  //   const res = await listRole();
  //   if (+res?.result?.status === 200) {
  //     setDataList(res?.result?.data);
  //   }
  // };

  useEffect(() => {
    if (dataDetail !== undefined && (type === "Edit" || type === "Detail")) {
      setValue("name", dataDetail?.name ?? "");
      setValue("ecommerceLink", dataDetail?.ecommerceLink ?? "");
    }
  }, [dataDetail, type]);

  return (
    <>
      <Drawer
        open={open}
        anchor="right"
        variant="temporary"
        onClose={handleClose}
        ModalProps={{ keepMounted: true }}
        sx={{ "& .MuiDrawer-paper": { width: { xs: 300, sm: 400 } } }}
      >
        <Header>
          <Typography variant="h6">
            {type} {title}
          </Typography>
          <IconButton
            size="small"
            onClick={handleClose}
            sx={{ color: "text.primary" }}
          >
            <Icon icon="mdi:close" fontSize={20} />
          </IconButton>
        </Header>
        <Box sx={{ p: 5 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name="name"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <>
                    <TextField
                      InputLabelProps={type !== "Add" ? { shrink: true } : {}}
                      sx={
                        type === "Detail"
                          ? {
                              "& .Mui-disabled": {
                                "-webkit-text-fill-color": "black !important",
                                color: "black !important",
                              },
                            }
                          : {}
                      }
                      value={value}
                      label={`${title} Name`}
                      onChange={onChange}
                      placeholder={`${title} Name`}
                      disabled={loading || type === "Detail"}
                      error={Boolean(errors.name)}
                    />
                  </>
                )}
              />
              {errors.name && (
                <FormHelperText sx={{ color: "error.main" }}>
                  {errors.name.message}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name="ecommerceLink"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    InputLabelProps={type !== "Add" ? { shrink: true } : {}}
                    sx={
                      type === "Detail"
                        ? {
                            "& .Mui-disabled": {
                              "-webkit-text-fill-color": "black !important",
                              color: "black !important",
                            },
                          }
                        : {}
                    }
                    value={value}
                    label="E-Commerce Link"
                    onChange={onChange}
                    placeholder="E-Commerce Link"
                    disabled={loading || type === "Detail"}
                    error={Boolean(errors.ecommerceLink)}
                  />
                )}
              />
              {errors.ecommerceLink && (
                <FormHelperText sx={{ color: "error.main" }}>
                  {errors.ecommerceLink.message}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Card sx={{ pointer: "cursor" }}>
                <CardContent>
                  <img
                    src={
                      selectedImage?.imgSource ??
                      "/images/pages/empty-image.svg"
                    }
                    alt="empty image"
                    height="auto"
                    width="100%"
                  />
                  <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={toggleDialog}
                    disabled={loading}
                    sx={{
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                      padding: "4px 25%",
                    }}
                  >
                    <Icon icon="mdi:image-plus" fontSize={18} />
                    Choose Image
                  </Button>
                </CardContent>
              </Card>
            </FormControl>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Button
                size="large"
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={handleClose}
                disabled={loading}
                sx={{ mr: 3 }}
              >
                Cancel
              </Button>
              {type !== "Detail" ? (
                <Button
                  size="large"
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={25} />
                  ) : (
                    <>{type === "Add" ? "Save" : "Edit"}</>
                  )}
                </Button>
              ) : (
                ""
              )}
            </Box>
          </form>
        </Box>
      </Drawer>
      <Dialog
        open={openDialog}
        fullWidth
        maxWidth="lg"
        keepMounted
        onClose={toggleDialog}
        TransitionComponent={Transition}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="customized-dialog-title" sx={{ p: 4 }}>
          <Typography variant="h6" component="span">
            Selecting an Image
          </Typography>
          <IconButton
            aria-label="close"
            onClick={toggleDialog}
            sx={{ top: 10, right: 10, position: "absolute", color: "grey.500" }}
          >
            <Icon icon="mdi:close" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ minWidth: "75%" }}>
          <MediaDocumentList
            title={MediaOptions}
            isSelected
            onSelectedImage={(e) => handleSelectImage(e)}
          />
        </DialogContent>
        <DialogActions className="dialog-actions-dense">
          <Button onClick={handleSubmitImage} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EquipmentsDrawer;
