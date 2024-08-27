import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import axios from "axios";
import Icon from "src/@core/components/icon";
import { useAuth } from "src/hooks/useAuth";
import { getInitials } from "src/@core/utils/get-initials";
import CustomAvatar from "src/@core/components/mui/avatar";

const ProfilePicture = styled("img")(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: theme.shape.borderRadius,
  border: `5px solid ${theme.palette.common.white}`,
  [theme.breakpoints.down("md")]: {
    marginBottom: theme.spacing(4),
  },
}));

const UserProfileHeader = () => {
  // ** State
  const auth = useAuth();
  const userData = auth?.user?.data;

  return userData !== null ? (
    <Card>
      <CardMedia
        component="img"
        alt="profile-header"
        image="/images/pages/profile-banner.png"
        sx={{
          height: { xs: 150, md: 250 },
          "-webkit-transform": "scaleX(-1)",
          transform: "scaleX(-1)",
        }}
      />
      <CardContent
        sx={{
          pt: 0,
          mt: -8,
          display: "flex",
          alignItems: "flex-end",
          flexWrap: { xs: "wrap", md: "nowrap" },
          justifyContent: { xs: "center", md: "flex-start" },
        }}
      >
        {/* <ProfilePicture src={data.profileImg} alt="profile-picture" /> */}
        <CustomAvatar
          skin="dark"
          color={"warning"}
          sx={{
            fontSize: "3.5rem",
            width: "8rem",
            height: "8rem",
            fontWeight: 600,
            border: "5px solid rgb(255, 255, 255)",
          }}
        >
          {getInitials(userData?.name ?? userData?.username)}
        </CustomAvatar>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            ml: { xs: 0, md: 6 },
            alignItems: "flex-end",
            flexWrap: ["wrap", "nowrap"],
            justifyContent: ["center", "space-between"],
          }}
        >
          <Box
            sx={{
              mb: [6, 0],
              display: "flex",
              flexDirection: "column",
              alignItems: ["center", "flex-start"],
            }}
          >
            <Typography variant="h5" sx={{ mb: 4 }}>
              {userData?.name}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: ["center", "flex-start"],
              }}
            >
              <Box
                sx={{
                  mr: 5,
                  display: "flex",
                  alignItems: "center",
                  "& svg": { mr: 1, color: "text.secondary" },
                }}
              >
                <Icon icon="mdi:account-outline" />
                <Typography
                  sx={{ ml: 1, color: "text.secondary", fontWeight: 600 }}
                >
                  {userData?.username ?? "-"}
                </Typography>
              </Box>
              <Box
                sx={{
                  mr: 5,
                  display: "flex",
                  alignItems: "center",
                  "& svg": { mr: 1, color: "text.secondary" },
                }}
              >
                <Icon icon="mdi:email-outline" />
                <Typography
                  sx={{ ml: 1, color: "text.secondary", fontWeight: 600 }}
                >
                  {userData?.email ?? "-"}
                </Typography>
              </Box>
              {!userData?.gender ? (
                <Box
                  sx={{
                    mr: 5,
                    display: "flex",
                    alignItems: "center",
                    "& svg": { mr: 1, color: "text.secondary" },
                  }}
                >
                  <Icon
                    icon={
                      userData?.gender === "Male"
                        ? "mdi:gender-male"
                        : "mdi:gender-female"
                    }
                  />
                  <Typography
                    sx={{ ml: 1, color: "text.secondary", fontWeight: 600 }}
                  >
                    {userData?.gender ?? "-"}
                  </Typography>
                </Box>
              ) : (
                <></>
              )}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  "& svg": { mr: 1, color: "text.secondary" },
                }}
              >
                <Icon icon="mdi:calendar-blank" />
                <Typography
                  sx={{ ml: 1, color: "text.secondary", fontWeight: 600 }}
                >
                  Birthday {userData?.date_of_birth ?? "-"}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  ) : null;
};

export default UserProfileHeader;
