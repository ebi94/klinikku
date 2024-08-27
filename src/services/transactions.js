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

const listTransactions = async () => {
  const requestOptions = {
    method: "GET",
    headers,
    redirect: "follow",
  };

  return await fetch(`/api/transactions/list`, requestOptions).then(
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

const detailTransactions = async (id) => {
  const requestOptions = {
    method: "GET",
    headers,
    redirect: "follow",
  };

  return await fetch(`/api/transactions/detail?id=${id}`, requestOptions).then(
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

export { listTransactions, detailTransactions };
