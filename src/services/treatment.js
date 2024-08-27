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

const listTreatment = async (id) => {
  const requestOptions = {
    method: "GET",
    headers,
    redirect: "follow",
  };

  return await fetch(`/api/treatment/list?id=${id}`, requestOptions).then(
    async (r) => {
      let result;
      try {
        result = await r.json();
      } catch (e) {
        result = {};
      }

      return { ...result };
    }
  );
};

const detailTreatment = async (id) => {
  const requestOptions = {
    method: "GET",
    headers,
    redirect: "follow",
  };

  return await fetch(`/api/treatment/detail?id=${id}`, requestOptions).then(
    async (r) => {
      let result;
      try {
        result = await r.json();
      } catch (e) {
        result = {};
      }

      return { ...result };
    }
  );
};

const createTreatment = async (payload) => {
  const requestOptions = {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
    redirect: "follow",
  };

  return await fetch(`/api/treatment/add`, requestOptions).then(async (r) => {
    let result;
    try {
      result = await r.json();
    } catch (e) {
      result = {};
    }

    return { ...result };
  });
};

export { listTreatment, detailTreatment, createTreatment };
