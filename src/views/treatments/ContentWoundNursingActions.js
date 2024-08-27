import React, { useState, useEffect, use } from "react";
import toast from "react-hot-toast";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

// Third-party libraries for functionality
import { useForm } from "react-hook-form";

import SpinnerLoadData from "src/@core/components/spinner-load-data";
import ButtonCustom from "../components/buttons/ButtonCustom";
import ButtonSubmit from "../components/buttons/ButtonSubmit";
import {
  addWoundNursingActions,
  detailWoundNursingActions,
} from "src/services/medicalRecords";
import FormWoundNursingActions from "../forms/form-medical-records/FormWoundNursingActions";
import { fakeDataWoundNursingActions } from "src/configs/constans";
import FillEmptyState from "../components/empty-state/FillEmptyState";
import FormWoundNursingActionsAdditional from "../forms/form-medical-records/FormWoundNursingActionsAdditional";

const ContentWoundNursingActions = (props) => {
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

  const mappingDataGrandChild = (values, id) => {
    let result = [];
    const groupedGrandChildData = {};

    Object.keys(values).forEach((key) => {
      const match = key.match(
        /([a-zA-Z]+)_([a-zA-Z]+)_([0-9]+)_([a-zA-Z]+)_([a-zA-Z]+)_([0-9]+)/
      );
      if (match) {
        const type = match[1];
        const subChildId = match[6];
        const grandChildId = match[3];
        const keyName = match["input"];
        const getTextValue = values[keyName] ?? "-";

        if (type === "grandchild" && +subChildId === +id) {
          groupedGrandChildData[grandChildId] = {
            grand_child_id: +grandChildId,
            text_value: getTextValue,
          };
        }
      }
    });

    result.push(Object.values(groupedGrandChildData));

    return result[0] ?? [];
  };

  const mappingDataSubChild = (values, id) => {
    let result = [];
    const groupedSubChildData = {};

    Object.keys(values).forEach((key) => {
      const match = key.match(
        /([a-zA-Z]+)_([a-zA-Z]+)_([0-9]+)_([a-zA-Z]+)_([a-zA-Z]+)_([0-9]+)/
      );
      if (match) {
        const type = match[1];
        const childId = match[6];
        const subChildId = match[3];
        const keyName = match["input"];
        const getTextValue = values[keyName] ?? "-";

        if (type === "subchild" && +childId === +id) {
          groupedSubChildData[subChildId] = {
            sub_child_id: +subChildId,
            text_value: getTextValue,
            grand_child: mappingDataGrandChild(values, subChildId),
          };
        }
      }
    });

    result.push(Object.values(groupedSubChildData));

    return result[0] ?? [];
  };

  const mappingDataChild = (values, id) => {
    if (id === 1 && +values?.parent_id_1?.length > 1) {
      const resChild = values?.parent_id_1.map((item) => ({
        child_id: +item,
        text_value: "-",
        sub_child: [],
      }));
      return resChild;
    } else {
      let result = [];
      const groupedChildData = {};

      Object.keys(values).forEach((key) => {
        const match = key.match(
          /([a-zA-Z]+)_([a-zA-Z]+)_([0-9]+)_([a-zA-Z]+)_([a-zA-Z]+)_([0-9]+)/
        );
        if (match) {
          const type = match[1];
          const childId = match[6];

          if (type === "subchild") {
            groupedChildData[childId] = {
              child_id: +childId,
              text_value: "-",
              sub_child: mappingDataSubChild(values, childId),
            };
          }
        }
      });

      result.push(Object.values(groupedChildData));

      return result[0] ?? [];
    }
  };

  const transformData = (values) => {
    const result = [];
    const groupedData = {};

    Object.keys(values).forEach((key) => {
      const match = key.match(/([a-zA-Z]+)_([a-zA-Z]+)_([0-9]+)/);
      if (match) {
        const type = match[1];
        const id = match[3];
        if (!groupedData[id] && type === "parent") {
          groupedData[id] = {
            parent_id: +id,
            child: mappingDataChild(values, +id),
          };
        }
      }
    });
    result.push(Object.values(groupedData));

    return result[0];
  };

  const convertData = (data) => {
    const groupedByIndex = Object.keys(data).reduce((acc, key) => {
      const index = key.split("_")[0];
      const newKey = key.slice(key.indexOf("_") + 1);

      if (!acc[index]) acc[index] = {};
      acc[index][newKey] = data[key];

      return acc;
    }, {});
    const resData = Object.values(groupedByIndex);

    const mappingResult = resData.map((item) => {
      return transformData(item);
    });
    return mappingResult;
  };

  const fetchDataDetail = async (nurseId) => {
    const res = await detailWoundNursingActions(id, nurseId);
    if (+res?.result?.status === 200) {
      const data = res?.result?.data;
      // const data = fakeDataWoundNursingActions;
      if (data?.nursing_actions_id === null) setIsEdit(true);
      setIsFillable(data?.is_fillable);
      setDataDetail(data?.nursing_actions_data ?? []);
      setLoadingData(false);
    } else {
      // const data = fakeDataWoundNursingActions;
      // setDataDetail(data);
      setLoadingData(false);
      toast.error(`Oops! ${res?.result?.message}`);
    }
  };

  const onSubmit = async (values) => {
    setLoading(true);
    const dataWoundNursingActions = convertData(values);
    const payload = {
      treatment_id: id,
      wound_nursing_actions: dataWoundNursingActions,
    };

    const res = await addWoundNursingActions(payload);
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
                <FormWoundNursingActions
                  data={item}
                  loadingData={loadingData}
                  loadingForm={loading}
                  index={index}
                  isEdit={isEdit}
                  dataForm={dataForm}
                />
              ))}
            <FormWoundNursingActionsAdditional
              data={{}}
              loadingData={loadingData}
              loadingForm={loading}
              // index={index}
              isEdit={isEdit}
              dataForm={dataForm}
            />
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

export default ContentWoundNursingActions;
