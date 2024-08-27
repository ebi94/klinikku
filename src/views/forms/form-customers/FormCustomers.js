import React, { useState, useEffect, forwardRef } from "react";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Controller } from "react-hook-form";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";

import { listClinic } from "src/services/clinics";
import { listRegion } from "src/services/region";
import { listGender } from "src/configs/constans";
import { mappingDataOptions } from "src/utils/helpers";

const CustomInput = forwardRef(({ ...props }, ref) => {
  return <TextField inputRef={ref} {...props} sx={{ width: "100%" }} />;
});

const FormCustomers = (props) => {
  const { loading, dataForm } = props;

  const [clinicList, setClinicsList] = useState([]);
  const [listProvince, setListProvince] = useState([]);
  const [listCityDistrict, setListCityDistrict] = useState([]);
  const [listSubdistrict, setListSubdistrict] = useState([]);
  const [listVillageDistrict, setListVillageDistrict] = useState([]);

  const { control, setValue, errors } = dataForm;

  const fetchClinicList = async () => {
    const res = await listClinic();
    if (+res?.result?.status === 200) {
      const data = res?.result?.data !== null ? res?.result?.data : [];

      const mappingData = mappingDataOptions(data, "clinic_id");
      setClinicsList(mappingData);
    } else {
      toast.error(`Opps ! ${res?.error} `);
      if (+res?.status === 401) {
        logout();
      }
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
    fetchClinicList();
    fetchListRegion("province");
  }, []);

  return (
    <>
      {" "}
      <Grid container spacing={5}>
        <>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              1. Info Pasien
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
                    label="Nama Lengkap"
                    onChange={onChange}
                    placeholder="Nama Lengkap"
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
                name="nik"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    size="small"
                    label="NIK"
                    onChange={onChange}
                    placeholder="3170XXXXXXXXXXX"
                    disabled={loading}
                    error={Boolean(errors.nik)}
                    aria-describedby="validation-basic"
                  />
                )}
              />
              {errors.nik && (
                <FormHelperText
                  sx={{ color: "error.main" }}
                  id="validation-basic"
                >
                  {errors.nik.message}
                </FormHelperText>
              )}
            </FormControl>
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
                    label="No Telepon"
                    onChange={onChange}
                    placeholder="0812312312312"
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
                name="email"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    size="small"
                    label="Email"
                    onChange={onChange}
                    placeholder="customer@mail.com"
                    disabled={loading}
                    error={Boolean(errors.email)}
                    aria-describedby="validation-basic"
                  />
                )}
              />
              {errors.email && (
                <FormHelperText
                  sx={{ color: "error.main" }}
                  id="validation-basic"
                >
                  {errors.email.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Controller
                name="gender"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <Autocomplete
                    value={value}
                    InputLabelProps={{ shrink: true }}
                    required
                    options={listGender}
                    id="autocomplete-gender"
                    onChange={(option, e, reason) => {
                      if (e?.value) {
                        setValue("gender", e?.value);
                        onChange(e?.value);
                      }
                      if (reason === "clear") {
                        setValue("gender", null);
                      }
                    }}
                    error={Boolean(errors.gender)}
                    labelId="gender"
                    aria-describedby="gender"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        label="Jenis Kelamin"
                        placeholder=""
                        disabled={loading}
                        error={Boolean(errors.gender)}
                      />
                    )}
                  />
                )}
              />
              {errors.gender && (
                <FormHelperText
                  sx={{ color: "error.main" }}
                  id="validation-basic"
                >
                  {errors.gender.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Controller
                name="date_of_birth"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <DatePicker
                    size="small"
                    selected={value}
                    onChange={(e) => {
                      onChange(e);
                    }}
                    placeholderText="2000-01-01"
                    showMonthDropdown
                    showYearDropdown
                    disabled={loading}
                    customInput={
                      <CustomInput
                        value={value}
                        required
                        size="small"
                        onChange={onChange}
                        label="Tgl Lahir"
                        error={Boolean(errors.date_of_birth)}
                        aria-describedby="date_of_birth"
                      />
                    }
                  />
                )}
              />
              {errors.date_of_birth && (
                <FormHelperText
                  sx={{ color: "error.main" }}
                  id="validation-basic"
                >
                  {errors.date_of_birth.message}
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
                        setValue("province_id", e?.value);
                        onChange(e?.value);
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
                        label="Provinsi"
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
                  ? "Silahkan pilih Provinsi terlebih dahulu"
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
                          fetchListRegion("subdistrict", "", e?.value);
                          setListSubdistrict([]);
                          setListVillageDistrict([]);
                          setValue("city_district_id", e?.value);
                          onChange(e?.value);
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
                      disabled={listCityDistrict?.length === 0 || loading}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          label="Kota/Kabupaten"
                          placeholder=""
                          disabled={listCityDistrict?.length === 0 || loading}
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
                  ? "Silahkan pilih Kota/Kabupaten terlebih dahulu"
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
                          fetchListRegion("village", "", "", e?.value);
                          setListVillageDistrict([]);
                          setValue("subdistrict_id", e?.value);
                          onChange(e?.value);
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
                      disabled={listSubdistrict?.length === 0 || loading}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          label="Kecamatan"
                          placeholder=""
                          disabled={listSubdistrict?.length === 0 || loading}
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
                  ? "Silahkan pilih Kecamatan terlebih dahulu"
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
                          setValue("village_subdistrict_id", e?.value);
                          onChange(e?.value);
                        }
                        if (reason === "clear") {
                          setValue("village_subdistrict_id", null);
                        }
                      }}
                      error={Boolean(errors.village_subdistrict_id)}
                      labelId="province"
                      disabled={listVillageDistrict?.length === 0 || loading}
                      aria-describedby="province"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          label="Kelurahan"
                          placeholder=""
                          disabled={
                            listVillageDistrict?.length === 0 || loading
                          }
                          error={Boolean(errors.village_subdistrict_id)}
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
          <Grid item xs={12} sm={12}>
            <FormControl fullWidth>
              <Controller
                name="complete_address"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    rows={4}
                    size="small"
                    multiline
                    {...field}
                    label="Alamat Lengkap"
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
            <FormControl fullWidth>
              <Controller
                name="clinic_id"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <Autocomplete
                    value={value}
                    InputLabelProps={{ shrink: true }}
                    required
                    options={clinicList}
                    id="autocomplete-clinic_id"
                    onChange={(option, e, reason) => {
                      if (e?.value) {
                        setValue("clinic_id", e?.value);
                        onChange(e?.value);
                      }
                      if (reason === "clear") {
                        setValue("clinic_id", null);
                      }
                    }}
                    error={Boolean(errors.clinic_id)}
                    labelId="clinic_id"
                    aria-describedby="clinic_id"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        label="Klinik"
                        placeholder=""
                        disabled={loading}
                        error={Boolean(errors.clinic_id)}
                      />
                    )}
                  />
                )}
              />
              {errors.clinic_id && (
                <FormHelperText
                  sx={{ color: "error.main" }}
                  id="validation-basic"
                >
                  {errors.clinic_id.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
        </>
      </Grid>
    </>
  );
};

export default FormCustomers;
