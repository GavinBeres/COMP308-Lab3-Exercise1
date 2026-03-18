import React, { Suspense, lazy } from "react";

const AuthApp = lazy(() => import("auth_mf/AuthApp"));
const CommunityApp = lazy(() => import("community_mf/CommunityApp"));

function App() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Community Engagement System</h1>
      <p>COMP308 Lab 3 - Exercise 1</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.3fr",
          gap: "20px",
          alignItems: "start",
          marginTop: "20px",
        }}
      >
        <div style={{ border: "1px solid #ccc", borderRadius: "10px", padding: "15px" }}>
          <Suspense fallback={<div>Loading Authentication Module...</div>}>
            <AuthApp />
          </Suspense>
        </div>

        <div style={{ border: "1px solid #ccc", borderRadius: "10px", padding: "15px" }}>
          <Suspense fallback={<div>Loading Community Module...</div>}>
            <CommunityApp />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default App;