
import { Routes } from "@/constants/routes";
import MyWallets from "@/pages/MyWallets";
import Trade from "@/pages/Trade";
import NavBar from "@/widgets/NavBar";
import {Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAccount } from "wagmi";
import Landing from "./pages/Landing";
import NotConnected from "./shared/NotConnected";
import { Toaster } from "./shared/ui/toaster";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/", // Base path for Layout
      element: <Layout />, // Layout as the base element
      children: [
        {
          index: true, // Represents the root path ("/")
          element: <MyWallets />,
        },
        {
          path: Routes.TRADE, // Assuming Routes.TRADE is "/trade"
          element: <Trade />,
        },
        // Add more nested routes as needed
      ],
    },
    // You can add more top-level routes here, outside of the Layout if necessary
  ]);

  return <RouterProvider router={router} />;
}

const Layout = () => {
  const { isConnected } = useAccount();

  return (
      <div className="min-h-screen w-full text-info overflow-x-hidden">
        <NavBar />
        <div className="pt-[58px]">
          <Outlet /> {/* This is where the nested routes get rendered */}
        </div>
        <Toaster />
      </div>
  );
};
