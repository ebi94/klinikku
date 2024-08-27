import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CircularProgress from "@mui/material/CircularProgress";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
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
import DropzoneWrapper from "src/@core/styles/libs/react-dropzone";
import FileUploaderSingle from "src/views/articles/FileUploaderSingle";
import Icon from "src/@core/components/icon";
import { uploadMedia } from "src/services/media";

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

const MediaDrawer = (props) => {
  const { open, toggle, title, onRefresh } = props;

  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);

  const schema = yup.object().shape({
    name: yup
      .string()
      .min(3, (obj) =>
        showErrors(`${title?.name} Name`, obj.value.length, obj.min)
      )
      .required(),
  });

  const defaultValues = {
    name: "",
  };

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onReset = () => {
    reset({ name: "" });
    setFiles([]);
  };

  const onSubmit = async (data) => {
    setLoading(true);

    const payload = {
      name: data?.name,
      file: files[0],
      type: title?.name,
    };

    const res = await uploadMedia(payload);
    if (+res?.result?.status === 201) {
      setLoading(false);
      toast.success(`Upload ${title?.name} Success`);
      onReset();
      toggle();
    } else {
      setLoading(false);
      toast.error(`Oops! ${res?.result?.message}`);
    }
  };

  const handleClose = () => {
    toggle();
    onReset();
  };

  const onUpload = (e) => {
    if (Array.isArray(e) && e.length > 0) {
      setFiles(e);
    } else {
      console.error("Invalid files array:", e);
    }
  };

  return (
    <>
      <Drawer
        open={open}
        anchor="right"
        variant="temporary"
        onClose={handleClose}
        ModalProps={{ keepMounted: true }}
        sx={{ "& .MuiDrawer-paper": { width: { xs: 450, sm: 600 } } }}
      >
        <Header>
          <Typography variant="h6">Upload {title?.name}</Typography>
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
                      value={value}
                      label={`${title?.name} Name`}
                      onChange={onChange}
                      placeholder={`${title?.name} Name`}
                      disabled={loading}
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
            <DropzoneWrapper>
              <FileUploaderSingle
                onUpload={onUpload}
                files={files}
                type={title?.value}
              />
            </DropzoneWrapper>
            <Box sx={{ mb: 6 }} />
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Button
                size="small"
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={handleClose}
                disabled={loading}
                sx={{ mr: 3 }}
              >
                Cancel
              </Button>
              <Button
                size="small"
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={25} />
                ) : (
                  `Upload ${title?.name}`
                )}
              </Button>
            </Box>
          </form>
        </Box>
      </Drawer>
    </>
  );
};

export default MediaDrawer;
