import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const API = import.meta.env.VITE_API_URL || "/api";
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI || window.location.origin + "/oauth/callback";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { oauthLogin } = useAuth();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const params   = new URLSearchParams(window.location.search);
    const code     = params.get("code");
    const state    = params.get("state");
    const provider = sessionStorage.getItem("oauth_provider");
    const savedState = sessionStorage.getItem("oauth_state");

    if (!code || !provider) {
      navigate("/login");
      return;
    }

    if (state && state !== savedState) {
      console.error("OAuth state mismatch");
      navigate("/login");
      return;
    }

    sessionStorage.removeItem("oauth_state");
    sessionStorage.removeItem("oauth_provider");

    fetch(`${API}/auth/oauth/${provider}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, redirectUri: REDIRECT_URI }),
    })
      .then(r => {
        if (!r.ok) throw new Error("OAuth login failed");
        return r.json();
      })
      .then(data => {
        oauthLogin(data);
        navigate("/");
      })
      .catch(() => navigate("/login?error=oauth"));
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