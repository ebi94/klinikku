const headers = new Headers();
let userData;
if (typeof window !== "undefined") {
  userData = JSON.parse(localStorage.getItem("userData"));
}
const token = userData?.data?.access_token;
headers.append("Content-Type", "application/json");
headers.append("token", `Bearer ${token}`);

const addCustomer = async (payload) => {
  const bodyReq = {
    // Data Pasien
    nik: payload?.nik,
    name: payload?.name,
    phone: payload?.phone,
    email: payload?.email,
    gender: payload?.gender,
    date_of_birth: payload?.date_of_birth,
    province_id: payload?.province_id,
    city_district_id: payload?.city_district_id,
    subdistrict_id: payload?.subdistrict_id,
    village_subdistrict_id: payload?.village_subdistrict_id,
    complete_address: payload?.complete_address,
    clinic_id: payload?.clinic_id,
    // Data Wali
    nik_wali: payload?.nik_wali,
    name_wali: payload?.name_wali,
    phone_wali: payload?.phone_wali,
    email_wali: payload?.email_wali,
    gender_wali: payload?.gender_wali,
    date_of_birth_wali: payload?.date_of_birth_wali,
    province_id_wali: payload?.province_id_wali,
    city_district_id_wali: payload?.city_district_id_wali,
    subdistrict_id_wali: payload?.subdistrict_id_wali,
    village_subdistrict_id_wali: payload?.village_subdistrict_id_wali,
    complete_address_wali: payload?.complete_address_wali,
    relationship: payload?.relationship,
  };

  const requestOptions = {
    method: "POST",
    headers,
    body: JSON.stringify(bodyReq),
    redirect: "follow",
  };

  return await fetch(`/api/customers/add`, requestOptions).then(async (r) => {
    let result;
    try {
      result = await r.json();
    } catch (e) {
      result = {};
    }

    return { ...result };
  });
};

const listCustomer = async () => {
  const requestOptions = {
    method: "GET",
    headers,
    redirect: "follow",
  };

  return await fetch(`/api/customers/list`, requestOptions).then(async (r) => {
    let result;
    try {
      result = await r.json();
    } catch (e) {
      result = {};
    }

    return { ...result };
  });
};

const detailCustomer = async (id) => {
  const requestOptions = {
    method: "GET",
    headers,
    redirect: "follow",
  };

  return await fetch(`/api/customers/detail?id=${id}`, requestOptions).then(
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

export { addCustomer, listCustomer, detailCustomer };
