// ** React Imports
import { useState, useEffect, forwardRef } from "react";

// ** Next Import
import Link from "next/link";

// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import CardContent from "@mui/material/CardContent";
import Select from "@mui/material/Select";
import { DataGrid } from "@mui/x-data-grid";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Third Party Imports
import format from "date-fns/format";
import DatePicker from "react-datepicker";
import toast from "react-hot-toast";

// ** Utils Import
import { getInitials } from "src/@core/utils/get-initials";

// ** Custom Components Imports
import CustomAvatar from "src/@core/components/mui/avatar";
import TableHeader from "src/views/apps/invoice/list/TableHeader";

// ** Styled Components
import DatePickerWrapper from "src/@core/styles/libs/react-datepicker";
import PageHeader from "src/@core/components/page-header";
import { listTransactions } from "src/services/transactions";
import { formatRupiah, selectColor } from "src/utils/helpers";

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  color: theme.palette.primary.main,
}));

// ** renders client column
const renderClient = (row) => {
  return (
    <CustomAvatar
      skin="light"
      color={row.avatarColor || "primary"}
      sx={{ mr: 3, width: 30, height: 30, fontSize: ".875rem" }}
    >
      {getInitials(row?.fullName ? row?.fullName : "John Doe")}
    </CustomAvatar>
  );
};

const defaultColumns = [
  {
    field: "invoice_no",
    minWidth: 150,
    headerName: "No Invoice",
    renderCell: ({ row }) => (
      <LinkStyled
        href={`/transactions/detail/${row?.invoice_no}`}
      >{`${row?.invoice_no}`}</LinkStyled>
    ),
  },
  {
    field: "pasien",
    minWidth: 250,
    headerName: "Pasien",
    renderCell: ({ row }) => {
      const { pasien } = row;

      return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {renderClient(row)}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography
              noWrap
              variant="body2"
              sx={{ color: "text.primary", fontWeight: 600 }}
            >
              {pasien?.name}
            </Typography>
            <Typography noWrap variant="caption">
              {pasien?.mr}
            </Typography>
          </Box>
        </Box>
      );
    },
  },
  {
    minWidth: 90,
    field: "clinic",
    flex: 0.05,
    headerName: "Klinik",
    renderCell: ({ row }) => (
      <Typography variant="body2">{`${row?.clinic?.name}`}</Typography>
    ),
  },
  {
    minWidth: 135,
    field: "date",
    flex: 0.08,
    headerName: "Tgl Perawatan",
    renderCell: ({ row }) => (
      <Typography variant="body2">{row?.date}</Typography>
    ),
  },
  {
    minWidth: 135,
    field: "created_at",
    headerName: "Tanggal Invoice",
    renderCell: ({ row }) => (
      <Typography variant="body2">{row?.created_at}</Typography>
    ),
  },
  {
    minWidth: 120,
    field: "created_by",
    headerName: "Perawat",
    renderCell: ({ row }) => (
      <Typography variant="body2">{row?.created_by}</Typography>
    ),
  },
  {
    minWidth: 120,
    field: "total_biaya",
    headerName: "Total Biaya",
    renderCell: ({ row }) => (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography
            noWrap
            variant="body2"
            sx={{ color: "text.primary", fontWeight: 600 }}
          >
            {formatRupiah(row?.total_price ?? 0)}
          </Typography>
        </Box>
      </Box>
    ),
  },
];
/* eslint-disable */
const CustomInput = forwardRef((props, ref) => {
  const startDate =
    props.start !== null ? format(props.start, "MM/dd/yyyy") : "";
  const endDate =
    props.end !== null ? ` - ${format(props.end, "MM/dd/yyyy")}` : null;
  const value = `${startDate}${endDate !== null ? endDate : ""}`;
  props.start === null && props.dates.length && props.setDates
    ? props.setDates([])
    : null;
  const updatedProps = { ...props };
  delete updatedProps.setDates;
  return (
    <TextField
      fullWidth
      inputRef={ref}
      {...updatedProps}
      label={props.label || ""}
      value={value}
    />
  );
});

/* eslint-enable */
const Transactions = () => {
  // ** State
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState([]);
  const [value, setValue] = useState("");
  const [statusValue, setStatusValue] = useState("");
  const [endDateRange, setEndDateRange] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [startDateRange, setStartDateRange] = useState(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const breadCrumbs = [
    { id: 1, path: "/dashboards", name: "Home" },
    { id: 2, path: "#", name: "Transactions List" },
  ];

  // ** Hooks
  const handleFilter = (val) => {
    setValue(val);
  };

  const handleStatusValue = (e) => {
    setStatusValue(e.target.value);
  };

  const handleOnChangeRange = (dates) => {
    const [start, end] = dates;
    if (start !== null && end !== null) {
      setDates(dates);
    }
    setStartDateRange(start);
    setEndDateRange(end);
  };

  const columns = [
    ...defaultColumns,
    {
      flex: 0.1,
      minWidth: 130,
      sortable: false,
      field: "actions",
      headerName: "Aksi",
      renderCell: ({ row }) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="View">
            <IconButton
              size="small"
              component={Link}
              href={`/transactions/detail/${row?.id}`}
            >
              <Icon icon="mdi:eye-outline" fontSize={20} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const fetchDataList = async () => {
    const res = await listTransactions();
    if (+res?.result?.status === 200) {
      const data =
        res?.result?.data?.data !== null ? res?.result?.data?.data : [];
      const mappingDataList = data.map((item) => {
        return {
          id: item?.invoice_id,
          ...item,
        };
      });

      setDataList(mappingDataList);
      setLoading(false);
    } else {
      toast.error(`Status Code : ${res?.error}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataList();
  }, []);
  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <PageHeader
          breadCrumbs={breadCrumbs}
          title="Transactions List"
          subtitle="List of Customer Transactions using KlinikKu Apps"
        />
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Filters" />
            <CardContent>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="invoice-status-select">Status</InputLabel>
                    <Select
                      fullWidth
                      size="small"
                      value={statusValue}
                      sx={{ mr: 4, mb: 2 }}
                      label="Status"
                      onChange={handleStatusValue}
                      labelId="invoice-status-select"
                    >
                      <MenuItem value="">none</MenuItem>
                      <MenuItem value="downloaded">Downloaded</MenuItem>
                      <MenuItem value="draft">Draft</MenuItem>
                      <MenuItem value="paid">Paid</MenuItem>
                      <MenuItem value="partial payment">
                        Partial Payment
                      </MenuItem>
                      <MenuItem value="past due">Past Due</MenuItem>
                      <MenuItem value="sent">Sent</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    isClearable
                    selectsRange
                    monthsShown={2}
                    endDate={endDateRange}
                    selected={startDateRange}
                    startDate={startDateRange}
                    shouldCloseOnSelect={false}
                    id="date-range-picker-months"
                    onChange={handleOnChangeRange}
                    customInput={
                      <CustomInput
                        dates={dates}
                        size="small"
                        setDates={setDates}
                        label="Tanggal Invoice"
                        end={endDateRange}
                        start={startDateRange}
                      />
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <TableHeader
              value={value}
              selectedRows={selectedRows}
              handleFilter={handleFilter}
            />
            <DataGrid
              autoHeight
              pagination
              rows={dataList}
              columns={columns}
              loading={loading}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              onRowSelectionModelChange={(rows) => setSelectedRows(rows)}
            />
          </Card>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  );
};

export default Transactions;
