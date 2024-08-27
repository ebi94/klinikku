"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Box, Divider, Grid, Typography } from "@mui/material";
import ButtonCustom from "src/views/components/buttons/ButtonCustom";
import { detailSupportingData } from "src/services/medicalRecords";
import SpinnerLoadData from "src/@core/components/spinner-load-data";
import Image from "next/image";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

const DetailSupportingData = (props) => {
  const { id, data, onClickEdit } = props;

  const [dataDetail, setDataDetail] = useState([]);

  const renderFile = (fileUrl) => {
    fetch(fileUrl)
      .then((response) => {
        const contentType = response.headers.get("Content-Type");
        return contentType;
      })
      .catch((error) => {
        console.error("Error fetching the URL:", error);
      });
  };

  useEffect(() => {
    setDataDetail(data);
  }, [data]);

  return (
    <>
      <Box sx={{ pb: 1, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="h6" sx={{ mb: 2, display: "flex" }}>
          Pencitraan (CT/USG) :
        </Typography>
        {dataDetail?.imaging ? (
          <>
            <br />
            {renderFile(dataDetail?.imaging)}
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <PhotoProvider>
                <PhotoView src={dataDetail?.imaging}>
                  <Image
                    src={dataDetail?.imaging}
                    alt="Pencitraan (CT/USG)"
                    sizes="100vw"
                    // Make the image display full width
                    style={{
                      width: "35%",
                      height: "auto",
                    }}
                    width={100}
                    height={200}
                  />
                </PhotoView>
              </PhotoProvider>
            </Box>
          </>
        ) : (
          <>-</>
        )}
        <Typography variant="h6" sx={{ mb: 2, mt: 4, display: "flex" }}>
          Hasil Lab :{" "}
        </Typography>
        {dataDetail?.lab_result ? (
          <>
            <br />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <PhotoProvider>
                <PhotoView src={dataDetail?.lab_result}>
                  <Image
                    src={dataDetail?.lab_result}
                    alt="Hasil Lab"
                    sizes="100vw"
                    // Make the image display full width
                    style={{
                      width: "35%",
                      height: "auto",
                    }}
                    width={100}
                    height={200}
                  />
                </PhotoView>
              </PhotoProvider>
            </Box>
          </>
        ) : (
          <>-</>
        )}
        <Typography variant="h6" sx={{ mb: 2, mt: 4, display: "flex" }}>
          Kultur Bakteri :{" "}
        </Typography>
        {dataDetail?.culture_result ? (
          <>
            <br />
            {renderFile(dataDetail?.culture_result)}
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <PhotoProvider>
                <PhotoView src={dataDetail?.culture_result}>
                  <Image
                    src={dataDetail?.culture_result}
                    alt="Kultur Bakteri"
                    sizes="100vw"
                    // Make the image display full width
                    style={{
                      width: "35%",
                      height: "auto",
                    }}
                    width={100}
                    height={200}
                  />
                </PhotoView>
              </PhotoProvider>
            </Box>
          </>
        ) : (
          <>-</>
        )}
        <Typography variant="h6" sx={{ mb: 2, mt: 4, display: "flex" }}>
          Pemeriksaan Vaskuler :{" "}
        </Typography>
        {dataDetail?.vascular_testing ? (
          <>
            <br />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <PhotoProvider>
                <PhotoView src={dataDetail?.vascular_testing}>
                  <Image
                    src={dataDetail?.vascular_testing}
                    alt="Pemeriksaan Vaskuler"
                    sizes="100vw"
                    // Make the image display full width
                    style={{
                      width: "35%",
                      height: "auto",
                    }}
                    width={100}
                    height={200}
                  />
                </PhotoView>
              </PhotoProvider>
            </Box>
          </>
        ) : (
          <>-</>
        )}
      </Box>
      <Divider />
      <Box sx={{ marginTop: 4 }} />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={3}></Grid>
        <Grid item xs={12} sm={6} />
        <Grid item xs={12} sm={3}>
          <ButtonCustom text="Ubah Data" onClick={() => onClickEdit()} />
        </Grid>
      </Grid>
    </>
  );
};

export default DetailSupportingData;
