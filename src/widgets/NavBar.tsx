import Logo from "@/shared/Logo";
import { Routes } from "@/constants/routes";
import classNames from "classnames";
import { ConnectKitButton } from "connectkit";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import { useLocation } from "react-router-dom";
import "./navbar.css";

const getLinkClass = (isActive: boolean) => classNames("text-md hover:text-blue-400", {
  "underline underline-offset-4 text-blue-300 custom-drop-shadow": isActive
});

export default function NavBar() {
  const location = useLocation();
  const currentRoute = location.pathname;

  const { isConnected } = useAccount();
  return (
    <div className="navbar fixed z-[100] bg-[#0C1023] text-info px-6 py-2 flex justify-between items-center w-full">
      <div className="flex flex-row justify-between items-center gap-3">
        <Logo />
        {isConnected && (
          <>
            <Link to={Routes.ROOT} className={getLinkClass(currentRoute == Routes.ROOT)}>
              My Wallets
            </Link>
            <Link to={Routes.TRADE} className={getLinkClass(currentRoute == Routes.TRADE)}>
              Trade
            </Link>
          </>
        )}
      </div>
      <ConnectKitButton />
    </div>
  )
}