import { useMemo, useState, useEffect } from "react";
import { fetchWithToken } from "../../services/config";
import {
  createDevUser,
  createDevItem,
  createDevOrder,
  updateDevOrderStatus,
  getDevOrderMessages,
  createDevOrderMessage,
} from "../../services/adminDev";
import "./Admin.css";

export default function Admin() {
  const [view, setView] = useState("users");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [usersCatalog, setUsersCatalog] = useState([]);
  const [itemsCatalog, setItemsCatalog] = useState([]);
  const [ordersCatalog, setOrdersCatalog] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [devError, setDevError] = useState("");
  const [devOk, setDevOk] = useState("");

  const [createOrderForm, setCreateOrderForm] = useState({
    buyerId: "",
    itemId: "",
    finalPrice: "",
    status: "PENDING",
  });

  const [statusForm, setStatusForm] = useState({
    orderId: "",
    status: "IN_PROGRESS",
  });

  const [messageForm, setMessageForm] = useState({
    senderId: "",
    content: "",
  });

  const [createUserForm, setCreateUserForm] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [createItemForm, setCreateItemForm] = useState({
    creatorId: "",
    title: "",
    description: "",
    basePrice: "",
    itemType: "SERVICE",
    categoryId: "",
  });

  useEffect(() => {
    if (view === "develop") {
      loadDevelopData();
      return;
    }
    loadData(view);
  }, [view]);

  const parseListResponse = async (res, label) => {
    const raw = await res.text();
    if (!res.ok) {
      throw new Error(raw || `Error cargando ${label}`);
    }
    try {
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      throw new Error(`Respuesta inválida en ${label}`);
    }
  };

  const loadData = async (currentView) => {
    setLoading(true);
    setAdminError("");
    try {
      const endpoint = currentView === "users" ? "/users" : "/items";
      const res = await fetchWithToken(endpoint);
      const list = await parseListResponse(res, currentView);
      setData(list);
    } catch (e) {
      setAdminError(e.message || "No se pudieron cargar los datos");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const loadDevelopData = async () => {
    setLoading(true);
    setAdminError("");
    setDevError("");
    setDevOk("");
    try {
      const [usersRes, itemsRes, ordersRes] = await Promise.all([
        fetchWithToken("/users"),
        fetchWithToken("/items"),
        fetchWithToken("/admin/dev/orders"),
      ]);

      const [users, items, orders] = await Promise.all([
        parseListResponse(usersRes, "users"),
        parseListResponse(itemsRes, "items"),
        parseListResponse(ordersRes, "orders"),
      ]);

      setUsersCatalog(users);
      setItemsCatalog(items);
      setOrdersCatalog(orders);

      const firstBuyer = users[0]?.id ? String(users[0].id) : "";
      const firstItem = items[0]?.id ? String(items[0].id) : "";
      const firstOrder = orders[0]?.id ? String(orders[0].id) : "";

      setCreateOrderForm((prev) => ({
        ...prev,
        buyerId: prev.buyerId || firstBuyer,
        itemId: prev.itemId || firstItem,
      }));
      setCreateItemForm((prev) => ({
        ...prev,
        creatorId: prev.creatorId || firstBuyer,
      }));
      setStatusForm((prev) => ({
        ...prev,
        orderId: prev.orderId || firstOrder,
      }));
      setSelectedOrderId((prev) => prev || firstOrder);
    } catch (e) {
      const message = e.message || "No se pudieron cargar los datos de develop";
      setDevError(message);
      setAdminError(message);
      setUsersCatalog([]);
      setItemsCatalog([]);
      setOrdersCatalog([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres borrar este registro?")) return;

    try {
      const endpoint = view === "users" ? `/users/${id}` : `/items/${id}`;
      await fetchWithToken(endpoint, { method: "DELETE" });
      setData(data.filter((item) => item.id !== id));
    } catch {
      alert("Fallo al ejecutar el borrado.");
    }
  };

  const selectedOrder = useMemo(
    () => ordersCatalog.find((o) => String(o.id) === String(selectedOrderId)) || null,
    [ordersCatalog, selectedOrderId]
  );

  const senderOptions = useMemo(() => {
    if (!selectedOrder) return [];
    return usersCatalog.filter(
      (u) => u.id === selectedOrder.buyerId || u.id === selectedOrder.creatorId
    );
  }, [selectedOrder, usersCatalog]);

  useEffect(() => {
    if (senderOptions.length === 0) {
      setMessageForm((prev) => ({ ...prev, senderId: "" }));
      return;
    }
    const valid = senderOptions.some((u) => String(u.id) === String(messageForm.senderId));
    if (!valid) {
      setMessageForm((prev) => ({ ...prev, senderId: String(senderOptions[0].id) }));
    }
  }, [senderOptions, messageForm.senderId]);

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setDevError("");
    setDevOk("");
    try {
      const payload = {
        buyerId: Number(createOrderForm.buyerId),
        itemId: Number(createOrderForm.itemId),
        finalPrice:
          createOrderForm.finalPrice === "" ? null : Number(createOrderForm.finalPrice),
        status: createOrderForm.status,
      };
      await createDevOrder(payload);
      setDevOk("Order creada correctamente.");
      await loadDevelopData();
    } catch (e2) {
      setDevError(e2.message || "No se pudo crear la order");
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setDevError("");
    setDevOk("");
    try {
      await createDevUser({
        email: createUserForm.email.trim(),
        username: createUserForm.username.trim(),
        password: createUserForm.password,
      });
      setCreateUserForm({ email: "", username: "", password: "" });
      setDevOk("Usuario creado correctamente.");
      await loadDevelopData();
    } catch (e2) {
      setDevError(e2.message || "No se pudo crear el usuario");
    }
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    setDevError("");
    setDevOk("");
    try {
      const payload = {
        creatorId: Number(createItemForm.creatorId),
        title: createItemForm.title.trim(),
        description: createItemForm.description.trim(),
        basePrice: Number(createItemForm.basePrice),
        itemType: createItemForm.itemType,
        categoryId: createItemForm.categoryId === "" ? null : Number(createItemForm.categoryId),
      };
      await createDevItem(payload);
      setCreateItemForm((prev) => ({
        ...prev,
        title: "",
        description: "",
        basePrice: "",
        categoryId: "",
      }));
      setDevOk("Item creado correctamente.");
      await loadDevelopData();
    } catch (e2) {
      setDevError(e2.message || "No se pudo crear el item");
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setDevError("");
    setDevOk("");
    try {
      await updateDevOrderStatus(Number(statusForm.orderId), statusForm.status);
      setDevOk("Estado actualizado.");
      await loadDevelopData();
    } catch (e2) {
      setDevError(e2.message || "No se pudo actualizar el estado");
    }
  };

  const handleLoadMessages = async () => {
    if (!selectedOrderId) return;
    setDevError("");
    setDevOk("");
    try {
      const list = await getDevOrderMessages(Number(selectedOrderId));
      setMessages(Array.isArray(list) ? list : []);
    } catch (e2) {
      setDevError(e2.message || "No se pudieron cargar mensajes");
      setMessages([]);
    }
  };

  const handleCreateMessage = async (e) => {
    e.preventDefault();
    if (!selectedOrderId) return;
    setDevError("");
    setDevOk("");
    try {
      await createDevOrderMessage(
        Number(selectedOrderId),
        Number(messageForm.senderId),
        messageForm.content
      );
      setMessageForm((prev) => ({ ...prev, content: "" }));
      setDevOk("Mensaje enviado.");
      await handleLoadMessages();
    } catch (e2) {
      setDevError(e2.message || "No se pudo enviar el mensaje");
    }
  };

  const renderBasicTable = () => (
    <table className="admin-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>{view === "users" ? "Email / Usuario" : "Título"}</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{view === "users" ? `${item.email} - ${item.username}` : item.title}</td>
            <td>
              <button className="btn-delete" onClick={() => handleDelete(item.id)}>
                Borrar
              </button>
            </td>
          </tr>
        ))}
        {data.length === 0 && (
          <tr>
            <td colSpan="3">No hay registros.</td>
          </tr>
        )}
      </tbody>
    </table>
  );

  const renderDevelopPanel = () => (
    <div className="dev-layout">
      <section className="dev-card">
        <h2>Crear Usuario</h2>
        <form className="dev-form" onSubmit={handleCreateUser}>
          <label>
            Email
            <input
              type="email"
              value={createUserForm.email}
              onChange={(e) => setCreateUserForm((p) => ({ ...p, email: e.target.value }))}
              required
            />
          </label>

          <label>
            Username
            <input
              value={createUserForm.username}
              onChange={(e) => setCreateUserForm((p) => ({ ...p, username: e.target.value }))}
              minLength={3}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={createUserForm.password}
              onChange={(e) => setCreateUserForm((p) => ({ ...p, password: e.target.value }))}
              minLength={6}
              required
            />
          </label>

          <button className="btn-primary" type="submit">Crear usuario</button>
        </form>
      </section>

      <section className="dev-card">
        <h2>Crear Item</h2>
        <form className="dev-form" onSubmit={handleCreateItem}>
          <label>
            Creator
            <select
              value={createItemForm.creatorId}
              onChange={(e) => setCreateItemForm((p) => ({ ...p, creatorId: e.target.value }))}
              required
            >
              {usersCatalog.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.id} · {u.username}
                </option>
              ))}
            </select>
          </label>

          <label>
            Título
            <input
              value={createItemForm.title}
              onChange={(e) => setCreateItemForm((p) => ({ ...p, title: e.target.value }))}
              required
            />
          </label>

          <label>
            Descripción
            <textarea
              rows={2}
              value={createItemForm.description}
              onChange={(e) => setCreateItemForm((p) => ({ ...p, description: e.target.value }))}
            />
          </label>

          <label>
            Precio base
            <input
              type="number"
              min="0"
              step="0.01"
              value={createItemForm.basePrice}
              onChange={(e) => setCreateItemForm((p) => ({ ...p, basePrice: e.target.value }))}
              required
            />
          </label>

          <label>
            Tipo
            <select
              value={createItemForm.itemType}
              onChange={(e) => setCreateItemForm((p) => ({ ...p, itemType: e.target.value }))}
            >
              <option value="SERVICE">SERVICE</option>
              <option value="PRODUCT">PRODUCT</option>
            </select>
          </label>

          <label>
            Category ID
            <input
              type="number"
              min="1"
              value={createItemForm.categoryId}
              onChange={(e) => setCreateItemForm((p) => ({ ...p, categoryId: e.target.value }))}
              placeholder="Opcional"
            />
          </label>

          <button className="btn-primary" type="submit">Crear item</button>
        </form>
      </section>

      <section className="dev-card">
        <h2>Crear Order</h2>
        <form className="dev-form" onSubmit={handleCreateOrder}>
          <label>
            Buyer
            <select
              value={createOrderForm.buyerId}
              onChange={(e) => setCreateOrderForm((p) => ({ ...p, buyerId: e.target.value }))}
              required
            >
              {usersCatalog.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.id} · {u.username} · {u.email}
                </option>
              ))}
            </select>
          </label>

          <label>
            Item
            <select
              value={createOrderForm.itemId}
              onChange={(e) => setCreateOrderForm((p) => ({ ...p, itemId: e.target.value }))}
              required
            >
              {itemsCatalog.map((it) => (
                <option key={it.id} value={it.id}>
                  {it.id} · {it.title} · {it.basePrice}€
                </option>
              ))}
            </select>
          </label>

          <label>
            Final Price
            <input
              type="number"
              min="0"
              step="0.01"
              value={createOrderForm.finalPrice}
              onChange={(e) => setCreateOrderForm((p) => ({ ...p, finalPrice: e.target.value }))}
              placeholder="Vacío = base price"
            />
          </label>

          <label>
            Status
            <select
              value={createOrderForm.status}
              onChange={(e) => setCreateOrderForm((p) => ({ ...p, status: e.target.value }))}
            >
              <option value="PENDING">PENDING</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </label>

          <button className="btn-primary" type="submit">Crear</button>
        </form>
      </section>

      <section className="dev-card">
        <h2>Actualizar Status</h2>
        <form className="dev-form" onSubmit={handleStatusUpdate}>
          <label>
            Order
            <select
              value={statusForm.orderId}
              onChange={(e) => setStatusForm((p) => ({ ...p, orderId: e.target.value }))}
              required
            >
              {ordersCatalog.map((o) => (
                <option key={o.id} value={o.id}>
                  #{o.id} · {o.itemTitle ?? "Item"} · {o.status}
                </option>
              ))}
            </select>
          </label>

          <label>
            Status
            <select
              value={statusForm.status}
              onChange={(e) => setStatusForm((p) => ({ ...p, status: e.target.value }))}
            >
              <option value="PENDING">PENDING</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </label>

          <button className="btn-primary" type="submit">Actualizar</button>
        </form>
      </section>

      <section className="dev-card dev-card-wide">
        <h2>Mensajes del Encargo</h2>
        <div className="dev-inline-actions">
          <label>
            Order
            <select
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(e.target.value)}
            >
              {ordersCatalog.map((o) => (
                <option key={o.id} value={o.id}>
                  #{o.id} · buyer {o.buyerId} · creator {o.creatorId}
                </option>
              ))}
            </select>
          </label>
          <button className="btn-secondary" type="button" onClick={handleLoadMessages}>
            Cargar mensajes
          </button>
        </div>

        <form className="dev-form" onSubmit={handleCreateMessage}>
          <label>
            Sender
            <select
              value={messageForm.senderId}
              onChange={(e) => setMessageForm((p) => ({ ...p, senderId: e.target.value }))}
              required
            >
              {senderOptions.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.id} · {u.username}
                </option>
              ))}
            </select>
          </label>

          <label>
            Content
            <textarea
              rows={3}
              value={messageForm.content}
              onChange={(e) => setMessageForm((p) => ({ ...p, content: e.target.value }))}
              required
            />
          </label>

          <button className="btn-primary" type="submit">Enviar mensaje</button>
        </form>

        <div className="dev-messages">
          {messages.length === 0 ? (
            <p>No hay mensajes cargados.</p>
          ) : (
            messages.map((m) => (
              <article key={m.id} className="dev-message-item">
                <header>
                  <strong>{m.senderUsername ?? `User ${m.senderId}`}</strong>
                  <span>{m.sentAt ? new Date(m.sentAt).toLocaleString() : ""}</span>
                </header>
                <p>{m.content}</p>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="dev-card dev-card-wide">
        <div className="dev-inline-actions">
          <h2>Orders existentes</h2>
          <button className="btn-secondary" type="button" onClick={loadDevelopData}>
            Refrescar
          </button>
        </div>
        <div className="dev-orders-grid">
          {ordersCatalog.map((o) => (
            <article key={o.id} className="dev-order-item">
              <h3>#{o.id} · {o.itemTitle ?? "Item"}</h3>
              <p>Buyer: {o.buyerId} · {o.buyerUsername ?? "-"}</p>
              <p>Creator: {o.creatorId} · {o.creatorUsername ?? "-"}</p>
              <p>Estado: {o.status}</p>
              <p>Precio: {o.finalPrice} €</p>
            </article>
          ))}
          {ordersCatalog.length === 0 && <p>No hay orders.</p>}
        </div>
      </section>
    </div>
  );

  return (
    <div className="admin-container">
      <h1>Panel de Administración</h1>
      
      <div className="admin-tabs">
        <button 
          className={view === "users" ? "active" : ""} 
          onClick={() => setView("users")}
        >
          Usuarios
        </button>
        <button 
          className={view === "items" ? "active" : ""} 
          onClick={() => setView("items")}
        >
          Contenido
        </button>
        <button 
          className={view === "develop" ? "active" : ""} 
          onClick={() => setView("develop")}
        >
          Develop
        </button>
      </div>

      {adminError && <p className="admin-error">{adminError}</p>}
      {view === "develop" && devError && <p className="dev-error">{devError}</p>}
      {view === "develop" && devOk && <p className="dev-ok">{devOk}</p>}

      {loading ? (
        <p>Cargando datos...</p>
      ) : view === "develop" ? (
        renderDevelopPanel()
      ) : (
        renderBasicTable()
      )}
    </div>
  );
}