import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, LogInIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const Header = ({ curpage }: any) => {
  const { logout, loading, user } = useAuth();
  const router = useRouter();

  return (
    <header className="flex justify-between items-center p-4 border-b fixed top-0 w-full bg-[#FFFFFFBB] backdrop-blur-lg z-50 shadow h-[70px]">
      <h1 className="text-xl">
        <span className=" italic">
          task<span className=" font-bold text-red-900">E</span>asy
        </span>
      </h1>
      <div className="flex gap-4">
        {curpage === "tasks" && (
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/kanban")}
            className="flex items-center px-2"
          >
            Kanban
          </Button>
        )}
        {curpage === "kanban" && (
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/tasks")}
            className="flex items-center px-2"
          >
            Tasks
          </Button>
        )}
        {loading !== "loading" && user && (
          <Button
            variant="outline"
            onClick={logout}
            className="flex items-center px-2"
          >
            <LogOut className="h-5" />
            <span className="ml-1 hidden sm:block">Log out</span>
          </Button>
        )}
        {loading !== "loading" && !user && (
          <Button
            variant="outline"
            onClick={() => router.push("/auth/login")}
            className="flex items-center px-2"
          >
            <LogInIcon className="h-5" />
            <span className="ml-1 hidden sm:block">Login</span>
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
