import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import * as yup from "yup";
import toast from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Box,
  Divider,
  Grid,
  FormLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormHelperText,
  Typography,
  Card,
  CardContent,
  Checkbox,
  FormGroup,
  FormControlLabel,
  InputAdornment,
} from "@mui/material";
import {
  diseaseOptions,
  appetiteOptions,
  frequencyOptions,
  wayOfWalkingOptions,
  eatingPatternOptions,
  konjungtivaOptions,
  consciousnessOptions,
  momentOptions,
} from "src/configs/constans";
import { addGeneralAssestment } from "src/services/medicalRecords";
import moment from "moment";
import ButtonSubmit from "src/views/components/buttons/ButtonSubmit";
import ButtonCustom from "src/views/components/buttons/ButtonCustom";
import DividerText from "src/views/components/divider/DividerText";

const formSchema = yup.object({
  main_complaint: yup.string().required("Keluhan utama harus diisi."),
  history_of_injury: yup.string().required("Riwayat cedera harus diisi."),
  concomitant_disease: yup
    .array()
    .of(yup.string())
    .required("Penyakit penyerta harus diisi."),
  nutrition: yup
    .object({
      appetite: yup
        .string()
        .oneOf(
          ["Baik", "Biasa", "Anoreksia Mual Muntah"],
          "Appetite tidak valid."
        )
        .required("Appetite harus diisi."),
      frequency_of_eating: yup
        .string()
        .oneOf(["3", "2", "1"], "Frekuensi makan tidak valid.")
        .required("Frekuensi makan harus diisi."),
      eating_pattern: yup
        .string()
        .oneOf(["Teratur", "Tidak Teratur"], "Pola makan tidak valid.")
        .required("Pola makan harus diisi."),
    })
    .required("Informasi nutrisi harus diisi."),
  physical_condition: yup
    .object({
      way_of_walking: yup
        .string()
        .oneOf(
          ["Jalan Sendiri", "Kursi Roda", "Bantuan"],
          "Cara berjalan tidak valid."
        )
        .required("Cara berjalan harus diisi."),
      weight: yup
        .number()
        .typeError("Berat badan harus berupa angka.")
        .required("Berat badan harus diisi."),
      height: yup
        .number()
        .typeError("Tinggi badan harus berupa angka.")
        .required("Tinggi badan harus diisi."),
      konjungtiva: yup
        .string()
        .oneOf(["Normal", "Pucat"], "Konjungtiva tidak valid.")
        .required("Konjungtiva harus diisi."),
    })
    .required("Kondisi fisik harus diisi."),
  triage: yup
    .object({
      blood_pressure: yup
        .string()
        .matches(
          /^\d{1,3}\/\d{1,3}$/,
          "Tekanan darah harus dalam format XXX/XXX."
        )
        .required("Tekanan darah harus diisi."),
      pulse_frequency: yup
        .number()
        .typeError("Frekuensi nadi harus berupa angka.")
        .required("Frekuensi nadi harus diisi."),
      body_temperature: yup
        .number()
        .typeError("Suhu badan harus berupa angka.")
        .required("Suhu badan harus diisi."),
      breathing_frequency: yup
        .number()
        .typeError("Frekuensi pernapasan harus berupa angka.")
        .required("Frekuensi pernapasan harus diisi."),
      consciousness: yup
        .string()
        .oneOf(
          [
            "Compose Mentis",
            "Apatis",
            "Delirium",
            "Somnolen",
            "Sopor",
            "Semi Koma",
            "Koma Ringan",
          ],
          "Kesadaran tidak valid."
        )
        .required("Kesadaran harus diisi."),
    })
    .required("Triage harus diisi."),
  gds: yup
    .object({
      data: yup
        .number()
        .typeError("Data GDS harus berupa angka.")
        .required("Data GDS harus diisi."),
      date: yup
        .date()
        .required("Tanggal GDS harus diisi.")
        .typeError("Format tanggal GDS harus YYYY-MM-DD HH:mm"),
      moment: yup
        .string()
        .oneOf(["Sesudah Makan", "Sebelum Makan"], "Moment GDS tidak valid.")
        .required("Moment GDS harus diisi."),
    })
    .required("GDS harus diisi."),
});

