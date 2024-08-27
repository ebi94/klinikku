import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import SpinnerLoadData from "src/@core/components/spinner-load-data";
import ButtonCustom from "../components/buttons/ButtonCustom";
import ButtonSubmit from "../components/buttons/ButtonSubmit";
import {
  addWoundDiagnose,
  detailWoundDiagnose,
} from "src/services/medicalRecords";
import FormWoundDiagnose from "../forms/form-medical-records/FormWoundDiagnose";

// Third-party libraries for functionality
import { useForm } from "react-hook-form";
import FillEmptyState from "../components/empty-state/FillEmptyState";

const ContentWoundDiagnose = (props) => {
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

  const onSubmit = async (e, index) => {
    setLoading(true);
    const transformedArray = dataDetail.map(() => ({
      child_id: [],
    }));
    let tempData = [...transformedArray];
    tempData[index] = { child_id: e };
    const payload = {
      treatment_id: id,
      wound_diagnose: tempData,
    };
    const res = await addWoundDiagnose(payload);
    if (+res?.result?.status === 201) {
      setLoading(false);
      toast.success("Berahasil menambahkan data");
    } else {
      setLoading(false);
      toast.error(`Opps ! ${res?.error}`);
    }
  };

  const fetchDataDetail = async (nurseId) => {
    const res = await detailWoundDiagnose(id, nurseId);
    if (+res?.result?.status === 200) {
      const data = res?.result?.data;
      if (data?.diagnose_id === null) setIsEdit(true);
      setIsFillable(data?.is_fillable);
      setDataDetail(data?.diagnose_data ?? []);
      setLoadingData(false);
    } else {
      setLoadingData(false);
      toast.error(`Oops! ${res?.result?.message}`);
    }
  };

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
          <form onSubmit={handleSubmit(onSubmit)}>
            {+dataDetail.length > 0 &&
              dataDetail.map((item, index) => (
                <FormWoundDiagnose
                  data={item}
                  loadingData={loadingData}
                  loadingForm={loading}
                  index={index}
                  isEdit={isEdit}
                  onSubmitForm={(e) => submitForm(e, index)}
                  dataForm={dataForm}
                />
              ))}
            <Box sx={{ marginTop: 4 }} />
            {isEdit ? (
              <>
                <Box sx={{ marginTop: 4 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={3}>
                    <ButtonCustom
                      text="Batal"
                      loading={loading}
                      onClick={() => setIsEdit(false)}
                      useBackToTop
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} />
                  <Grid item xs={12} sm={3}>
                    <ButtonSubmit loading={loading} />
                  </Grid>
                </Grid>
              </>
            ) : (
              <>
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
          </form>
        </>
      ) : (
        <FillEmptyState />
      )}
    </>
  );
};

export default ContentWoundDiagnose;
