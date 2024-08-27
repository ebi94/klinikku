import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import Icon from "src/@core/components/icon";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { addCategory, editCategory } from "src/services/cms";
import { CircularProgress } from "@mui/material";
import { titleToSlug } from "src/@core/utils/title-to-slug";

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
    .min(3, (obj) => showErrors("Category Name", obj.value.length, obj.min))
    .required(),
});

const AddCategoryArticleDrawer = (props) => {
  const { open, toggle, isEdit, dataDetail, type, onRefresh } = props;

  const [loading, setLoading] = useState(false);

  const defaultValues = {
    name: "",
    slug: "",
  };

  const defaultValuesEdit = {
    name: dataDetail?.name,
    slug: dataDetail?.slug,
  };

  const {
    reset,
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: type === "Add" ? defaultValues : defaultValuesEdit,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);

    const payload = {
      name: data?.name,
      slug: data?.slug,
    };

    const payloadEdit = {
      article_category_id: dataDetail?.article_category_id,
      name: data?.name,
      slug: data?.slug,
    };

    if (type === "Add") {
      const res = await addCategory(payload);
      if (+res?.result?.status === 201) {
        setLoading(false);
        toast.success("Created Category Article Success");
        reset();
        onRefresh();
        toggle();
      } else {
        setLoading(false);
        toast.error(`Opps ! ${res?.error}`);
      }
    } else {
      const res = await editCategory(payloadEdit);
      if (+res?.result?.status === 200) {
        setLoading(false);
        toast.success("Updated Success");
        reset();
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
    reset();
  };

  useEffect(() => {
    if (dataDetail !== undefined && type === "Edit") {
      setValue("name", dataDetail?.name ?? "");
      setValue("slug", dataDetail?.slug ?? "");
    }
  }, [dataDetail, type, setValue]);

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="persistent"
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ "& .MuiDrawer-paper": { width: { xs: 300, sm: 420 } } }}
    >
      <Header>
        <Typography variant="h6">
          {isEdit ? "Tambah Baru" : "Ubah"} Kategori Artikel
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
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  size="small"
                  label="Category Name"
                  onChange={(e) => {
                    onChange(e);
                    const convertTitle = titleToSlug(e.target.value);
                    setValue("slug", convertTitle);
                  }}
                  placeholder="Category Name"
                  disabled={loading}
                  error={Boolean(errors.name)}
                />
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
              name="slug"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  size="small"
                  label="Category Slug"
                  onChange={onChange}
                  placeholder="Category Slug"
                  disabled={loading}
                  error={Boolean(errors.slug)}
                />
              )}
            />
            {errors.slug && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.slug.message}
              </FormHelperText>
            )}
          </FormControl>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Button
                fullWidth
                size="small"
                variant="outlined"
                color="secondary"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                fullWidth
                size="small"
                type="submit"
                variant="contained"
                disabled={loading}
              >
                {loading ? <CircularProgress size={20} /> : "Submit"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Drawer>
  );
};

export default AddCategoryArticleDrawer;
