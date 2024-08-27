import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Icon from "src/@core/components/icon";
import CustomChip from "src/@core/components/mui/chip";

const styles = {
  boxMain: {
    display: "flex",
    alignItems: "center",
  },
  boxHeader: {
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
  },
  boxTitle: {
    mr: 2,
    display: "flex",
    mb: 0.4,
    flexDirection: "column",
  },
  boxDescription: {
    display: "flex",
  },
  boxDate: {
    display: "flex",
    alignItems: "center",
    "& svg": {
      mr: 1,
      color: "text.secondary",
      verticalAlign: "middle",
    },
  },
  typographyTitle: {
    fontWeight: 500,
    lineHeight: 1.71,
    letterSpacing: "0.22px",
    fontSize: "0.875rem !important",
    marginRight: 2,
  },
  customChip: {
    height: 20,
    mt: 0.4,
    fontSize: "0.75rem",
    fontWeight: 600,
  },
};

const ChipStatus = (props) => {
  const { value } = props;
  switch (value) {
    case "Kembali":
      return (
        <CustomChip
          skin="light"
          size="small"
          label={value}
          color="warning" // green color for success
          sx={styles.customChip}
        />
      );
    case "Sembuh":
      return (
        <CustomChip
          skin="light"
          size="small"
          label={value}
          color="success" // blue color for general positive outcome
          sx={styles.customChip}
        />
      );
    case "Rujuk":
      return (
        <CustomChip
          skin="light"
          size="small"
          label={value}
          color="warning" // orange color for caution
          sx={styles.customChip}
        />
      );
    case "Meninggal":
      return (
        <CustomChip
          skin="light"
          size="small"
          label={value}
          color="error" // red color for negative outcomes
          sx={styles.customChip}
        />
      );
    case "Tidak Kembali Lagi":
      return (
        <CustomChip
          skin="light"
          size="small"
          label={value}
          color="default" // grey color for neutral or undefined statuses
          sx={styles.customChip}
        />
      );
    default:
      return (
        <CustomChip
          skin="light"
          size="small"
          label={value}
          color="secondary" // secondary color for any other statuses not listed
          sx={styles.customChip}
        />
      );
  }
};

const AccordionTitle = (props) => {
  const { data } = props;
  return (
    <Box>
      <Box key={1} sx={styles.boxMain}>
        <Box sx={styles.boxHeader}>
          <Box sx={styles.boxTitle}>
            <Box sx={styles.boxDescription}>
              <Typography sx={styles.typographyTitle}>
                {data?.clinic?.name}
              </Typography>
              <Typography sx={styles.typographyTitle}>
                {data?.created_by?.name ? `(${data?.created_by?.name})` : ""}
              </Typography>
              <ChipStatus value={data?.treatment_status} />
            </Box>
            <Box sx={styles.boxDate}>
              <Icon fontSize="0.875rem" icon="mdi:calendar-blank-outline" />
              <Typography variant="caption">{data?.date}</Typography>
              <Box sx={{ marginLeft: 2 }} />
              {data?.next_visit ? (
                <>
                  <Typography variant="caption">|</Typography>
                  <Box sx={{ marginLeft: 2 }} />
                  <Icon fontSize="0.875rem" icon="mdi:calendar-blank-outline" />
                  <Typography variant="caption">
                    Kunjungan berikutnya
                  </Typography>
                  <Icon fontSize="0.875rem" icon="mdi:chevron-double-right" />
                  <Typography variant="caption">{data?.next_visit}</Typography>
                </>
              ) : (
                <></>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AccordionTitle;
