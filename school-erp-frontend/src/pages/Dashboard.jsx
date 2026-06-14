const Dashboard = () => {
  // ERP dummy statistics data
  const stats = [
    { id: 1, label: 'Total Students', count: '1,250', color: 'bg-blue-500' },
    { id: 2, label: 'Total Teachers', count: '48', color: 'bg-green-500' },
    { id: 3, label: 'Fees Collected', count: '85%', color: 'bg-purple-500' },
    { id: 4, label: 'Active Classes', count: '24', color: 'bg-orange-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
      
      {/* Cards Grid Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stat.count}</p>
            </div>
            <div className={`w-12 h-12 rounded-full ${stat.color} opacity-20`}></div>
          </div>
        ))}
      </div>

      {/* Skeleton Placeholder for Table/Charts */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-64 flex items-center justify-center">
        <p className="text-gray-400 italic">Recent Activities & Notices coming soon...</p>
      </div>
    </div>
  );
};

export default Dashboard;