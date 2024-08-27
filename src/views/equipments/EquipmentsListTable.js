import { useState, useEffect } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import { DataGrid } from "@mui/x-data-grid";
import Icon from "src/@core/components/icon";
import EquipmentsDrawer from "./list/EquipmentsDrawer";
import { requestSearch } from "src/@core/utils/request-search";

const exampleData = [
  {
    id: 1,
    name: "Nama Productnya Disini",
    imageLink: "/images/products/google-home.png",
    ecommerceLink: "https://tokopedia.com",
  },
  {
    id: 2,
    name: "Kain Kassa",
    imageLink: "/images/banners/banner-1.jpg",
    ecommerceLink: "https://bukalapak.com",
  },
  {
    id: 3,
    name: "Perban",
    imageLink: "/images/cards/comment-alt-lines.png",
    ecommerceLink: "https://tokopedia.com",
  },
  {
    id: 4,
    name: "Betadin 10ml",
    imageLink: "/images/products/google-home.png",
    ecommerceLink: "https://shoope.com",
  },
  {
    id: 5,
    name: "Avtur 100ml",
    imageLink: "/images/banners/banner-2.jpg",
    ecommerceLink: "https://tokopedia.com",
  },
  {
    id: 6,
    name: "Minyak Kayu Putih Botol Besar",
    imageLink: "/images/cards/analog-clock.jpg",
    ecommerceLink: "https://tokopedia.com",
  },
  {
    id: 7,
    name: "Minyak Bumi",
    imageLink: "/images/cards/analog-clock.jpg",
    ecommerceLink: "https://tokopedia.com",
  },
];

const EquipmentsListTable = (props) => {
  const { type } = props;

  // ** State
  const [value, setValue] = useState("");
  const [data, setData] = useState([]);
  const [dataListSearch, setDataListSearch] = useState([]);
  const [dataDetail, setDataDetail] = useState({});
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerType, setDrawerType] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 7,
  });

  const toggleDrawer = (type, dataDrawer) => {
    setOpenDrawer(!openDrawer);
    setDrawerType(type);
    if (type === "Edit") {
      setDataDetail(dataDrawer);
    } else {
      setDataDetail({});
    }
  };

  const handleFilter = (value) => {
    setValue(value);
    const filteredData = requestSearch(value, exampleData);
    setDataListSearch(filteredData);
  };

  const columns = [
    {
      flex: 0.03,
      minWidth: 10,
      field: "id",
      headerName: "ID",
      renderCell: ({ row }) => (
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          {row.id}
        </Typography>
      ),
    },
    {
      flex: 0.05,
      minWidth: 100,
      field: "imageLink",
      headerName: "Image",
      renderCell: ({ row }) => (
        <Box
          sx={{
            width: "100%",
            height: "56px",
            position: "relative",
            display: "inline-block",
            overflow: "hidden",
            margin: 0,
            borderRadius: "10px",
            cursor: "pointer",
            img: {
              display: "block",
              position: "absolute",
              top: "50%",
              left: "50%",
              height: "56px",
              transform: "translate(-50%, -50%) !important",
              borderRadius: "10px",
            },
          }}
        >
          <PhotoProvider>
            <PhotoView src={row?.imageLink}>
              <img src={row?.imageLink} alt="" />
            </PhotoView>
          </PhotoProvider>
        </Box>
      ),
    },
    {
      flex: 0.25,
      minWidth: 230,
      field: "name",
      headerName: "Name",
      renderCell: ({ row }) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="subtitle2" sx={{ color: "text.primary" }}>
            {row.name}
          </Typography>
        </Box>
      ),
    },
    {
      flex: 0.25,
      minWidth: 100,
      field: "ecommerceLink",
      headerName: "E-Commerce Link",
      renderCell: ({ row }) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body2" sx={{ color: "text.primary" }}>
            {row.ecommerceLink}
          </Typography>
          <a target="_blank" href={row.ecommerceLink}>
            <IconButton>
              <Icon icon="mdi:open-in-new" fontSize={20} />
            </IconButton>
          </a>
        </Box>
      ),
    },
    {
      flex: 0.07,
      width: 50,
      sortable: false,
      field: "actions",
      headerName: "Aksi",
      renderCell: ({ row }) => (
        <IconButton onClick={() => toggleDrawer("Edit", row)}>
          <Icon icon="mdi:pencil-outline" fontSize={20} />
        </IconButton>
      ),
    },
  ];

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
                <Typography variant="h6">{type?.title} List</Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <TextField
                    size="small"
                    placeholder={`Cari ${type?.title}`}
                    value={value}
                    onChange={(e) => handleFilter(e.target.value)}
                  />
                  <Button
                    sx={{ ml: 4 }}
                    variant="contained"
                    onClick={() => toggleDrawer("Add", {})}
                  >
                    Add {type?.title}
                  </Button>
                </Box>
              </Box>
            </>
          }
        />
        <CardContent>
          <DataGrid
            autoHeight
            disableColumnMenu
            rows={value ? dataListSearch : exampleData}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[7, 10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </CardContent>
      </Card>
      <EquipmentsDrawer
        open={openDrawer}
        toggle={(type) => toggleDrawer(type, {})}
        type={drawerType}
        dataDetail={dataDetail}
        title={type?.title}
      />
    </>
  );
};

export default EquipmentsListTable;
