import React, { useState, useEffect, use } from "react";
import toast from "react-hot-toast";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

// Third-party libraries for functionality
import { useForm } from "react-hook-form";

import SpinnerLoadData from "src/@core/components/spinner-load-data";
import ButtonCustom from "../components/buttons/ButtonCustom";
import ButtonSubmit from "../components/buttons/ButtonSubmit";
import {
  addWoundEducation,
  detailWoundEducation,
} from "src/services/medicalRecords";
import FormWoundEducation from "../forms/form-medical-records/FormWoundEducation";
import DetailWoundEducation from "./detail/DetailWoundEducation";
import { fakeDataWoundEducation } from "src/configs/constans";
import FillEmptyState from "../components/empty-state/FillEmptyState";

const ContentWoundEducation = (props) => {
  const { id, data } = props;
  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [dataDetail, setDataDetail] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [isFillable, setIsFillable] = useState(true);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "all",
  });

  const dataForm = {
    control: control,
    setValue: setValue,
  };

  const fetchDataDetail = async (nurseId) => {
    const res = await detailWoundEducation(id, nurseId);
    if (+res?.result?.status === 200) {
      const data = res?.result?.data;
      if (data?.education_id === null) setIsEdit(true);
      setIsFillable(data?.is_fillable);
      setDataDetail(data);
      setLoadingData(false);
    } else {
      setLoadingData(false);
      const data = fakeDataWoundEducation;
      setDataDetail(data);
      toast.error(`Oops! ${res?.result?.message}`);
    }
  };

  const onSubmit = async (values) => {
    setLoading(true);

    const payload = {
      treatment_id: id,
      etiology_progress: values?.etiology_progress ?? "",
      medication: values?.medication ?? "",
      nutrition: values?.nutrition ?? "",
      activity_lifestyle: values?.activity_lifestyle ?? "",
    };

    console.log(payload);
    const res = await addWoundEducation(payload);
    if (+res?.result?.status === 201) {
      setLoading(false);
      setIsEdit(false);
      fetchDataDetail(data?.nursing_number);
      toast.success("Berhasil menambahkan data");
    } else {
      setLoading(false);
      toast.error(`Opps ! ${res?.error}`);
    }
  };

  const onSubmitEmpty = async () => {
    setLoading(true);

    const payload = {
      treatment_id: id,
      etiology_progress: null,
      medication: null,
      nutrition: null,
      activity_lifestyle: null,
    };

    console.log(payload);
    const res = await addWoundEducation(payload);
    if (+res?.result?.status === 201) {
      setLoading(false);
      setIsEdit(false);
      fetchDataDetail(data?.nursing_number);
      toast.success("Berhasil menambahkan data");
    } else {
      setLoading(false);
      toast.error(`Opps ! ${res?.error}`);
    }
  };

  useEffect(() => {
    const dataEducation = dataDetail?.education;
    if (dataEducation) {
      Object.entries(dataEducation).map(([key, value]) => {
        console.log("default data", key, value);
        setValue(key, value ?? "");
      });
    }
  }, [dataDetail]);

  useEffect(() => {
    if (id) {
      if (data?.nursing_number !== undefined) {
        fetchDataDetail(data?.nursing_number);
      } else {
        setLoadingData(false);
        setLoading(false);
        setIsEdit(false);
        setIsFillable(false);
      }
    }
  }, [id, data?.nursing_number]);

  return (
    <>
      {loadingData ? (
        <SpinnerLoadData />
      ) : isFillable ? (
        <>
          {isEdit ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormWoundEducation
                data={dataDetail}
                loading={loading}
                isEdit={isEdit}
                dataForm={dataForm}
              />
              <Box sx={{ marginTop: 4 }} />
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <ButtonCustom
                    text="Batal"
                    loading={loading}
                    onClick={() => setIsEdit(false)}
                    useBackToTop
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    size="small"
                    fullWidth
                    disabled={loading}
                    color="info"
                    variant="contained"
                    onClick={() => onSubmitEmpty()}
                  >
                    Isi Nanti
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <ButtonSubmit loading={loading} />
                </Grid>
              </Grid>
            </form>
          ) : (
            <>
              <DetailWoundEducation data={dataDetail} />
              <Box sx={{ marginTop: 4 }} />
              <Grid container spacing={3}>
                <Grid item xs={12} sm={9} />
                <Grid item xs={12} sm={3}>
                  <ButtonCustom
                    text="Ubah Data"
                    loading={loading}
                    onClick={() => setIsEdit(true)}
                    useBackToTop
                  />
                </Grid>
              </Grid>
            </>
          )}
        </>
      ) : (
        <FillEmptyState />
      )}
    </>
  );
};

export default ContentWoundEducation;
