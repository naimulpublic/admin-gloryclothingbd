import { ListTreeIcon } from "lucide-react";
import { NotebookTabs } from "lucide-react";
import { Plus } from "lucide-react";
import { ShieldEllipsis } from "lucide-react";
import { SlidersVertical } from "lucide-react";
import { CreativeCommonsIcon } from "lucide-react";
import { Radio } from "lucide-react";
import { SquareStack } from "lucide-react";
import { UserSquare } from "lucide-react";
import { UserRoundCog } from "lucide-react";
import { ListOrdered } from "lucide-react";
import { SquarePlus } from "lucide-react";
import { Projector } from "lucide-react";
import { Tags } from "lucide-react";
import { Layers2 } from "lucide-react";
import { ShieldUser } from "lucide-react";
import { Plug } from "lucide-react";
import { ListTodo } from "lucide-react";
import { ListTree } from "lucide-react";
import {
  Home,
  ImagePlus,
  GalleryVerticalEnd,
  Sliders,
  ListCheck,
  CpuIcon,
  CreativeCommons,
  Users,
  Upload,
  Server,
  Layers,
  PackageSearch,
  PackageCheck,
  DollarSign,
  MessageSquare,
  File,
  BarChart3,
  Settings,
  ArrowLeftToLine,
  LayoutDashboard,
  
} from "lucide-react";

export const Menu = [
  {
    name: "Dashboard",
    subname: [
      { name: "Home Page", icon: <Home size={20} />, url: "/dashboard" },
      {
        name: "Reports",
        icon: (
          <BarChart3
            className="h-5 w-5 md:h-6 md:w-6 xl:h-8 xl:w-7"
            size={30}
          />
        ),
        url: "/dashboard/reports",
      },
    ],
    icon: (
      <LayoutDashboard
        className="h-5 w-5 md:h-6 md:w-6 xl:h-8 xl:w-7"
        size={30}
      />
    ),
  },
  {
    name: "Admin",
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
        name: "Cupons",
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
    icon: (
      <ShieldUser className="h-5 w-5 md:h-6 md:w-6 xl:h-8 xl:w-7" size={30} />
    ),
  },
  {
    name: "Create Manage",
    subname: [
      {
        name: "Product",
        icon: <SquarePlus size={20} />,
        url: "/dashboard/create/product",
      },
      {
        name: "Category",
        icon: <SquarePlus size={20} />,
        url: "/dashboard/create/categories",
      },
      {
        name: "Subcategory",
        icon: <SquarePlus size={20} />,
        url: "/dashboard/create/subcategories",
      },
      {
        name: "SubChild",
        icon: <SquarePlus size={20} />,
        url: "/dashboard/create/subcategorychild",
      },

      {
        name: "Slider",
        icon: <SquarePlus size={20} />,
        url: "/dashboard/create/sliders",
      },
      {
        name: "Cupon",
        icon: <SquarePlus size={20} />,
        url: "/dashboard/admin/create/cupon",
      },
      {
        name: "Admin",
        icon: <SquarePlus size={20} />,
        url: "/dashboard/admin/create/admin",
      },
      {
        name: "Brand",
        icon: <SquarePlus size={20} />,
        url: "/dashboard/create/brand",
      },
    ],
    icon: (
      <SquarePlus className="h-5 w-5 md:h-6 md:w-6 xl:h-8 xl:w-7" size={30} />
    ),
  },
  {
    name: "Reports",
    icon: (
      <BarChart3 className="h-5 w-5 md:h-6 md:w-6 xl:h-8 xl:w-7" size={30} />
    ),
    url: "/dashboard/reports",
  },

  {
    name: "User States",
    icon: (
      <UserSquare className="h-5 w-5 md:h-6 md:w-6 xl:h-8 xl:w-7" size={30} />
    ),
    url: "/dashboard/reports",
  },
  {
    name: "Profile",
    icon: (
      <UserRoundCog className="h-5 w-5 md:h-6 md:w-6 xl:h-8 xl:w-7" size={30} />
    ),
    url: "/dashboard/profile",
  },
  {
    name: "System Settings",
    icon: (
      <Settings className="h-5 w-5 md:h-6 md:w-6 xl:h-8 xl:w-7" size={30} />
    ),
    url: "/dashboard/reports",
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
