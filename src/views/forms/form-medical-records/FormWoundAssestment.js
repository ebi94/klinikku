// React and Next.js imports
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

// Third-party libraries for functionality
import { Controller } from "react-hook-form";

// Material-UI components
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControlLabel from "@mui/material/FormControlLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";

// Services and local components
import DividerText from "src/views/components/divider/DividerText";
import { CircularProgress, TextField } from "@mui/material";
import DetailWoundAssestment from "src/views/treatments/detail/DetailWoundAssestment";
import FileUploaderSimple from "src/views/files/FileUploaderSimple";
import DropzoneWrapperSimple from "src/@core/styles/libs/react-dropzone-simple";

import Icon from "src/@core/components/icon";

const Label = (props) => {
  const { value, score } = props;
  return (
    <Box sx={{ display: "flex" }}>
      <Typography sx={{ marginRight: 2 }}>{value}</Typography>
      {score !== null && (
        <Typography variant="caption" color="error">
          skor : {score}
        </Typography>
      )}
    </Box>
  );
};

const RenderSelectOption = ({ index, data, control, loading, setValue }) => {
  const [additionalOptions, setAdditionalOptions] = useState([]);
  const [icd10Options, setIcd10Options] = useState([]);
  const [subIcd10Options, setSubIcd10Options] = useState([]);
  const [selectedIcd10, setSelectedIcd10] = useState("");
  const [useAnotherTextField, setUseAnotherTextField] = useState(false);

  const handleMainSelectChange = (event) => {
    const selectedValue = event.target.value;
    const selectedChild = data.child.find((c) => c.child_id === selectedValue);
    setValue(`${index}_child_${data?.parent_id}`, "");
    setValue(`${index}_icd_${data?.parent_id}`, "");
    setValue(`${index}_subicd_${data?.parent_id}`, "");

    setSubIcd10Options([]);
    if (selectedChild && selectedChild.sub_child.length > 0) {
      console.log("selectedChild.sub_child", selectedChild.sub_child);
      setAdditionalOptions(selectedChild.sub_child);
    } else {
      setAdditionalOptions([]);
    }

    if (selectedChild && selectedChild.icd10.length > 0) {
      setIcd10Options(selectedChild.icd10);
    } else {
      setIcd10Options([]);
    }

    if (selectedChild?.child_name === "Lainnya") {
      setUseAnotherTextField(true);
    } else {
      setUseAnotherTextField(false);
    }
  };

  const handleIcd10SelectChange = (event) => {
    const selectedValue = event.target.value;
    const selectedChild = icd10Options.find(
      (c) => c.icd10_id === selectedValue
    );
    setSubIcd10Options([]);
    setSelectedIcd10(selectedChild);
    if (selectedChild && selectedChild.sub_icd10.length > 0) {
      setSubIcd10Options(selectedChild.sub_icd10);
    } else {
      setSubIcd10Options([]);
    }
  };

  const checkDefaultValue = (data) => {
    const selectedNames = data
      .filter((item) => item.selected)
      .map((item) => item.child_id);
    return selectedNames[0] ?? null;
  };

  return (
    <>
      <DividerText label={data?.parent_name} />
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel size="small">{data.parent_name}</InputLabel>
          <Controller
            name={`${index}_parent_${data?.parent_id}`}
            control={control}
            render={({ field: { value, onChange } }) => (
              <>
                <Select
                  disabled={loading}
                  size="small"
                  defaultValue={checkDefaultValue(data?.child)}
                  value={value}
                  label={data.parent_name}
                  onChange={(e) => {
                    onChange(e.target.value);
                    handleMainSelectChange(e);
                  }}
                >
                  {data.child.map((item) => (
                    <MenuItem key={item.child_id} value={+item.child_id}>
                      <Label value={item.child_name} score={item.score} />
                    </MenuItem>
                  ))}
                </Select>
              </>
            )}
          />
        </FormControl>
      </Grid>

      {additionalOptions.length > 0 && (
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel size="small">Kategori {data?.parent_name}</InputLabel>
            <Controller
              name={`${index}_child_${data?.parent_id}`}
              control={control}
              render={({ field: { value, onChange } }) => (
                <>
                  <Select
                    label={`Kategopri ${data?.parent_name}`}
                    size="small"
                    disabled={loading}
                    defaultValue={checkDefaultValue(additionalOptions)}
                    value={value}
                    onChange={(e) => {
                      onChange(e.target.value);
                    }}
                  >
                    {additionalOptions.map((option) => (
                      <MenuItem
                        key={option.child_id}
                        value={+option.sub_child_id}
                      >
                        <Label
                          value={option.sub_child_name}
                          score={option.score}
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </>
              )}
            />
          </FormControl>
        </Grid>
      )}
      {icd10Options.length > 0 && (
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel size="small">Kategori</InputLabel>
            <Controller
              name={`${index}_icd_${data?.parent_id}`}
              control={control}
              render={({ field: { value, onChange } }) => (
                <Select
                  label="Kategori"
                  size="small"
                  disabled={loading}
                  // defaultValue={checkDefaultValue(icd10Options)}
                  value={value}
                  onChange={(e) => {
                    onChange(e.target.value);
                    handleIcd10SelectChange(e);
                  }}
                >
                  {icd10Options.map((option) => (
                    <MenuItem key={option.icd10_id} value={+option.icd10_id}>
                      {option.category} ({option.icd10_value})
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Grid>
      )}
      {subIcd10Options.length > 0 && (
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel size="small">Sub Kategori</InputLabel>
            <Controller
              name={`${index}_subicd_${data?.parent_id}`}
              control={control}
              render={({ field: { value, onChange } }) => (
                <Select
                  label="Sub Categories"
                  size="small"
                  // defaultValue={checkDefaultValue(subIcd10Options)}
                  disabled={loading}
                  onChange={(e) => {
                    onChange(e.target.value);
                  }}
                >
                  {subIcd10Options.map((option) => (
                    <MenuItem
                      key={option.sub_icd10_id}
                      value={+option.sub_icd10_id}
                    >
                      {option.category} ({selectedIcd10?.icd10_value}
                      {option.icd10_plus_value})
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Grid>
      )}
      {useAnotherTextField && (
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <Controller
              name={`${index}_textvalue_${data?.parent_id}`}
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  label="Keterangan"
                  size="small"
                  fullWidth
                  disabled={loading}
                  sx={{ flexDirection: "row" }} // Menyusun radio buttons dalam satu baris
                  onChange={(e) => onChange(e.target.value)}
                />
              )}
            />
          </FormControl>
        </Grid>
      )}
    </>
  );
};

const RenderRadioButton = ({ index, data, control, loading, disabled }) => {
  const checkDefaultValue = (data) => {
    const selectedNames = data
      .filter((item) => item.selected)
      .map((item) => item.child_name);
    return selectedNames[0] ?? null;
  };
  return (
    <>
      <DividerText label={data?.parent_name} />
      <Grid item xs={12}>
        <FormControl fullWidth>
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs={12} sm={12}>
              <Controller
                name={`${index}_parent_${data?.parent_id}`}
                control={control}
                disabled={loading}
                render={({ field: { value, onChange } }) => (
                  <RadioGroup
                    size="small"
                    disabled={loading}
                    value={value}
                    sx={{ flexDirection: "row" }} // Menyusun radio buttons dalam satu baris
                    onChange={(e) => onChange(e.target.value)}
                  >
                    {data?.child.map((itemChild) => (
                      <FormControlLabel
                        value={+itemChild?.child_id}
                        control={<Radio />}
                        disabled={loading}
                        label={
                          <Label
                            value={itemChild?.child_name}
                            score={itemChild?.score}
                          />
                        }
                        key={itemChild?.child_name}
                      />
                    ))}
                  </RadioGroup>
                )}
              />
            </Grid>
          </Grid>
        </FormControl>
      </Grid>
    </>
  );
};

const RenderTextField = ({
  index,
  data,
  control,
  loading,
  disabled,
  setValue,
}) => {
  setValue(`${index}_parent_${data?.parent_id}`, data?.child?.[0]?.child_id);
  return (
    <>
      <DividerText label={data?.parent_name} />
      <Grid item xs={12}>
        <FormControl fullWidth>
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs={12} sm={4}>
              <Controller
                name={`${index}_parent_${data?.parent_id}_text`}
                control={control}
                disabled={loading}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    size="small"
                    fullWidth
                    disabled={loading}
                    label={data?.child?.[0]?.child_name}
                    value={value}
                    sx={{ flexDirection: "row" }} // Menyusun radio buttons dalam satu baris
                    onChange={(e) => onChange(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">cm²</InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </FormControl>
      </Grid>
      <Grid item xs={12} sx={{ display: "none" }}>
        <FormControl fullWidth>
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs={12} sm={4}>
              <Controller
                name={`${index}_parent_${data?.parent_id}`}
                control={control}
                disabled={loading}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    size="small"
                    fullWidth
                    disabled={loading}
                    value={data?.child?.[0]?.child_id}
                    sx={{ flexDirection: "row" }} // Menyusun radio buttons dalam satu baris
                    onChange={(e) => onChange(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">cm²</InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </FormControl>
      </Grid>
    </>
  );
};

const FormWoundAssestment = (props) => {
  const {
    data,
    index,
    loadingData,
    loadingForm,
    isEdit,
    dataForm,
    onSetDataFiles,
  } = props;
  const { control, setValue } = dataForm;

  const countFile = [
    { file: null },
    { file: null },
    { file: null },
    { file: null },
    { file: null },
  ];

  const [filesList, setFilesList] = useState(countFile);

  const handleChangeFiles = (file, index) => {
    let tempFiles = [...filesList];
    tempFiles[index] = { file };
    setFilesList(tempFiles);
    console.log(tempFiles);
  };

  const handleRemoveFiles = (index) => {
    let tempFiles = [...filesList];
    tempFiles[index] = { file: null };
    setFilesList(tempFiles);
  };

  useEffect(() => {
    const tempFiles = filesList.filter((item) => item?.file !== null);
    onSetDataFiles(tempFiles);
  }, [filesList]);

  return (
    <>
      <Card sx={{ marginTop: 6 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Pengkajian Luka ke - {+index + 1}
          </Typography>
          {loadingData ? (
            <Box sx={{ width: "100%", textAlign: "center" }}>
              <CircularProgress size={40} />
              <Typography>Mohon Tunggu . . .</Typography>
            </Box>
          ) : isEdit ? (
            <>
              <Grid container spacing={3}>
                {+data?.length > 0 &&
                  data.map((item) => (
                    <React.Fragment key={item.id}>
                      {item?.form_type === "radio-button" ? (
                        <RenderRadioButton
                          index={index}
                          data={item}
                          control={control}
                          loading={loadingForm}
                          disabled={!isEdit}
                        />
                      ) : item?.form_type === "text-input" ? (
                        <RenderTextField
                          index={index}
                          data={item}
                          control={control}
                          loading={loadingForm}
                          disabled={!isEdit}
                          setValue={setValue}
                        />
                      ) : item?.form_type === "select-dropdown" ? (
                        <RenderSelectOption
                          index={index}
                          data={item}
                          control={control}
                          loading={loadingForm}
                          disabled={!isEdit}
                          setValue={setValue}
                        />
                      ) : null}
                    </React.Fragment>
                  ))}
                <DividerText label="Foto Luka (Min 2 Foto)" />
                <Grid item xs={12} sm={12}>
                  <Grid container spacing={3}>
                    {filesList.map((item, index) => (
                      <Grid item xs={6} sx={{ flex: { md: 1 } }}>
                        <DropzoneWrapperSimple>
                          <FileUploaderSimple
                            onSetFile={(e) => handleChangeFiles(e, index)}
                            file={item?.file ?? []}
                            type={"application"}
                          />
                        </DropzoneWrapperSimple>
                        {+item?.file?.length > 0 && (
                          <Box
                            sx={{
                              width: "100%",
                              marginTop: 2,
                              textAlign: "center",
                            }}
                          >
                            <Icon
                              icon="mdi:close-circle"
                              fontSize={35}
                              onClick={() => handleRemoveFiles(index)}
                              style={{
                                color: "red",
                                cursor: "pointer",
                              }}
                            />
                          </Box>
                        )}
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
              <Box sx={{ marginTop: 4 }} />
              <Divider />
            </>
          ) : (
            <>
              <DetailWoundAssestment data={data} />
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default FormWoundAssestment;
