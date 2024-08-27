import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import SpinnerLoadData from "src/@core/components/spinner-load-data";
import ButtonCustom from "../components/buttons/ButtonCustom";
import {
  addWoundAssestment,
  addWoundAssestmentFile,
  detailWoundAssestment,
} from "src/services/medicalRecords";
import FormWoundAssestment from "../forms/form-medical-records/FormWoundAssestment";
import ButtonSubmit from "../components/buttons/ButtonSubmit";

// Third-party libraries for functionality
import { useForm } from "react-hook-form";
import FillEmptyState from "../components/empty-state/FillEmptyState";

const ContentWoundAssestment = (props) => {
  const { id, data } = props;

  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [dataDetail, setDataDetail] = useState({});
  const [filesList, setFilesList] = useState([]);
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

  const fetchDataDetail = async (nurseId) => {
    const res = await detailWoundAssestment(id, nurseId);
    if (+res?.result?.status === 200) {
      const data = res?.result?.data;
      if (data?.assessment_id === null) setIsEdit(true);
      setIsFillable(data?.is_fillable);
      setDataDetail(data?.assessment_data ?? []);
      setLoadingData(false);
    } else {
      setLoadingData(false);
      toast.error(`Oops! ${res?.result?.message}`);
    }
  };

  const transformData = (values) => {
    const result = [];

    // Temporary storage for grouped data by number suffix
    const groupedData = {};

    // Loop through each key in the data object
    Object.keys(values).forEach((key) => {
      // Regular expression to extract the type and the numeric identifier
      const match = key.match(/([a-zA-Z]+)_([0-9]+)/);
      if (match) {
        // console.log("match", match);
        const isTExtValue = match?.input.includes("text");
        const type = isTExtValue ? "textvalue" : match[1]; // e.g., 'parent', 'icd10', 'subicd10'
        const id = match[2]; // e.g., '1'

        // console.log("isTExtValue", isTExtValue);

        // Initialize sub-object if it doesn't exist
        if (!groupedData[id]) {
          groupedData[id] = {
            parent_id: +id,
            child_id: "",
            sub_child_id: "",
            icd10_id: "",
            sub_icd10_id: "",
            text_value: "",
          };
        }

        console.log("values[key]", values[key]);

        // Map incoming data to the correct fields
        switch (type) {
          case "parent":
            groupedData[id].child_id = +values[key];
            break;
          case "child":
            groupedData[id].sub_child_id = +values[key] > 0 ? +values[key] : "";
            break;
          case "icd":
            groupedData[id].icd10_id = values[key];
            break;
          case "subicd":
            groupedData[id].sub_icd10_id = values[key];
            break;
          case "textvalue":
            groupedData[id].text_value = values[key];
            break;
          default:
            break;
        }
      }
    });

    // Convert the object to an array of values
    result.push(Object.values(groupedData));

    return result[0];
  };

  const convertData = (data) => {
    const groupedByIndex = Object.keys(data).reduce((acc, key) => {
      // Ambil indeks dari awal kunci
      const index = key.split("_")[0];
      // Hapus indeks dari kunci untuk mendapatkan nama asli
      const newKey = key.slice(key.indexOf("_") + 1);

      if (!acc[index]) acc[index] = {}; // Inisialisasi objek jika belum ada
      acc[index][newKey] = data[key]; // Tetapkan nilai ke kunci yang benar

      return acc;
    }, {});

    // Konversi objek yang terkelompok menjadi array
    const resData = Object.values(groupedByIndex);
    const mappingResult = resData.map((item) => {
      return transformData(item);
    });
    return mappingResult;
  };

  const onSubmitFiles = async (assessmentId) => {
    const payload = { assessment_id: assessmentId, files: filesList };
    const res = await addWoundAssestmentFile(payload);
    if (+res?.result?.status === 201) {
      setLoading(false);
      setIsEdit(false);
      fetchDataDetail(data?.nursing_number);
      toast.success("Berhasil Menambahkan Pengkajian Luka");
    } else {
      setLoading(false);
      toast.error(`Opps ! ${res?.error}`);
    }
  };

  const hasErrorFiles = () => {
    const indicesWithIssues = [];
    filesList.forEach((item, index) => {
      const fileCount = item.files ? item.files.length : 0;
      if (fileCount < 2) {
        indicesWithIssues.push(index);
      }
    });
    return indicesWithIssues;
  };

  const onSubmit = async (values) => {
    const hasError = hasErrorFiles();
    if (+hasError?.length > 0) {
      let message = "";
      hasError.forEach((index) => {
        message += `Foto luka ke - ${index + 1} kurang dari 2. \n`;
      });
      toast.error(message);
    } else {
      setLoading(true);
      convertData(values);
      const dataWoundAssestment = convertData(values);
      const payload = {
        treatment_id: id,
        wound_assessment: dataWoundAssestment,
      };
      const res = await addWoundAssestment(payload);
      if (+res?.result?.status === 201) {
        onSubmitFiles(res?.result?.data?.assessment_id);
      } else {
        setLoading(false);
        toast.error(`Opps ! ${res?.error}`);
      }
    }
    // onSubmitFiles();
  };

  const dataForm = {
    control: control,
    setValue: setValue,
  };

  const submitFiles = (e, index) => {
    let tempFiles = [...filesList];
    tempFiles[index] = { files: e };
    setFilesList(tempFiles);
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

  useEffect(() => {
    console.log("dataDetail", dataDetail);
    if (+dataDetail?.length > 0) {
      const defaultData = Array.from({ length: dataDetail.length }, () => ({
        files: null,
      }));
      setFilesList(defaultData);
    }
  }, [dataDetail]);

  return (
    <>
      {loadingData ? (
        <SpinnerLoadData />
      ) : isFillable ? (
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            {+dataDetail.length > 0 &&
              dataDetail.map((item, index) => (
                <FormWoundAssestment
                  data={item}
                  loadingData={loadingData}
                  loadingForm={loading}
                  index={index}
                  isEdit={isEdit}
                  onSubmitForm={(e) => submitForm(e, index)}
                  dataForm={dataForm}
                  onSetDataFiles={(e) => submitFiles(e, index)}
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

export default ContentWoundAssestment;
