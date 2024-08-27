// React and Next.js related imports
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

// Material-UI components
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import { CircularProgress } from "@mui/material";

// Form validation and management tools
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

// Date and time management
import moment from "moment";

// Toast notifications
import toast from "react-hot-toast";

// Custom components and styles
import PageHeader from "src/@core/components/page-header";
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
import FormCustomers from "src/views/forms/form-customers/FormCustomers";
import FormGuardians from "src/views/forms/form-customers/FormGuardians";

// Service calls
import { addCustomer } from "src/services/customers";

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
  // Data Pasien
  email: yup.string().email().required("Kolom ini harus diisi !"),
  name: yup
    .string()
    .min(3, (obj) => showErrors("Nama", obj.value.length, obj.min))
    .required("Kolom ini harus diisi !"),
  complete_address: yup
    .string()
    .min(10, (obj) => showErrors("Alamat", obj.value.length, obj.min))
    .required("Kolom ini harus diisi !"),
  gender: yup.string().required("Jenis Kelamin ini harus diisi !"),
  date_of_birth: yup.string().required("Kolom ini harus diisi !"),
  phone: yup
    .string()
    .min(8, (obj) => showErrors("No Telepon", obj.value.length, obj.min))
    .max(13, (obj) =>
      showErrors("No Telepon", obj.value.length, obj.min, obj.max)
    )
    .required("Kolom ini harus diisi !"),
  nik: yup
    .string()
    .min(16, (obj) => showErrors("NIK", obj.value.length, obj.min))
    .required("Kolom ini harus diisi !"),
  province_id: yup.string().required("Provinsi harus dipilih !"),
  city_district_id: yup.string().required("Kota/Kabupateb harus dipilih !"),
  subdistrict_id: yup.string().required("Kecamatan harus dipilih !"),
  village_subdistrict_id: yup.string().required("Kelurahan harus dipilih !"),
  clinic_id: yup.string().required("Kelurahan harus dipilih !"),
  // Data Wali
  email_wali: yup.string().email().required("Kolom ini harus diisi !"),
  name_wali: yup
    .string()
    .min(3, (obj) => showErrors("Name", obj.value.length, obj.min))
    .required("Kolom ini harus diisi !"),
  province_id_wali: yup.string().required("Provinsi harus dipilih !"),
  city_district_id_wali: yup
    .string()
    .required("Kota/Kabupateb harus dipilih !"),
  subdistrict_id_wali: yup.string().required("Kecamatan harus dipilih !"),
  village_subdistrict_id_wali: yup
    .string()
    .required("Kelurahan harus dipilih !"),
  complete_address_wali: yup
    .string()
    .min(10, (obj) => showErrors("Alamat", obj.value.length, obj.min))
    .required("Kolom ini harus diisi !"),
  gender_wali: yup.string().required("Jenis Kelamin harus diisi !"),
  date_of_birth_wali: yup.string().required("Kolom ini harus diisi !"),
  phone_wali: yup
    .string()
    .min(8, (obj) => showErrors("No Telepon", obj.value.length, obj.min))
    .max(13, (obj) =>
      showErrors("No Telepon", obj.value.length, obj.min, obj.max)
    )
    .required("Kolom ini harus diisi !"),
  nik_wali: yup
    .string()
    .min(16, (obj) => showErrors("NIK", obj.value.length, obj.min))
    .required("Kolom ini harus diisi !"),
  relationship: yup.string().required("Relasi harus diisi !"),
});

const CustomerNew = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const breadCrumbs = [
    { id: 1, path: "/dashboards", name: "Home" },
    { id: 2, path: "/customers", name: "Customers" },
    { id: 3, path: "#", name: "Customer Add" },
  ];

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ mode: "all", resolver: yupResolver(schema) });

  const dataForm = {
    control,
    setValue,
    errors,
  };

  const onSubmit = async (value) => {
    console.log("value submit", value);
    setLoading(true);
    const formattedDate = (date) => {
      return moment(date).format("YYYY-MM-DD");
    };
    const payload = {
      // Data Pasien
      nik: value?.nik,
      name: value?.name,
      phone: value?.phone,
      email: value?.email,
      gender: value?.gender,
      date_of_birth: formattedDate(value?.date_of_birth),
      province_id: value?.province_id,
      city_district_id: value?.city_district_id,
      subdistrict_id: value?.subdistrict_id,
      village_subdistrict_id: value?.village_subdistrict_id,
      complete_address: value?.complete_address,
      clinic_id: value?.clinic_id,
      // Data Wali
      nik_wali: value?.nik_wali,
      name_wali: value?.name_wali,
      phone_wali: value?.phone_wali,
      email_wali: value?.email_wali,
      gender_wali: value?.gender_wali,
      date_of_birth_wali: formattedDate(value?.date_of_birth_wali),
      province_id_wali: value?.province_id_wali,
      city_district_id_wali: value?.city_district_id_wali,
      subdistrict_id_wali: value?.subdistrict_id_wali,
      village_subdistrict_id_wali: value?.village_subdistrict_id_wali,
      complete_address_wali: value?.complete_address_wali,
      relationship: value?.relationship,
    };

    console.log("payload add customer", payload);
    const res = await addCustomer(payload);
    if (+res?.result?.status === 201) {
      setLoading(false);
      toast.success("Berhasil Menambahkan Data Pasien");
      router.push("/customers");
    } else {
      setLoading(false);
      toast.error(`Opps ! ${res?.error}`);
    }
  };

  useEffect(() => {
    console.log("error", errors);
  }, [errors]);

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
          <PageHeader breadCrumbs={breadCrumbs} title="Tambah Customer Baru" />
          <Grid item xs={12} md={12} lg={12}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Card>
                <Divider sx={{ m: "0 !important" }} />
                <CardContent>
                  <FormCustomers loading={loading} dataForm={dataForm} />
                  <Divider sx={{ marginTop: 6, marginBottom: 4 }} />
                  <FormGuardians loading={loading} dataForm={dataForm} />
                </CardContent>
                <Divider sx={{ m: "0 !important" }} />
                <CardActions
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Link href="/customers">
                    <Button
                      calor="warning"
                      size="small"
                      variant="contained"
                      sx={{ mr: 2, width: "150px" }}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </Link>

                  <Button
                    color="success"
                    size="small"
                    variant="contained"
                    sx={{ width: "150px" }}
                    type="submit"
                    disabled={loading}
                  >
                    {!loading ? "Submit" : <CircularProgress size={20} />}
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

export default CustomerNew;
