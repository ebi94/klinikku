import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
  FormControl,
  FormLabel,
  FormHelperText,
  Typography,
  Button,
} from "@mui/material";
import ButtonCustom from "src/views/components/buttons/ButtonCustom";
import ButtonSubmit from "src/views/components/buttons/ButtonSubmit";
import DropzoneWrapper from "src/@core/styles/libs/react-dropzone";
import { addSupportingData } from "src/services/medicalRecords";
import { listFormSupportingData } from "src/configs/constans";
import toast from "react-hot-toast";
import FileUploaderMultiple from "src/views/files/FileUploaderMultiple";

const FormDataSupport = (props) => {
  const { id, data, onClickCancel } = props;

  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState(listFormSupportingData);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      imaging: "",
      lab_result: "",
      vascular_testing: "",
      culture_result: "",
    },
  });

  const onUpload = (uploadFiles, index) => {
    let tempFiles = [...files];
    tempFiles[index] = { ...files[index], files: uploadFiles };
    setFiles(tempFiles);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        treatment_id: id,
        imaging: files[0]?.files?.[0] ?? null,
        lab_result: files[1]?.files?.[0] ?? null,
        vascular_testing: files[2]?.files?.[0] ?? null,
        culture_result: files[3]?.files?.[0] ?? null,
      };
      const response = await addSupportingData(payload);
      if (response?.result?.status === 201) {
        toast.success("Berhasil Mengubah Data Penunjang");
        onClickCancel();
      } else {
        toast.error("Ooops ! Ada yang salah");
        console.error("Failed", response);
      }
    } catch (error) {
      toast.error("Ooops ! Ada yang salah");
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitEmpty = async (data) => {
    setLoading(true);
    try {
      const payload = {
        treatment_id: id,
        imaging: [],
        lab_result: [],
        vascular_testing: [],
        culture_result: [],
      };
      const response = await addSupportingData(payload);
      if (response?.result?.status === 201) {
        toast.success("Berhasil Mengubah Data Penunjang");
        onClickCancel();
      } else {
        toast.error("Ooops ! Ada yang salah");
        console.error("Failed", response);
      }
    } catch (error) {
      toast.error("Ooops ! Ada yang salah");
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ marginTop: 6 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Data Penunjang
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          {listFormSupportingData.map((item, index) => (
            <Grid key={index} item xs={12} sm={12} sx={{ marginBottom: 2 }}>
              <Grid container spacing={2} alignItems="flex-start">
                <Grid item xs={12} sm={3}>
                  <FormLabel
                    component="legend"
                    sx={{ fontWeight: 600, paddingTop: 2 }}
                  >
                    {item?.label}
                  </FormLabel>
                </Grid>
                <Grid item xs={12} sm={9}>
                  <FormControl fullWidth>
                    <Controller
                      name={item?.name}
                      control={control}
                      render={({ field }) => (
                        <>
                          <DropzoneWrapper>
                            <FileUploaderMultiple
                              {...field}
                              onUpload={(e) => onUpload(e, index)}
                              files={files[index]?.files ?? []}
                              type={"application"}
                            />
                          </DropzoneWrapper>
                        </>
                      )}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          ))}
          <Divider />
          <Box sx={{ marginTop: 4 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <ButtonCustom
                text="Batal"
                loading={loading}
                onClick={() => onClickCancel()}
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
      </CardContent>
    </Card>
  );
};

export default FormDataSupport;
