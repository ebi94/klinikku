import React, { useState, useEffect, use } from "react";
import toast from "react-hot-toast";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import SpinnerLoadData from "src/@core/components/spinner-load-data";
import ButtonCustom from "../components/buttons/ButtonCustom";
import ButtonSubmit from "../components/buttons/ButtonSubmit";
import { detailInvoice } from "src/services/medicalRecords";
import { fakeDataWoundEducation } from "src/configs/constans";
import DetailInvoice from "./detail/DetailInvoice";
import { Icon } from "@iconify/react";
import FormInvoice from "../forms/form-medical-records/FormInvoice";
import FillEmptyState from "../components/empty-state/FillEmptyState";
import FormDetailInvoice from "../forms/form-medical-records/FormDetailInvoice";

const ContentInvoice = (props) => {
  const { id, data } = props;
  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [dataDetail, setDataDetail] = useState({});
  const [isFillable, setIsFillable] = useState(true);
  // const [isEdit, setIsEdit] = useState(false);

  const fetchDataDetail = async (nurseId) => {
    const res = await detailInvoice(id, nurseId);
    if (+res?.result?.status === 200) {
      const data = res?.result?.data ?? [];
      setDataDetail(data);
      setIsFillable(data?.is_fillable);
      setLoadingData(false);
    } else {
      setLoadingData(false);
      const data = fakeDataWoundEducation;
      setDataDetail(data);
      toast.error(`Oops! ${res?.result?.message}`);
    }
  };

  useEffect(() => {
    const dataEducation = dataDetail?.education;
    if (dataEducation) {
      Object.entries(dataEducation).map(([key, value]) => {
        console.log("default data", key, value);
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
          {!dataDetail?.is_complete_mr ? (
            <>
              <FormDetailInvoice
                data={dataDetail}
                onSubmitData={() => {
                  fetchDataDetail(data?.nursing_number);
                }}
              />
            </>
          ) : (
            <>
              <DetailInvoice data={dataDetail} />
              <Box sx={{ marginTop: 4 }} />
              <Grid container spacing={3}>
                <Grid item xs={12} sm={3}>
                  <ButtonCustom
                    useTargetBlank
                    onClick={() => {}}
                    href={`/print/invoice?treatmentId=${id}&nurseId=${data?.nursing_number}`}
                    text="Print"
                    color="info"
                    icon={
                      <Icon
                        icon="mdi:printer"
                        style={{ marginRight: 8 }}
                        fontSize={20}
                      />
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} />
                <Grid item xs={12} sm={3}>
                  {/* <ButtonCustom
                text="Ubah Data"
                loading={loading}
                onClick={() => setIsEdit(true)}
                useBackToTop
              /> */}
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

export default ContentInvoice;
