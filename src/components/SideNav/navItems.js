import {
  faHome,
  faChartPie,
  faMoneyBill,
  faFolderOpen,
  faUserCircle,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";

const navItems = [
  {
    id: 0,
    link: "/dashboard",
    name: "Home",
    icon: faHome,
  },
  {
    id: 1,
    link: "/dashboard",
    name: "Accounting",
    icon: faChartPie,
  },
  {
    id: 2,
    link: "/dashboard",
    name: "Payroll",
    icon: faMoneyBill,
  },
  {
    id: 3,
    link: "/dashboard",
    name: "People",
    icon: faUserCircle,
  },
  {
    id: 4,
    link: "/dashboard",
    name: "Document",
    icon: faFolderOpen,
  },
  {
    id: 5,
    link: "/dashboard",
    name: "For Support",
    icon: faQuestionCircle,
    style: { position: "absolute", top: "78%", minWidth: "100px" },
  },
];

export default navItems;
