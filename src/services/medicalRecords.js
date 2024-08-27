const baseUrl = process.env.NEXT_PUBLIC_URL_SIMK_API;
const headers = new Headers();
let userData;
if (typeof window !== "undefined") {
  userData = JSON.parse(localStorage.getItem("userData"));
}
const token = userData?.data?.access_token;
headers.append("Content-Type", "application/json");
headers.append("token", `Bearer ${token}`);

const addGeneralAssestment = async (payload) => {
  const bodyReq = {
    treatment_id: payload?.treatment_id,
    clinic_id: payload?.clinic_id,
    is_new: payload?.is_new,
    date: payload?.date,
    main_complaint: payload?.main_complaint,
    history_of_injury: payload?.history_of_injury,
    concomitant_disease: payload?.concomitant_disease,
    nutrition: payload?.nutrition,
    physical_condition: payload?.physical_condition,
    triage: payload?.triage,
    gds: payload?.gds,
  };

  const requestOptions = {
    method: "POST",
    headers,
    body: JSON.stringify(bodyReq),
    redirect: "follow",
  };

  return await fetch(
    `/api/medicalRecords/generalAssestment/add`,
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

// const addSupportingData = async (payload) => {
//   const bodyReq = {
//     treatment_id: payload?.treatment_id,
//     supporting_data: payload?.supporting_data,
//   };

//   const requestOptions = {
//     method: "POST",
//     headers,
//     body: JSON.stringify(bodyReq),
//     redirect: "follow",
//   };

//   return await fetch(
//     `/api/medicalRecords/supportingData/add`,
//     requestOptions
//   ).then(async (r) => {
//     let result;
//     try {
//       result = await r.json();
//     } catch (e) {
//       result = {};
//     }

//     return { ...result };
//   });
// };

const addMedicalRecords = async (payload) => {
  const bodyReq = {
    name: payload?.name,
    nik: payload?.nik,
    phone: payload?.phone,
    email: payload?.email,
    gender: payload?.gender,
    date_of_birth: payload?.date_of_birth,
    address: payload?.address,
    clinic_id: payload?.clinic_id,
  };

  const requestOptions = {
    method: "POST",
    headers,
    body: JSON.stringify(bodyReq),
    redirect: "follow",
  };

  return await fetch(`/api/customer/add`, requestOptions).then(async (r) => {
    let result;
    try {
      result = await r.json();
    } catch (e) {
      result = {};
    }

    return { ...result };
  });
};

const listMedicalRecords = async () => {
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

const detailMedicalRecords = async (id) => {
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

const getWoundAssestmentList = async (tkn) => {
  const requestOptions = {
    method: "GET",
    headers,
    redirect: "follow",
  };

  return await fetch(
    `/api/medicalRecords/woundAssestment/listQuestions`,
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

const addWoundAssestment = async (payload) => {
  const bodyReq = {
    treatment_id: payload?.treatment_id,
    wound_assessment: payload?.wound_assessment,
  };

  const requestOptions = {
    method: "POST",
    headers,
    body: JSON.stringify(bodyReq),
    redirect: "follow",
  };

  return await fetch(
    `/api/medicalRecords/woundAssestment/add`,
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

const addWoundAssestmentFile = async (payload) => {
  const headersUpload = new Headers();

  headersUpload.append("Authorization", `Bearer ${token}`);

  const formData = new FormData();
  formData.append(`assessment_id`, payload?.assessment_id);
  payload?.files.map((item, index) => {
    item?.files?.map((itemChild, indexChild) => {
      formData.append(
        `wound_image[${index}][${indexChild}]`,
        itemChild.file[0]
      );
    });
  });

  const requestOptions = {
    method: "POST",
    headers: headersUpload,
    body: formData,
    redirect: "follow",
  };

  return await fetch(
    `${baseUrl}api/backoffice/customers/medical-record/wound-assessment/wound-image`,
    requestOptions
  ).then(async (r) => {
    let result;
    try {
      result = await r.json();
    } catch (e) {
      result = {};
    }

    return { result };
  });
};

const addWoundDiagnose = async (payload) => {
  const bodyReq = {
    treatment_id: payload?.treatment_id,
    wound_diagnose: payload?.wound_diagnose,
  };

  const requestOptions = {
    method: "POST",
    headers,
    body: JSON.stringify(bodyReq),
    redirect: "follow",
  };

  return await fetch(
    `/api/medicalRecords/woundDiagnose/add`,
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

const addWoundNursingActions = async (payload) => {
  const bodyReq = {
    treatment_id: payload?.treatment_id,
    wound_nursing_actions: payload?.wound_nursing_actions,
  };

  const requestOptions = {
    method: "POST",
    headers,
    body: JSON.stringify(bodyReq),
    redirect: "follow",
  };

  return await fetch(
    `/api/medicalRecords/woundNursingActions/add`,
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

const addWoundEducation = async (payload) => {
  const bodyReq = {
    treatment_id: payload?.treatment_id,
    etiology_progress: payload?.etiology_progress,
    medication: payload?.medication,
    nutrition: payload?.nutrition,
    activity_lifestyle: payload?.activity_lifestyle,
  };

  const requestOptions = {
    method: "POST",
    headers,
    body: JSON.stringify(bodyReq),
    redirect: "follow",
  };

  return await fetch(
    `/api/medicalRecords/woundEducation/add`,
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

const addSupportingData = async (payload) => {
  const headersUpload = new Headers();

  headersUpload.append("Authorization", `Bearer ${token}`);

  const formData = new FormData();

  formData.append("treatment_id", payload?.treatment_id);
  formData.append("imaging", payload?.imaging);
  formData.append("lab_result", payload?.lab_result);
  formData.append("vascular_testing", payload?.vascular_testing);
  formData.append("culture_result", payload?.culture_result);

  const requestOptions = {
    method: "POST",
    headers: headersUpload,
    body: formData,
    redirect: "follow",
  };

  return await fetch(
    `${baseUrl}api/backoffice/customers/medical-record/wound-supporting-data/create`,
    requestOptions
  ).then(async (r) => {
    let result;
    try {
      result = await r.json();
    } catch (e) {
      result = {};
    }

    return { result };
  });
};

const calculatePriceInvoice = async (payload) => {
  const bodyReq = { ...payload };

  const requestOptions = {
    method: "POST",
    headers,
    body: JSON.stringify(bodyReq),
    redirect: "follow",
  };

  return await fetch(
    `/api/medicalRecords/invoice/calculatePrice`,
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

const detailGeneralAssestment = async (id, nurseId) => {
  const requestOptions = {
    method: "GET",
    headers,
    redirect: "follow",
  };

  return await fetch(
    `/api/medicalRecords/generalAssestment/detail?id=${id}&nurseId=${nurseId}`,
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

const detailWoundAssestment = async (id, nurseId) => {
  const requestOptions = {
    method: "GET",
    headers,
    redirect: "follow",
  };

  return await fetch(
    `/api/medicalRecords/woundAssestment/detail?id=${id}&nurseId=${nurseId}`,
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

const detailWoundDiagnose = async (id, nurseId) => {
  const requestOptions = {
    method: "GET",
    headers,
    redirect: "follow",
  };

  return await fetch(
    `/api/medicalRecords/woundDiagnose/detail?id=${id}&nurseId=${nurseId}`,
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

const detailSupportingData = async (id, nurseId) => {
  const requestOptions = {
    method: "GET",
    headers,
    redirect: "follow",
  };

  return await fetch(
    `/api/medicalRecords/supportingData/detail?id=${id}&nurseId=${nurseId}`,
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

const detailWoundNursingActions = async (id, nurseId) => {
  const requestOptions = {
    method: "GET",
    headers,
    redirect: "follow",
  };

  return await fetch(
    `/api/medicalRecords/woundNursingActions/detail?id=${id}&nurseId=${nurseId}`,
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

const detailInvoice = async (id, nurseId) => {
  const requestOptions = {
    method: "GET",
    headers,
    redirect: "follow",
  };

  return await fetch(
    `/api/medicalRecords/invoice/detail?id=${id}&nurseId=${nurseId}`,
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

const detailWoundEducation = async (id, nurseId) => {
  const requestOptions = {
    method: "GET",
    headers,
    redirect: "follow",
  };

  return await fetch(
    `/api/medicalRecords/woundEducation/detail?id=${id}&nurseId=${nurseId}`,
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

const updateInvoice = async (payload) => {
  const bodyReq = { ...payload };

  const requestOptions = {
    method: "PUT",
    headers,
    body: JSON.stringify(bodyReq),
    redirect: "follow",
  };

  return await fetch(`/api/medicalRecords/invoice/update`, requestOptions).then(
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

export {
  addGeneralAssestment,
  addSupportingData,
  addWoundDiagnose,
  addWoundNursingActions,
  addWoundEducation,
  addMedicalRecords,
  addWoundAssestmentFile,
  calculatePriceInvoice,
  listMedicalRecords,
  detailMedicalRecords,
  detailGeneralAssestment,
  detailWoundAssestment,
  detailWoundDiagnose,
  detailSupportingData,
  detailWoundNursingActions,
  detailWoundEducation,
  detailInvoice,
  getWoundAssestmentList,
  addWoundAssestment,
  updateInvoice,
};
