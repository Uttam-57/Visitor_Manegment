const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Placeholder Stats Cards */}
        {[
          { label: "Total Passes Today", value: "24", color: "from-blue-500 to-blue-600" },
          { label: "Active Check-ins", value: "12", color: "from-emerald-500 to-emerald-600" },
          { label: "Pending Approvals", value: "5", color: "from-amber-500 to-amber-600" },
        ].map((stat, i) => (
          <div key={i} className={`p-6 rounded-xl text-white bg-linear-to-br ${stat.color} shadow-lg`}>
            <p className="text-white/80 font-medium mb-1">{stat.label}</p>
            <h3 className="text-4xl font-bold">{stat.value}</h3>
          </div>
        ))}
      </div>
      
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 h-96 flex items-center justify-center">
        <p className="text-slate-500">Charts & Data Table goes here</p>
      </div>
    </div>
  );
};

export default Dashboard;
