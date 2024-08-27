import React, { useState, useEffect, forwardRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Grid from "@mui/material/Grid";
import Icon from "src/@core/components/icon";
import toast from "react-hot-toast";
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
import { detailClinic } from "src/services/clinics";
import { CircularProgress } from "@mui/material";
import PageHeader from "src/@core/components/page-header";
import { listRegion } from "src/services/region";
import TypographyInfo from "src/views/ui/typography/TypographyInfo";

const ClinicDetail = () => {
  const router = useRouter();
  const clinicId = router.query.id;

  const [loading, setLoading] = useState(true);
  const [dataDetail, setDataDetail] = useState({});
  const [provinceName, setProvinceName] = useState("");
  const [cityName, setCityName] = useState("");
  const [subdistrictName, setSubdistrictName] = useState("");
  const [villageName, setVillageName] = useState("");

  const breadCrumbs = [
    { id: 1, path: "/dashboards", name: "Home" },
    { id: 2, path: "/clinic", name: "Clinic List" },
    { id: 3, path: "#", name: "Clinic Detail" },
  ];

  const fetchDataDetail = async () => {
    const res = await detailClinic(clinicId);
    if (+res?.result?.status === 200) {
      setDataDetail(res?.result?.data);
      setLoading(false);
    } else {
      setLoading(false);
      toast.error(`Opps ! ${res?.error}`);
    }
  };

  const fetchListRegion = async (
    region,
    province_id,
    city_district_id,
    subdistrict_id
  ) => {
    const res = await listRegion(
      region,
      province_id,
      city_district_id,
      subdistrict_id
    );
    if (+res?.result?.status === 200) {
      const data = res?.result?.data !== null ? res?.result?.data : [];
      if (region === "province") {
        const filteredData = data.filter(
          (item) => +item?.province_id === +dataDetail?.province_id
        );
        setProvinceName(filteredData[0]?.name);
      }
      if (region === "city") {
        const filteredData = data.filter(
          (item) => +item?.city_district_id === +dataDetail?.city_district_id
        );
        setCityName(filteredData[0]?.name);
      }
      if (region === "subdistrict") {
        const filteredData = data.filter(
          (item) => +item?.subdistrict_id === +dataDetail?.subdistrict_id
        );
        setSubdistrictName(filteredData[0]?.name);
      }
      if (region === "village") {
        const filteredData = data.filter(
          (item) =>
            +item?.village_subdistrict_id ===
            +dataDetail?.village_subdistrict_id
        );
        setVillageName(filteredData[0]?.name);
      }
    } else {
      console.error(res);
    }
  };

  useEffect(() => {
    fetchListRegion("province");
    if (dataDetail?.province_id) {
      fetchListRegion("city", dataDetail?.province_id);
    }
    if (dataDetail?.city_district_id) {
      fetchListRegion("subdistrict", "", dataDetail?.city_district_id);
    }
    if (dataDetail?.subdistrict_id) {
      fetchListRegion("village", "", "", dataDetail?.subdistrict_id);
    }
  }, [
    dataDetail?.province_id,
    dataDetail?.city_district_id,
    dataDetail?.subdistrict_id,
    dataDetail?.village_subdistrict_id,
  ]);

  useEffect(() => {
    if (clinicId) fetchDataDetail("province");
  }, [clinicId]);

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
          <PageHeader breadCrumbs={breadCrumbs} title="Detail Clinic" />
          <Grid item xs={12} md={12} lg={12}>
            <Card>
              <CardHeader title={`Detail Info - ${dataDetail?.name ?? ""}`} />
              <Divider sx={{ m: "0 !important" }} />
              <CardContent>
                {loading ? (
                  <Box sx={{ width: "100%", textAlign: "center" }}>
                    <CircularProgress sx={{ my: "auto", mx: 50 }} />
                  </Box>
                ) : (
                  <>
                    <Grid container spacing={5}>
                      <>
                        <Grid item xs={12}>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            1. Clinic Info
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TypographyInfo
                            data={{
                              label: "Name",
                              description: dataDetail?.name,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TypographyInfo
                            data={{
                              label: "Code",
                              description: dataDetail?.code,
                            }}
                          />
                        </Grid>
                      </>
                      <>
                        <Grid item xs={12}>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            2. Alamat Info
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                          <TypographyInfo
                            data={{
                              label: "Alamat",
                              description: dataDetail?.complete_address,
                            }}
                          />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <TypographyInfo
                            data={{
                              label: "Province",
                              description: provinceName,
                            }}
                          />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <TypographyInfo
                            data={{
                              label: "City",
                              description: cityName,
                            }}
                          />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <TypographyInfo
                            data={{
                              label: "Subdistrict",
                              description: subdistrictName,
                            }}
                          />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <TypographyInfo
                            data={{
                              label: "Village",
                              description: villageName,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                          <Typography sx={{ fontWeight: 500, mb: 1, ml: 4 }}>
                            Map Links
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ my: "auto", ml: 4 }}
                          >
                            {dataDetail?.map_links}{" "}
                            <Icon icon="mdi:link-outline" fontSize={20} />
                          </Typography>
                          {dataDetail?.map_links ? (
                            <iframe
                              id="inlineFrame"
                              title="Inline Frame "
                              width="100%"
                              height="200"
                              src={dataDetail?.map_links}
                            ></iframe>
                          ) : (
                            ""
                          )}
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <TypographyInfo
                            data={{
                              label: "Latitude",
                              description: dataDetail?.latitude,
                            }}
                          />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <TypographyInfo
                            data={{
                              label: "Longitude",
                              description: dataDetail?.longitude,
                            }}
                          />
                        </Grid>
                      </>
                      <>
                        <Grid item xs={12}>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            3. Contact Info
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <TypographyInfo
                            data={{
                              label: "Phone 1",
                              description: dataDetail?.phone?.[0],
                            }}
                          />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <TypographyInfo
                            data={{
                              label: "Phone 2",
                              description: dataDetail?.phone?.[1],
                            }}
                          />
                        </Grid>
                      </>
                      <>
                        <Grid item xs={12}>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            4. Operational Hours
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, ml: 4 }}
                          >
                            a. Weekdays
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={2}>
                          <TypographyInfo
                            data={{
                              label: "Open",
                              description:
                                dataDetail?.operational_hours?.weekdays?.open,
                            }}
                          />
                        </Grid>
                        <Grid item xs={6} sm={2}>
                          <TypographyInfo
                            data={{
                              label: "Close",
                              description:
                                dataDetail?.operational_hours?.weekdays?.close,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, ml: 4 }}
                          >
                            b. Weekend
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={2}>
                          <TypographyInfo
                            data={{
                              label: "Open",
                              description:
                                dataDetail?.operational_hours?.weekend?.open,
                            }}
                          />
                        </Grid>
                        <Grid item xs={6} sm={2}>
                          <TypographyInfo
                            data={{
                              label: "Close",
                              description:
                                dataDetail?.operational_hours?.weekend?.close,
                            }}
                          />
                        </Grid>
                      </>
                      <>
                        <Grid item xs={12}>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            5. Facilities
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                          <Typography sx={{ fontWeight: 500, mb: 1, ml: 4 }}>
                            Facility
                          </Typography>
                          {dataDetail?.facility?.length > 0 &&
                            dataDetail?.facility.map((item) => (
                              <Typography
                                variant="body2"
                                sx={{ my: "auto", ml: 4 }}
                              >
                                {item?.name},
                              </Typography>
                            ))}
                        </Grid>
                      </>
                    </Grid>
                  </>
                )}
              </CardContent>
              <Divider sx={{ m: "0 !important" }} />
              <CardActions
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Link href="/clinic">
                  <Button
                    calor="warning"
                    variant="contained"
                    sx={{ mr: 2, width: "150px" }}
                    disabled={loading}
                  >
                    Back
                  </Button>
                </Link>
                <Link href={`/clinic/edit/${clinicId}`}>
                  <Button
                    color="success"
                    variant="contained"
                    sx={{ width: "150px" }}
                    disabled={loading}
                  >
                    Edit
                  </Button>
                </Link>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </DatePickerWrapper>
    </>
  );
};

export default ClinicDetail;
