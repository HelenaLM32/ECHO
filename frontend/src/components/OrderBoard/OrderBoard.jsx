import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { getOrderMessages, sendOrderMessage } from "../../services/orderMessages";
import "./OrderBoard.css";

export default function OrderBoard({ orderId, buyerId, creatorId }) {
  const { user } = useAuth();

  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState("");
  const [sending, setSending]     = useState(false);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");

  const bottomRef = useRef(null);

  const isParticipant =
    user?.id === buyerId || user?.id === creatorId;


  useEffect(() => {
    if (!orderId || !isParticipant) return;
    setLoading(true);
    getOrderMessages(orderId)
      .then(setMessages)
      .catch(() => setError("No se pudieron cargar los mensajes"))
      .finally(() => setLoading(false));
  }, [orderId]);


  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    setError("");
    try {
      const newMsg = await sendOrderMessage(orderId, text);
      setMessages((prev) => [...prev, newMsg]);
      setInput("");
    } catch (err) {
      setError(err.message || "Error al enviar el mensaje");
    } finally {
      setSending(false);
    }
  };

  if (!isParticipant) {
    return (
      <p className="ob-notice">
        Solo el cliente y el creador pueden ver este tablón.
      </p>
    );
  }

  return (
    <section className="ob-wrapper" aria-label="Tablón del encargo">
      <h2 className="ob-title">Tablón del encargo</h2>

      <div className="ob-messages" role="log" aria-live="polite">
        {loading && <p className="ob-placeholder">Cargando mensajes…</p>}

        {!loading && messages.length === 0 && (
          <p className="ob-placeholder">
            Aún no hay mensajes. ¡Sé el primero en escribir!
          </p>
        )}

        {messages.map((msg) => {
          const isMine = msg.senderId === user?.id;
          return (
            <div
              key={msg.id}
              className={`ob-bubble ${isMine ? "ob-bubble--mine" : "ob-bubble--theirs"}`}
            >
              <span className="ob-bubble__sender">
                {isMine ? "Tú" : msg.senderUsername}
              </span>
              <p className="ob-bubble__text">{msg.content}</p>
              <time className="ob-bubble__time" dateTime={msg.sentAt}>
                {formatTime(msg.sentAt)}
              </time>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {error && <p className="ob-error">{error}</p>}

      <form className="ob-form" onSubmit={handleSend}>
        <textarea
          className="ob-form__input"
          rows={2}
          placeholder="Escribe un mensaje…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend(e);
            }
          }}
          maxLength={2000}
          disabled={sending}
        />
        <button
          type="submit"
          className="ob-form__btn"
          disabled={sending || !input.trim()}
        >
          {sending ? "Enviando…" : "Enviar"}
        </button>
      </form>
    </section>
  );
}

function formatTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString("es-ES", {
    day:    "2-digit",
    month:  "2-digit",
    year:   "numeric",
    hour:   "2-digit",
    minute: "2-digit",
  });
}
