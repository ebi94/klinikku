import { jsonToQueryParam } from "src/utils/helpers";

const headers = new Headers();
let userData;
if (typeof window !== "undefined") {
  userData = JSON.parse(localStorage.getItem("userData"));
}
const token = userData?.data?.access_token;
headers.append("Content-Type", "application/json");
headers.append("token", `Bearer ${token}`);

const listRegion = async (
  region,
  province_id,
  city_district_id,
  subdistrict_id
) => {
  const requestOptions = {
    method: "GET",
    headers,
    redirect: "follow",
  };

  const requestBody = {
    region: region,
    province_id: province_id,
    city_district_id: city_district_id,
    subdistrict_id: subdistrict_id,
  };

  return await fetch(
    `/api/region/list?${jsonToQueryParam(requestBody)}`,
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

export { listRegion };
