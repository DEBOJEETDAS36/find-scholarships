"use client";

export default function FirebaseTest() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Firebase ENV Test</h2>
      <pre>
        {JSON.stringify(
          {
            apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          },
          null,
          2
        )}
      </pre>
    </div>
  );
}
