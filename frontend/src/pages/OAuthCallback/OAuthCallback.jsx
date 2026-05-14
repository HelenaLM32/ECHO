import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const API = import.meta.env.VITE_API_URL || "/api";
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI || window.location.origin + "/oauth/callback";

// Flag outside the component so it survives StrictMode double-mount
let oauthHandled = false;

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { oauthLogin } = useAuth();

  useEffect(() => {
    // Reset on every fresh navigation to this page
    // (the flag is module-level so it persists across StrictMode remounts
    //  but resets when the user navigates away and back)
    if (oauthHandled) return;
    oauthHandled = true;

    const params      = new URLSearchParams(window.location.search);
    const code        = params.get("code");
    const state       = params.get("state");
    const errorParam  = params.get("error");
    const provider    = sessionStorage.getItem("oauth_provider");
    const savedState  = sessionStorage.getItem("oauth_state");

    // Clean up session storage immediately so a refresh doesn't re-trigger
    sessionStorage.removeItem("oauth_state");
    sessionStorage.removeItem("oauth_provider");

    if (errorParam) {
      console.error("Google OAuth error:", errorParam);
      oauthHandled = false;
      navigate("/login?error=oauth");
      return;
    }

    if (!code || !provider) {
      oauthHandled = false;
      navigate("/login");
      return;
    }

    if (state && savedState && state !== savedState) {
      console.error("OAuth state mismatch");
      oauthHandled = false;
      navigate("/login?error=oauth");
      return;
    }

    fetch(`${API}/auth/oauth/${provider}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, redirectUri: REDIRECT_URI }),
    })
      .then(r => {
        if (!r.ok) return r.text().then(t => { throw new Error(t); });
        return r.json();
      })
      .then(data => {
        oauthLogin(data);
        oauthHandled = false; // reset for future logins
        navigate("/");
      })
      .catch(err => {
        console.error("OAuth callback error:", err.message);
        oauthHandled = false;
        navigate("/login?error=oauth");
      });
  }, []);

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "80vh",
      color: "#aaa",
      fontSize: 16
    }}>
      Iniciando sesión...
    </div>
  );
}
