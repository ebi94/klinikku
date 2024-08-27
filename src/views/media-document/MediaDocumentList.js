import React, { useEffect, useState } from "react";
import useSWR from "swr";
import toast from "react-hot-toast";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { useAuth } from "src/hooks/useAuth";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import { listMedia } from "src/services/media";
import EmptyState from "../components/empty-state/EmptyState";
import MediaDrawer from "./MediaDrawer";

const MediaDocumentList = (props) => {
  const { title, isSelected, onSelectedImage } = props;
  const { logout } = useAuth();

  const limit = isSelected ? 12 : 18;
  const [value, setValue] = useState("");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const fetchDataList = async () => {
    const res = await listMedia(title?.value, page, limit, value);
    const data = res?.result?.data;
    setTotalPage(data?.last_page);
    if (+res?.status === 401) {
      toast.error(`Opps ! ${res?.error} ${res?.status}`);
      logout();
    }

    return data?.data;
  };

  const handleChangePagination = (e, val) => {
    setPage(val);
  };

  const { data, error, isLoading, mutate } = useSWR("media", fetchDataList);

  const handleSelectImage = (e) => {
    setSelectedImage(e);
    onSelectedImage(e);
  };

  useEffect(() => {
    if (
      title?.name !== undefined &&
      page !== undefined &&
      value !== undefined
    ) {
      mutate(fetchDataList);
      setSelectedImage("");
    }
  }, [title?.name, page, value, openDrawer]);

  return (
    <>
      <Card sx={{ mb: 6 }}>
        <CardContent>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={4} md={4}>
              <FormControl fullWidth size="small">
                <TextField
                  value={value}
                  size="small"
                  label={`Cari`}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={`Cari`}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={6} />
            {!isSelected ? (
              <Grid item xs={12} sm={4} md={2}>
                <Button
                  size="medium"
                  fullWidth
                  variant="contained"
                  onClick={toggleDrawer}
                >
                  Upload {title?.name}
                </Button>
              </Grid>
            ) : (
              <></>
            )}
          </Grid>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={12} sx={{ minHeight: "50vh" }}>
              {isLoading ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <CircularProgress size={48} />
                </Box>
              ) : (
                <Grid container spacing={6}>
                  {data?.length > 0 ? (
                    data.map((item, index) => (
                      <Grid
                        item
                        xs={6}
                        md={title?.value === "video" ? 4 : 2}
                        key={index}
                      >
                        <Card
                          sx={
                            selectedImage?.media_icon_id === item?.media_icon_id
                              ? { boxShadow: "0px 2px 10px 0px #56ca00" }
                              : {}
                          }
                        >
                          {title?.value === "video" ? (
                            <video
                              width="100%"
                              key={item?.media_icon_id}
                              alt={item?.link}
                              className="single-file-image"
                              src={item?.link}
                              controls
                            >
                              <source src={item?.link} type="video/mp4" />
                            </video>
                          ) : (
                            <PhotoProvider>
                              <PhotoView
                                src={
                                  item?.link ?? "/images/pages/empty-image.svg"
                                }
                              >
                                <CardMedia
                                  sx={{ height: "6rem", cursor: "pointer" }}
                                  image={
                                    item?.link ??
                                    "/images/pages/empty-image.svg"
                                  }
                                />
                              </PhotoView>
                            </PhotoProvider>
                          )}
                          <CardContent
                            sx={{
                              padding: "0.85rem !important",
                              paddingBottom: "0.85rem !important",
                            }}
                          >
                            <Tooltip
                              title={item?.name}
                              placement="bottom-start"
                            >
                              <Typography noWrap variant="subtitle2">
                                {item?.name}
                              </Typography>
                            </Tooltip>
                            {isSelected ? (
                              <Button
                                size="small"
                                sx={{ marginTop: "10px" }}
                                variant={
                                  selectedImage?.media_icon_id ===
                                  item?.media_icon_id
                                    ? "contained"
                                    : "outlined"
                                }
                                fullWidth
                                color={
                                  selectedImage?.media_icon_id ===
                                  item?.media_icon_id
                                    ? "primary"
                                    : "secondary"
                                }
                                onClick={() =>
                                  handleSelectImage({ id: index, ...item })
                                }
                              >
                                Choose
                              </Button>
                            ) : (
                              <></>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    ))
                  ) : (
                    <EmptyState />
                  )}
                </Grid>
              )}
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Pagination
                count={+totalPage}
                onChange={handleChangePagination}
                shape="rounded"
                color="primary"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <MediaDrawer open={openDrawer} toggle={toggleDrawer} title={title} />
    </>
  );
};

export default MediaDocumentList;
