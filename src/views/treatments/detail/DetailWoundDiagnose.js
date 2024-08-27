import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import TypographyInfoDetail from "src/views/ui/typography/TypographyInfoDetail";
import DividerText from "src/views/components/divider/DividerText";

const DetailWoundDiagnose = ({ data }) => {
  const desktopView = useMediaQuery("(min-width:600px)");

  // Function to find the first selected item's property.
  const getSelectedProperty = (items, property) => {
    const names = [];
    items.forEach((section) => {
      section.value.forEach((item) => {
        if (item.selected === true) {
          // Ganti "1" dengan true jika struktur data Anda menggunakan boolean
          names.push(`${item.name} (${item?.sdki})`);
        }
      });
    });
    return names.length > 0 ? names.join(", ") : "-";
  };

  // Function to render sub-section based on 'key' (either 'icd10' or 'sub_child').
  const renderSubsection = (children, key) => {
    const selectedChildName = getSelectedProperty(children, "child_name");
    const subData = children.find(
      (child) => child.child_name === selectedChildName
    )?.[key];

    if (subData?.length > 0) {
      const label = key === "icd10" ? "ICD 10" : "Kategori";
      const description = getSelectedProperty(
        subData,
        key === "icd10" ? "category" : "sub_child_name"
      );

      return (
        <Box sx={{ marginLeft: 10 }}>
          <TypographyInfoDetail
            data={{ label, widthLabel: "auto", description }}
          />
        </Box>
      );
    }
    return null;
  };

  const renderChildSubsection = (children, key) => {
    const selectedChildName = getSelectedProperty(children, "child_name");
    const subData = children.find(
      (child) => child.child_name === selectedChildName
    )?.[key];
    if (subData?.length > 0) {
      const description = getSelectedProperty(subData, "category");
      const childSubData = subData.find(
        (subChild) => subChild.category === description
      )?.sub_icd10;
      if (childSubData?.length > 0) {
        const description = getSelectedProperty(childSubData, "category");

        return (
          <Box sx={{ marginLeft: 10 }}>
            <TypographyInfoDetail
              data={{ label: "Sub ICD 10", widthLabel: "auto", description }}
            />
          </Box>
        );
      }
    }
    return null;
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      {data.map((item, index) => (
        <React.Fragment key={index}>
          <DividerText label={item?.name} />
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            {+item?.child?.length > 0 &&
              item?.child.map((itemChild) => (
                <Grid item xs={12} sm={6} sx={{ paddingLeft: 4 }}>
                  <TypographyInfoDetail
                    data={{
                      label: itemChild?.child_name,
                      description: getSelectedProperty(item?.child, "name"),
                      widthLabel: desktopView ? "15%" : "30%",
                    }}
                  />
                </Grid>
              ))}
          </Grid>
          {renderSubsection(item.child, "icd10")}
          {renderSubsection(item.child, "sub_child")}
          {renderChildSubsection(item.child, "icd10")}
          <Box sx={{ mb: 6 }} />
        </React.Fragment>
      ))}
    </Box>
  );
};

export default DetailWoundDiagnose;
