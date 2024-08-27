export const selectColor = (val) => {
  if (val === "Booked") {
    return "success";
  } else if (val === "Cancelled") {
    return "danger";
  } else if (val === "Paid") {
    return "info";
  } else if (val === "In Progress") {
    return "secondary";
  } else if (val === "Completed") {
    return "success";
  } else if (val === "Assigned") {
    return "warning";
  } else {
    return "secondary";
  }
};

export const jsonToQueryParam = (json) => {
  return Object.entries(json)
    .map((e) => e.join("="))
    .join("&");
};

export const mappingDataOptions = (data, key) => {
  const mappingDataList = data.map((item) => {
    return {
      id: item?.[key],
      value: item?.[key],
      label: item?.name,
      ...item,
    };
  });
  return [...mappingDataList];
};

export const toSnakeCase = (str) => {
  // Replace spaces with underscores and convert all to lowercase
  return str
    .replace(/\s+/g, "_") // Replace spaces with _
    .toLowerCase(); // Convert to lowercase
};

export const formatLabel = (label) => {
  return label
    .split("_") // Memisahkan kata berdasarkan underscore
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Mengubah huruf pertama tiap kata menjadi huruf besar
    .join(" "); // Menggabungkan kata-kata dengan spasi
};

export const formatRupiah = (angka) => {
  angka = angka ?? 0;

  let rupiah = "";
  let angkaRev = angka.toString().split("").reverse().join("");
  for (let i = 0; i < angkaRev.length; i++) {
    if (i % 3 === 0) {
      rupiah += angkaRev.substr(i, 3) + ".";
    }
  }
  return (
    "Rp " +
    rupiah
      .split("", rupiah.length - 1)
      .reverse()
      .join("")
  );
};
