import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import ButtonCustom from "src/views/components/buttons/ButtonCustom";
import TypographyInfoDetail from "src/views/ui/typography/TypographyInfoDetail";

const DetailGeneralAssestment = (props) => {
  const { data, loading, onClickEdit } = props;

  return (
    <Card sx={{ marginTop: 6 }}>
      <CardContent>
        <Box sx={{ pb: 1, borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Informasi Klinik
          </Typography>
          <TypographyInfoDetail
            data={{
              label: "Nama Klinik",
              description: data?.clinic?.name ?? "-",
              widthLabel: "25%",
            }}
          />
          <TypographyInfoDetail
            data={{
              label: "Tanggal Pengkajian",
              description: data?.date ?? "-",
              widthLabel: "25%",
            }}
          />
        </Box>

        <Box sx={{ pb: 1, borderBottom: 1, borderColor: "divider", mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Riwayat Medik
          </Typography>
          <TypographyInfoDetail
            data={{
              label: "Keluhan Utama",
              description: data?.main_complaint ?? "-",
              widthLabel: "25%",
            }}
          />
          <TypographyInfoDetail
            data={{
              label: "Riwayat Cedera",
              description: data?.history_of_injury ?? "-",
              widthLabel: "25%",
            }}
          />
          <TypographyInfoDetail
            data={{
              label: "Penyakit Penyerta",
              description:
                data?.concomitant_disease?.length > 0
                  ? data?.concomitant_disease.join(", ")
                  : "",
              widthLabel: "25%",
            }}
          />
        </Box>

        <Box sx={{ pb: 1, borderBottom: 1, borderColor: "divider", mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Status Nutrisi
          </Typography>
          <TypographyInfoDetail
            data={{
              label: "Nafsu Makan",
              description: data?.nutrition?.appetite ?? "-",
              widthLabel: "25%",
            }}
          />
          <TypographyInfoDetail
            data={{
              label: "Pola Makan",
              description: data?.nutrition?.eating_pattern ?? "-",
              widthLabel: "25%",
            }}
          />
          <TypographyInfoDetail
            data={{
              label: "Frekuensi Makan",
              description: data?.nutrition?.frequency_of_eating ?? "-",
              widthLabel: "25%",
            }}
          />
        </Box>

        <Box sx={{ pb: 1, borderBottom: 1, borderColor: "divider", mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Kondisi Fisik
          </Typography>
          <TypographyInfoDetail
            data={{
              label: "Tinggi Badan",
              description: `${data?.physical_condition?.height ?? "-"} cm`,
              widthLabel: "25%",
            }}
          />
          <TypographyInfoDetail
            data={{
              label: "Berat Badan",
              description: `${data?.physical_condition?.weight ?? "-"} kg`,
              widthLabel: "25%",
            }}
          />
          <TypographyInfoDetail
            data={{
              label: "Konjungtiva",
              description: data?.physical_condition?.konjungtiva ?? "-",
              widthLabel: "25%",
            }}
          />
          <TypographyInfoDetail
            data={{
              label: "Cara Berjalan",
              description: data?.physical_condition?.way_of_walking ?? "-",
              widthLabel: "25%",
            }}
          />
        </Box>

        <Box sx={{ pb: 1, borderBottom: 1, borderColor: "divider", mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Triase
          </Typography>
          <TypographyInfoDetail
            data={{
              label: "Kesadaran",
              description: data?.triage?.consciousness ?? "-",
              widthLabel: "25%",
            }}
          />
          <TypographyInfoDetail
            data={{
              label: "Tekanan Darah",
              description: data?.triage?.blood_pressure ?? "-",
              widthLabel: "25%",
            }}
          />
          <TypographyInfoDetail
            data={{
              label: "Frekuensi Nadi",
              description: data?.triage?.pulse_frequency ?? "-",
              widthLabel: "25%",
            }}
          />
          <TypographyInfoDetail
            data={{
              label: "Suhu Tubuh",
              description: `${data?.triage?.body_temperature ?? "-"} °C`,
              widthLabel: "25%",
            }}
          />
          <TypographyInfoDetail
            data={{
              label: "Frekuensi Pernapasan",
              description: data?.triage?.breathing_frequency ?? "-",
              widthLabel: "25%",
            }}
          />
        </Box>
        <Divider />
        <Box sx={{ marginTop: 4 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} sm={3}></Grid>
          <Grid item xs={12} sm={6} />
          <Grid item xs={12} sm={3}>
            <ButtonCustom
              text="Ubah Data"
              loading={loading}
              onClick={() => onClickEdit()}
              useBackToTop
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DetailGeneralAssestment;
