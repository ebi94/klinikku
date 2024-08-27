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
import { getWoundAssestmentList } from "src/services/medicalRecords";
import ButtonSubmit from "src/views/components/buttons/ButtonSubmit";
import ButtonCustom from "src/views/components/buttons/ButtonCustom";
import DividerText from "src/views/components/divider/DividerText";
import PageHeader from "src/@core/components/page-header";
import { CircularProgress } from "@mui/material";

const RenderSelectOption = ({ data, control, errors, loading }) => {
  const [additionalOptions, setAdditionalOptions] = useState([]);

  const handleMainSelectChange = (event) => {
    const selectedValue = event.target.value;
    const selectedChild = data.child.find(
      (c) => c.child_name === selectedValue
    );

    if (selectedChild && selectedChild.sub_child.length > 0) {
      setAdditionalOptions(selectedChild.sub_child);
    } else {
      setAdditionalOptions([]);
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
            <InputLabel size="small">Sub Categories</InputLabel>
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

const FormGeneralAssestment = (props) => {
  // const { listQuestion, res } = props;
  // console.log("listQustion", listQuestion);
  // console.log("res", res);
  const router = useRouter();
  const { id, patientId } = router.query;
  let userData;
  if (typeof window !== "undefined") {
    userData = JSON.parse(localStorage.getItem("userData"));
  }
  const token = userData?.data?.access_token;
  const [listQuestion, setListQuestion] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingForm, setLoadingForm] = useState(true);

  const breadCrumbs = [
    { id: 1, path: "/dashboards", name: "Home" },
    {
      id: 2,
      path: `/customers/detail/${patientId}/?tab=treatment`,
      name: "Customer Detail",
    },
    { id: 3, path: "#", name: "Formulir Pengkajian Umum" },
  ];
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
    // resolver: yupResolver(formSchema),
  });

  console.log("errors", errors);

  const onSubmit = async (values) => {};

  const fetchListQuestions = async () => {
    const res = await getWoundAssestmentList();
    if (+res?.result?.status === 200) {
      const data = res?.result?.data;
      setListQuestion(data);
      setLoadingForm(false);
    } else {
      toast.error(`Oops gagal ! ${res?.error}`);
      setLoadingForm(false);
    }
  };
  useEffect(() => {
    fetchListQuestions();
  }, []);

  return (
    <>
      <PageHeader
        breadCrumbs={breadCrumbs}
        title="Formulir Pengkajian Luka"
        subtitle=""
      />
      <Card sx={{ marginTop: 6 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Pengkajian Luka
          </Typography>
          {loadingForm ? (
            <Box sx={{ width: "100%", textAlign: "center" }}>
              <CircularProgress size={40} />
              <Typography>Mohon Tunggu . . .</Typography>
            </Box>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                {+listQuestion?.length > 0 &&
                  listQuestion.map((item) => (
                    <>
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
                    </>
                  ))}
              </Grid>
              <Box sx={{ marginTop: 4 }} />
              <Divider />
              <Box sx={{ marginTop: 4 }} />
              <Grid container spacing={3}>
                <Grid item xs={12} sm={3}>
                  <ButtonCustom text="Batal" loading={loading} />
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

// export async function getServerSideProps(context) {
//   try {
//     const res = await getWoundAssestmentList();
//     if (res?.result?.status === 200) {
//       return {
//         props: {
//           listQuestion: res.result.data || [], // Ensure default to empty array if no data
//         },
//       };
//     } else {
//       console.error(`Failed to fetch questions: ${res?.error}`);
//       return {
//         props: {
//           listQuestion: [],
//           res: res ?? "",
//         },
//       };
//     }
//   } catch (error) {
//     console.error("An error occurred:", error);
//     return {
//       props: {
//         listQuestion: [],
//         res: res ?? "",
//       },
//     };
//   }
// }

export default FormGeneralAssestment;
