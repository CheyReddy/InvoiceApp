import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle.jsx";
import { LogOut, Clock } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { dashboardConfig } from "../config/dashboardConfig.js";
import toast from "react-hot-toast";

function HubHomePage() {
  const { email, logout } = useAuth();

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8 transition-colors overflow-hidden">
      <div className="max-w-6xl mx-auto p-2 sm:p-4 lg:p-8 h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 sm:mb-8 shrink-0 gap-4">
          <div className="min-w-0">
            <Link to="/hub">
              <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white truncate">
                SoloPilot Dashboard
              </h1>
            </Link>

            <p className="text-xs sm:text-sm lg:text-base text-gray-500 dark:text-gray-400 mt-1 truncate">
              Logged in as {email}
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <ThemeToggle />

            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-sm sm:text-base text-red-600 dark:text-red-400 font-medium hover:underline"
              aria-label="Log Out"
            >
              <LogOut size={25} className="sm:w-6 sm:h-6" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>

        {/* Scrollable Dashboard */}
        <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6 pb-4">
            {dashboardConfig.map((d) => {
              const IconComponent = d.icon;

              const handleClick = (e) => {
                if (d.appStatus === "COMING_SOON") {
                  e.preventDefault();
                  toast(`${d.appName} is coming soon!`, {
                    icon: "🚧",
                  });
                  return;
                }
                if (d.appStatus === "IN_PROGRESS" && !import.meta.env.DEV) {
                  e.preventDefault();
                  toast(`${d.appName} is still in progress!`, {
                    icon: "🚧",
                  });
                  return;
                }
              };

              return (
                <Link
                  to={d.toUrl}
                  key={d.toUrl}
                  onClick={handleClick}
                  className="
                    relative
                    min-h-[120px]
                    sm:min-h-[150px]
                    lg:min-h-[170px]
                    px-3
                    sm:px-4
                    lg:px-6
                    py-4
                    sm:py-5
                    lg:py-6
                    rounded-lg
                    bg-blue-600
                    text-white
                    font-medium
                    hover:bg-blue-700
                    transition-colors
                    flex
                    flex-col
                    items-center
                    justify-center
                    text-center
                  "
                >
                  {d.appStatus === "COMING_SOON" && (
                    <span className="absolute top-2 right-2 flex items-center gap-1 text-[8px] sm:text-[9px] lg:text-[10px] text-amber-200">
                      <Clock size={10} className="sm:w-3 sm:h-3" />
                      COMING SOON
                    </span>
                  )}
                  {d.appStatus === "IN_PROGRESS" && (
                    <span className="absolute top-2 right-2 flex items-center gap-1 text-[8px] sm:text-[9px] lg:text-[10px] text-amber-200">
                      <Clock size={10} className="sm:w-3 sm:h-3" />
                      IN PROGRESS
                    </span>
                  )}

                  <IconComponent className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 mb-3 sm:mb-4 mt-2.5" />

                  <span className="text-xs sm:text-sm lg:text-base leading-tight">
                    {d.appName}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HubHomePage;
