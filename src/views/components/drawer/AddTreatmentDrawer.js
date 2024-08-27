// ** React Imports
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Drawer from "@mui/material/Drawer";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import Icon from "src/@core/components/icon";
import { useDispatch, useSelector } from "react-redux";
import { createTreatment } from "src/services/treatment";
import ButtonSubmit from "../buttons/ButtonSubmit";
import ButtonCustom from "../buttons/ButtonCustom";
import { listClinic } from "src/services/clinics";

const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(3, 4),
  justifyContent: "space-between",
  backgroundColor: theme.palette.background.default,
}));

const schemaWound = yup.object().shape({
  // treatment: yup.string().required("Silahkan Pilih Salah Satu !"),
  total_wound: yup
    .number()
    .typeError("Harus diisi !")
    .required("Harus diisi !"),
});

const schemaEye = yup.object().shape({
  treatment: yup.string().required("Silahkan Pilih Salah Satu !"),
  total_eye: yup.string().required("Harus diisi !"),
});

const AddTreatmentDrawer = (props) => {
  // ** Props
  const { open, toggle, patientId } = props;

  const [loading, setLoading] = useState(false);
  const [treatment, setTreatment] = useState("Wound");
  const [totalEye, setTotalEye] = useState();
  const [dataListClinic, setDataListClinic] = useState([]);

  const router = useRouter();

  let userData;
  if (typeof window !== "undefined") {
    userData = JSON.parse(localStorage.getItem("userData"));
  }

  const defaultValues = {
    treatment: "Wound",
    total_wound: "",
  };

  const {
    reset,
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(treatment === "Wound" ? schemaWound : schemaEye),
  });

  console.log("errors", errors);

  const onSubmit = async (data) => {
    setLoading(true);

    const payload = {
      clinic_id: userData?.data?.clinic?.id,
      patient_id: patientId,
      ...data,
    };

    const res = await createTreatment(payload);
    if (+res?.result?.status === 201) {
      const data = res?.result?.data;
      setLoading(false);
      toast.success("Berhasil Membuat Perawatan Baru !");
      toggle();
      router.push(
        `/treatment/add/${data?.treatment_id}/?patientId=${patientId}&tab=pengkajian-umum`
        // `/order-unit/detail/`
      );
    } else {
      setLoading(false);
      toast.error(`Opps ! ${res?.error}`);
    }
  };

  const fetchListClinic = async () => {
    const res = await listClinic();
    console.log("res", res);
    if (+res?.result?.status === 200) {
      const data = res?.result?.data ?? [];
      setDataListClinic(data);
    }
  };

  const handleClose = () => {
    toggle();
    reset();
  };

  useEffect(() => {
    fetchListClinic();
  }, []);

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ "& .MuiDrawer-paper": { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant="h6">Tambah Perawatan Baru</Typography>
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
              name="treatment"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <>
                  <InputLabel
                    id="treatment"
                    error={Boolean(errors.treatment)}
                    size="small"
                  >
                    Pilih Perawatan
                  </InputLabel>
                  <Select
                    fullWidth
                    size="small"
                    disabled
                    value={treatment}
                    id="select-treatment"
                    label="Pilih Perawatan"
                    labelId="treatment-select"
                    onChange={(e) => {
                      setTreatment(e.target.value);
                      setValue("treatment", e.target.value);
                    }}
                    error={Boolean(errors.treatment)}
                    inputProps={{ placeholder: "Silahkan Pilih Salah Satu" }}
                  >
                    <MenuItem value="Wound">Luka</MenuItem>
                    {/* <MenuItem value="Eye">mata</MenuItem> */}
                  </Select>
                </>
              )}
            />
            {errors.treatment && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.treatment.message}
              </FormHelperText>
            )}
          </FormControl>
          {userData?.data?.clinic?.id ? (
            <></>
          ) : (
            <>
              <FormControl fullWidth sx={{ mb: 6 }}>
                <Controller
                  name="clinic_id"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <>
                      <InputLabel
                        id="clinic_id-select"
                        error={Boolean(errors.clinic_id)}
                        size="small"
                      >
                        Pilih Klinik/Unit
                      </InputLabel>
                      <Select
                        fullWidth
                        size="small"
                        disabled={loading}
                        value={value}
                        id="select-treatment"
                        label="Pilih Perawatan"
                        labelId="treatment-select"
                        onChange={(e) => {
                          setValue("clinic_id", e.target.value);
                        }}
                        error={Boolean(errors.clinic_id)}
                        inputProps={{
                          placeholder: "Silahkan Pilih Salah Satu",
                        }}
                      >
                        {dataListClinic.map((item) => (
                          <MenuItem value={item?.clinic_id}>
                            {item?.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </>
                  )}
                />
                {errors.clinic_id && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.clinic_id.message}
                  </FormHelperText>
                )}
              </FormControl>
            </>
          )}
          {treatment === "Wound" && (
            <FormControl fullWidth sx={{ mb: 6 }}>
              <FormLabel component="legend" error={Boolean(errors.total_wound)}>
                Jumlah Luka
              </FormLabel>
              <Controller
                name="total_wound"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    disabled={loading}
                    sx={{ flexDirection: "row" }} // Menyusun radio buttons dalam satu baris
                    onChange={(e) => field.onChange(e.target.value)}
                    error={Boolean(errors.total_wound)}
                  >
                    <FormControlLabel
                      value={1}
                      control={<Radio />}
                      label={1}
                      key={1}
                    />
                    <FormControlLabel
                      value={2}
                      control={<Radio />}
                      label={2}
                      key={2}
                    />
                  </RadioGroup>
                )}
              />
              {/* <Controller
                name="total_wound"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    size="small"
                    disabled={loading}
                    label="Jumlah Luka"
                    onChange={onChange}
                    placeholder="1"
                    error={Boolean(errors.total_wound)}
                  />
                )}
              /> */}
              {errors.total_wound && (
                <FormHelperText sx={{ color: "error.main" }}>
                  {errors.total_wound.message}
                </FormHelperText>
              )}
            </FormControl>
          )}
          {treatment === "eyes" && (
            <FormControl fullWidth sx={{ mb: 6 }}>
              <InputLabel id="role-select">Pilih Posisi Mata</InputLabel>
              <Select
                fullWidth
                size="small"
                value={totalEye}
                disabled={loading}
                id="select-total_eye"
                label="Pilih Posisi Mata"
                labelId="total_eye-select"
                onChange={(e) => {
                  setTotalEye(e.target.value);
                  setValue("total_eye", e.target.value);
                }}
                inputProps={{ placeholder: "Pilih Posisi Mata" }}
              >
                <MenuItem value="right">Kanan</MenuItem>
                <MenuItem value="left">Kiri</MenuItem>
                <MenuItem value="both">Kanan & Kiri</MenuItem>
              </Select>
              {errors.total_eye && (
                <FormHelperText sx={{ color: "error.main" }}>
                  {errors.total_eye.message}
                </FormHelperText>
              )}
            </FormControl>
          )}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <ButtonCustom
              text="Batal"
              loading={loading}
              onClick={handleClose}
            />
            <Box sx={{ width: "50%" }} />
            <ButtonSubmit loading={loading} />
          </Box>
        </form>
      </Box>
    </Drawer>
  );
};

export default AddTreatmentDrawer;
