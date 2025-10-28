import { ListTreeIcon } from "lucide-react";
import { NotebookTabs } from "lucide-react";
import { Plus } from "lucide-react";
import { ShieldEllipsis } from "lucide-react";
import { SlidersVertical } from "lucide-react";
import { CreativeCommonsIcon } from "lucide-react";
import { Radio } from "lucide-react";
import { Receipt } from "lucide-react";
import { TimerIcon } from "lucide-react";
import { ShipIcon } from "lucide-react";
import { Timer } from "lucide-react";
import { SquareStack } from "lucide-react";
import { UserSquare } from "lucide-react";
import { UserRoundCog } from "lucide-react";
import { ListOrdered } from "lucide-react";
import { SquarePlus } from "lucide-react";
import { Tags } from "lucide-react";
import { Layers2 } from "lucide-react";
import { ShieldUser } from "lucide-react";

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
    List,
  Clock,
  RefreshCw,
  Truck,
  Package,
  XCircle,
  
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
        name: "Shop-Now",
        icon: <CreativeCommonsIcon size={20} />,
        url: "/dashboard/shopnow",
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
      {
        name: "Shop Image",
        icon: <SquarePlus size={20} />,
        url: "/dashboard/create/shopimage",
      }
    ],
    icon: (
      <SquarePlus className="h-5 w-5 md:h-6 md:w-6 xl:h-8 xl:w-7" size={30} />
    ),
  },
  {
    name: "Order Manage",
    subname: [
        {
    name: "Total Orders",
    icon: <List size={20} />,
    url: "/dashboard/orders",
  },
  {
    name: "Pending Orders",
    icon: <Clock size={20} />, // অপেক্ষমান আইটেমের জন্য টাইমার/ক্লক খুব উপযোগী
    url: "/dashboard/orders/pending",
  },
  {
    name: "Processing",
    icon: <RefreshCw size={20} />, // প্রক্রিয়াধীন (processing) বোঝাতে রিফ্রেশ/রোটেট আইকন ঠিক থাকে
    url: "/dashboard/orders/confirmed,processing",
  },
  {
    name: "Shipped",
    icon: <Truck size={20} />, // শিপিং/ট্রান্সপোর্ট বোঝাতে ট্রাক
    url: "/dashboard/orders/shipped",
  },
  {
    name: "Delivery",
    icon: <Package size={20} />, // ডেলিভারি/প্যাকেজ স্ট্যাটাসের জন্য প্যাকেজ আইকন
    url: "/dashboard/orders/delivered",
  },
  {
    name: "Cancel",
    icon: <XCircle size={20} />, // বাতিলের জন্য ক্রস-সার্কেল স্পষ্ট
    url: "/dashboard/orders/cancelled",
  },
    ],
    icon: (
      <Receipt
        className="h-5 w-5 md:h-6 md:w-6 xl:h-8 xl:w-7"
        size={30}
      />
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
    url: "/dashboard/userstates",
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
    url: "/dashboard/systemsettings",
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
