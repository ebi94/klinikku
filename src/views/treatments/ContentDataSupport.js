import React, { useState, useEffect } from "react";
import FormDataSupport from "../forms/form-medical-records/FormDataSupport";
import DetailSupportingData from "./detail/DetailSupportingData";
import { detailSupportingData } from "src/services/medicalRecords";
import SpinnerLoadData from "src/@core/components/spinner-load-data";
import FillEmptyState from "../components/empty-state/FillEmptyState";

const ContentDataSupport = (props) => {
  const { id, data } = props;

  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [dataDetail, setDataDetail] = useState({});
  const [isFillable, setIsFillable] = useState(true);

  const fetchDataDetail = async (nurseId) => {
    const res = await detailSupportingData(id, nurseId);
    if (+res?.result?.status === 200) {
      const data = res?.result?.data;
      if (data?.supporting_data_id === null) setIsEdit(true);
      setIsFillable(data?.is_fillable);
      setDataDetail(data?.supporting_data);
      setLoading(false);
    } else {
      setLoading(false);
      toast.error(`Oops! ${res?.result?.message}`);
    }
  };

  useEffect(() => {
    if (id) {
      if (data?.nursing_number !== undefined) {
        fetchDataDetail(data?.nursing_number);
      } else {
        setLoading(false);
        setIsEdit(false);
        setIsFillable(false);
      }
    }
  }, [id, data?.nursing_number]);

  useEffect(() => {
    console.log("dataDetail", dataDetail);
  }, [dataDetail]);

  return loading ? (
    <SpinnerLoadData />
  ) : isFillable ? (
    isEdit ? (
      <FormDataSupport
        id={id}
        data={dataDetail}
        onClickCancel={() => setIsEdit(false)}
      />
    ) : (
      <DetailSupportingData
        id={id}
        data={data}
        onClickEdit={() => setIsEdit(true)}
      />
    )
  ) : (
    <>
      <FillEmptyState />
    </>
  );
};

export default ContentDataSupport;
