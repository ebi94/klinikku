import axios from "axios";

export default function handler(req, res) {
  const baseUrl = process.env.NEXT_PUBLIC_URL_SIMK_API;
  const accessToken = req?.headers?.token;

  if (req.method === "POST") {
    const {
      // Data Pasien
      nik,
      name,
      phone,
      email,
      gender,
      date_of_birth,
      province_id,
      city_district_id,
      subdistrict_id,
      village_subdistrict_id,
      complete_address,
      clinic_id,
      // Data Wali
      nik_wali,
      name_wali,
      phone_wali,
      email_wali,
      gender_wali,
      date_of_birth_wali,
      province_id_wali,
      city_district_id_wali,
      subdistrict_id_wali,
      village_subdistrict_id_wali,
      complete_address_wali,
      relationship,
    } = req.body;

    if (
      // Data Pasien
      !nik ||
      !name ||
      !phone ||
      !email ||
      !gender ||
      !date_of_birth ||
      !province_id ||
      !city_district_id ||
      !subdistrict_id ||
      !village_subdistrict_id ||
      !complete_address ||
      !clinic_id ||
      // Data Wali
      !nik_wali ||
      !name_wali ||
      !phone_wali ||
      !email_wali ||
      !gender_wali ||
      !date_of_birth_wali ||
      !province_id_wali ||
      !city_district_id_wali ||
      !subdistrict_id_wali ||
      !village_subdistrict_id_wali ||
      !complete_address_wali ||
      !relationship
    ) {
      return res
        .status(400)
        .json({ error: "Missing required fields in the request body" });
    }

    const headers = {
      Authorization: accessToken,
    };

    const bodyReq = {
      // Data Pasien
      nik,
      name,
      phone,
      email,
      gender,
      date_of_birth,
      province_id,
      city_district_id,
      subdistrict_id,
      village_subdistrict_id,
      complete_address,
      clinic_id,
      // Data Wali
      nik_wali,
      name_wali,
      phone_wali,
      email_wali,
      gender_wali,
      date_of_birth_wali,
      province_id_wali,
      city_district_id_wali,
      subdistrict_id_wali,
      village_subdistrict_id_wali,
      complete_address_wali,
      relationship,
      wali_main_user: false,
    };

    const requestOptions = {
      method: "POST",
      url: `${baseUrl}api/backoffice/customers/create`,
      headers,
      data: bodyReq,
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
        console.error(error);
        if (error.response) {
          const errorMessage =
            error?.message || "An error occurred during the request.";
          const statusCode = error?.response?.status || 500;
          if (errorMessage === "Token has expired") {
            res.status(401).json({ error: errorMessage, status: 401 });
          }
          res.status(statusCode).json({ error: errorMessage, errorlag: error });
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
