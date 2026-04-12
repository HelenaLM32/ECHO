import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMyOrders } from "../../services/orders";
import "./Orders.css";

const STATUS_LABELS = {
  PENDING:     "Pendiente",
  IN_PROGRESS: "En progreso",
  COMPLETED:   "Completado",
  CANCELLED:   "Cancelado",
};

export default function Orders() {
  const { user } = useAuth();

  const [orders, setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]    = useState("");

  useEffect(() => {
    setLoading(true);
    getMyOrders()
      .then(setOrders)
      .catch(() => setError("No se pudieron cargar los encargos"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="orders-page"><p>Cargando encargos…</p></div>;
  if (error)   return <div className="orders-page"><p className="orders-error">{error}</p></div>;

  const asClient  = orders.filter((o) => o.buyerId  === user?.id);
  const asCreator = orders.filter((o) => o.creatorId === user?.id);

  return (
    <div className="orders-page">
      <h1 className="orders-page__title">Mis encargos</h1>

      <section className="orders-section">
        <h2 className="orders-section__heading">Como cliente</h2>
        {asClient.length === 0 ? (
          <p className="orders-empty">No has realizado ningún encargo todavía.</p>
        ) : (
          <ul className="orders-list">
            {asClient.map((o) => (
              <OrderCard key={o.id} order={o} role="buyer" />
            ))}
          </ul>
        )}
      </section>

      <section className="orders-section">
        <h2 className="orders-section__heading">Como creador</h2>
        {asCreator.length === 0 ? (
          <p className="orders-empty">Aún no tienes encargos recibidos.</p>
        ) : (
          <ul className="orders-list">
            {asCreator.map((o) => (
              <OrderCard key={o.id} order={o} role="creator" />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function OrderCard({ order, role }) {
  return (
    <li className="order-card">
      <div className="order-card__info">
        <span className={`order-card__status order-card__status--${order.status?.toLowerCase()}`}>
          {STATUS_LABELS[order.status] ?? order.status}
        </span>
        <h3 className="order-card__title">{order.itemTitle ?? `Encargo #${order.id}`}</h3>
        <p className="order-card__meta">
          {role === "buyer"
            ? `Creador: ${order.creatorUsername ?? "—"}`
            : `Cliente: ${order.buyerUsername ?? "—"}`}
        </p>
        <p className="order-card__price">{order.finalPrice?.toFixed(2)} €</p>
      </div>
      <Link className="order-card__link" to={`/orders/${order.id}`}>
        Ver tablón →
      </Link>
    </li>
  );
}
