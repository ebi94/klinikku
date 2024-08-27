import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { detailGeneralAssestment } from "src/services/medicalRecords";
import FormGeneralAssestment from "../forms/form-medical-records/FormGeneralAssestment";
import DetailGeneralAssestment from "./detail/DetailGeneralAssestment";
import SpinnerLoadData from "src/@core/components/spinner-load-data";
import { useRouter } from "next/router";

const ContentGeneralAssestment = (props) => {
  const { id, data, useEdit = false, onSubmitData = () => {} } = props;

  const router = useRouter();
  console.log("useEdit", useEdit);
  const [isEdit, setIsEdit] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [dataDetail, setDataDetail] = useState({});

  const fetchDataDetail = async (nurseId) => {
    const res = await detailGeneralAssestment(id, nurseId);
    if (+res?.result?.status === 200) {
      const data = res?.result?.data;
      if (data?.general_id === null) setIsEdit(true);
      setDataDetail(data);
      setLoadingData(false);
    } else {
      setLoadingData(false);
      toast.error(`Oops! ${res?.result?.message}`);
    }
    console.log("res", res);
  };

  useEffect(() => {
    if (useEdit) {
      setIsEdit(true);
      setLoadingData(false);
    }
  }, [useEdit]);

  useEffect(() => {
    if (id && data?.nursing_number) {
      fetchDataDetail(data?.nursing_number);
    }
  }, [id, data?.nursing_number]);

  return (
    <>
      {loadingData ? (
        <SpinnerLoadData />
      ) : (
        <>
          {isEdit ? (
            <FormGeneralAssestment
              data={dataDetail}
              onClickCancel={() => setIsEdit(false)}
              onSubmitData={() => router.reload()}
            />
          ) : (
            <>
              <DetailGeneralAssestment
                loading={loadingData}
                data={dataDetail}
                onClickEdit={() => setIsEdit(true)}
              />
            </>
          )}
        </>
      )}
    </>
  );
};

export default ContentGeneralAssestment;
