import React, { Suspense, lazy } from "react";

const AuthApp = lazy(() => import("auth_mf/AuthApp"));
const CommunityApp = lazy(() => import("community_mf/CommunityApp"));

function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #2563eb, #1e3a8a)",
            color: "white",
            padding: "25px 30px",
            borderRadius: "16px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
            marginBottom: "25px",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "2.3rem" }}>
            Community Engagement System
          </h1>
          <p style={{ marginTop: "10px", fontSize: "1.05rem", opacity: 0.95 }}>
            COMP308 Lab 3 - Exercise 1
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.4fr",
            gap: "24px",
            alignItems: "start",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
              border: "1px solid #e5e7eb",
            }}
          >
            <Suspense fallback={<div>Loading Authentication Module...</div>}>
              <AuthApp />
            </Suspense>
          </div>

          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
              border: "1px solid #e5e7eb",
            }}
          >
            <Suspense fallback={<div>Loading Community Module...</div>}>
              <CommunityApp />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;