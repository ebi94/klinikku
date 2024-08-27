const navigation = () => {
  return [
    {
      title: "Dashboard",
      icon: "mdi:home-outline",
      path: "/dashboards",
    },
    {
      sectionTitle: "Customer & User",
    },
    {
      title: "Customers",
      icon: "mdi:account-group-outline",
      path: "/customers",
    },
    {
      sectionTitle: "Order Management",
    },
    {
      title: "Unit",
      icon: "mdi:hospital",
      path: "/order-unit",
    },
    {
      title: "Homecare",
      icon: "mdi:home-outline",
      path: "/order-homecare",
    },

    // {
    //   title: 'Telenursing',
    //   icon: 'mdi:phone-outline',
    //   path: '/order-telenursing'
    // },

    // {
    //   sectionTitle: 'Transactions'
    // },
    // {
    //   title: 'Transactions',
    //   icon: 'mdi:money',
    //   path: '/transactions'
    // },
    {
      sectionTitle: "Master Data",
    },

    // {
    //   title: 'Tools and Materials',
    //   icon: 'mdi:bowl-mix-outline',
    //   path: '/tools-materials'
    // },
    {
      title: "Media & Document",
      icon: "mdi:movie",
      path: "/media-document",
    },
    {
      sectionTitle: "KlinikKu MANAGEMENT",
    },

    // {
    //   title: 'TnC & FAQ',
    //   icon: 'mdi:frequently-asked-questions',
    //   path: '/tnc-faq'
    // },
    {
      title: "Advertisements",
      icon: "mdi:advertisements",
      path: "/advertisements",
    },

    // {
    //   title: 'Action Approval',
    //   icon: 'mdi:file-check-outline',
    //   path: '/action-approval'
    // },
    {
      title: "CMS Article",
      icon: "mdi:post-outline",
      children: [
        {
          title: "List Article",
          path: "/articles/list",
        },
        {
          title: "Category Article",
          path: "/articles/category",
        },
      ],
    },

    // {
    //   title: 'CMS Educations',
    //   icon: 'mdi:school-outline',
    //   path: '/educations'
    // },

    // {
    //   title: 'Push Notifications',
    //   icon: 'mdi:bell-outline',
    //   path: '/push-notifications'
    // },
    {
      sectionTitle: "User & Role Management",
    },
    {
      title: "Users",
      icon: "mdi:account-outline",
      path: "/users",
    },
    {
      title: "Roles & Permissions",
      icon: "mdi:shield-account-outline",
      children: [
        {
          title: "Roles Permission",
          path: "/users/role",
        },

        // {
        //   title: 'Permissions',
        //   path: '/users/permission'
        // }
      ],
    },

    // {
    //   sectionTitle: 'Log'
    // },
    // {
    //   title: 'User Activity Log',
    //   icon: 'mdi:account-details-outline',
    //   path: '/user-activity-log'
    // }

    // Example Menu
  ];
};

export default navigation;
