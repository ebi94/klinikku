import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import TypographyInfoDetail from "src/views/ui/typography/TypographyInfoDetail";
import DividerText from "src/views/components/divider/DividerText";
import { Divider, Typography } from "@mui/material";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";

const DetailWoundNursingActions = ({ data }) => {
  console.log("data", data);
  const desktopView = useMediaQuery("(min-width:600px)");

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      {data.map((item, index) => (
        <React.Fragment key={index}>
          <DividerText label={item?.parent_name} />
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            {+item?.parent_id === 1 ? (
              <>
                <Grid item xs={12} sm={6} sx={{ paddingLeft: 20 }}>
                  {+item?.child?.length > 0 &&
                    item.child.map((itemChild) => {
                      return itemChild?.selected ? (
                        <Typography variant="h6">
                          - {itemChild?.child_name}
                        </Typography>
                      ) : null;
                    })}
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={12} sm={12} sx={{ paddingLeft: 20 }}>
                  <Grid container spacing={2} sx={{ marginTop: 2 }}>
                    <div style={{ marginLeft: 10, width: "100%" }}>
                      <ol>
                        {+item?.child?.length > 0 &&
                          item.child.map((item, index) => (
                            <li key={index}>
                              <Typography
                                variant="subtitle1"
                                sx={{ marginTop: 4, fontWeight: 800 }}
                              >
                                {item?.child_name}
                              </Typography>
                              <ol>
                                {+item?.sub_child.length > 0 &&
                                  item?.sub_child.map((itemChild) => (
                                    <li type="a">
                                      <TableContainer
                                        component={Paper}
                                        key={itemChild?.title}
                                      >
                                        <Box
                                          sx={{
                                            display: "flex",
                                            marginLeft: 2,
                                            width: "100%",
                                            alignItems: "center",
                                          }}
                                        >
                                          <Typography
                                            variant="subtitle1"
                                            sx={{
                                              width: "auto",
                                              marginRight: 4,
                                              fontWeight: 600,
                                            }}
                                          >
                                            {itemChild?.sub_child_name}
                                          </Typography>
                                          <Typography variant="subtitle2">
                                            : {itemChild?.text_value}
                                          </Typography>
                                        </Box>
                                        {+itemChild?.grand_child.length > 0 && (
                                          <Table
                                            sx={{
                                              marginBottom: 6,
                                              marginLeft: 8,
                                            }}
                                          >
                                            <TableBody>
                                              {itemChild?.grand_child.map(
                                                (itemSubChild, index) => (
                                                  <TableRow key={index}>
                                                    <TableCell
                                                      sx={{
                                                        width: "20%",
                                                        padding: 2,
                                                        fontWeight: 600,
                                                      }}
                                                      component="th"
                                                      scope="row"
                                                    >
                                                      {index + 1}.{" "}
                                                      {
                                                        itemSubChild?.grand_child_name
                                                      }
                                                    </TableCell>
                                                    <TableCell
                                                      sx={{
                                                        width: "1%",
                                                        padding: 2,
                                                      }}
                                                    >
                                                      :
                                                    </TableCell>
                                                    <TableCell
                                                      align="left"
                                                      sx={{ padding: 2 }}
                                                    >
                                                      {itemSubChild?.text_value}
                                                    </TableCell>
                                                  </TableRow>
                                                )
                                              )}
                                            </TableBody>
                                          </Table>
                                        )}{" "}
                                      </TableContainer>
                                    </li>
                                  ))}
                              </ol>
                            </li>
                          ))}
                      </ol>
                    </div>
                  </Grid>
                </Grid>
              </>
            )}
          </Grid>
          <Box sx={{ mb: 6 }} />
          {/* <WoundCareForm /> */}
        </React.Fragment>
      ))}
    </Box>
  );
};

export default DetailWoundNursingActions;
