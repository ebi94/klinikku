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

const listOrderHomecare = async (patientId) => {
  const requestOptions = {
    method: "GET",
    headers,
    redirect: "follow",
  };

  const requestBody = {
    patientId: patientId ?? "",
  };

  return await fetch(
    `/api/order/homecare/list?${jsonToQueryParam(requestBody)}`,
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

const detailOrderHomecare = async (id) => {
  const requestOptions = {
    method: "GET",
    headers,
    redirect: "follow",
  };

  return await fetch(
    `/api/order/homecare/detail?id=${id}`,
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

const updateStatusOrderHomecare = async (id, payload) => {
  const requestOptions = {
    method: "PUT",
    headers,
    body: JSON.stringify(payload),
    redirect: "follow",
  };

  return await fetch(
    `/api/order/homecare/updateStatus?id=${id}`,
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

const createOrderHomecare = async (payload) => {
  const requestOptions = {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
    redirect: "follow",
  };

  return await fetch(`/api/order/homecare/add`, requestOptions).then(
    async (r) => {
      let result;
      try {
        result = await r.json();
      } catch (e) {
        result = await r.json();
      }

      return { ...result, err: "123" };
    }
  );
};

export {
  listOrderHomecare,
  detailOrderHomecare,
  updateStatusOrderHomecare,
  createOrderHomecare,
};
