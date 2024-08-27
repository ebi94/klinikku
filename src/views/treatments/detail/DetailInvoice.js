// ** MUI Imports
import Image from "next/image";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Divider from "@mui/material/Divider";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import { styled, useTheme } from "@mui/material/styles";
import TableContainer from "@mui/material/TableContainer";
import TableCell from "@mui/material/TableCell";

// ** Configs
import themeConfig from "src/configs/themeConfig";
import { fakeDataInvoice } from "src/configs/constans";
import { formatRupiah } from "src/utils/helpers";

const MUITableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 0,
  paddingLeft: "0 !important",
  paddingRight: "0 !important",
  paddingTop: `${theme.spacing(1)} !important`,
  paddingBottom: `${theme.spacing(1)} !important`,
}));

const CalcWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  "&:not(:last-of-type)": {
    marginBottom: theme.spacing(2),
  },
}));

const DetailInvoice = (props) => {
  const { data } = props;

  return (
    <Card>
      <CardContent sx={{ marginLeft: 8, marginRight: 8 }}>
        <Grid container>
          <Grid item sm={6} xs={12} sx={{ mb: { sm: 0, xs: 4 } }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Box sx={{ mb: 6, display: "flex", alignItems: "center" }}>
                <Image src="/images/example-logo.png" width={35} height={35} />
                <Typography
                  variant="h6"
                  sx={{
                    ml: 2.5,
                    fontWeight: 600,
                    lineHeight: "normal",
                    textTransform: "uppercase",
                  }}
                >
                  {themeConfig.templateName}
                </Typography>
              </Box>
              <div>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  PT KlinikKu
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Jakarta, Indonesia
                </Typography>
                <Typography variant="body2">+62 (21) 456 7891</Typography>
              </div>
            </Box>
          </Grid>
          <Grid item sm={6} xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "flex-start", sm: "flex-end" },
              }}
            >
              <Table sx={{ maxWidth: "350px" }}>
                <TableBody>
                  <TableRow>
                    <MUITableCell>
                      <Typography variant="h6">Invoice</Typography>
                    </MUITableCell>
                    <MUITableCell>
                      <Typography variant="h6">{`${data?.invoice_no}`}</Typography>
                    </MUITableCell>
                  </TableRow>
                  <TableRow>
                    <MUITableCell>
                      <Typography variant="body2">Date Issued:</Typography>
                    </MUITableCell>
                    <MUITableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {data?.date}
                      </Typography>
                    </MUITableCell>
                  </TableRow>
                  <TableRow>
                    <MUITableCell>
                      <Typography variant="body2">Date Due:</Typography>
                    </MUITableCell>
                    <MUITableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {data?.date}
                      </Typography>
                    </MUITableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Grid>
        </Grid>
      </CardContent>

      <Divider />

      <CardContent sx={{ marginLeft: 8, marginRight: 8 }}>
        <Grid container>
          <Grid item xs={12} sm={6} sx={{ mb: { lg: 0, xs: 4 } }}>
            <Typography variant="body2" sx={{ mb: 3.5, fontWeight: 600 }}>
              Invoice To:
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {data?.pasien?.name}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {data?.pasien?.complete_address}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {data?.pasien?.phone}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{
              display: "flex",
              justifyContent: ["flex-start", "flex-end"],
            }}
          >
            <div>
              <Typography variant="body2" sx={{ mb: 3.5, fontWeight: 600 }}>
                Bill To:
              </Typography>
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <MUITableCell>Total Due:</MUITableCell>
                      <MUITableCell>
                        {formatRupiah(data?.total_price)}
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>Bank name:</MUITableCell>
                      <MUITableCell>BCA</MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>No Rekening:</MUITableCell>
                      <MUITableCell>12344567</MUITableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </Grid>
        </Grid>
      </CardContent>

      <Divider />

      <TableContainer sx={{ paddingLeft: 8, paddingRight: 8 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nama</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell sx={{ textAlign: "end" }}>Harga Satuan</TableCell>
              <TableCell sx={{ textAlign: "end" }}>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {+data?.items?.length > 0 &&
              data?.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell dangerouslySetInnerHTML={{ __html: item?.name }} />
                  <TableCell>{item?.qty}</TableCell>
                  <TableCell sx={{ textAlign: "end" }}>
                    {formatRupiah(item?.unit_price)}
                    {item?.unit ?? ""}
                  </TableCell>
                  <TableCell sx={{ textAlign: "end" }}>
                    {formatRupiah(item?.total)}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CardContent sx={{ marginLeft: 8, marginRight: 8 }}>
        <Grid container>
          <Grid item xs={12} sm={7} lg={9} sx={{ order: { sm: 1, xs: 2 } }}>
            <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
              <Typography variant="body2" sx={{ mr: 2, fontWeight: 600 }}>
                Perawat:
              </Typography>
              <Typography variant="body2">{data?.created_by}</Typography>
            </Box>

            <Typography variant="body2">
              Terima Kasih, semoga lekas sembuh
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={5}
            lg={3}
            sx={{ mb: { sm: 0, xs: 4 }, order: { sm: 2, xs: 1 } }}
          >
            <CalcWrapper>
              <Typography variant="body2">Sub Total</Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, textAlign: "end" }}
              >
                : {formatRupiah(data?.total_price)}
              </Typography>
            </CalcWrapper>
            <CalcWrapper>
              <Typography variant="body2">Diskon</Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, textAlign: "end" }}
              >
                : (- {formatRupiah(data?.total_price)})
              </Typography>
            </CalcWrapper>
            <CalcWrapper>
              <Typography variant="body2">Pajak (11%)</Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, textAlign: "end" }}
              >
                : {formatRupiah(data?.total_price)}
              </Typography>
            </CalcWrapper>
            <CalcWrapper>
              <Typography variant="body2">Grand Total</Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, textAlign: "end" }}
              >
                : {formatRupiah(data?.total_price)}
              </Typography>
            </CalcWrapper>
            {/* <CalcWrapper>
              <Typography variant="body2">Discount:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                $28
              </Typography>
            </CalcWrapper>
            <CalcWrapper>
              <Typography variant="body2">Tax:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                21%
              </Typography>
            </CalcWrapper>
            <Divider />
            <CalcWrapper>
              <Typography variant="body2">Total:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                $1690
              </Typography>
            </CalcWrapper> */}
          </Grid>
        </Grid>
      </CardContent>

      <Divider />

      <CardContent sx={{ marginLeft: 8, marginRight: 8 }}>
        <Typography variant="body2">
          <strong>Note:</strong> <br />
          {data?.next_visit ? `Kunjungan Berikutnya : ${data?.next_visit}` : ""}
          <br />
          {data?.treatment_status
            ? `Status Perawatan : ${data?.treatment_status}`
            : ""}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DetailInvoice;
