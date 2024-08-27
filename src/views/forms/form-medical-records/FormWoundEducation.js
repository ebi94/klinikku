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

// ** Icon Imports
import Icon from "src/@core/components/icon";

// Services and local components
import { formatLabel } from "src/utils/helpers";

const FormWoundEducation = (props) => {
  const { data, loading, dataForm } = props;
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
            Form Edukasi
          </Typography>
          <Grid container spacing={3}>
            {data?.education &&
              Object.entries(data?.education).map(([key, val]) => {
                return (
                  <Grid key={key} item xs={12} sm={12} sx={{ marginBottom: 2 }}>
                    <Grid container spacing={2} alignItems="flex-start">
                      <Grid item xs={12} sm={3}>
                        <FormLabel
                          component="legend"
                          sx={{ fontWeight: 600, paddingTop: 2 }}
                        >
                          {formatLabel(key)}
                        </FormLabel>
                      </Grid>
                      <Grid item xs={12} sm={9}>
                        <FormControl fullWidth>
                          <Controller
                            name={key}
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                name={key}
                                size="small"
                                disabled={loading}
                                onChange={(e) => {
                                  onChange(e.target.value);
                                }}
                                value={value}
                                fullWidth
                                multiline
                                rows={4}
                              />
                            )}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                );
              })}
          </Grid>
          <Box sx={{ marginTop: 4 }} />
          <Divider />
        </CardContent>
      </Card>
    </>
  );
};

export default FormWoundEducation;
