// ** React Imports
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import toast from "react-hot-toast";

// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";

// ** Custom Components
import CustomChip from "src/@core/components/mui/chip";
import CustomAvatar from "src/@core/components/mui/avatar";

// ** Utils Import
import { getInitials } from "src/@core/utils/get-initials";
import { detailCustomer } from "src/services/customers";
import { CircularProgress } from "@mui/material";
import TypographyInfoDetail from "src/views/ui/typography/TypographyInfoDetail";

const CustomerViewLeft = () => {
  const router = useRouter();
  const patientId = router.query.id;
  // ** States
  const [dataDetail, setDataDetail] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchDataDetail = async () => {
    const res = await detailCustomer(patientId);
    if (+res?.result?.status === 200) {
      const data = res?.result?.data !== null ? res?.result?.data : [];
      setDataDetail(data);
      setLoading(false);
    } else {
      toast.error(`Status Code : ${res?.error}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) fetchDataDetail();
  }, [patientId]);

  return (
    <Grid container spacing={6} sx={{ position: "sticky", top: 0 }}>
      <Grid item xs={12}>
        <Card>
          <CardContent
            sx={{
              pt: 15,
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            {dataDetail?.avatar ? (
              <CustomAvatar
                src={dataDetail?.avatar}
                variant="rounded"
                alt={dataDetail?.name}
                sx={{ width: 120, height: 120, fontWeight: 600, mb: 4 }}
              />
            ) : (
              <CustomAvatar
                skin="light"
                variant="rounded"
                color={dataDetail?.avatarColor}
                sx={{
                  width: 120,
                  height: 120,
                  fontWeight: 600,
                  mb: 4,
                  fontSize: "3rem",
                }}
              >
                {getInitials(dataDetail?.name ?? "")}
              </CustomAvatar>
            )}
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress size={50} />
              </Box>
            ) : (
              <>
                <Typography variant="h6" sx={{ mb: 4 }}>
                  {dataDetail?.name}
                </Typography>
                <CustomChip
                  skin="light"
                  size="small"
                  label={
                    <Box sx={{ display: "flex" }}>
                      <Typography
                        sx={{ mr: 2, fontWeight: 500, fontSize: "0.775rem" }}
                      >
                        No MR:
                      </Typography>
                      <Typography
                        sx={{ fontWeight: 600, fontSize: "0.775rem" }}
                      >
                        {dataDetail?.nik}
                      </Typography>
                    </Box>
                  }
                  color="info"
                  sx={{ textTransform: "capitalize" }}
                />
              </>
            )}
          </CardContent>
          <CardContent>
            <Divider sx={{ my: (theme) => `${theme.spacing(4)} !important` }} />
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress size={50} />
              </Box>
            ) : (
              <Box sx={{ pb: 1 }}>
                <TypographyInfoDetail
                  data={{
                    label: "Nama Lengkap",
                    description: dataDetail?.name,
                    widthLabel: "45%",
                  }}
                />
                <TypographyInfoDetail
                  data={{
                    label: "Jenis Kelammin",
                    description: dataDetail?.gender,
                    widthLabel: "45%",
                  }}
                />
                <TypographyInfoDetail
                  data={{
                    label: "No Telepon",
                    description: dataDetail?.phone,
                    widthLabel: "45%",
                  }}
                />
                <TypographyInfoDetail
                  data={{
                    label: "Email",
                    description: dataDetail?.email,
                    widthLabel: "45%",
                    useTooltip: true,
                  }}
                />
                <TypographyInfoDetail
                  data={{
                    label: "Tempat, Tgl Lahir",
                    description: `${dataDetail?.place_of_birth ?? ""}, ${
                      dataDetail?.date_of_birth
                    }`,
                    widthLabel: "45%",
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
                <TypographyInfoDetail
                  data={{
                    label: "Alamat",
                    description: dataDetail?.address,
                    widthLabel: "45%",
                    useTooltip: true,
                  }}
                />
                <TypographyInfoDetail
                  data={{
                    label: "Registration Source",
                    description: dataDetail?.registered_with,
                    widthLabel: "45%",
                    useTooltip: true,
                  }}
                />
              </Box>
            )}
          </CardContent>

          <CardActions sx={{ display: "flex", justifyContent: "center" }}>
            <Link href={`/customers/edit/${dataDetail?.patient_id}`}>
              <Button variant="contained" sx={{ mr: 2 }}>
                Edit Data
              </Button>
            </Link>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
};

export default CustomerViewLeft;
