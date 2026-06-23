function AppContent() {
  const { token } = useAuth();

  return (
    <Router>
      <Routes>

        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />

        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />

        {/* 🟢 Root ("/") ka decision ProtectedRoute se BAHAR rakho */}
        <Route
          path="/"
          element={<Navigate to={token ? "/dashboard" : "/register"} replace />}
        />

        {/* 🔒 Dashboard layout ab apna alag path lega, "/" nahi */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/students" element={<Student />} />
          <Route path="/settings" element={<Setting />} />
          <Route path="/fees" element={<FeeManagement />} />
          <Route path="/fee-collection" element={<FeeCollection />} />
          <Route path="/pending-fees" element={<PendingFees />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/attendance-report" element={<AttendanceReport />} />
          <Route path="/student/new" element={<StudentForm />} />
        </Route>

        <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}