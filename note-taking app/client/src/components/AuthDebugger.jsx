import { useAuth0 } from "@auth0/auth0-react";
import { useAuthToken } from "../AuthTokenContext";

export default function AuthDebugger() {
  const { user } = useAuth0();
  const { accessToken } = useAuthToken();

  return (
    <div className="auth-debugger">
      <div className="debugger-item">
        <p>Access Token:</p>
        <p>{JSON.stringify(accessToken, null, 2)}</p>
      </div>
      <div className="debugger-item">
        <p>User Info</p>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>
    </div>
  );
}
