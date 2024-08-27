import React from "react";
import { Box, Divider, Typography } from "@mui/material";
import TypographyInfoDetail from "src/views/ui/typography/TypographyInfoDetail";

const DetailWoundAssestment = ({ data }) => {
  // Function to find the first selected item's property.
  const getSelectedProperty = (items, property) =>
    items.find((item) => item.selected)?.[property] || "-";

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
    <Box sx={{ pb: 1, borderBottom: 1, borderColor: "divider" }}>
      {data.map((item, index) => (
        <React.Fragment key={index}>
          <Box sx={{ width: "100%", display: "flex" }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, display: "flex", minWidth: "20%" }}
            >
              {item?.parent_name}
            </Typography>
            <Typography sx={{ margin: "auto 10px", paddingBottom: "0.5rem" }}>
              : {getSelectedProperty(item?.child, "child_name")}
            </Typography>
          </Box>
          {renderSubsection(item.child, "icd10")}
          {renderSubsection(item.child, "sub_child")}
          {renderChildSubsection(item.child, "icd10")}
          <Divider />
        </React.Fragment>
      ))}
    </Box>
  );
};

export default DetailWoundAssestment;
