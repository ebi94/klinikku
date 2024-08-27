import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CircularProgress from "@mui/material/CircularProgress";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "src/hooks/useAuth";
import Icon from "src/@core/components/icon";
import {
  addPermission,
  editPermission,
  listPermission,
} from "src/services/permissions";

const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field} harus diisi !`;
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`;
  } else {
    return "";
  }
};

const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(3, 4),
  justifyContent: "space-between",
  backgroundColor: theme.palette.background.default,
}));

const schema = yup.object().shape({
  name: yup
    .string()
    .min(3, (obj) => showErrors("Name", obj.value.length, obj.min))
    .required(),
});

const AddRoleDrawer = (props) => {
  // ** Props
  const { open, toggle, type, dataDetail, onRefresh } = props;
  console.log("dataDetail", dataDetail);

  // ** State
  const [loading, setLoading] = useState(false);
  const [permissionList, setPermissionList] = useState([]);
  const [menuData, setMenuData] = useState([]);

  const { logout } = useAuth();

  const defaultValues = {
    name: "",
  };

  const handleSelectAllCheckbox = () => {};

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onReset = () => {
    reset({ name: "" });
  };

  const onSubmit = async (data) => {
    console.log("data", data);
    setLoading(true);

    const payload = {
      name: data?.name,
      permission: menuData,
    };

    const payloadEdit = {
      role_id: dataDetail?.role_id,
      name: data?.name,
    };

    if (type === "Add") {
      const res = await addPermission(payload);
      if (+res?.result?.status === 201) {
        setLoading(false);
        toast.success("Created Role Successfully");
        onReset();
        toggle();
        onRefresh();
      } else {
        setLoading(false);
        toast.error(`Opps ! ${res?.error}`);
      }
    } else {
      const res = await editPermission(payloadEdit);
      if (+res?.result?.status === 200) {
        setLoading(false);
        toast.success("Updated Success");
        onReset();
        toggle();
        onRefresh();
      } else {
        setLoading(false);
        toast.error(`Opps ! ${res?.error}`);
      }
    }
  };

  const handleClose = () => {
    setValue("name", "");
    toggle();
    onReset();
  };

  const fetchPemissionsList = async () => {
    const res = await listPermission();
    if (+res?.result?.status === 200) {
      const data = res?.result?.data !== null ? res?.result?.data : [];

      const mappingDataList = data.map((item) => {
        return {
          id: item?.menu_id,
          ...item,
        };
      });

      const mappingDataMenu = data.map((item) => {
        return {
          menu_id: `${item?.menu_id}`,
          create: false,
          read: false,
          update: false,
          delete: false,
        };
      });
      setPermissionList(mappingDataList);
      setMenuData(mappingDataMenu);
    } else {
      setLoading(false);
      toast.error(`Opps ! ${res?.error} `);
      if (+res?.status === 401) {
        logout();
      }
    }
  };

  const togglePermission = (e, value) => {
    let tempMenuData = [...menuData];
    const [menuId, action] = e.split("-");
    const actionValue = action.toLowerCase();

    const crudData = () => {
      switch (actionValue) {
        case "create":
          return {
            read: false,
            update: false,
            delete: false,
          };
        case "read":
          return {
            create: false,
            update: false,
            delete: false,
          };
        case "update":
          return {
            create: false,
            read: false,
            delete: false,
          };
        case "delete":
          return {
            create: false,
            read: false,
            update: false,
          };
      }
    };

    const data = crudData();

    const newMenuData = {
      menu_id: `${menuId}`,
      [actionValue]: value,
      ...data,
    };

    const checkMenuId = menuData.filter((item) => +item?.menu_id === +menuId);
    if (+checkMenuId?.length > 0) {
      const updatedData = menuData.map((menu) => {
        if (+menu.menu_id === +menuId) {
          switch (actionValue) {
            case "create":
              return {
                ...menu,
                create: value,
              };
            case "read":
              return {
                ...menu,
                read: value,
              };
            case "update":
              return {
                ...menu,
                update: value,
              };
            case "delete":
              return {
                ...menu,
                delete: value,
              };
          }
        } else {
          return menu;
        }
      });
      tempMenuData = updatedData;
    } else {
      tempMenuData = [...menuData, newMenuData];
    }
    setMenuData(tempMenuData);
  };

  useEffect(() => {
    if (dataDetail !== undefined && type === "Edit") {
      setValue("name", dataDetail?.name ?? "");

      const mappingDataList = dataDetail?.permission.map((item) => {
        return {
          id: item?.menu_id,
          ...item,
          ...item?.access,
        };
      });
      console.log("mappingDataList", mappingDataList);

      const mappingDataMenu = dataDetail?.permission.map((item) => {
        return {
          menu_id: `${item?.menu_id}`,
          create: false,
          read: false,
          update: false,
          delete: false,
        };
      });
      setPermissionList(mappingDataList);
      setMenuData(mappingDataMenu);
    }
  }, [dataDetail, type, setValue]);

  useEffect(() => {
    fetchPemissionsList();
  }, []);

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        "& .MuiDrawer-paper": { width: { xs: 300, sm: "calc(100vw - 270px)" } },
      }}
    >
      <Header>
        <Typography variant="h6">{type} Role</Typography>
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{ color: "text.primary" }}
        >
          <Icon icon="mdi:close" fontSize={20} />
        </IconButton>
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 6, mt: 3 }} size="small">
            <Controller
              name="name"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  size="small"
                  InputLabelProps={type !== "Add" ? { shrink: true } : {}}
                  value={value}
                  label="Name"
                  onChange={onChange}
                  placeholder="Name"
                  disabled={loading}
                  error={Boolean(errors.name)}
                />
              )}
            />
            {errors.name && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.name.message}
              </FormHelperText>
            )}
          </FormControl>
          <Box>
            <Typography variant="h6">Role Permissions</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ pl: "0 !important" }}>
                      <Box
                        sx={{
                          display: "flex",
                          fontSize: "0.875rem",
                          whiteSpace: "nowrap",
                          alignItems: "center",
                          textTransform: "capitalize",
                          "& svg": { ml: 1, cursor: "pointer" },
                        }}
                      >
                        Administrator Access
                        <Tooltip
                          placement="top"
                          title="Allows a full access to the system"
                        >
                          <Box sx={{ display: "flex" }}>
                            <Icon
                              icon="mdi:information-outline"
                              fontSize="1rem"
                            />
                          </Box>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell colSpan={3}>
                      <FormControlLabel
                        label="Select All"
                        sx={{
                          "& .MuiTypography-root": {
                            textTransform: "capitalize",
                          },
                        }}
                        control={
                          <Checkbox
                            size="small"
                            onChange={handleSelectAllCheckbox}
                            disabled={loading}
                          />
                        }
                      />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {permissionList.map((i) => (
                    <TableRow
                      key={i?.id}
                      sx={{
                        "& .MuiTableCell-root:first-of-type": {
                          pl: "0 !important",
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                          color: (theme) =>
                            `${theme.palette.text.primary} !important`,
                        }}
                      >
                        {i?.title}
                      </TableCell>
                      <TableCell>
                        <FormControlLabel
                          label="Buat"
                          value={true}
                          control={
                            <Checkbox
                              size="small"
                              disabled={loading}
                              id={`${i?.id}-Buat`}
                              onChange={(e) =>
                                togglePermission(
                                  `${i?.id}-Buat`,
                                  e.target.checked
                                )
                              }
                              inputProps={{ "aria-label": "controlled" }}
                              defaultChecked={i?.create}
                            />
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <FormControlLabel
                          label="Read"
                          control={
                            <Checkbox
                              size="small"
                              disabled={loading}
                              id={`${i?.id}-Read`}
                              onChange={(e) =>
                                togglePermission(
                                  `${i?.id}-Read`,
                                  e.target.checked
                                )
                              }
                              checked={i?.read}
                              inputProps={{ "aria-label": "controlled" }}

                              // defaultChecked={i?.read}
                            />
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <FormControlLabel
                          label="Update"
                          control={
                            <Checkbox
                              size="small"
                              disabled={loading}
                              id={`${i?.id}-Update`}
                              onChange={(e) =>
                                togglePermission(
                                  `${i?.id}-Update`,
                                  e.target.checked
                                )
                              }
                              checked={i?.update}
                              inputProps={{ "aria-label": "controlled" }}

                              // defaultChecked={i?.update}
                            />
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <FormControlLabel
                          label="Delete"
                          control={
                            <Checkbox
                              size="small"
                              disabled={loading}
                              id={`${i?.id}-Delete`}
                              onChange={(e) =>
                                togglePermission(
                                  `${i?.id}-Delete`,
                                  e.target.checked
                                )
                              }
                              checked={i?.delete}
                              inputProps={{ "aria-label": "controlled" }}

                              // defaultChecked={i?.delete}
                            />
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Grid container spacing={3} sx={{ mt: 3 }}>
            <Grid item md={3} xs={12}>
              <Button
                size="small"
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item md={3} xs={12}></Grid>
            <Grid item md={3} xs={12}></Grid>
            <Grid item md={3} xs={12}>
              <Button
                size="small"
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={25} />
                ) : (
                  <>{type === "Add" ? "Save" : "Edit"}</>
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Drawer>
  );
};

export default AddRoleDrawer;
