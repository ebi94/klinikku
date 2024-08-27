import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

// ** Demo Components Imports
import CustomersView from "src/views/customers/detail/CustomerViewPage";

const CustomersDetail = ({ tab, invoiceData }) => {
  const router = useRouter();
  const patientId = router.query.id;
  console.log("pasien id", patientId);
  return <CustomersView patientId={patientId} />;
};

export default CustomersDetail;
