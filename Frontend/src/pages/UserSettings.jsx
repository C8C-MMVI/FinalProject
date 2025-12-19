function UserSettings() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">User Settings</h1>
      <form className="max-w-lg bg-white p-6 rounded shadow space-y-4">
        <div>
          <label className="block text-sm font-medium">Username</label>
          <input
            type="text"
            className="w-full mt-1 p-2 border rounded"
            placeholder="Username"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            className="w-full mt-1 p-2 border rounded"
            placeholder="Email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            className="w-full mt-1 p-2 border rounded"
            placeholder="Password"
          />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default UserSettings;
