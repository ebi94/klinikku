const baseUrl = process.env.NEXT_PUBLIC_URL_SIMK_API;
const headers = new Headers();
let userData;
if (typeof window !== "undefined") {
  userData = JSON.parse(localStorage.getItem("userData"));
}
const token = userData?.data?.access_token;
headers.append("Content-Type", "application/json");
headers.append("token", `Bearer ${token}`);

const listUser = async () => {
  const requestOptions = {
    method: "GET",
    headers,
    redirect: "follow",
  };

  return await fetch(`/api/users/list`, requestOptions).then(async (r) => {
    let result;
    try {
      result = await r.json();
    } catch (e) {
      result = {};
    }

    return { ...result };
  });
};

const addUser = async (payload) => {
  const headersUpload = new Headers();

  headersUpload.append("Authorization", `Bearer ${token}`);

  const formdata = new FormData();

  if (+payload?.is_nurse === 1) {
    formdata.append("role_id", payload?.role_id);
    formdata.append("username", payload?.username);
    formdata.append("email", payload?.email);
    formdata.append("avatar", payload?.avatar);
    formdata.append("name", payload?.name);
    formdata.append("gender", payload?.gender);
    formdata.append("date_of_birth", payload?.date_of_birth);
    formdata.append("place_of_birth", payload?.place_of_birth);
    formdata.append("phone", payload?.phone);
    formdata.append("is_nurse", payload?.is_nurse);
    formdata.append("is_active", payload?.is_active ? 1 : 0);
    formdata.append("clinic_id", payload?.clinic_id);
    formdata.append("is_clinic_pic", payload?.is_clinic_pic);
    formdata.append("marital_status", payload?.marital_status);
    formdata.append("nik", payload?.nik);
    formdata.append("str", payload?.str);
    formdata.append("file_str", payload?.file_str);
    formdata.append("sipp", payload?.sipp);
    formdata.append("file_sipp", payload?.file_sipp);
    formdata.append("nirappni", payload?.nirappni);
    formdata.append("file_nirappni", payload?.file_nirappni);
    formdata.append("ktainwocna", payload?.ktainwocna);
    formdata.append("file_ktainwocna", payload?.file_ktainwocna);
    formdata.append("npwp", payload?.npwp);
    formdata.append("file_npwp", payload?.file_npwp);
    formdata.append("operational_radius", payload?.operational_radius ?? "");
  } else {
    formdata.append("role_id", payload?.role_id);
    formdata.append("username", payload?.username);
    formdata.append("email", payload?.email);
    formdata.append("avatar", payload?.avatar);
    formdata.append("name", payload?.name);
    formdata.append("gender", payload?.gender);
    formdata.append("date_of_birth", payload?.date_of_birth);
    formdata.append("place_of_birth", payload?.place_of_birth);
    formdata.append("phone", payload?.phone);
    formdata.append("is_nurse", payload?.is_nurse);
    formdata.append("is_active", payload?.is_active ? 1 : 0);
    formdata.append("marital_status", payload?.marital_status);
    formdata.append("nik", payload?.nik);
  }

  const requestOptions = {
    method: "POST",
    headers: headersUpload,
    body: formdata,
    redirect: "follow",
  };

  return await fetch(
    `${baseUrl}/api/backoffice/users/create`,
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

const editUser = async (payload) => {
  const bodyReq = {
    user_id: payload?.user_id,
    role_id: payload?.role_id,
    email: payload?.email,
    avatar: payload?.avatar,
    name: payload?.name,
    gender: payload?.gender,
    date_of_birth: payload?.date_of_birth,
    is_active: payload?.is_active,
  };

  const requestOptions = {
    method: "PUT",
    headers,
    body: JSON.stringify(bodyReq),
    redirect: "follow",
  };

  return await fetch(`/api/users/edit/`, requestOptions).then(async (r) => {
    let result;
    try {
      result = await r.json();
    } catch (e) {
      result = {};
    }

    return { ...result };
  });
};

const detailUser = async (id) => {
  const requestOptions = {
    method: "GET",
    headers,
    redirect: "follow",
  };

  return await fetch(`/api/users/detail?id=${id}`, requestOptions).then(
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

const updateUser = async (slug) => {
  const requestOptions = {
    method: "GET",
    headers,
    redirect: "follow",
  };

  return await fetch(`${baseUrl}/api/acv/blog/${slug}`, requestOptions).then(
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

const deleteUser = async (slug) => {
  const requestOptions = {
    method: "GET",
    headers,
    redirect: "follow",
  };

  return await fetch(`${baseUrl}/api/acv/blog/${slug}`, requestOptions).then(
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

export { listUser, addUser, editUser, detailUser, updateUser, deleteUser };
