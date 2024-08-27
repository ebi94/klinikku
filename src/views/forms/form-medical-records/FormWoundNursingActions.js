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
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// Services and local components
import DividerText from "src/views/components/divider/DividerText";
import { CircularProgress } from "@mui/material";
import { mappingDataOptions } from "src/utils/helpers";
import DetailWoundNursingActions from "src/views/treatments/detail/DetailWoundNursingActions";

const RenderGrandChildCheckbox = (props) => {
  const { id, data, control, loading, disabled, index } = props;
  const [value, setValue] = useState([]);
  if (+data?.length > 0) {
    return (
      <>
        <Grid item xs={12} sm={12} sx={{ marginLeft: 12 }}>
          <FormControl fullWidth key={data?.grand_child_name}>
            <Grid container spacing={2} alignItems="flex-start">
              <Grid item xs={12} sm={12}>
                <Grid container spacing={2} alignItems="flex-start">
                  <Grid item xs={12} sm={12}>
                    <FormGroup sx={{ display: "contents" }}>
                      {data.map((option) => (
                        <Box sx={{ display: "flex", marginTop: 2 }}>
                          <FormLabel
                            sx={{ width: "30%" }}
                            key={option?.grand_child_name}
                            label={option?.grand_child_name}
                          >
                            {option?.grand_child_name}
                          </FormLabel>
                          <Controller
                            name={`${index}_grandchild_id_${option?.grand_child_id}_subchild_id_${id}`}
                            control={control}
                            render={({ field: { onChange, ref } }) => (
                              <>
                                <TextField
                                  name={`text_grandchild_id_${option?.grand_child_id}`}
                                  sx={{
                                    display: option?.is_with_input
                                      ? "block"
                                      : "none",
                                  }}
                                  size="small"
                                  label="Keterangan"
                                  placeholder="Keterangan"
                                  onChange={(e) => onChange(e.target.value)}
                                  fullWidth
                                  multiline
                                  rows={2}
                                />
                              </>
                            )}
                          />
                        </Box>
                      ))}
                    </FormGroup>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </FormControl>
          <Divider sx={{ marginTop: 4 }} />
        </Grid>
        {/* ))} */}
      </>
    );
  } else {
    return null;
  }
};

const RenderChildCheckbox = (props) => {
  const { id, data, control, loading, disabled, index } = props;
  const [value, setValue] = useState([]);
  if (+data?.length > 0) {
    return (
      <>
        <Grid item xs={12} sm={12} sx={{ marginLeft: 12 }}>
          <FormControl fullWidth key={data?.sub_child_name}>
            <Grid container spacing={2} alignItems="flex-start">
              <Grid item xs={12} sm={12}>
                <Grid container spacing={2} alignItems="flex-start">
                  <Grid item xs={12} sm={12}>
                    <FormGroup sx={{ display: "contents" }}>
                      {data.map((option) => (
                        <>
                          {option?.is_with_input ? (
                            <Box sx={{ display: "flex", marginTop: 2 }}>
                              <FormLabel
                                component="legend"
                                sx={{ width: "30%" }}
                              >
                                {option?.sub_child_name}
                              </FormLabel>
                              <Controller
                                name={`${index}_subchild_id_${option?.sub_child_id}_child_id_${id}`}
                                control={control}
                                render={({ field: { onChange, ref } }) => (
                                  <>
                                    <TextField
                                      size="small"
                                      placeholder="Keterangan"
                                      label="Keterangan"
                                      onChange={(e) => onChange(e.target.value)}
                                      fullWidth
                                      multiline
                                      rows={2}
                                    />
                                  </>
                                )}
                              />
                            </Box>
                          ) : (
                            <Box sx={{ display: "flex", marginTop: 2 }}>
                              <FormLabel
                                sx={{ width: "30%" }}
                                key={option?.sub_child_name}
                                label={option?.sub_child_name}
                              >
                                {option?.sub_child_name}
                              </FormLabel>
                              <Controller
                                name={`${index}_subchild_id_${option?.sub_child_id}_child_id_${id}`}
                                control={control}
                                render={({ field: { onChange, ref } }) => (
                                  <>
                                    <TextField
                                      sx={{ display: "none" }}
                                      size="small"
                                      placeholder="Keterangan"
                                      label="Keterangan"
                                      onChange={(e) => onChange(e.target.value)}
                                      fullWidth
                                      multiline
                                      rows={2}
                                    />
                                  </>
                                )}
                              />
                              {+option?.grand_child?.length > 0 && (
                                <RenderGrandChildCheckbox
                                  id={option?.sub_child_id}
                                  index={index}
                                  data={option?.grand_child}
                                  control={control}
                                  loading={loading}
                                  disabled={disabled}
                                />
                              )}
                            </Box>
                          )}
                        </>
                      ))}
                    </FormGroup>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </FormControl>
          <Divider sx={{ marginTop: 4 }} />
        </Grid>
        {/* ))} */}
      </>
    );
  } else {
    return null;
  }
};

