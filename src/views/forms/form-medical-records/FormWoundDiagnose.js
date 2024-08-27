// React and Next.js imports
import React, { useEffect, useState } from "react";

// Third-party libraries for functionality
import { Controller } from "react-hook-form";

// Material-UI components
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import FormGroup from "@mui/material/FormGroup";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

// Services and local components
import DividerText from "src/views/components/divider/DividerText";
import { CircularProgress } from "@mui/material";
import DetailWoundDiagnose from "src/views/treatments/detail/DetailWoundDiagnose";
import { mappingDataOptions, toSnakeCase } from "src/utils/helpers";

const RenderCheckbox = (props) => {
  const { index, data, control, loading, disabled } = props;
  const [value, setValue] = useState([]);
  const mappingDataCheckBox = (dataArray) => {
    return mappingDataOptions(dataArray, "child_id");
  };
  return (
    <>
      <DividerText label={data?.name} />
      {data?.child.map((item, index) => (
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth key={item?.child_name}>
            <Grid container spacing={2} alignItems="flex-start">
              <Grid item xs={12} sm={12}>
                <Grid container spacing={2} alignItems="flex-start">
                  <Grid item xs={12} sm={3}>
                    <FormLabel
                      component="legend"
                      sx={{ fontWeight: 600, paddingTop: 2 }}
                    >
                      {item?.child_name}
                    </FormLabel>
                  </Grid>
                  <Grid item xs={12} sm={9}>
                    <Controller
                      name={`${index}_${toSnakeCase(
                        data?.name + item?.child_name
                      )}`}
                      control={control}
                      render={({ field: { onChange, ref } }) => (
                        <>
                          <FormGroup sx={{ display: "contents" }}>
                            {mappingDataCheckBox(item?.value).map((option) => (
                              <>
                                <FormControlLabel
                                  key={option?.id}
                                  control={
                                    <Checkbox
                                      // checked={option?.selected}
                                      disabled={loading || disabled}
                                      onChange={(event) => {
                                        const newValue = event.target.checked
                                          ? [...value, option?.child_id]
                                          : value.filter(
                                              (item) =>
                                                item !== option?.child_id
                                            );
                                        setValue(newValue);
                                        onChange(newValue); // Correctly using onChange from field to update the array
                                      }}
                                      value={option?.child_id}
                                      name={option?.name}
                                    />
                                  }
                                  label={`${option?.name} (${option?.sdki})`}
                                />
                              </>
                            ))}
                          </FormGroup>
                        </>
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </FormControl>
        </Grid>
      ))}
    </>
  );
};

const FormWoundDiagnose = (props) => {
  const { data, index, loadingData, loadingForm, isEdit, dataForm } = props;
  const { control, setValue } = dataForm;

  const onSubmit = (values) => {
    setLoading(true);
    const allValues = Object.values(values);
    const combinedValues = allValues.flat();
    const filteredValues = combinedValues.filter((item) => item !== undefined);
    onSubmitForm(filteredValues);
  };

  return (
    <>
      <Card sx={{ marginTop: 6 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Diagnosa Luka ke - {+index + 1}
          </Typography>
          {loadingForm ? (
            <Box sx={{ width: "100%", textAlign: "center" }}>
              <CircularProgress size={40} />
              <Typography>Mohon Tunggu . . .</Typography>
            </Box>
          ) : isEdit ? (
            <>
              <Grid container spacing={3}>
                {+data?.length > 0 &&
                  data.map((item) => (
                    <RenderCheckbox
                      index={index}
                      data={item}
                      control={control}
                      loading={loadingData}
                      setValue={setValue}
                      disabled={!isEdit}
                    />
                  ))}
              </Grid>
              <Box sx={{ marginTop: 4 }} />
              <Divider />
            </>
          ) : (
            <>
              <DetailWoundDiagnose data={data} />
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default FormWoundDiagnose;
