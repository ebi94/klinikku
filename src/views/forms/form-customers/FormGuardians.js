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

import { listRegion } from "src/services/region";
import { listGender, listRelationship } from "src/configs/constans";
import { mappingDataOptions } from "src/utils/helpers";

const CustomInput = forwardRef(({ ...props }, ref) => {
  return <TextField inputRef={ref} {...props} sx={{ width: "100%" }} />;
});

const FormGuardians = (props) => {
  const { loading, dataForm } = props;

  const [listProvince, setListProvince] = useState([]);
  const [listCityDistrict, setListCityDistrict] = useState([]);
  const [listSubdistrict, setListSubdistrict] = useState([]);
  const [listVillageDistrict, setListVillageDistrict] = useState([]);

  const { control, setValue, errors } = dataForm;

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
      <Grid container spacing={5}>
        <>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              2. Info Wali Pasien
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Controller
                name="name_wali"
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
                    error={Boolean(errors.name_wali)}
                    aria-describedby="validation-basic"
                  />
                )}
              />
              {errors.name_wali && (
                <FormHelperText
                  sx={{ color: "error.main" }}
                  id="validation-basic"
                >
                  {errors.name_wali.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Controller
                name="nik_wali"
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
                    error={Boolean(errors.nik_wali)}
                    aria-describedby="validation-basic"
                  />
                )}
              />
              {errors.nik_wali && (
                <FormHelperText
                  sx={{ color: "error.main" }}
                  id="validation-basic"
                >
                  {errors.nik_wali.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Controller
                name="phone_wali"
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
                    error={Boolean(errors?.phone_wali)}
                    aria-describedby="validation-basic"
                  />
                )}
              />
              {errors?.phone_wali && (
                <FormHelperText
                  sx={{ color: "error.main" }}
                  id="validation-basic"
                >
                  {errors?.phone_wali.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Controller
                name="email_wali"
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
                    error={Boolean(errors.email_wali)}
                    aria-describedby="validation-basic"
                  />
                )}
              />
              {errors.email_wali && (
                <FormHelperText
                  sx={{ color: "error.main" }}
                  id="validation-basic"
                >
                  {errors.email_wali.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Controller
                name="gender_wali"
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
                        setValue("gender_wali", e?.value);
                        onChange(e?.value);
                      }
                      if (reason === "clear") {
                        setValue("gender_wali", null);
                      }
                    }}
                    error={Boolean(errors.gender_wali)}
                    labelId="gender_wali"
                    aria-describedby="gender_wali"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        label="Jenis Kelamin"
                        placeholder=""
                        disabled={loading}
                        error={Boolean(errors.gender_wali)}
                      />
                    )}
                  />
                )}
              />
              {errors.gender_wali && (
                <FormHelperText
                  sx={{ color: "error.main" }}
                  id="validation-basic"
                >
                  {errors.gender_wali.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Controller
                name="date_of_birth_wali"
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
                        error={Boolean(errors.date_of_birth_wali)}
                        aria-describedby="date_of_birth_wali"
                      />
                    }
                  />
                )}
              />
              {errors.date_of_birth_wali && (
                <FormHelperText
                  sx={{ color: "error.main" }}
                  id="validation-basic"
                >
                  {errors.date_of_birth_wali.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <Controller
                name="province_id_wali"
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
                        setValue("province_id_wali", e?.value);
                        onChange(e?.value);
                        setValue("city_district_id_wali", null);
                        setValue("subdistrict_id_wali", null);
                        setValue("village_subdistrict_id_wali", null);
                      }
                      if (reason === "clear") {
                        setListCityDistrict([]);
                        setListSubdistrict([]);
                        setListVillageDistrict([]);
                        setValue("province_id_wali", null);
                        setValue("city_district_id_wali", null);
                        setValue("subdistrict_id_wali", null);
                        setValue("village_subdistrict_id_wali", null);
                      }
                    }}
                    error={Boolean(errors.province_id_wali)}
                    labelId="province"
                    aria-describedby="province"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        label="Provinsi"
                        placeholder=""
                        disabled={loading}
                        error={Boolean(errors.province_id_wali)}
                      />
                    )}
                  />
                )}
              />
              {errors.province_id_wali && (
                <FormHelperText
                  sx={{ color: "error.main" }}
                  id="validation-basic"
                >
                  {errors.province_id_wali.message}
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
                  name="city_district_id_wali"
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
                          setValue("city_district_id_wali", e?.value);
                          onChange(e?.value);
                          setValue("subdistrict_id_wali", null);
                          setValue("village_subdistrict_id_wali", null);
                        }
                        if (reason === "clear") {
                          setListSubdistrict([]);
                          setListVillageDistrict([]);
                          setValue("city_district_id_wali", null);
                          setValue("subdistrict_id_wali", null);
                          setValue("village_subdistrict_id_wali", null);
                        }
                      }}
                      error={Boolean(errors.city_district_id_wali)}
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
                          error={Boolean(errors.city_district_id_wali)}
                        />
                      )}
                    />
                  )}
                />
                {errors.city_district_id_wali && (
                  <FormHelperText
                    sx={{ color: "error.main" }}
                    id="validation-basic"
                  >
                    {errors.city_district_id_wali.message}
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
                  name="subdistrict_id_wali"
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
                          setValue("subdistrict_id_wali", e?.value);
                          onChange(e?.value);
                          setValue("village_subdistrict_id_wali", null);
                        }
                        if (reason === "clear") {
                          setListVillageDistrict([]);
                          setValue("subdistrict_id_wali", null);
                          setValue("village_subdistrict_id_wali", null);
                        }
                      }}
                      error={Boolean(errors.subdistrict_id_wali)}
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
                          error={Boolean(errors.subdistrict_id_wali)}
                        />
                      )}
                    />
                  )}
                />
                {errors.subdistrict_id_wali && (
                  <FormHelperText
                    sx={{ color: "error.main" }}
                    id="validation-basic"
                  >
                    {errors.subdistrict_id_wali.message}
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
                  name="village_subdistrict_id_wali"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <Autocomplete
                      value={value}
                      options={listVillageDistrict}
                      id="autocomplete-province"
                      onChange={(option, e, reason) => {
                        if (e?.value) {
                          setValue("village_subdistrict_id_wali", e?.value);
                          onChange(e?.value);
                        }
                        if (reason === "clear") {
                          setValue("village_subdistrict_id_wali", null);
                        }
                      }}
                      error={Boolean(errors.village_subdistrict_id_wali)}
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
                          error={Boolean(errors.village_subdistrict_id_wali)}
                        />
                      )}
                    />
                  )}
                />
                {errors.village_subdistrict_id_wali && (
                  <FormHelperText
                    sx={{ color: "error.main" }}
                    id="validation-basic"
                  >
                    {errors.village_subdistrict_id_wali.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Tooltip>
          </Grid>
          <Grid item xs={12} sm={12}>
            <FormControl fullWidth>
              <Controller
                name="complete_address_wali"
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
                name="relationship"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <Autocomplete
                    value={value}
                    InputLabelProps={{ shrink: true }}
                    required
                    options={listRelationship}
                    id="autocomplete-relationship"
                    onChange={(option, e, reason) => {
                      if (e?.value) {
                        setValue("relationship", e?.value);
                        onChange(e?.value);
                      }
                      if (reason === "clear") {
                        setValue("relationship", null);
                      }
                    }}
                    error={Boolean(errors.relationship)}
                    labelId="relationship"
                    aria-describedby="relationship"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        label="Relasi"
                        placeholder=""
                        disabled={loading}
                        error={Boolean(errors.relationship)}
                      />
                    )}
                  />
                )}
              />
              {errors.relationship && (
                <FormHelperText
                  sx={{ color: "error.main" }}
                  id="validation-basic"
                >
                  {errors.relationship.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
        </>
      </Grid>
    </>
  );
};

export default FormGuardians;
