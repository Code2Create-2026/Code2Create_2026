// sample_project/frontend/App.jsx
//
// Minimal sample React component for testing the analysis engine.
//
// This component accesses:
//   data.user_id   (snake_case — mismatches backend's "userId")
//   data.name      (matches backend)
//   data.email     (matches backend)
//
// The analysis engine should detect:
//   userId vs user_id → POSSIBLE MISMATCH ⚠
//   name   vs name    → MATCH ✓
//   email  vs email   → MATCH ✓

import React, { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1>User Profile</h1>
      {/* This will be undefined if backend changed userId to user_id or vice versa */}
      <p>ID: {data.user_id}</p>
      <p>Name: {data.name}</p>
      <p>Email: {data.email}</p>
    </div>
  );
}

export default App;
