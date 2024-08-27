import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Grid from "@mui/material/Grid";
import toast from "react-hot-toast";
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
import PageHeader from "src/@core/components/page-header";
import { detailUser } from "src/services/users";
import CustomChip from "src/@core/components/mui/chip";
import CustomAvatar from "src/@core/components/mui/avatar";
import TypographyInfoDetail from "src/views/ui/typography/TypographyInfoDetail";
import CardMediaDocument from "src/views/ui/cards/CardMediaDocument";
import "react-photo-view/dist/react-photo-view.css";

const UserDetail = () => {
  const router = useRouter();
  const userId = router.query.id;

  const [loading, setLoading] = useState(true);
  const [dataDetail, setDataDetail] = useState({});

  const breadCrumbs = [
    { id: 1, path: "/dashboards", name: "Home" },
    { id: 2, path: "/users", name: "Users List" },
    { id: 3, path: "#", name: "Users Detail" },
  ];

  const fetchDataDetail = async (id) => {
    const res = await detailUser(id);
    if (+res?.result?.status === 200) {
      setDataDetail(res?.result?.data);
      setLoading(false);
    } else {
      setLoading(false);
      toast.error(`Opps ! ${res?.error}`);
    }
  };

  useEffect(() => {
    if (userId) fetchDataDetail(userId);
  }, [userId]);

  return (
    <>
      <DatePickerWrapper>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="stretch"
          spacing={6}
        >
          <PageHeader breadCrumbs={breadCrumbs} title="Detail User" />
          <Grid item xs={12} md={4} lg={4}>
            <Card
              sx={{ position: "-webkit-sticky", position: "sticky", top: 100 }}
            >
              <CardContent
                sx={{
                  pt: 15,
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                {dataDetail.avatar ? (
                  <CustomAvatar
                    src={dataDetail.avatar}
                    variant="rounded"
                    alt={dataDetail?.name}
                    sx={{ width: 120, height: 120, fontWeight: 600, mb: 4 }}
                  />
                ) : (
                  <CustomAvatar
                    skin="light"
                    variant="rounded"
                    color={dataDetail.avatarColor}
                    sx={{
                      width: 120,
                      height: 120,
                      fontWeight: 600,
                      mb: 4,
                      fontSize: "3rem",
                    }}
                  >
                    {/* {getInitials(dataDetail.name)} */}
                  </CustomAvatar>
                )}
                <Typography variant="h6" sx={{ mb: 4 }}>
                  {dataDetail.name}
                </Typography>
                <CustomChip
                  skin="light"
                  size="small"
                  label={
                    <Box sx={{ display: "flex" }}>
                      <Typography
                        sx={{ mr: 2, fontWeight: 500, fontSize: "0.775rem" }}
                      >
                        Username:
                      </Typography>
                      <Typography
                        sx={{ fontWeight: 600, fontSize: "0.775rem" }}
                      >
                        {dataDetail?.username}
                      </Typography>
                    </Box>
                  }
                  color="info"
                  sx={{ textTransform: "capitalize" }}
                />
              </CardContent>
              <CardContent>
                <Divider
                  sx={{ my: (theme) => `${theme.spacing(4)} !important` }}
                />
                <Box sx={{ pb: 1 }}>
                  <TypographyInfoDetail
                    data={{
                      label: "Nama Lengkap",
                      widthLabel: "45%",
                      description: dataDetail?.name,
                    }}
                  />
                  <TypographyInfoDetail
                    data={{
                      label: "Jenis Kelamin",
                      widthLabel: "45%",
                      description:
                        dataDetail?.gender === "Male"
                          ? "Laki-laki"
                          : "Perempuan",
                    }}
                  />
                  <TypographyInfoDetail
                    data={{
                      label: "Email",
                      widthLabel: "45%",
                      description: dataDetail?.email,
                    }}
                  />

                  <TypographyInfoDetail
                    data={{
                      label: "No Telepon",
                      widthLabel: "45%",
                      description: dataDetail?.phone,
                    }}
                  />
                  <TypographyInfoDetail
                    data={{
                      label: "Tempat, Tgl Lahir",
                      widthLabel: "45%",
                      description: `${dataDetail?.place_of_birth}, ${dataDetail?.date_of_birth}`,
                    }}
                  />
                  <TypographyInfoDetail
                    data={{
                      label: "Status",
                      widthLabel: "45%",
                      description: (
                        <CustomChip
                          skin="dark"
                          size="small"
                          label={
                            <Typography
                              sx={{
                                fontWeight: 600,
                                fontSize: "0.775rem",
                                color: dataDetail?.is_active
                                  ? "#F3FF90"
                                  : "#FFE8C5",
                              }}
                            >
                              {dataDetail?.is_active ? "Active" : "Not Active"}
                            </Typography>
                          }
                          color={dataDetail?.is_active ? "success" : "error"}
                        />
                      ),
                    }}
                  />
                </Box>
              </CardContent>

              <CardActions sx={{ display: "flex", justifyContent: "center" }}>
                <Link href={`/users/edit/${dataDetail?.user_id}`}>
                  <Button variant="contained" sx={{ mr: 2 }}>
                    Edit Data
                  </Button>
                </Link>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} md={8} lg={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Document Info
                </Typography>
                <CardMediaDocument
                  data={{
                    label: "STR",
                    imageUrl: `${dataDetail?.file_str}`,
                    description: dataDetail?.str,
                  }}
                />
                <CardMediaDocument
                  data={{
                    label: "SIPP",
                    imageUrl: dataDetail?.file_sipp,
                    description: dataDetail?.sipp,
                  }}
                />
                <CardMediaDocument
                  data={{
                    label: "NIRAPPNI",
                    imageUrl: dataDetail?.file_nirappni,
                    description: dataDetail?.nirappni,
                  }}
                />
                <CardMediaDocument
                  data={{
                    label: "KTA Inwocna",
                    imageUrl: dataDetail?.file_ktainwocna,
                    description: dataDetail?.ktainwocna,
                  }}
                />
                <CardMediaDocument
                  data={{
                    label: "NPWP",
                    imageUrl: dataDetail?.file_npwp,
                    description: dataDetail?.npwp,
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DatePickerWrapper>
    </>
  );
};

export default UserDetail;
