import React, { useState, useEffect, forwardRef } from "react";
import { useRouter } from "next/router";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import DatePicker from "react-datepicker";
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { listRegion } from "src/services/region";
import { addClinic } from "src/services/clinics";
import { listFacilities } from "src/configs/constans";
import moment from "moment";
import toast from "react-hot-toast";
import { CircularProgress } from "@mui/material";
import PageHeader from "src/@core/components/page-header";
import Link from "next/link";
import { mappingDataOptions } from "src/utils/helpers";

const showErrors = (field, valueLen, min, max = 0) => {
  if (valueLen === 0) {
    return `${field} harus diisi !`;
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`;
  } else if (valueLen > 0 && valueLen > max && max > 0) {
    return `${field} must be at least max ${max} characters`;
  } else {
    return "";
  }
};

const schema = yup.object().shape({
  name: yup
    .string()
    .min(3, (obj) => showErrors("Clinic Name", obj?.value?.length, obj.min))
    .required("Kolom ini harus diisi !"),
  code: yup
    .string()
    .min(3, (obj) => showErrors("Clinic Code", obj?.value?.length, obj.min))
    .required("Kolom ini harus diisi !"),
  complete_address: yup
    .string()
    .min(10, (obj) => showErrors("Alamat", obj?.value?.length, obj.min))
    .required("Kolom ini harus diisi !"),
  province_id: yup
    .object()
    .shape({
      id: yup.number().required(),
      value: yup.number().required(),
      label: yup.string().required(),
      province_id: yup.number().required(),
      name: yup.string().required(),
    })
    .required("Kolom ini harus diisi !"),
  city_district_id: yup
    .object()
    .shape({
      id: yup.number().required(),
      value: yup.number().required(),
      label: yup.string().required(),
      city_district_id: yup.number().required(),
      name: yup.string().required(),
    })
    .required("Kolom ini harus diisi !"),
  subdistrict_id: yup
    .object()
    .shape({
      id: yup.number().required(),
      value: yup.number().required(),
      label: yup.string().required(),
      subdistrict_id: yup.number().required(),
      name: yup.string().required(),
    })
    .required("Kolom ini harus diisi !"),
  village_subdistrict_id: yup
    .object()
    .shape({
      id: yup.number().required(),
      value: yup.number().required(),
      label: yup.string().required(),
      village_subdistrict_id: yup.number().required(),
      name: yup.string().required(),
    })
    .required("Kolom ini harus diisi !"),
  phone: yup
    .string()
    .min(8, (obj) => showErrors("Phone", obj?.value?.length, obj.min))
    .max(13, (obj) => showErrors("Phone", obj?.value?.length, obj.min, obj.max))
    .required("Kolom ini harus diisi !"),
  phone_nd: yup
    .string()
    .min(8, (obj) => showErrors("Phone", obj?.value?.length, obj.min))
    .max(13, (obj) =>
      showErrors("Phone", obj?.value?.length, obj.min, obj.max)
    ),
  latitude: yup.string().required("Kolom ini harus diisi !"),
  longitude: yup.string().required("Kolom ini harus diisi !"),
  map_links: yup.string().required("Kolom ini harus diisi !"),
  weekdays_open: yup.string().required("Kolom ini harus diisi !"),
  weekdays_close: yup.string().required("Kolom ini harus diisi !"),
  weekend_open: yup.string().required("Kolom ini harus diisi !"),
  weekend_close: yup.string().required("Kolom ini harus diisi !"),
  facility: yup.mixed().required("Kolom ini harus diisi !"),
});

const CustomInput = forwardRef(({ ...props }, ref) => {
  return <TextField inputRef={ref} {...props} sx={{ width: "100%" }} />;
});

const ClinicNew = () => {
  const router = useRouter();
  const regex = /^[0-9\b]+$/;

  const [loading, setLoading] = useState(false);
  const [listProvince, setListProvince] = useState([]);
  const [listCityDistrict, setListCityDistrict] = useState([]);
  const [listSubdistrict, setListSubdistrict] = useState([]);
  const [listVillageDistrict, setListVillageDistrict] = useState([]);

  const breadCrumbs = [
    { id: 1, path: "/dashboards", name: "Home" },
    { id: 2, path: "/clinic", name: "Clinic List" },
    { id: 3, path: "#", name: "Add New Clinic" },
  ];

  const defaultValues = {
    name: "",
    code: "",
    complete_address: "",
    province_id: null,
    city_district_id: null,
    subdistrict_id: null,
    village_subdistrict_id: null,
    // phone: ["08128989789", "081829019289"],
    latitude: "",
    longitude: "",
    map_links: "",
    facility: [],
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues, mode: "all", resolver: yupResolver(schema) });
  console.log("errors", errors);

  const onSubmit = async (value) => {
    setLoading(true);
    const payload = {
      code: value?.code,
      name: value?.name,
      complete_address: value?.complete_address,
      province_id: value?.province_id?.id,
      city_district_id: value?.city_district_id?.id,
      subdistrict_id: value?.subdistrict_id?.id,
      village_subdistrict_id: value?.village_subdistrict_id?.id,
      phone: [value?.phone, value?.phone_nd],
      latitude: value?.latitude,
      longitude: value?.longitude,
      map_links: value?.map_links,
      operational_hours: {
        weekdays: {
          open: moment(value?.weekdays_open).format("HH:mm"),
          close: moment(value?.weekdays_close).format("HH:mm"),
        },
        weekend: {
          open: moment(value?.weekend_open).format("HH:mm"),
          close: moment(value?.weekend_close).format("HH:mm"),
        },
      },
      facility: value?.facility,
    };
    console.log("payload", payload);
    const res = await addClinic(payload);
    if (+res?.result?.status === 201) {
      setLoading(false);
      toast.success("Buat New Clinic Success");
      router.push("/clinic");
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
        const mappingDataList = mappingDataOptions(data, "province_id");
        setListProvince(mappingDataList);
        setListCityDistrict([]);
        setListSubdistrict([]);
        setListVillageDistrict([]);
      }
      if (region === "city") {
        const mappingDataList = mappingDataOptions(data, "city_district_id");
        setListCityDistrict(mappingDataList);
        setListSubdistrict([]);
        setListVillageDistrict([]);
      }
      if (region === "subdistrict") {
        const mappingDataList = mappingDataOptions(data, "subdistrict_id");
        setListSubdistrict(mappingDataList);
        setListVillageDistrict([]);
      }
      if (region === "village") {
        const mappingDataList = mappingDataOptions(
          data,
          "village_subdistrict_id"
        );
        setListVillageDistrict(mappingDataList);
      }
    } else {
      console.error(res);
    }
  };

  useEffect(() => {
    fetchListRegion("province");
  }, []);

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
          <PageHeader breadCrumbs={breadCrumbs} title="Add New Clinic" />
          <Grid item xs={12} md={12} lg={12}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Card>
                {/* <CardHeader title="Add New Clinic" /> */}
                <Divider sx={{ m: "0 !important" }} />
                <CardContent>
                  <Grid container spacing={5}>
                    <>
                      <Grid item xs={12}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          1. Clinic Info
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <Controller
                            name="name"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                value={value}
                                size="small"
                                label="Name"
                                onChange={onChange}
                                placeholder="Clinic Name"
                                disabled={loading}
                                error={Boolean(errors.name)}
                                aria-describedby="validation-basic"
                              />
                            )}
                          />
                          {errors.name && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic"
                            >
                              {errors.name.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <Controller
                            name="code"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                value={value}
                                size="small"
                                label="Code"
                                onChange={onChange}
                                placeholder="Clinic Code"
                                disabled={loading}
                                error={Boolean(errors.code)}
                                aria-describedby="validation-basic"
                              />
                            )}
                          />
                          {errors.code && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic"
                            >
                              {errors.code.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                    </>
                    <>
                      <Grid item xs={12}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          2. Alamat Info
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <FormControl fullWidth>
                          <Controller
                            name="complete_address"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <TextField
                                rows={2}
                                size="small"
                                multiline
                                {...field}
                                label="Alamat"
                                disabled={loading}
                                error={Boolean(errors.complete_address)}
                                aria-describedby="validation-basic-textarea"
                              />
                            )}
                          />
                          {errors.complete_address && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic-textarea"
                            >
                              {errors.complete_address.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <Controller
                            name="province_id"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <Autocomplete
                                value={value}
                                options={listProvince}
                                id="autocomplete-province"
                                onChange={(option, e, reason) => {
                                  if (e?.value) {
                                    fetchListRegion("city", e?.value);
                                    setListCityDistrict([]);
                                    setListSubdistrict([]);
                                    setListVillageDistrict([]);
                                    setValue("province_id", e);
                                    onChange(e);
                                    setValue("city_district_id", null);
                                    setValue("subdistrict_id", null);
                                    setValue("village_subdistrict_id", null);
                                  }
                                  if (reason === "clear") {
                                    setListCityDistrict([]);
                                    setListSubdistrict([]);
                                    setListVillageDistrict([]);
                                    setValue("province_id", null);
                                    setValue("city_district_id", null);
                                    setValue("subdistrict_id", null);
                                    setValue("village_subdistrict_id", null);
                                  }
                                }}
                                error={Boolean(errors.province_id)}
                                labelId="province"
                                aria-describedby="province"
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    label="Province"
                                    placeholder=""
                                    disabled={loading}
                                    error={Boolean(errors.province_id)}
                                  />
                                )}
                              />
                            )}
                          />
                          {errors.province_id && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic"
                            >
                              {errors.province_id.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Tooltip
                          title={
                            listCityDistrict?.length === 0
                              ? "Please select the Province first"
                              : ""
                          }
                          placement="top-start"
                        >
                          <FormControl fullWidth size="small">
                            <Controller
                              name="city_district_id"
                              control={control}
                              rules={{ required: true }}
                              render={({ field: { value, onChange } }) => (
                                <Autocomplete
                                  value={value}
                                  options={listCityDistrict}
                                  id="autocomplete-province"
                                  onChange={(option, e, reason) => {
                                    if (e?.value) {
                                      fetchListRegion(
                                        "subdistrict",
                                        "",
                                        e?.value
                                      );
                                      setListSubdistrict([]);
                                      setListVillageDistrict([]);
                                      setValue("city_district_id", e);
                                      onChange(e);
                                      setValue("subdistrict_id", null);
                                      setValue("village_subdistrict_id", null);
                                    }
                                    if (reason === "clear") {
                                      setListSubdistrict([]);
                                      setListVillageDistrict([]);
                                      setValue("city_district_id", null);
                                      setValue("subdistrict_id", null);
                                      setValue("village_subdistrict_id", null);
                                    }
                                  }}
                                  error={Boolean(errors.city_district_id)}
                                  labelId="city"
                                  aria-describedby="city"
                                  disabled={
                                    listCityDistrict?.length === 0 || loading
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      size="small"
                                      label="City"
                                      placeholder=""
                                      disabled={
                                        listCityDistrict?.length === 0 ||
                                        loading
                                      }
                                      error={Boolean(errors.city_district_id)}
                                    />
                                  )}
                                />
                              )}
                            />
                            {errors.city_district_id && (
                              <FormHelperText
                                sx={{ color: "error.main" }}
                                id="validation-basic"
                              >
                                {errors.city_district_id.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Tooltip>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Tooltip
                          title={
                            listSubdistrict?.length === 0
                              ? "Please select the City first"
                              : ""
                          }
                          placement="top-start"
                        >
                          <FormControl fullWidth size="small">
                            <Controller
                              name="subdistrict_id"
                              control={control}
                              rules={{ required: true }}
                              render={({ field: { value, onChange } }) => (
                                <Autocomplete
                                  value={value}
                                  options={listSubdistrict}
                                  id="autocomplete-province"
                                  onChange={(option, e, reason) => {
                                    if (e?.value) {
                                      fetchListRegion(
                                        "village",
                                        "",
                                        "",
                                        e?.value
                                      );
                                      setListVillageDistrict([]);
                                      setValue("subdistrict_id", e);
                                      onChange(e);
                                      setValue("village_subdistrict_id", null);
                                    }
                                    if (reason === "clear") {
                                      setListVillageDistrict([]);
                                      setValue("subdistrict_id", null);
                                      setValue("village_subdistrict_id", null);
                                    }
                                  }}
                                  error={Boolean(errors.subdistrict_id)}
                                  labelId="province"
                                  aria-describedby="province"
                                  disabled={
                                    listSubdistrict?.length === 0 || loading
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      size="small"
                                      label="Subdistrict"
                                      placeholder=""
                                      disabled={
                                        listSubdistrict?.length === 0 || loading
                                      }
                                      error={Boolean(errors.subdistrict_id)}
                                    />
                                  )}
                                />
                              )}
                            />
                            {errors.subdistrict_id && (
                              <FormHelperText
                                sx={{ color: "error.main" }}
                                id="validation-basic"
                              >
                                {errors.subdistrict_id.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Tooltip>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Tooltip
                          title={
                            listCityDistrict?.length === 0
                              ? "Please select the Subdistrict first"
                              : ""
                          }
                          placement="top-start"
                        >
                          <FormControl fullWidth size="small">
                            <Controller
                              name="village_subdistrict_id"
                              control={control}
                              rules={{ required: true }}
                              render={({ field: { value, onChange } }) => (
                                <Autocomplete
                                  value={value}
                                  options={listVillageDistrict}
                                  id="autocomplete-province"
                                  onChange={(option, e, reason) => {
                                    if (e?.value) {
                                      setValue("village_subdistrict_id", e);
                                      onChange(e);
                                    }
                                    if (reason === "clear") {
                                      setValue("village_subdistrict_id", null);
                                    }
                                  }}
                                  error={Boolean(errors.village_subdistrict_id)}
                                  labelId="province"
                                  disabled={
                                    listVillageDistrict?.length === 0 || loading
                                  }
                                  aria-describedby="province"
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      size="small"
                                      label="Village"
                                      placeholder=""
                                      disabled={
                                        listVillageDistrict?.length === 0 ||
                                        loading
                                      }
                                      error={Boolean(
                                        errors.village_subdistrict_id
                                      )}
                                    />
                                  )}
                                />
                              )}
                            />
                            {errors.village_subdistrict_id && (
                              <FormHelperText
                                sx={{ color: "error.main" }}
                                id="validation-basic"
                              >
                                {errors.village_subdistrict_id.message}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Tooltip>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <Controller
                            name="latitude"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                value={value}
                                size="small"
                                label="Latitude"
                                onChange={onChange}
                                placeholder="Latitude"
                                disabled={loading}
                                error={Boolean(errors.latitude)}
                                aria-describedby="validation-basic"
                              />
                            )}
                          />
                          {errors.latitude && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic"
                            >
                              {errors.latitude.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <Controller
                            name="longitude"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                value={value}
                                size="small"
                                label="Longitude"
                                onChange={onChange}
                                placeholder="Longitude"
                                disabled={loading}
                                error={Boolean(errors.longitude)}
                                aria-describedby="validation-basic"
                              />
                            )}
                          />
                          {errors.longitude && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic"
                            >
                              {errors.longitude.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <FormControl fullWidth>
                          <Controller
                            name="map_links"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                value={value}
                                size="small"
                                label="Map Links"
                                onChange={onChange}
                                placeholder="Map Links"
                                disabled={loading}
                                error={Boolean(errors.map_links)}
                                aria-describedby="validation-basic"
                              />
                            )}
                          />
                          {errors.map_links && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic"
                            >
                              {errors.map_links.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                    </>
                    <>
                      <Grid item xs={12}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          3. Contact Info
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <Controller
                            name="phone"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                value={value}
                                size="small"
                                label="No Telepon 1"
                                onChange={(e) => {
                                  const inputValue = e.target.value;
                                  if (
                                    inputValue === "" ||
                                    regex.test(inputValue)
                                  ) {
                                    if (
                                      inputValue.startsWith("0") ||
                                      inputValue === ""
                                    ) {
                                      onChange(inputValue);
                                    }
                                  }
                                }}
                                placeholder="08123456789"
                                disabled={loading}
                                error={Boolean(errors.phone)}
                                aria-describedby="validation-basic"
                              />
                            )}
                          />
                          {errors.phone && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic"
                            >
                              {errors.phone.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <Controller
                            name="phone_nd"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                value={value}
                                size="small"
                                label="No Telepon 2"
                                onChange={(e) => {
                                  const inputValue = e.target.value;
                                  if (
                                    inputValue === "" ||
                                    regex.test(inputValue)
                                  ) {
                                    if (
                                      inputValue.startsWith("0") ||
                                      inputValue === ""
                                    ) {
                                      onChange(inputValue);
                                    }
                                  }
                                }}
                                placeholder="08123456789"
                                disabled={loading}
                                error={Boolean(errors.phone_nd)}
                                aria-describedby="validation-basic"
                              />
                            )}
                          />
                          {errors.phone_nd && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic"
                            >
                              {errors.phone_nd.message}
                            </FormHelperText>
                          )}
                        </FormControl>
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
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <Controller
                            name="weekdays_open"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <DatePicker
                                size="small"
                                selected={value}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Open Time"
                                dateFormat="H:mm"
                                onChange={(e) => onChange(e)}
                                placeholderText="09:00"
                                disabled={loading}
                                customInput={
                                  <CustomInput
                                    value={value}
                                    size="small"
                                    onChange={onChange}
                                    label="Open"
                                    error={Boolean(errors.weekdays_open)}
                                    aria-describedby="weekdays_open"
                                  />
                                }
                              />
                            )}
                          />
                          {errors.weekdays_open && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic"
                            >
                              {errors.weekdays_open.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <Controller
                            name="weekdays_close"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <DatePicker
                                size="small"
                                selected={value}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Close Time"
                                dateFormat="H:mm"
                                onChange={(e) => onChange(e)}
                                placeholderText="17:00"
                                disabled={loading}
                                customInput={
                                  <CustomInput
                                    value={value}
                                    size="small"
                                    onChange={onChange}
                                    label="close"
                                    error={Boolean(errors.weekdays_close)}
                                    aria-describedby="weekdays_close"
                                  />
                                }
                              />
                            )}
                          />
                          {errors.weekdays_close && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic"
                            >
                              {errors.weekdays_close.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, ml: 4 }}
                        >
                          b. Weekend
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <Controller
                            name="weekend_open"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <DatePicker
                                size="small"
                                selected={value}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Open Time"
                                dateFormat="H:mm"
                                onChange={(e) => onChange(e)}
                                placeholderText="09:00"
                                disabled={loading}
                                customInput={
                                  <CustomInput
                                    value={value}
                                    size="small"
                                    onChange={onChange}
                                    label="Open"
                                    error={Boolean(errors.weekend_open)}
                                    aria-describedby="weekend_open"
                                  />
                                }
                              />
                            )}
                          />
                          {errors.weekend_open && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic"
                            >
                              {errors.weekend_open.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <Controller
                            name="weekend_close"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <DatePicker
                                size="small"
                                selected={value}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Close Time"
                                dateFormat="H:mm"
                                onChange={(e) => onChange(e)}
                                placeholderText="17:00"
                                disabled={loading}
                                customInput={
                                  <CustomInput
                                    value={value}
                                    size="small"
                                    onChange={onChange}
                                    label="Close"
                                    error={Boolean(errors.weekend_close)}
                                    aria-describedby="weekend_close"
                                  />
                                }
                              />
                            )}
                          />
                          {errors.weekend_close && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic"
                            >
                              {errors.weekend_close.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                    </>
                    <>
                      <Grid item xs={12}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          5. Facilities
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <FormControl size="small" fullWidth>
                          <Controller
                            name="facility"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <Autocomplete
                                multiple
                                freeSolo
                                value={value}
                                options={listFacilities}
                                id="autocomplete-facility"
                                onChange={(e, valueArray) => {
                                  onChange(e);
                                  setValue("facility", valueArray);
                                }}
                                error={Boolean(errors.facility)}
                                labelId="facility"
                                aria-describedby="facility"
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    label="Facility"
                                    placeholder=""
                                    disabled={loading}
                                    error={Boolean(errors.facility)}
                                  />
                                )}
                              />
                            )}
                          />
                          {errors.facility && (
                            <FormHelperText
                              sx={{ color: "error.main" }}
                              id="validation-basic"
                            >
                              {errors.facility.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                    </>
                  </Grid>
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
                      Batal
                    </Button>
                  </Link>
                  <Button
                    color="success"
                    variant="contained"
                    sx={{ width: "150px" }}
                    type="submit"
                    disabled={loading}
                  >
                    {!loading ? "Simpan" : <CircularProgress size={20} />}
                  </Button>
                </CardActions>
              </Card>
            </form>
          </Grid>
        </Grid>
      </DatePickerWrapper>
    </>
  );
};

export default ClinicNew;
