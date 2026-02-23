export default function DashboardPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Welcome Back 👋</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">Total Teachers</h3>
          <p className="text-2xl font-bold mt-2">120</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">Total Student</h3>
          <p className="text-2xl font-bold mt-2">450</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">classes</h3>
          <p className="text-2xl font-bold mt-2">32</p>
        </div>
      </div>
    </div>
  );
}
