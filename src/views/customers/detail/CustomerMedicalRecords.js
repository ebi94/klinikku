// React core and Next.js imports
import * as React from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import Link from "next/link";

// MUI components
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

// Custom components and utilities
import Icon from "src/@core/components/icon";
import { requestSearch } from "src/@core/utils/request-search";
import AddTreatmentDrawer from "src/views/components/drawer/AddTreatmentDrawer";
import SpinnerLoadData from "src/@core/components/spinner";
import EmptyState from "src/views/components/empty-state/EmptyState";
import { useRouter } from "next/router";

const CustomerMedicalRecords = (props) => {
  const { dataList, loading } = props;
  const router = useRouter();
  const patientId = router?.query?.id;
  // ** State
  const [value, setValue] = useState("");
  const [dataListSearch, setDataListSearch] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const RowOptions = ({ data }) => {
    return (
      <Link href={`/order-telenursing/detail/${data?.order_id}`}>
        <IconButton size="small">
          <Icon icon="mdi:eye-outline" fontSize={20} />
        </IconButton>
      </Link>
    );
  };

  const handleSearch = (val) => {
    setValue(val);
    const filteredData = requestSearch(val, dataList);
    setDataListSearch(filteredData);
  };

  const Row = (props) => {
    const { row } = props;
    console.log("row", row);

    return (
      <React.Fragment>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell component="th" scope="row">
            {row?.treatment}
          </TableCell>
          <TableCell align="right"> {row?.clinic?.name}</TableCell>
          <TableCell align="right">
            {row?.treatment === "Wound"
              ? `Total luka: ${row?.total_wound}`
              : row?.total_eye}
          </TableCell>
          <TableCell align="right">{row?.current_treatment_status}</TableCell>
          <TableCell align="right">
            <Link
              href={`/treatment/detail/${row?.id}/?patientId=${row.patient_id}`}
            >
              <IconButton aria-label="expand row" size="small">
                <Icon icon="mdi:eye-outline" fontSize={20} />
              </IconButton>
            </Link>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  };

  Row.propTypes = {
    row: PropTypes.shape({
      calories: PropTypes.number.isRequired,
      carbs: PropTypes.number.isRequired,
      fat: PropTypes.number.isRequired,
      history: PropTypes.arrayOf(
        PropTypes.shape({
          amount: PropTypes.number.isRequired,
          customerId: PropTypes.string.isRequired,
          date: PropTypes.string.isRequired,
        })
      ).isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      protein: PropTypes.number.isRequired,
    }).isRequired,
  };

  return (
    <>
      <Card>
        <CardHeader
          title={
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <TextField
                    size="small"
                    placeholder="Cari Perawatan"
                    value={value}
                    onChange={(e) => {
                      handleSearch(e.target.value);
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{ mb: 3, whiteSpace: "nowrap" }}
                    onClick={() => setOpenDrawer(true)}
                  >
                    Tambah Perawatan
                  </Button>
                </Box>
              </Box>
            </>
          }
        />
        <CardContent>
          {loading ? (
            <SpinnerLoadData />
          ) : dataList?.length > 0 ? (
            <TableContainer component={Paper}>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell>Perawatan</TableCell>
                    <TableCell align="right">Klinik</TableCell>
                    <TableCell align="right">Keterangan</TableCell>
                    <TableCell align="right">Status</TableCell>
                    <TableCell align="right">Aksi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {+dataList?.length > 0 &&
                    dataList.map((row) => <Row key={row.name} row={row} />)}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <EmptyState />
          )}
        </CardContent>
      </Card>
      <AddTreatmentDrawer
        open={openDrawer}
        toggle={toggleDrawer}
        patientId={patientId}
      />
    </>
  );
};

export default CustomerMedicalRecords;
