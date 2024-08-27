// ** Mock Adapter
import mock from "src/@fake-db/mock";

const cardStatsData = {
  statsHorizontal: [
    {
      stats: "2,856",
      title: "New Customers",
      icon: "mdi:account-outline",
    },
    {
      stats: "28.6K",
      color: "success",
      title: "Total Customers",
      icon: "mdi:account-multiple-outline",
    },
    {
      color: "info",
      stats: "16.6K",
      title: "Customers Active",
      icon: "mdi:account-check-outline",
    },
    {
      stats: "2,856",
      color: "error",
      icon: "mdi:account-remove-outline",
      title: "Customers Not Active",
    },
  ],
  statsClinic: [
    {
      stats: "10",
      title: "New Clinic",
      color: "info",
      icon: "mdi:office-building-outline",
    },
    {
      stats: "289",
      color: "success",
      title: "Total Clinics",
      icon: "mdi:office-building-outline",
    },
  ],
  statsOrderHorizontal: [
    {
      stats: "2,856",
      title: "New Orders",
      icon: "mdi:text-box-outline",
    },
    {
      stats: "28.6K",
      color: "success",
      title: "Total Orders",
      icon: "mdi:text-box-multiple-outline",
    },
    {
      color: "info",
      stats: "16.6K",
      title: "Order Process",
      icon: "mdi:text-box-check-outline",
    },
    {
      stats: "2,856",
      color: "error",
      icon: "mdi:text-box-remove-outline",
      title: "Order Cancelled",
    },
  ],
  statsVertical: [
    {
      stats: "862",
      trend: "negative",
      trendNumber: "-18%",
      title: "New Project",
      subtitle: "Yearly Project",
      icon: "mdi:briefcase-variant-outline",
    },
    {
      icon: "mdi:poll",
      stats: "$25.6k",
      color: "secondary",
      trendNumber: "+42%",
      title: "Total Profit",
      subtitle: "Weekly Profit",
    },
    {
      stats: "$95.2k",
      title: "Revenue",
      color: "success",
      trendNumber: "+12%",
      icon: "mdi:currency-usd",
      subtitle: "Revenue Increase",
    },
    {
      color: "error",
      stats: "44.10k",
      trend: "negative",
      title: "Logistics",
      trendNumber: "-25%",
      icon: "mdi:truck-outline",
      subtitle: "Regional Logistics",
    },
    {
      stats: "268",
      title: "Reports",
      color: "warning",
      trend: "negative",
      trendNumber: "-8%",
      icon: "mdi:check",
      subtitle: "System Bugs",
    },
    {
      stats: "1.2k",
      color: "info",
      trendNumber: "+12%",
      title: "Transactions",
      icon: "mdi:trending-up",
      subtitle: "Daily Transactions",
    },
  ],
  statsCharacter: [
    {
      stats: "13.7k",
      title: "Ratings",
      trendNumber: "+38%",
      src: "/images/cards/pose_f9.png",
      chipText: `Year of ${new Date().getFullYear()}`,
    },
    {
      stats: "24.5k",
      trend: "negative",
      title: "Sessions",
      trendNumber: "-22%",
      chipText: "Last Week",
      chipColor: "secondary",
      src: "/images/cards/pose_m18.png",
    },
    {
      stats: "2,856",
      chipColor: "info",
      title: "Customers",
      trendNumber: "+59%",
      chipText: "Last Quarter",
      src: "/images/cards/pose_m1.png",
    },
    {
      stats: "42.5k",
      trendNumber: "+26%",
      chipColor: "warning",
      title: "Total Orders",
      chipText: "Last Month",
      src: "/images/cards/pose_m35.png",
    },
  ],
};
mock.onGet("/cards/statistics").reply(() => {
  return [200, cardStatsData];
});
