import Index from "views/Index.js";
import Profile from "views/examples/Experts";
import Tables from "views/examples/Tables.js";
import Frame14 from "./views/examples/frame14";
import Frame13 from "./views/examples/frame13";
import Frame15 from "./views/examples/frame15";
import Frame16 from "./views/examples/frame16";
import Expertfooter from "components/Footers/Expertfooter";

var routes = [
  {
    path: "/index",
    icon: "ni ni-tv-2 text-primary",
    component: Index,
    layout: "/admin"
  },
  
  {
    path: "/Experts",
    icon: "ni ni-single-02 text-yellow",
    component: Profile,
    layout: "/admin"
  },
  {
    path: "/tables",
    icon: "ni ni-bullet-list-67 text-red",
    component: Tables,
    layout: "/admin"
  },
  {
    path: "/Frame14",
    icon: "ni ni-app",
    component: Frame14,
    layout: "/admin"
  },
  {
    path: "/Frame13",
    icon: "ni ni-circle-08",
    component: Frame13,
    layout: "/admin"
  },
  {
    path: "/Frame15",
    icon: "ni ni-circle-08",
    component: Frame15,
    layout: "/admin"

  },
  {
    path: "/Frame16",
    icon: "ni ni-circle-08",
    component: Frame16,
    layout: "/admin"

  },
  {
    path: "/Expertfooter",
    icon: "ni ni-circle-08",
    component: Expertfooter,
    layout: "/admin"

  }
  // {
  //   path: "/blogs",
  //   name: "blogs",
  //   icon: "ni ni-bullet-list-67 text-red",
  //   component: Video,
  //   layout: "/admin"
  // },
  
 
];
export default routes;
