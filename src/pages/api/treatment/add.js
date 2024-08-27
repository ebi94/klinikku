import axios from "axios";

export default function handler(req, res) {
  const baseUrl = process.env.NEXT_PUBLIC_URL_SIMK_API;
  const accessToken = req?.headers?.token;

  if (req.method === "POST") {
    const { clinic_id, patient_id, treatment, total_wound, total_eye } =
      req.body;

    if (
      !clinic_id || !patient_id || !treatment || treatment === "Wound"
        ? !total_wound
        : !total_eye
    ) {
      return res
        .status(400)
        .json({ error: "Missing required fields in the request body" });
    }

    const headers = {
      Authorization: accessToken,
    };

    const bodyReq = {
      clinic_id,
      patient_id,
      treatment,
      total_wound,
      total_eye,
      order_id: "",
    };

    const requestOptions = {
      method: "POST",
      url: `${baseUrl}api/backoffice/customers/medical-record/treatment/create`,
      headers,
      data: bodyReq,
      redirect: "follow",
    };

    axios
      .request(requestOptions)
      .then(function (response) {
        return res.status(200).json({
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
          if (errorMessage === "Token has expired") {
            return res.status(401).json({ error: errorMessage, status: 401 });
          }
          return res.status(statusCode).json({
            error: errorMessage,
            err: error,
          });
        } else if (error.request) {
          return res
            .status(500)
            .json({ error: "No response received from the server." });
        } else {
          return res
            .status(500)
            .json({ error: "An unexpected error occurred." });
        }
      });
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
