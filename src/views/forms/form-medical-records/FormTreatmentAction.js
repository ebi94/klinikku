// React and Next.js imports
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

// Third-party libraries for functionality
import toast from "react-hot-toast";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";

// Material-UI components
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControlLabel from "@mui/material/FormControlLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";

// Services and local components
import ButtonSubmit from "src/views/components/buttons/ButtonSubmit";
import ButtonCustom from "src/views/components/buttons/ButtonCustom";
import DividerText from "src/views/components/divider/DividerText";
import { CircularProgress } from "@mui/material";

const RenderSelectOption = ({ data, control, errors, loading }) => {
  const [additionalOptions, setAdditionalOptions] = useState([]);
  const [icd10Options, setIcd10Options] = useState([]);
  const [subIcd10Options, setSubIcd10Options] = useState([]);
  const [selectedIcd10, setSelectedIcd10] = useState("");

  const handleMainSelectChange = (event) => {
    const selectedValue = event.target.value;
    const selectedChild = data.child.find(
      (c) => c.child_name === selectedValue
    );

    setSubIcd10Options([]);
    if (selectedChild && selectedChild.sub_child.length > 0) {
      setAdditionalOptions(selectedChild.sub_child);
    } else {
      setAdditionalOptions([]);
    }

    if (selectedChild && selectedChild.icd10.length > 0) {
      setIcd10Options(selectedChild.icd10);
    } else {
      setIcd10Options([]);
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

  return (
    <>
      <DividerText label={data?.parent_name} />
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel size="small">{data.parent_name}</InputLabel>
          <Controller
            name={data.parent_name}
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                size="small"
                label={data.parent_name}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  handleMainSelectChange(e);
                }}
              >
                {data.child.map((item) => (
                  <MenuItem key={item.child_id} value={item.child_name}>
                    {item.child_name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>
      </Grid>

      {additionalOptions.length > 0 && (
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel size="small">Sub Kategori</InputLabel>
            <Select
              label="Sub Categories"
              size="small"
              onChange={(e) => {
                // handle changes for sub category selection if necessary
              }}
            >
              {additionalOptions.map((option) => (
                <MenuItem key={option.child_id} value={option.sub_child_name}>
                  {option.sub_child_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      )}
      {icd10Options.length > 0 && (
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel size="small">Kategori</InputLabel>
            <Controller
              name={"Icd10Kategori"}
              control={control}
              render={({ field }) => (
                <Select
                  label="Kategori"
                  size="small"
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    handleIcd10SelectChange(e);
                  }}
                >
                  {icd10Options.map((option) => (
                    <MenuItem key={option.icd10_id} value={option.icd10_id}>
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
            <Select
              label="Sub Categories"
              size="small"
              onChange={(e) => {
                // handle changes for sub category selection if necessary
              }}
            >
              {subIcd10Options.map((option) => (
                <MenuItem key={option.sub_icd10_id} value={option.sub_icd10_id}>
                  {option.category} ({selectedIcd10?.icd10_value}
                  {option.icd10_plus_value})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      )}
    </>
  );
};

const RenderRadioButton = ({ data, control, errors, loading }) => {
  return (
    <>
      <DividerText label={data?.parent_name} />
      <Grid item xs={12}>
        <FormControl
          fullWidth
          // error={Boolean(errors.nutrition?.appetite)}
        >
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs={12} sm={12}>
              <Controller
                name={data?.parent_name}
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    size="small"
                    disabled={loading}
                    sx={{ flexDirection: "row" }} // Menyusun radio buttons dalam satu baris
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    {data?.child.map((itemChild) => (
                      <FormControlLabel
                        value={itemChild?.child_name}
                        control={<Radio />}
                        label={itemChild?.child_name}
                        key={itemChild?.child_name}
                      />
                    ))}
                  </RadioGroup>
                )}
              />
              {errors?.nutrition?.appetite && (
                <FormHelperText>
                  {errors?.nutrition.appetite.message}
                </FormHelperText>
              )}
            </Grid>
          </Grid>
        </FormControl>
      </Grid>
    </>
  );
};

const FormTreatmentAction = (props) => {
  const { data, loadingForm } = props;
  console.log("data list", data);
  console.log("props", props);

  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
    // resolver: yupResolver(createValidationSchema()),
  });

  console.log("errors", errors);

  const onSubmit = async (values) => {};

  return (
    <>
      <Card sx={{ marginTop: 6 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Tindakan Perawatan
          </Typography>
          {loadingForm ? (
            <Box sx={{ width: "100%", textAlign: "center" }}>
              <CircularProgress size={40} />
              <Typography>Mohon Tunggu . . .</Typography>
            </Box>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                {+data?.length > 0 &&
                  data.map((item) => (
                    <React.Fragment key={item.id}>
                      {item?.form_type === "radio-button" ? (
                        <>
                          <RenderRadioButton
                            data={item}
                            control={control}
                            errors={errors}
                            loading={loading}
                          />
                        </>
                      ) : (
                        <>
                          <RenderSelectOption
                            data={item}
                            control={control}
                            errors={errors}
                            loading={loading}
                          />
                        </>
                      )}
                    </React.Fragment>
                  ))}
              </Grid>
              <Box sx={{ marginTop: 4 }} />
              <Divider />
              <Box sx={{ marginTop: 4 }} />
              <Grid container spacing={3}>
                <Grid item xs={12} sm={3}>
                  <ButtonCustom text="Batal" loading={loading} useBackToTop />
                </Grid>
                <Grid item xs={12} sm={6} />
                <Grid item xs={12} sm={3}>
                  <ButtonSubmit loading={loading} />
                </Grid>
              </Grid>
            </form>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default FormTreatmentAction;
