import { jsonToQueryParam } from "src/utils/helpers";

const headers = new Headers();
let userData;
let token;
if (typeof window !== "undefined") {
  userData = JSON.parse(localStorage.getItem("userData"));
}
token = userData?.data?.access_token;
headers.append("Content-Type", "application/json");
headers.append("token", `Bearer ${token}`);

const listOrderTelenursing = async (patientId) => {
  const requestOptions = {
    method: "GET",
    headers,
    redirect: "follow",
  };

  const requestBody = {
    patientId: patientId ?? "",
  };

  return await fetch(
    `/api/order/telenursing/list?${jsonToQueryParam(requestBody)}`,
    requestOptions
  ).then(async (r) => {
    let result;
    try {
      result = await r.json();
    } catch (e) {
      result = {};
    }

    return { ...result };
  });
};

const detailOrderTelenursing = async (id) => {
  const requestOptions = {
    method: "GET",
    headers,
    redirect: "follow",
  };

  return await fetch(
    `/api/order/telenursing/detail?id=${id}`,
    requestOptions
  ).then(async (r) => {
    let result;
    try {
      result = await r.json();
    } catch (e) {
      result = {};
    }

    return { ...result };
  });
};

export { listOrderTelenursing, detailOrderTelenursing };
