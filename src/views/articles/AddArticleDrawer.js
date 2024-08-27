import { useState, forwardRef, useEffect } from "react";
import toast from "react-hot-toast";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import Slide from "@mui/material/Slide";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import MenuItem from "@mui/material/MenuItem";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import Icon from "src/@core/components/icon";
import { EditorWrapper } from "src/@core/styles/libs/react-draft-wysiwyg";
import EditorControlled from "src/views/forms/form-elements/editor/EditorControlled";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { addArticle, editArticle, listCategoryArticle } from "src/services/cms";
import MediaDocumentList from "../media-document/MediaDocumentList";
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
  title: yup
    .string()
    .required("Title Article harus diisi !")
    .min(10, (obj) => showErrors("Title Article", obj.value.length, obj.min)),
  slug: yup
    .string()
    .required("Slug harus diisi !")
    .min(10, (obj) => showErrors("Slug", obj.value.length, obj.min)),
  metaDescription: yup.string().required("Meta Description harus diisi !"),
});

const defaultValues = {
  title: "",
  slug: "",
  metaDescription: "",
};

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddArticleDrawer = (props) => {
  // ** Props
  const { open, toggle, type, dataDetail, onRefresh } = props;

  // ** State
  const [mediaIcon, setMediaIcon] = useState({});
  const [categoryArticle, setCategoryArticle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [isHighlight, setIsHighlight] = useState(false);
  const [clearState, setClearState] = useState(false);

  // ** Hooks

  const toggleDialog = () => {
    if (openDialog === false) setClearState(false);
    setOpenDialog(!openDialog);
  };

  const handleCloseDialog = () => {
    toggleDialog();
    setSelectedImage([]);
  };

  const handleSelectImage = (e) => {
    setSelectedImage(e);
  };

  const {
    reset,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const resetForm = () => {
    reset();
    setCategoryArticle("");
    setContent("");
    setSelectedImage([]);
    setMediaIcon({});
    setClearState(true);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setClearState(false);

    const payload = {
      title: data?.title,
      slug: data?.slug,
      meta_description: data?.metaDescription,
      content: content,
      article_category_id: categoryArticle,
      media_icon_id: mediaIcon?.media_icon_id,
      active: isActive,
      is_highlighted: isHighlight,
    };

    const payloadEdit = {
      article_id: dataDetail?.article_id,
      title: data?.title,
      slug: data?.slug,
      meta_description: data?.metaDescription,
      content: content,
      article_category_id: categoryArticle,
      media_icon_id: mediaIcon?.media_icon_id,
      active: isActive,
      is_highlighted: isHighlight,
    };

    if (type === "Add") {
      const res = await addArticle(payload);
      if (+res?.result?.status === 201) {
        setLoading(false);
        toast.success("Buat Article Success");
        resetForm();
        onRefresh();
        toggle();
      } else {
        setLoading(false);
        toast.error(`Opps ! ${res?.error}`);
      }
    } else {
      const res = await editArticle(payloadEdit);
      if (+res?.result?.status === 200) {
        setLoading(false);
        toast.success("Update Article Success");
        resetForm();
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
    resetForm();
  };

  const handleSubmitSelectedIamge = () => {
    toggleDialog();
    setMediaIcon(selectedImage);
  };

  const fetchCategoryList = async () => {
    const res = await listCategoryArticle();
    if (+res?.result?.status === 200) {
      const data = res?.result?.data !== null ? res?.result?.data : [];

      if (+data.length > 0) {
        const mappingDataList = data.map((item) => {
          return {
            id: item?.article_category_id,
            ...item,
          };
        });
        setCategoryList(mappingDataList);
      } else {
        setLoading(false);
        setDataList([]);
      }
    }
  };

  useEffect(() => {
    if (dataDetail !== undefined && type === "Edit") {
      setValue("title", dataDetail?.title ?? "");
      setValue("metaDescription", dataDetail?.meta_description ?? "");
      setValue("slug", dataDetail?.slug ?? "");
      setCategoryArticle(dataDetail?.category?.article_category_id);
      setIsActive(dataDetail?.active);
      setIsHighlight(dataDetail?.is_highlighted);
      setMediaIcon(dataDetail?.media);
    }
  }, [dataDetail, type]);

  useEffect(() => {
    if (open && type === "Add") {
      setClearState(false);
      setTimeout(() => {
        setClearState(true);
      }, 100);
    }
  }, [open, type]);

  useEffect(() => {
    fetchCategoryList();
  }, []);

  return (
    <>
      <Drawer
        open={open}
        anchor="right"
        variant="persistent"
        onClose={handleClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: 300, sm: "calc(100vw - 270px)" },
          },
        }}
      >
        <Header>
          <Typography variant="h6">
            {type === "Add" ? "Add New" : "Edit"} Article
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
            <Grid container spacing={6}>
              <Grid item xs={12} md={8}>
                <FormControl fullWidth sx={{ mb: 6 }} size="small">
                  <Controller
                    name="title"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        required
                        size="small"
                        value={value}
                        disabled={loading}
                        label="Title"
                        onChange={(e) => {
                          onChange(e);
                          const convertTitle = titleToSlug(e.target.value);
                          setValue("slug", convertTitle);
                        }}
                        placeholder="Title"
                        error={Boolean(errors.title)}
                      />
                    )}
                  />
                  {errors.title && (
                    <FormHelperText sx={{ color: "error.main" }}>
                      {errors.title.message}
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl fullWidth sx={{ mb: 6 }} size="small">
                  <Controller
                    name="metaDescription"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        required
                        size="small"
                        value={value}
                        disabled={loading}
                        label="Meta Description"
                        onChange={onChange}
                        placeholder="Meta Description"
                        error={Boolean(errors.metaDescription)}
                      />
                    )}
                  />
                  {errors.metaDescription && (
                    <FormHelperText sx={{ color: "error.main" }}>
                      {errors.metaDescription.message}
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl fullWidth sx={{ mb: 6 }} size="small">
                  <Controller
                    name="slug"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        required
                        size="small"
                        value={value}
                        disabled={loading}
                        label="Slug"
                        onChange={onChange}
                        placeholder="Slug"
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
                <FormControl fullWidth sx={{ mb: 6 }} size="small">
                  <InputLabel id="category-select" required>
                    Category
                  </InputLabel>
                  <Select
                    required
                    fullWidth
                    value={categoryArticle}
                    id="select-category"
                    label="Select Category"
                    labelId="role-select"
                    onChange={(e) => setCategoryArticle(e.target.value)}
                    disabled={loading}
                    size="small"
                  >
                    <MenuItem value="">none</MenuItem>
                    {categoryList.map((item) => (
                      <MenuItem
                        key={item?.article_category_id}
                        value={item?.article_category_id}
                      >
                        {item?.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Grid container spacing={6}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth sx={{ mb: 6 }}>
                      <FormControlLabel
                        disabled={loading}
                        control={
                          <Switch
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                          />
                        }
                        label={isActive ? "Active" : "Not Active"}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth sx={{ mb: 6 }}>
                      <Tooltip
                        title={
                          !isActive
                            ? "Highlight is Enable when the Article is Active"
                            : null
                        }
                      >
                        <FormControlLabel
                          disabled={loading || !isActive}
                          control={
                            <Switch
                              checked={!isActive ? false : isHighlight}
                              onChange={(e) => setIsHighlight(e.target.checked)}
                            />
                          }
                          label={isHighlight ? "Highlight" : "Not Highlight"}
                        />
                      </Tooltip>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth sx={{ mb: 6 }} size="small">
                  <Card sx={{ pointer: "cursor" }}>
                    <CardContent>
                      {type === "Add" ? (
                        <img
                          src={
                            mediaIcon?.link ?? "/images/pages/empty-image.svg"
                          }
                          alt="empty image"
                          height="auto"
                          width={"100%"}
                        />
                      ) : (
                        <img
                          src={
                            mediaIcon?.link ? mediaIcon?.link : mediaIcon?.image
                          }
                          alt="empty image"
                          height="auto"
                          width={"100%"}
                        />
                      )}
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
                        Choose Thumbnail
                      </Button>
                    </CardContent>
                  </Card>
                </FormControl>
              </Grid>
            </Grid>
            <Box sx={{ mt: 3 }} />
            <EditorWrapper>
              <EditorControlled
                onChange={(e) => setContent(e)}
                clearState={clearState}
                defaultValues={dataDetail?.content}
              />
            </EditorWrapper>
            <Grid container spacing={3} sx={{ mt: 3 }}>
              <Grid item xs={12} md={3}>
                <Button
                  size="small"
                  variant="outlined"
                  color="secondary"
                  onClick={handleClose}
                  disabled={loading}
                  fullWidth
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item xs={12} md={6} />
              <Grid item xs={12} md={3}>
                <Button
                  size="small"
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  fullWidth
                >
                  {loading ? <CircularProgress size={20} /> : "Submit"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Drawer>
      <Dialog
        open={openDialog}
        fullWidth
        maxWidth="lg"
        keepMounted
        onClose={handleCloseDialog}
        TransitionComponent={Transition}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="customized-dialog-title" sx={{ p: 4 }}>
          <Typography variant="h6" component="span">
            Selecting a Thumbnail
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
            title={{ value: "image", name: "Image" }}
            isSelected
            onSelectedImage={(e) => handleSelectImage(e)}
          />
        </DialogContent>
        <DialogActions className="dialog-actions-dense">
          <Button onClick={handleSubmitSelectedIamge} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddArticleDrawer;
