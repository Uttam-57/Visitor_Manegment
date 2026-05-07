import { Link, useLocation } from "react-router-dom";
import { clsx } from "clsx";
import { ROUTES } from "../../constants/routes";

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", path: ROUTES.DASHBOARD, icon: "📊" },
    { label: "Projects", path: ROUTES.PROJECTS, icon: "📁" },
    { label: "Tasks", path: ROUTES.TASKS, icon: "✅" },
    { label: "Entries", path: ROUTES.ENTRIES, icon: "🗓️" },
    { label: "Gate Pass", path: ROUTES.GATE_PASS, icon: "🎟️" },
    { label: "Reports", path: ROUTES.REPORTS, icon: "📈" },
    { label: "Chat", path: ROUTES.CHAT, icon: "💬" },
    { label: "Users", path: ROUTES.USERS, icon: "👥" },
    { label: "Settings", path: ROUTES.SETTINGS, icon: "⚙️" },
    { label: "Change Password", path: ROUTES.CHANGE_PASSWORD, icon: "🔐" },
  ];

  return (
    <aside className="w-64 bg-surface-light dark:bg-surface-dark border-r border-slate-200 dark:border-slate-800 flex flex-col h-full shadow-lg z-20">
      <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl font-bold text-gradient">VMS Pro</h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
