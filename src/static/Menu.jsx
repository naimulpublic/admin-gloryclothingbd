import {
  Home,
  LayoutDashboard,
  ListTreeIcon,
  NotebookTabs,
  Plus,
  ShieldEllipsis,
  SlidersVertical,
  CreativeCommonsIcon,
  Radio,
  SquareStack,
  ListOrdered,
  SquarePlus,
  Projector,
  Tags,
  Layers2,
  ShieldUser,
  Plug,
  ListTodo,
  ListTree,
  BarChart2,
  Users,
  UserCog,
  Settings,
} from "lucide-react";

export const Menu = [
  {
    section: "Dashboard",
    items: [
      {
        name: "Dashboard",
        icon: <LayoutDashboard className="size-6 md:size-8" size={20} />,
        subname: [
          { name: "Home Page", icon: <Home size={18} />, url: "/dashboard" },
        ],
      },
    ],
  },
  {
    section: "Management",
    items: [
      {
        name: "Admin",
        icon: <ShieldUser className="size-6 md:size-8" size={20} />,
        subname: [
          {
            name: "Root Admin",
            icon: <ShieldEllipsis size={20} />,
            url: "/dashboard/rootadmin",
          },
          {
            name: "Products",
            icon: <Radio size={20} />,
            url: "/dashboard/products",
          },
          {
            name: "Categories",
            icon: <NotebookTabs size={20} />,
            url: "/dashboard/categories",
          },
          {
            name: "SubCategories",
            icon: <Layers2 size={20} />,
            url: "/dashboard/subcategories",
          },
          {
            name: "SubChild",
            icon: <SquareStack size={20} />,
            url: "/dashboard/subcategorychild",
          },
          {
            name: "Sliders",
            icon: <SlidersVertical size={20} />,
            url: "/dashboard/sliders",
          },
          {
            name: "Coupons",
            icon: <Tags size={20} />,
            url: "/dashboard/cupons",
          },
          {
            name: "Brands",
            icon: <CreativeCommonsIcon size={20} />,
            url: "/dashboard/brands",
          },
          {
            name: "Orders",
            icon: <ListOrdered size={20} />,
            url: "/dashboard/orders",
          },
        ],
      },
    ],
  },
  {
    section: "Create",
    items: [
      {
        name: "Create",
        icon: <SquarePlus className="size-6 md:size-8" size={20} />,
        subname: [
          { name: "Product", url: "/dashboard/create/product" },
          { name: "Category", url: "/dashboard/create/categories" },
          { name: "Subcategory", url: "/dashboard/create/subcategories" },
          { name: "SubChild", url: "/dashboard/create/subcategorychild" },
          { name: "Slider", url: "/dashboard/create/sliders" },
          { name: "Coupon", url: "/dashboard/admin/create/cupon" },
          { name: "Admin", url: "/dashboard/admin/create/admin" },
          { name: "Brand", url: "/dashboard/create/brand" },
        ],
      },
    ],
  },
  {
    section: "Analytics",
    items: [
      {
        name: "Reports",
        icon: <BarChart2 className="size-6 md:size-8" size={20} />,
        url: "/dashboard/reports",
      },
      {
        name: "User Stats",
        icon: <Users size={20} />,
        url: "/dashboard/users/stats",
      },
    ],
  },
  {
    section: "Settings",
    items: [
      {
        name: "Profile",
        icon: <UserCog className="size-6 md:size-8" size={20} />,
        url: "/dashboard/profile",
      },
      {
        name: "System Settings",
        icon: <Settings size={20} />,
        url: "/dashboard/settings",
      },
    ],
  },
];

export const brandOptions = [
  "Samsung",
  "Xiaomi",
  "Realme",
  "Oppo",
  "Vivo",
  "Walton",
  "Nothing",
];
