import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Header = () => {
  const { logout } = useAuth();

  return (
    <header className="flex justify-between items-center p-4 border-b fixed top-0 w-full bg-[#FFFFFFBB] backdrop-blur-lg z-50 shadow">
      <h1 className="text-xl">
        <span className=" italic">
          task<span className=" font-bold text-red-900">E</span>asy
        </span>{" "}
        Dashboard
      </h1>
      <Button
        variant="outline"
        onClick={logout}
        className="flex items-center px-2"
      >
        <LogOut />
        <span className="ml-2 hidden sm:block">Log out</span>
      </Button>
    </header>
  );
};

export default Header;