const FormGeneralAssestment = (props) => {
  const router = useRouter();
  const { data, onClickCancel, onSubmitData } = props;
  const { id, patientId } = router.query;
  const [loading, setLoading] = useState(false);

  const today = new Date();

  const defaultValues = {
    main_complaint: data?.main_complaint ?? "",
    history_of_injury: data?.history_of_injury ?? "",
    concomitant_disease: data?.concomitant_disease ?? [], // Start with an empty array since it's a list of strings
    nutrition: {
      appetite: data?.nutrition?.appetite ?? "", // Default could be one of the valid options or empty
      frequency_of_eating: data?.nutrition?.frequency_of_eating ?? "", // Default could be one of the valid options or empty
      eating_pattern: data?.nutrition?.eating_pattern ?? "", // Default could be one of the valid options or empty
    },
    physical_condition: {
      way_of_walking: data?.physical_condition?.way_of_walking ?? "",
      weight: data?.physical_condition?.weight ?? "", // Ensure this is a string or number depending on how you handle inputs
      height: data?.physical_condition?.height ?? "", // Ensure this is a string or number depending on how you handle inputs
      konjungtiva: data?.physical_condition?.konjungtiva ?? "",
    },
    triage: {
      blood_pressure: data?.triage?.blood_pressure ?? "",
      pulse_frequency: data?.triage?.pulse_frequency ?? "", // Make sure to handle as string if needed for display
      body_temperature: data?.triage?.body_temperature ?? "",
      breathing_frequency: data?.triage?.breathing_frequency ?? "",
      consciousness: data?.triage?.consciousness ?? "",
    },
    gds: {
      data: data?.gds?.data ?? "",
      date: data?.gds?.date ?? "", // Format YYYY-MM-DD HH:mm, ensure handling of date-time
      moment: data?.gds?.moment ?? "",
    },
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "all",
    resolver: yupResolver(formSchema),
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        date: moment(today).format("YYYY-MM-DD"),
        treatment_id: id,
        clinic_id: "f940baa4-ca51-418e-8411-3a87e2f5cb2c",
        is_new: true,
        triage: {
          ...values.triage,
          body_temperature: values.triage.body_temperature.toFixed(1),
        },
        gds: {
          ...values.gds,
          date: moment(values?.gds?.date).format("YYYY-MM-DD HH:mm"),
        },
      }; // adjust according to needed format
      const response = await addGeneralAssestment(payload);
      if (response?.result?.status === 201) {
        toast.success("Berhasil Menambahkan Data");
        setLoading(false);
        onSubmitData();
      } else {
        // Handle failure
        console.error("Failed", response);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkDefaultValue = (values, selected) => {
    if (+values?.length > 0) {
      return values.includes(selected);
    } else {
      return false;
    }
  };

  return (
    <>
      <Card sx={{ marginTop: 6 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Pengkajian Umum
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Divider></Divider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Grid container spacing={2} alignItems="flex-start">
                  <Grid item xs={12} sm={6}>
                    <FormLabel
                      component="legend"
                      sx={{ fontWeight: 600, paddingTop: 2 }}
                    >
                      Tanggal Pengkajian
                    </FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormLabel
                      component="legend"
                      sx={{ fontWeight: 600, paddingTop: 2, color: "#000000" }}
                    >
                      {moment(today).format("DD MMM YYYY")}
                    </FormLabel>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth error={Boolean(errors.main_complaint)}>
                  <Grid container spacing={2} alignItems="flex-start">
                    <Grid item xs={12} sm={3}>
                      <FormLabel
                        component="legend"
                        sx={{ fontWeight: 600, paddingTop: 2 }}
                      >
                        Keluhan Utama
                      </FormLabel>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                      <Controller
                        name="main_complaint"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            {...field}
                            disabled={loading}
                            id="main_complaint"
                            label=""
                            rows={3}
                            multiline
                            fullWidth
                          />
                        )}
                      />
                      {errors.main_complaint && (
                        <FormHelperText>
                          {errors.main_complaint.message}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  error={Boolean(errors.history_of_injury)}
                >
                  <Grid container spacing={2} alignItems="flex-start">
                    <Grid item xs={12} sm={3}>
                      <FormLabel
                        component="legend"
                        sx={{ fontWeight: 600, paddingTop: 2 }}
                      >
                        Riwayat Luka
                      </FormLabel>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                      <Controller
                        name="history_of_injury"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            {...field}
                            disabled={loading}
                            rows={3}
                            multiline
                            fullWidth
                          />
                        )}
                      />
                      {errors.history_of_injury && (
                        <FormHelperText>
                          {errors.history_of_injury.message}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  error={Boolean(errors.concomitant_disease)}
                >
                  <Grid container spacing={2} alignItems="flex-start">
                    <Grid item xs={12} sm={3}>
                      <FormLabel
                        component="legend"
                        sx={{ fontWeight: 600, paddingTop: 2 }}
                      >
                        Penyakit Penyerta
                      </FormLabel>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                      <Controller
                        name="concomitant_disease"
                        control={control}
                        render={({ field: { onChange, value, ref } }) => (
                          <FormGroup sx={{ display: "contents" }}>
                            {diseaseOptions.map((option, index) => {
                              return (
                                <FormControlLabel
                                  key={index}
                                  sx={{ width: "25%" }}
                                  control={
                                    <Checkbox
                                      //   checked={value.includes(option)}
                                      defaultChecked={checkDefaultValue(
                                        data?.component,
                                        option
                                      )}
                                      onChange={(event) => {
                                        const newValue = event.target.checked
                                          ? [...value, option]
                                          : value.filter(
                                              (item) => item !== option
                                            );
                                        onChange(newValue); // Correctly using onChange from field to update the array
                                      }}
                                      value={option}
                                      name={option}
                                    />
                                  }
                                  label={option}
                                />
                              );
                            })}
                          </FormGroup>
                        )}
                      />

                      {errors.concomitant_disease && (
                        <FormHelperText>
                          {errors.concomitant_disease.message}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>
              <DividerText label="Status Nutrisi" />
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  error={Boolean(errors.nutrition?.appetite)}
                >
                  <Grid container spacing={2} alignItems="flex-start">
                    <Grid item xs={12} sm={3}>
                      <FormLabel
                        component="legend"
                        sx={{ fontWeight: 600, paddingTop: 2 }} // Mengatur font weight seperti yang diinginkan
                      >
                        Nafsu Makan
                      </FormLabel>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                      <Controller
                        name="nutrition.appetite"
                        control={control}
                        render={({ field }) => (
                          <RadioGroup
                            {...field}
                            disabled={loading}
                            sx={{ flexDirection: "row" }} // Menyusun radio buttons dalam satu baris
                            onChange={(e) => field.onChange(e.target.value)}
                          >
                            {appetiteOptions.map((option) => (
                              <FormControlLabel
                                value={option}
                                control={<Radio />}
                                label={option}
                                key={option}
                              />
                            ))}
                          </RadioGroup>
                        )}
                      />
                      {errors.nutrition?.appetite && (
                        <FormHelperText>
                          {errors.nutrition.appetite.message}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  error={Boolean(errors.nutrition?.frequency_of_eating)}
                >
                  <Grid container spacing={2} alignItems="flex-start">
                    <Grid item xs={12} sm={3}>
                      <FormLabel
                        component="legend"
                        sx={{ fontWeight: 600, paddingTop: 2 }} // Sesuaikan gaya label seperti kode sebelumnya
                      >
                        Frekuensi Makan
                      </FormLabel>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                      <Controller
                        name="nutrition.frequency_of_eating"
                        control={control}
                        render={({ field }) => (
                          <RadioGroup
                            {...field}
                            disabled={loading}
                            sx={{ flexDirection: "row" }} // Menyusun radio buttons dalam satu baris
                            onChange={(e) => field.onChange(e.target.value)}
                          >
                            {frequencyOptions.map((option) => (
                              <FormControlLabel
                                value={option}
                                control={<Radio />}
                                label={`${option} x sehari`}
                                key={option}
                              />
                            ))}
                          </RadioGroup>
                        )}
                      />
                      {errors.nutrition?.frequency_of_eating && (
                        <FormHelperText>
                          {errors.nutrition.frequency_of_eating.message}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  error={Boolean(errors.nutrition?.eating_pattern)}
                >
                  <Grid container spacing={2} alignItems="flex-start">
                    <Grid item xs={12} sm={3}>
                      <FormLabel
                        component="legend"
                        sx={{ fontWeight: 600, paddingTop: 2 }} // Menyesuaikan style sesuai dengan label lainnya
                      >
                        Pola Makan
                      </FormLabel>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                      <Controller
                        name="nutrition.eating_pattern"
                        control={control}
                        render={({ field }) => (
                          <RadioGroup
                            {...field}
                            disabled={loading}
                            sx={{ flexDirection: "row" }} // Menyusun radio buttons dalam satu baris
                            onChange={(e) => field.onChange(e.target.value)}
                          >
                            {eatingPatternOptions.map((option) => (
                              <FormControlLabel
                                value={option}
                                control={<Radio />}
                                label={option}
                                key={option}
                              />
                            ))}
                          </RadioGroup>
                        )}
                      />
                      {errors.nutrition?.eating_pattern && (
                        <FormHelperText>
                          {errors.nutrition.eating_pattern.message}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>
              <DividerText label="Kondisi Fisik" />
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  error={Boolean(errors.physical_condition?.way_of_walking)}
                >
                  <Grid container spacing={2} alignItems="flex-start">
                    <Grid item xs={12} sm={3}>
                      <FormLabel
                        component="legend"
                        sx={{ fontWeight: 600, paddingTop: 2 }} // Menyesuaikan gaya label seperti pada elemen form lainnya
                      >
                        Cara Berjalan
                      </FormLabel>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                      <Controller
                        name="physical_condition.way_of_walking"
                        control={control}
                        render={({ field }) => (
                          <RadioGroup
                            {...field}
                            disabled={loading}
                            sx={{ flexDirection: "row" }} // Menyusun radio buttons dalam satu baris
                            onChange={(e) => field.onChange(e.target.value)}
                          >
                            {wayOfWalkingOptions.map((option) => (
                              <FormControlLabel
                                value={option}
                                control={<Radio />}
                                label={option}
                                key={option}
                              />
                            ))}
                          </RadioGroup>
                        )}
                      />
                      {errors.physical_condition?.way_of_walking && (
                        <FormHelperText>
                          {errors.physical_condition.way_of_walking.message}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  error={Boolean(errors.physical_condition?.weight)}
                >
                  <Grid container spacing={2} alignItems="flex-start">
                    <Grid item xs={12} sm={6}>
                      <FormLabel
                        component="legend"
                        sx={{ fontWeight: 600, paddingTop: 2 }}
                      >
                        Berat Badan (kg)
                      </FormLabel>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="physical_condition.weight"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            {...field}
                            disabled={loading}
                            type="tel"
                            label=""
                            fullWidth
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="start">
                                  kg
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                      {errors.physical_condition?.weight && (
                        <FormHelperText>
                          {errors.physical_condition.weight.message}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  error={Boolean(errors.physical_condition?.height)}
                >
                  <Grid container spacing={2} alignItems="flex-start">
                    <Grid item xs={12} sm={6}>
                      <FormLabel
                        component="legend"
                        sx={{ fontWeight: 600, paddingTop: 2 }}
                      >
                        Tinggi Badan (cm)
                      </FormLabel>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="physical_condition.height"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            size="small"
                            {...field}
                            disabled={loading}
                            type="tel"
                            label=""
                            fullWidth
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="start">
                                  cm
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                      {errors.physical_condition?.height && (
                        <FormHelperText>
                          {errors.physical_condition.height.message}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  error={Boolean(errors.physical_condition?.konjungtiva)}
                >
                  <Grid container spacing={2} alignItems="flex-start">
                    <Grid item xs={12} sm={3}>
                      <FormLabel
                        component="legend"
                        sx={{ fontWeight: 600, paddingTop: 2 }} // Menyesuaikan gaya label seperti pada elemen form lainnya
                      >
                        Konjungtiva
                      </FormLabel>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                      <Controller
                        name="physical_condition.konjungtiva"
                        control={control}
                        render={({ field }) => (
                          <RadioGroup
                            {...field}
                            disabled={loading}
                            sx={{ flexDirection: "row" }} // Menyusun radio buttons dalam satu baris
                            onChange={(e) => field.onChange(e.target.value)}
                          >
                            {konjungtivaOptions.map((option) => (
                              <FormControlLabel
                                value={option}
                                control={<Radio />}
                                label={option}
                                key={option}
                              />
                            ))}
                          </RadioGroup>
                        )}
                      />
                      {errors.physical_condition?.konjungtiva && (
                        <FormHelperText>
                          {errors.physical_condition.konjungtiva.message}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>
              <DividerText label="Triase" />
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  error={Boolean(errors.triage?.blood_pressure)}
                >
                  <Grid container spacing={2} alignItems="flex-start">
                    <Grid item xs={12} sm={3}>
                      <FormLabel
                        component="legend"
                        sx={{ fontWeight: 600, paddingTop: 2 }}
                      >
                        Tekanan Darah (XXX/XXX)
                      </FormLabel>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                      <Controller
                        name="triage.blood_pressure"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            disabled={loading}
                            size="small"
                            label=""
                            fullWidth
                          />
                        )}
                      />
                      {errors.triage?.blood_pressure && (
                        <FormHelperText>
                          {errors.triage.blood_pressure.message}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  error={Boolean(errors.triage?.pulse_frequency)}
                >
                  <Grid container spacing={2} alignItems="flex-start">
                    <Grid item xs={12} sm={6}>
                      <FormLabel
                        component="legend"
                        sx={{ fontWeight: 600, paddingTop: 2 }}
                      >
                        Frekuensi Nadi
                      </FormLabel>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="triage.pulse_frequency"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            disabled={loading}
                            size="small"
                            type="tel"
                            label=""
                            fullWidth
                          />
                        )}
                      />
                      {errors.triage?.pulse_frequency && (
                        <FormHelperText>
                          {errors.triage.pulse_frequency.message}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  error={Boolean(errors.triage?.breathing_frequency)}
                >
                  <Grid container spacing={2} alignItems="flex-start">
                    <Grid item xs={12} sm={6}>
                      <FormLabel
                        component="legend"
                        sx={{ fontWeight: 600, paddingTop: 2 }}
                      >
                        Frekuensi Nafas
                      </FormLabel>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="triage.breathing_frequency"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            disabled={loading}
                            size="small"
                            type="tel"
                            label=""
                            fullWidth
                          />
                        )}
                      />
                      {errors.triage?.breathing_frequency && (
                        <FormHelperText>
                          {errors.triage.breathing_frequency.message}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl
                  fullWidth
                  error={Boolean(errors.triage?.body_temperature)}
                >
                  <Grid container spacing={2} alignItems="flex-start">
                    <Grid item xs={12} sm={6}>
                      <FormLabel
                        component="legend"
                        sx={{ fontWeight: 600, paddingTop: 2 }}
                      >
                        Suhu Tubuh
                      </FormLabel>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="triage.body_temperature"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            disabled={loading}
                            size="small"
                            type="tel"
                            label=""
                            fullWidth
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="start">
                                  °C
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                      {errors.triage?.body_temperature && (
                        <FormHelperText>
                          {errors.triage.body_temperature.message}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  error={Boolean(errors.triage?.consciousness)}
                >
                  <Grid container spacing={2} alignItems="flex-start">
                    <Grid item xs={12} sm={3}>
                      <FormLabel
                        component="legend"
                        sx={{ fontWeight: 600, paddingTop: 2 }}
                      >
                        Kesadaran
                      </FormLabel>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                      <Controller
                        name="triage.consciousness"
                        control={control}
                        render={({ field }) => (
                          <RadioGroup
                            {...field}
                            disabled={loading}
                            onChange={(e) => field.onChange(e.target.value)}
                            sx={{ display: "contents" }}
                          >
                            {consciousnessOptions.map((option, index) => (
                              <FormControlLabel
                                key={index}
                                value={option}
                                control={<Radio />}
                                label={option}
                              />
                            ))}
                          </RadioGroup>
                        )}
                      />
                      {errors.triage?.consciousness && (
                        <FormHelperText>
                          {errors.triage.consciousness.message}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>
              <DividerText label="Gula Darah Sewaktu (GDS)" />
              <Grid item xs={12} sm={6}>
                <Grid container spacing={2} alignItems="flex-start">
                  <Grid item xs={12} sm={6}>
                    <FormLabel
                      component="legend"
                      sx={{ fontWeight: 600, paddingTop: 2 }}
                    >
                      Data GDS (mg/dL)
                    </FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={Boolean(errors.gds?.data)}>
                      <Controller
                        name="gds.data"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            disabled={loading}
                            size="small"
                            type="tel" // Type set as 'tel' for numeric input
                            label="" // Label removed here, as it's set separately by FormLabel
                            fullWidth
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="start">
                                  mg/dL
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                      {errors.gds?.data && (
                        <FormHelperText>
                          {errors.gds.data.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Grid container spacing={2} alignItems="flex-start">
                  <Grid item xs={12} sm={6}>
                    <FormLabel
                      component="legend"
                      sx={{ fontWeight: 600, paddingTop: 2 }}
                    >
                      Tanggal
                    </FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={Boolean(errors.gds?.date)}>
                      <Controller
                        name="gds.date"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            disabled={loading}
                            size="small"
                            type="datetime-local"
                            label="" // Label is empty here as it's provided by FormLabel
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                          />
                        )}
                      />
                      {errors.gds?.date && (
                        <FormHelperText>
                          {errors.gds.date.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Grid container spacing={2} alignItems="flex-start">
                  <Grid item xs={12} sm={3}>
                    <FormLabel
                      component="legend"
                      sx={{ fontWeight: 600, paddingTop: 2 }}
                    >
                      Moment Pengambilan GDS
                    </FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={9}>
                    <FormControl fullWidth error={Boolean(errors.gds?.moment)}>
                      <Controller
                        name="gds.moment"
                        control={control}
                        render={({ field }) => (
                          <RadioGroup
                            {...field}
                            disabled={loading}
                            sx={{ flexDirection: "row" }}
                            onChange={(e) => field.onChange(e.target.value)}
                          >
                            {momentOptions.map((option, index) => (
                              <FormControlLabel
                                key={index}
                                value={option}
                                control={<Radio />}
                                label={option}
                              />
                            ))}
                          </RadioGroup>
                        )}
                      />
                      {errors.gds?.moment && (
                        <FormHelperText>
                          {errors.gds.moment.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Divider />
            <Box sx={{ marginTop: 4 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={3}>
                <ButtonCustom
                  text="Batal"
                  loading={loading}
                  onClick={() => onClickCancel()}
                  useBackToTop
                />
              </Grid>
              <Grid item xs={12} sm={6} />
              <Grid item xs={12} sm={3}>
                <ButtonSubmit loading={loading} />
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default FormGeneralAssestment;