const RenderCheckbox = (props) => {
  const { data, control, loading, disabled, index } = props;
  const [value, setValue] = useState([]);
  const mappingDataCheckBox = (dataArray) => {
    return mappingDataOptions(dataArray, "child_id");
  };

  const hasSubChild = +data?.child?.[0]?.sub_child.length > 0;
  // if (data)
  return (
    <>
      <DividerText label={`${data?.parent_name}`} />
      {/* {data?.child.map((item, index) => ( */}
      <Grid item xs={12} sm={12}>
        <FormControl fullWidth key={data?.parent_name}>
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs={12} sm={12}>
              <Grid container spacing={2} alignItems="flex-start">
                <Grid item xs={12} sm={12}>
                  <Controller
                    name={`${index}_parent_id_${data?.parent_id}`}
                    control={control}
                    render={({ field: { onChange, ref } }) => (
                      <>
                        <FormGroup
                          sx={{ display: !hasSubChild ? "contents" : "flex" }}
                          // sx={{ display: "contents" }}
                        >
                          {data?.child.map((option) => (
                            <>
                              {option?.is_with_input ? (
                                <Box sx={{ display: "flex", marginTop: 4 }}>
                                  <FormLabel
                                    component="legend"
                                    sx={{ width: "30%" }}
                                  >
                                    {option?.child_name}
                                  </FormLabel>
                                  <Controller
                                    name={`${index}_text_child_id_${option?.child_id}`}
                                    control={control}
                                    render={({ field: { onChange, ref } }) => (
                                      <>
                                        <TextField
                                          name={`${index}_text_child_id_${option?.child_id}`}
                                          size="small"
                                          placeholder="Keterangan"
                                          label="Keterangan"
                                          onChange={(e) =>
                                            onChange(e.target.value)
                                          }
                                          fullWidth
                                          multiline
                                          rows={2}
                                        />
                                      </>
                                    )}
                                  />
                                </Box>
                              ) : (
                                <>
                                  {+option?.sub_child?.length > 0 ? (
                                    <>
                                      <FormLabel
                                        component="legend"
                                        sx={{ width: "30%" }}
                                      >
                                        {option?.child_name}
                                      </FormLabel>
                                      <RenderChildCheckbox
                                        id={option?.child_id}
                                        index={index}
                                        data={option?.sub_child}
                                        control={control}
                                        loading={loading}
                                        disabled={disabled}
                                      />
                                    </>
                                  ) : (
                                    <>
                                      <FormControlLabel
                                        sx={{ width: "30%" }}
                                        key={option?.child_id}
                                        control={
                                          <Checkbox
                                            disabled={loading || disabled}
                                            onChange={(event) => {
                                              const newValue = event.target
                                                .checked
                                                ? [...value, option?.child_id]
                                                : value.filter(
                                                    (item) =>
                                                      item !== option?.child_id
                                                  );
                                              setValue(newValue);
                                              onChange(newValue); // Correctly using onChange from field to update the array
                                            }}
                                            name={option?.child_name}
                                          />
                                        }
                                        label={option?.child_name}
                                      />
                                    </>
                                  )}
                                </>
                              )}
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
      {/* ))} */}
    </>
  );
};

const FormWoundNursingActions = (props) => {
  const { data, index, loadingData, loadingForm, isEdit, dataForm } = props;
  const { control, setValue } = dataForm;

  return (
    <>
      <Card sx={{ marginTop: 6 }}>
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ alignItems: "center", display: "flex" }}
          >
            <Icon icon="mdi:menu-right" fontSize={25} /> Tindakan Perawatan ke -{" "}
            {+index + 1}
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
                    <RenderCheckbox
                      index={index}
                      data={item}
                      control={control}
                      loading={loadingForm}
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
              <DetailWoundNursingActions data={data} />
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default FormWoundNursingActions;
