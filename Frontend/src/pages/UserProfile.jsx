function UserProfile() {
  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold font-lexend">User Profile</h1>

      <div className="bg-white rounded-xl shadow mt-6 p-4 space-y-3">
        <div>
          <label className="text-sm text-gray-500">Name</label>
          <p className="font-semibold">Admin User</p>
        </div>

        <div>
          <label className="text-sm text-gray-500">Email</label>
          <p className="font-semibold">admin@ark.com</p>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
