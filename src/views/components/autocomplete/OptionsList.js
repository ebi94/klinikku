import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import moment from "moment";

const OptionsList = (props) => {
  const { data } = props;
  console.log("option list data", data);

  return (
    <>
      {data?.inputValue ? (
        <>
          <Grid item xs={9} sm={9} md={9}>
            <Typography sx={{ fontSize: "12px", fontWeight: 600 }}>
              {data?.title}
            </Typography>
          </Grid>
        </>
      ) : (
        <>
          <Grid item xs={6} sm={9} md={9}>
            <Typography sx={{ fontSize: "12px", fontWeight: 600 }}>
              {data?.name}
            </Typography>
            <Typography variant="caption"></Typography>
            <Typography sx={{ fontSize: "10px", width: "100%" }} noWrap>
              {data?.date_of_birth
                ? moment(data?.date_of_birth).format("DD-MMM-YYYY")
                : ""}{" "}
              ({data?.age})
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3} md={3} sx={{ textAlign: "end" }}>
            <Typography variant="body2" sx={{ textAlign: "end" }}>
              {data?.gender === "Male" ? "Laki-laki" : "Perempuan"}
            </Typography>
          </Grid>
        </>
      )}
    </>
  );
};

export default OptionsList;
