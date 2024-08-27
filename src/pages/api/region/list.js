import axios from "axios";
import { jsonToQueryParam } from "src/utils/helpers";

export default function handler(req, res) {
  const baseUrl = process.env.NEXT_PUBLIC_URL_SIMK_API;
  const accessToken = req?.headers?.token;

  if (req.method === "GET") {
    const headers = {
      Authorization: accessToken,
    };

    const { searchParams } = new URL(`${baseUrl}${req.url}`);
    const region = searchParams.get("region");
    const province_id = searchParams.get("province_id");
    const city_district_id = searchParams.get("city_district_id");
    const subdistrict_id = searchParams.get("subdistrict_id");

    const requestBody = {
      region: region,
      province_id: province_id,
      city_district_id: city_district_id,
      subdistrict_id: subdistrict_id,
    };

    const requestOptions = {
      method: "GET",
      url: `${baseUrl}api/backoffice/region/list?${jsonToQueryParam(
        requestBody
      )}`,
      headers,
      redirect: "follow",
    };

    axios
      .request(requestOptions)
      .then(function (response) {
        res.status(200).json({
          result: {
            status: response?.status,
            data: response?.data?.data,
            message: response?.data?.message,
          },
        });
      })
      .catch(function (error) {
        if (error.response) {
          const errorMessage =
            error?.message || "An error occurred during the request.";
          const statusCode = error?.response?.status || 500;
          res.status(statusCode).json({ error: errorMessage });
        } else if (error.request) {
          res
            .status(500)
            .json({ error: "No response received from the server." });
        } else {
          res.status(500).json({ error: "An unexpected error occurred." });
        }
      });
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
