import { useState } from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import MuiTabList from "@mui/lab/TabList";
import Icon from "src/@core/components/icon";
import { useAuth } from "src/hooks/useAuth";
import UserProfile from "src/views/pages/user-profile/UserProfile";
import ProfileTab from "src/views/my-profile/ProfileTab";
import SecurityTab from "src/views/my-profile/SecurityTab";

const TabList = styled(MuiTabList)(({ theme }) => ({
  "& .MuiTabs-indicator": {
    display: "none",
  },
  "& .Mui-selected": {
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`,
  },
  "& .MuiTab-root": {
    minWidth: 65,
    minHeight: 40,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.up("md")]: {
      minWidth: 130,
    },
  },
}));

const MyProfile = ({ tab, data }) => {
  const auth = useAuth();
  const userData = auth?.user?.data;

  console.log("user data1", data);
  console.log("user data", userData);
  const mappingDataAbout = [
    {
      property: "Full Name",
      value: userData?.name,
      icon: "mdi:account-outline",
    },
    {
      property: "Username",
      value: userData?.username,
      icon: "mdi:account",
    },
    {
      property: "Status",
      value: userData?.is_active ? "Active" : "Not Active",
      icon: "mdi:check",
    },
    {
      property: "Role",
      value: userData?.role?.name,
      icon: "mdi:star-outline",
    },
  ];

  const mappingDataContacts = [
    {
      property: "Contact",
      value: userData?.phone ?? "-",
      icon: "mdi:phone-outline",
    },
    {
      property: "Email",
      value: userData?.email ?? "-",
      icon: "mdi:email-outline",
    },
  ];

  const mappingData = {
    about: mappingDataAbout,
    contacts: mappingDataContacts,
  };

  const [activeTab, setActiveTab] = useState("profile");
  const handleChange = (event, value) => {
    setActiveTab(value);
  };
  const tabContentList = {
    profile: <ProfileTab data={mappingData} />,
    security: <SecurityTab data={null} />,
  };
  return (
    <>
      <UserProfile tab={tab} data={data} />
      {activeTab === undefined ? null : (
        <Grid item xs={12} sx={{ mt: 4 }}>
          <TabContext value={activeTab}>
            <TabList
              variant="scrollable"
              scrollButtons="auto"
              onChange={handleChange}
              aria-label="forced scroll tabs example"
            >
              <Tab
                value="profile"
                label={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      "& svg": { mr: 2 },
                    }}
                  >
                    <Icon fontSize={20} icon="mdi:account-outline" />
                    Profile
                  </Box>
                }
              />
              <Tab
                value="security"
                label={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      "& svg": { mr: 2 },
                    }}
                  >
                    <Icon fontSize={20} icon="mdi:lock-outline" />
                    Security
                  </Box>
                }
              />
            </TabList>
            <Box sx={{ mt: 4 }}>{tabContentList[activeTab]}</Box>
          </TabContext>
        </Grid>
      )}
    </>
  );
};

export const getStaticProps = async ({ params }) => {
  const res = await axios.get("/pages/profile", {
    params: { tab: "profile" },
  });
  const data = res.data;

  return {
    props: {
      data,
    },
  };
};

export default MyProfile;
