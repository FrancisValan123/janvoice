import React from 'react'

const AnalyticsOverview = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Analytics Overview
      </h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Complaints</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">1,248</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Resolved</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">892</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">356</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Avg. Resolution Time</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">4.2 days</p>
        </div>
      </div>

      {/* Placeholder for Charts */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Complaints Over Time</h2>
        <div className="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-400">
          Chart Placeholder (e.g., Recharts LineChart)
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Complaints by Category</h2>
        <div className="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-400">
          Chart Placeholder (e.g., Recharts BarChart)
        </div>
      </div>
    </div>
  )
}

// 👇 THIS IS THE DEFAULT EXPORT THAT FIXES THE ERROR 👇
export default AnalyticsOverview