const headers = new Headers();
let userData;
if (typeof window !== "undefined") {
  userData = JSON.parse(localStorage.getItem("userData"));
}
const token = userData?.data?.access_token;
headers.append("Content-Type", "application/json");
headers.append("token", `Bearer ${token}`);

const listClinic = async () => {
  const requestOptions = {
    method: "GET",
    headers,
    redirect: "follow",
  };

  return await fetch(`/api/clinics/list`, requestOptions).then(async (r) => {
    let result;
    try {
      result = await r.json();
    } catch (e) {
      result = {};
    }

    return { ...result };
  });
};

const detailClinic = async (id) => {
  const requestOptions = {
    method: "GET",
    headers,
    redirect: "follow",
  };

  return await fetch(`/api/clinics/detail?id=${id}`, requestOptions).then(
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

const addClinic = async (payload) => {
  const bodyReq = {
    code: payload?.code,
    name: payload?.name,
    complete_address: payload?.complete_address,
    province_id: payload?.province_id,
    city_district_id: payload?.city_district_id,
    subdistrict_id: payload?.subdistrict_id,
    village_subdistrict_id: payload?.village_subdistrict_id,
    phone: payload?.phone,
    latitude: payload?.latitude,
    longitude: payload?.longitude,
    map_links: payload?.map_links,
    operational_hours: payload?.operational_hours,
    facility: payload?.facility,
  };

  const requestOptions = {
    method: "POST",
    headers,
    body: JSON.stringify(bodyReq),
    redirect: "follow",
  };

  return await fetch(`/api/clinics/add`, requestOptions).then(async (r) => {
    let result;
    try {
      result = await r.json();
    } catch (e) {
      result = {};
    }

    return { ...result };
  });
};

const editClinic = async (payload) => {
  const bodyReq = {
    code: payload?.code,
    name: payload?.name,
    complete_address: payload?.complete_address,
    province_id: payload?.province_id,
    city_district_id: payload?.city_district_id,
    subdistrict_id: payload?.subdistrict_id,
    village_subdistrict_id: payload?.village_subdistrict_id,
    phone: payload?.phone,
    latitude: payload?.latitude,
    longitude: payload?.longitude,
    map_links: payload?.map_links,
    operational_hours: payload?.operational_hours,
    facility: payload?.facility,
  };

  const requestOptions = {
    method: "PUT",
    headers,
    body: JSON.stringify(bodyReq),
    redirect: "follow",
  };

  return await fetch(`/api/clinics/edit`, requestOptions).then(async (r) => {
    let result;
    try {
      result = await r.json();
    } catch (e) {
      result = {};
    }

    return { ...result };
  });
};

export { listClinic, detailClinic, addClinic, editClinic };
