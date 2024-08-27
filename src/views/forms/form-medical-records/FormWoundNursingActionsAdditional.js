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
import { Radio, RadioGroup } from "@mui/material";

const FormWoundNursingActionsAdditional = (props) => {
  const { data, index, loadingData, loadingForm, isEdit, dataForm } = props;
  const { control, setValue } = dataForm;

  const [additionalAction, setAdditionalAction] = useState(false);
  const [additionalActionData, setAdditionalActionData] = useState([
    {
      id: 1,
      name: "insisi",
      label: "Insisi",
      useQty: false,
      isDisabled: true,
    },
    {
      id: 1,
      name: "jahit",
      label: "Menjahit/Jahitan",
      useQty: true,
      isDisabled: true,
    },
    {
      id: 1,
      name: "gunting",
      label: "Menggunting Kuku/sisi",
      useQty: true,
      isDisabled: true,
    },
    {
      id: 1,
      name: "nekrotomi",
      label: "Nekrotomi/Phalanx",
      useQty: true,
      isDisabled: true,
    },
  ]);

  const handleChangeAdditionalData = (value, key, type = "") => {
    let tempData = [...additionalActionData];
    tempData = additionalActionData.map((item) =>
      item?.name === key
        ? {
            ...item,
            isDisabled: !value,
            qty: value ? item.qty : "",
            note: value ? item.note : "",
          }
        : {
            ...item,
          }
    );

    if (type) {
      tempData = additionalActionData.map((item) => {
        if (item.name === key) {
          return {
            ...item,
            qty: type === "qty" ? value : item.qty,
            note: type === "note" ? value : item.note,
          };
        }
        return item;
      });
    }

    setAdditionalActionData(tempData);
    console.log(value, key);
  };

  const handleChangeAdditionalQty = (value, key) => {
    let tempData = [...additionalActionData];
    tempData = additionalActionData.map((item) => ({
      ...item,
      qty: item?.name === key ? value : "",
    }));
    setAdditionalActionData(tempData);
    console.log(value, key);
  };

  const handleChangeAdditionalNoted = (value, key) => {
    let tempData = [...additionalActionData];
    tempData = additionalActionData.map((item) => ({
      ...item,
      note: item?.name === key ? value : "",
    }));
    setAdditionalActionData(tempData);
    console.log(value, key);
  };

  return (
    <>
      <Card sx={{ marginTop: 6 }}>
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ alignItems: "center", display: "flex" }}
          >
            <Icon icon="mdi:menu-right" fontSize={25} />
            Tindakan Perawatan Tambahan
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12}>
              <FormControl fullWidth key={data?.parent_name}>
                <Grid container spacing={2} alignItems="flex-start">
                  <Grid item xs={12} sm={12}>
                    <Grid container spacing={2} alignItems="flex-start">
                      <Grid item xs={12} sm={12}>
                        <Controller
                          name={`approval`}
                          control={control}
                          render={({ field: { onChange, ref } }) => (
                            <>
                              <RadioGroup
                                aria-labelledby="additional-action"
                                name="radio-buttons-group"
                                defaultValue="tidak"
                                onChange={(e) => {
                                  console.log("eee", e);
                                  setAdditionalAction(e.target.value);
                                }}
                              >
                                <FormControlLabel
                                  value="ya"
                                  control={<Radio />}
                                  label="Iya, Memerlukan Tindakan Tambahan"
                                />
                                <FormControlLabel
                                  value="tidak"
                                  control={<Radio />}
                                  label="Tidak, Tidak Perlu Tindakan Tambahan"
                                />
                              </RadioGroup>
                            </>
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Divider sx={{ marginBottom: 4 }} />
                {additionalAction === "ya" ? (
                  <>
                    {additionalActionData.map((item, index) => (
                      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                        <Grid item xs={6} sm={3}>
                          <FormGroup>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  onChange={(e, checked) =>
                                    handleChangeAdditionalData(
                                      checked,
                                      item?.name
                                    )
                                  }
                                />
                              }
                              label={item?.label}
                            />
                          </FormGroup>
                        </Grid>
                        {item?.useQty && (
                          <Grid item xs={6} sm={2}>
                            <TextField
                              id="outlined-basic"
                              label="Qty"
                              size="small"
                              fullWidth
                              onChange={(e) =>
                                handleChangeAdditionalData(
                                  e.target.value,
                                  item?.name,
                                  "qty"
                                )
                              }
                              value={item?.qty}
                              disabled={item?.isDisabled}
                              variant="outlined"
                            />
                          </Grid>
                        )}
                        <Grid item xs={6} sm={item?.useQty ? 4 : 6}>
                          <Controller
                            name={`${name}_keterangan`}
                            control={control}
                            disabled={item?.isDisabled}
                            render={({ field: { onChange, ref } }) => (
                              <>
                                <TextField
                                  id="outlined-basic"
                                  label="Keterangan"
                                  size="small"
                                  fullWidth
                                  onChange={(e) =>
                                    handleChangeAdditionalData(
                                      e.target.value,
                                      item?.name,
                                      "note"
                                    )
                                  }
                                  value={item?.note}
                                  disabled={item?.isDisabled}
                                  variant="outlined"
                                />
                              </>
                            )}
                          />
                        </Grid>
                      </Grid>
                    ))}
                  </>
                ) : (
                  <></>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default FormWoundNursingActionsAdditional;
