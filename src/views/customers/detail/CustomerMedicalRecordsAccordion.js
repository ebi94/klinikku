import * as React from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionTitle from "src/views/components/accordion/AccordionTitle";
import AccordionContent from "src/views/components/accordion/AccordionContent";
import Icon from "src/@core/components/icon";
import SpinnerLoadData from "src/@core/components/spinner-load-data";

const CustomerMedicalRecordsAccordion = (props) => {
  const { dataList = [], loading, dataDetail } = props;
  console.log("dataList", dataList);

  return (
    <div>
      {loading ? (
        <>
          <SpinnerLoadData />
        </>
      ) : (
        <></>
      )}
      {dataDetail?.medical_record?.[0]?.is_complete_mr && (
        <>
          <Link
            href={`/treatment/add/${dataDetail?.treatment_id}/?patientId=${dataDetail?.patient_id}&tab=pengkajian-umum`}
          >
            <Button
              fullWidth
              variant="contained"
              size="small"
              sx={{ width: 200 }}
            >
              Tambah MR
            </Button>
          </Link>
        </>
      )}
      <Box sx={{ marginTop: 4 }} />
      {dataList.map((item) => (
        <Accordion key={item?.nursing_number}>
          <AccordionSummary
            id="panel-header-1"
            aria-controls="panel-content-1"
            expandIcon={<Icon icon="mdi:chevron-down" />}
          >
            <AccordionTitle data={item} />
          </AccordionSummary>
          <AccordionDetails>
            <AccordionContent data={item} />
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default CustomerMedicalRecordsAccordion;
