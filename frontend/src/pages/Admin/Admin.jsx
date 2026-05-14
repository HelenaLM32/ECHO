import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithToken } from "../../services/config";
import { useAuth } from "../../context/AuthContext";
import {
  createDevUser,
  createDevItem,
  createDevOrder,
  updateDevOrderStatus,
  getDevOrderMessages,
  createDevOrderMessage,
} from "../../services/adminDev";
import { getAllDisputes } from "../../services/disputes";
import { getAllReviews, deleteReview } from "../../services/reviews";
import DisputePanel from "../../components/DisputePanel";
import DetailModal from "../../components/DetailModal/DetailModal";
import ServiceDetail from "../../components/ServiceDetail/ServiceDetail";
import ProjectView from "../ItemProject/ProjectView";
import "./Admin.css";

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState("users");
  const [data, setData] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [usersCatalog, setUsersCatalog] = useState([]);
  const [itemsCatalog, setItemsCatalog] = useState([]);
  const [ordersCatalog, setOrdersCatalog] = useState([]);
  const [categoriesCatalog, setCategoriesCatalog] = useState([]);
  const [projectsCatalog, setProjectsCatalog] = useState([]);
  const [servicesCatalog, setServicesCatalog] = useState([]);
  const [venuesCatalog, setVenuesCatalog] = useState([]);
  const [eventsCatalog, setEventsCatalog] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [devError, setDevError] = useState("");
  const [devOk, setDevOk] = useState("");
  const [contentTypeFilter, setContentTypeFilter] = useState("all");
  const [contentModal, setContentModal] = useState({ open: false, type: null, data: null });
  const [selectedService, setSelectedService] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [searchUsers, setSearchUsers] = useState("");
  const [searchContent, setSearchContent] = useState("");
  const [searchReviews, setSearchReviews] = useState("");
  const [searchDisputes, setSearchDisputes] = useState("");

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

  const [createProjectForm, setCreateProjectForm] = useState({
    title: "",
    description: "",
    basePrice: "",
    categoryId: "",
  });

  const [createServiceForm, setCreateServiceForm] = useState({
    name: "",
    description: "",
    deliveryDuration: "1",
    categoryId: "",
    price: "",
    coverImageUrl: "",
    projectIds: [],
  });

  const [createVenueForm, setCreateVenueForm] = useState({
    name: "",
    address: "",
    capacity: "",
    telefono: "",
    email: "",
    sitioWeb: "",
    horario: "",
  });

  const [createEventForm, setCreateEventForm] = useState({
    title: "",
    description: "",
    venueId: "",
    startDate: "",
    endDate: "",
    precio: "",
    categoria: "",
    linkEntradas: "",
  });

  const [assignServiceForm, setAssignServiceForm] = useState({
    serviceId: "",
    projectIds: [],
  });

  useEffect(() => {
    if (view === "develop" || view === "items") {
      loadDevelopData();
      return;
    }
    if (view === "disputes") {
      loadDisputes();
      return;
    }
    if (view === "reviews") {
      loadReviews();
      return;
    }
    loadData(view);
  }, [view]);

  const openContentDetail = (entry) => {
    if (!entry) return;
    if (entry.type === "project") {
      setSelectedProjectId(entry.id);
      return;
    }
    if (entry.type === "service") {
      setSelectedService(entry.raw);
      return;
    }
    setContentModal({
      open: true,
      type: entry.type === "venue" ? "venue" : "event",
      data: entry.raw,
    });
  };

  const closeContentModal = () => {
    setContentModal({ open: false, type: null, data: null });
  };

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

  const loadDisputes = async () => {
    setLoading(true);
    setAdminError("");
    try {
      const list = await getAllDisputes();
      setDisputes(list);
    } catch (e) {
      setAdminError(e.message || "No se pudieron cargar las disputas");
      setDisputes([]);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    setLoading(true);
    setAdminError("");
    try {
      const list = await getAllReviews();
      setReviews(Array.isArray(list) ? list : []);
    } catch (e) {
      setAdminError(e.message || "No se pudieron cargar las reviews");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm("¿Eliminar esta review?")) return;
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch {
      alert("Error al eliminar la review.");
    }
  };

  const renderReviews = () => (
    <div className="admin-reviews">
      <div className="admin-section-toolbar">
        <h2>Reviews ({filteredReviews.length})</h2>
        <input
          type="search"
          className="admin-search-input"
          placeholder="Buscar por autor, comentario o ID..."
          value={searchReviews}
          onChange={(e) => setSearchReviews(e.target.value)}
        />
      </div>
      {filteredReviews.length === 0 ? (
        <p className="admin-empty">No hay reviews registradas.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Encargo</th>
              <th>Autor</th>
              <th>Puntuación</th>
              <th>Comentario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredReviews.map((r) => (
              <tr key={r.id}>
                <td>#{r.id}</td>
                <td>#{r.orderId}</td>
                <td>
                  {r.authorId ? (
                    <button
                      type="button"
                      className="admin-user-link"
                      onClick={() => navigate(`/profile/${r.authorId}`)}
                    >
                      @{r.authorUsername ?? r.authorId}
                    </button>
                  ) : (
                    <span>@{r.authorUsername ?? "usuario"}</span>
                  )}
                </td>
                <td>{"★".repeat(r.score)}{"☆".repeat(5 - r.score)}</td>
                <td className="admin-review-comment">{r.comment || "—"}</td>
                <td>
                  <button
                    className="admin-btn-danger"
                    onClick={() => handleDeleteReview(r.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  const loadDevelopData = async () => {
    setLoading(true);
    setAdminError("");
    setDevError("");
    setDevOk("");
    try {
      const [usersRes, itemsRes, ordersRes, categoriesRes, projectsRes, servicesRes, venuesRes, eventsRes] = await Promise.all([
        fetchWithToken("/users"),
        fetchWithToken("/items"),
        fetchWithToken("/admin/dev/orders"),
        fetchWithToken("/categories"),
        fetchWithToken("/item-projects"),
        fetchWithToken("/services"),
        fetchWithToken("/venues"),
        fetchWithToken("/events"),
      ]);

      const [users, items, orders, categories, projects, services, venues, events] = await Promise.all([
        parseListResponse(usersRes, "users"),
        parseListResponse(itemsRes, "items"),
        parseListResponse(ordersRes, "orders"),
        parseListResponse(categoriesRes, "categories"),
        parseListResponse(projectsRes, "projects"),
        parseListResponse(servicesRes, "services"),
        parseListResponse(venuesRes, "venues"),
        parseListResponse(eventsRes, "events"),
      ]);

      setUsersCatalog(users);
      setItemsCatalog(items);
      setOrdersCatalog(orders);
      setCategoriesCatalog(categories);
      setProjectsCatalog(projects);
      setServicesCatalog(services);
      setVenuesCatalog(venues);
      setEventsCatalog(events);

      const firstBuyer = users[0]?.id ? String(users[0].id) : "";
      const firstItem = items[0]?.id ? String(items[0].id) : "";
      const firstOrder = orders[0]?.id ? String(orders[0].id) : "";
      const firstCategory = categories[0]?.id ? String(categories[0].id) : "";
      const firstVenue = venues[0]?.id ? String(venues[0].id) : "";
      const firstService = services[0]?.id ? String(services[0].id) : "";

      setCreateOrderForm((prev) => ({
        ...prev,
        buyerId: prev.buyerId || firstBuyer,
        itemId: prev.itemId || firstItem,
      }));
      setStatusForm((prev) => ({
        ...prev,
        orderId: prev.orderId || firstOrder,
      }));
      setCreateProjectForm((prev) => ({
        ...prev,
        categoryId: prev.categoryId || firstCategory,
      }));
      setCreateServiceForm((prev) => ({
        ...prev,
        categoryId: prev.categoryId || firstCategory,
      }));
      setCreateEventForm((prev) => ({
        ...prev,
        venueId: prev.venueId || firstVenue,
      }));
      setAssignServiceForm((prev) => ({
        ...prev,
        serviceId: prev.serviceId || firstService,
      }));
      setSelectedOrderId((prev) => prev || firstOrder);
    } catch (e) {
      const message = e.message || "No se pudieron cargar los datos de develop";
      setDevError(message);
      setAdminError(message);
      setUsersCatalog([]);
      setItemsCatalog([]);
      setOrdersCatalog([]);
      setCategoriesCatalog([]);
      setProjectsCatalog([]);
      setServicesCatalog([]);
      setVenuesCatalog([]);
      setEventsCatalog([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!assignServiceForm.serviceId) return;
    const current = servicesCatalog.find(
      (service) => String(service.id) === String(assignServiceForm.serviceId)
    );
    if (!current) return;
    const currentIds = Array.isArray(current.projects)
      ? current.projects.map((project) => Number(project.id))
      : [];
    setAssignServiceForm((prev) => ({
      ...prev,
      projectIds: currentIds,
    }));
  }, [assignServiceForm.serviceId, servicesCatalog]);

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

  const contentEntries = useMemo(() => {
    const typed = [
      ...projectsCatalog.map((item) => ({
        id: item.id,
        type: "project",
        typeLabel: "Proyecto",
        title: item.item?.title || item.title || `Proyecto #${item.id}`,
        subtitle: item.item?.description || "Sin descripción",
        raw: item,
      })),
      ...servicesCatalog.map((item) => ({
        id: item.id,
        type: "service",
        typeLabel: "Servicio",
        title: item.name || `Servicio #${item.id}`,
        subtitle: item.description || "Sin descripción",
        raw: item,
      })),
      ...venuesCatalog.map((item) => ({
        id: item.id,
        type: "venue",
        typeLabel: "Local",
        title: item.name || `Local #${item.id}`,
        subtitle: item.address || "Sin dirección",
        raw: item,
      })),
      ...eventsCatalog.map((item) => ({
        id: item.id,
        type: "event",
        typeLabel: "Evento",
        title: item.title || `Evento #${item.id}`,
        subtitle: item.description || "Sin descripción",
        raw: item,
      })),
    ];

    const filtered =
      contentTypeFilter === "all"
        ? typed
        : typed.filter((entry) => entry.type === contentTypeFilter);

    const normalizedSearch = searchContent.trim().toLowerCase();
    const searchFiltered = !normalizedSearch
      ? filtered
      : filtered.filter((entry) =>
          `${entry.title} ${entry.subtitle} ${entry.typeLabel} ${entry.id}`
            .toLowerCase()
            .includes(normalizedSearch)
        );

    return searchFiltered.sort((a, b) => Number(b.id || 0) - Number(a.id || 0));
  }, [projectsCatalog, servicesCatalog, venuesCatalog, eventsCatalog, contentTypeFilter, searchContent]);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchUsers.trim().toLowerCase();
    if (!normalizedSearch) return data;
    return data.filter((item) =>
      `${item.id} ${item.email || ""} ${item.username || ""}`
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [data, searchUsers]);

  const filteredReviews = useMemo(() => {
    const normalizedSearch = searchReviews.trim().toLowerCase();
    if (!normalizedSearch) return reviews;
    return reviews.filter((item) =>
      `${item.id} ${item.orderId} ${item.authorId || ""} ${item.authorUsername || ""} ${item.comment || ""}`
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [reviews, searchReviews]);

  const filteredDisputes = useMemo(() => {
    const normalizedSearch = searchDisputes.trim().toLowerCase();
    if (!normalizedSearch) return disputes;
    return disputes.filter((item) =>
      `${item.id} ${item.orderId} ${item.createdByUsername || ""} ${item.reason || ""} ${item.status || ""}`
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [disputes, searchDisputes]);

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

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setDevError("");
    setDevOk("");
    if (!user?.id) {
      setDevError("No se pudo identificar el usuario autenticado");
      return;
    }
    if (!createProjectForm.categoryId) {
      setDevError("Selecciona una categoría para el proyecto");
      return;
    }
    try {
      const basePriceValue =
        createProjectForm.basePrice === "" ? null : Number(createProjectForm.basePrice);
      const itemPayload = {
        creatorId: Number(user.id),
        title: createProjectForm.title.trim(),
        description: createProjectForm.description.trim() || null,
        basePrice: basePriceValue,
        itemType: "PROJECT",
        categoryId: Number(createProjectForm.categoryId),
      };
      const createdItem = await createDevItem(itemPayload);
      const itemId = Number(createdItem?.id);
      if (!itemId) throw new Error("No se pudo obtener el ID del item de proyecto");

      const slugBase = createProjectForm.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const projectPayload = {
        id: itemId,
        item: { id: itemId },
        blocks: "[]",
        background: JSON.stringify({ mode: "color", value: "#ffffff" }),
        blockGap: 0,
        published: false,
        slug: slugBase || `project-${itemId}`,
      };

      const projectRes = await fetchWithToken("/item-projects/register", {
        method: "POST",
        body: JSON.stringify(projectPayload),
      });
      if (!projectRes.ok) {
        throw new Error((await projectRes.text()) || "No se pudo crear el proyecto");
      }

      setCreateProjectForm((prev) => ({
        ...prev,
        title: "",
        description: "",
        basePrice: "",
      }));
      setDevOk("Proyecto creado correctamente.");
      await loadDevelopData();
    } catch (e2) {
      setDevError(e2.message || "No se pudo crear el proyecto");
    }
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    setDevError("");
    setDevOk("");
    if (!createServiceForm.categoryId) {
      setDevError("Selecciona una categoría para el servicio");
      return;
    }
    try {
      const payload = {
        name: createServiceForm.name.trim(),
        description: createServiceForm.description.trim(),
        deliveryDuration: Number(createServiceForm.deliveryDuration || 1),
        categoryId: Number(createServiceForm.categoryId),
        price: createServiceForm.price === "" ? null : Number(createServiceForm.price),
        coverImageUrl: createServiceForm.coverImageUrl.trim() || null,
        projectIds: createServiceForm.projectIds.map((id) => Number(id)),
      };
      const res = await fetchWithToken("/services", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error((await res.text()) || "No se pudo crear el servicio");
      }
      setCreateServiceForm((prev) => ({
        ...prev,
        name: "",
        description: "",
        deliveryDuration: "1",
        price: "",
        coverImageUrl: "",
        projectIds: [],
      }));
      setDevOk("Servicio creado correctamente.");
      await loadDevelopData();
    } catch (e2) {
      setDevError(e2.message || "No se pudo crear el servicio");
    }
  };

  const handleCreateVenue = async (e) => {
    e.preventDefault();
    setDevError("");
    setDevOk("");
    try {
      const formData = new FormData();
      formData.append("name", createVenueForm.name.trim());
      formData.append("address", createVenueForm.address.trim());
      if (createVenueForm.capacity !== "") formData.append("capacity", createVenueForm.capacity);
      if (createVenueForm.telefono.trim()) formData.append("telefono", createVenueForm.telefono.trim());
      if (createVenueForm.email.trim()) formData.append("email", createVenueForm.email.trim());
      if (createVenueForm.sitioWeb.trim()) formData.append("sitioWeb", createVenueForm.sitioWeb.trim());
      if (createVenueForm.horario.trim()) formData.append("horario", createVenueForm.horario.trim());

      const res = await fetchWithToken("/venues", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        throw new Error((await res.text()) || "No se pudo crear el local");
      }
      setCreateVenueForm({
        name: "",
        address: "",
        capacity: "",
        telefono: "",
        email: "",
        sitioWeb: "",
        horario: "",
      });
      setDevOk("Local creado correctamente.");
      await loadDevelopData();
    } catch (e2) {
      setDevError(e2.message || "No se pudo crear el local");
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setDevError("");
    setDevOk("");
    if (!createEventForm.venueId) {
      setDevError("Selecciona un local para el evento");
      return;
    }
    if (!createEventForm.startDate || !createEventForm.endDate) {
      setDevError("Debes indicar fecha de inicio y fin");
      return;
    }
    if (new Date(createEventForm.startDate) >= new Date(createEventForm.endDate)) {
      setDevError("La fecha de inicio debe ser anterior a la fecha de fin");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("venueId", createEventForm.venueId);
      formData.append("startDate", createEventForm.startDate);
      formData.append("endDate", createEventForm.endDate);
      if (createEventForm.title.trim()) formData.append("title", createEventForm.title.trim());
      if (createEventForm.description.trim()) formData.append("description", createEventForm.description.trim());
      if (createEventForm.precio !== "") formData.append("precio", createEventForm.precio);
      if (createEventForm.categoria.trim()) formData.append("categoria", createEventForm.categoria.trim());
      if (createEventForm.linkEntradas.trim()) {
        formData.append("linkEntradas", createEventForm.linkEntradas.trim());
      }

      const res = await fetchWithToken("/events", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        throw new Error((await res.text()) || "No se pudo crear el evento");
      }
      setCreateEventForm((prev) => ({
        ...prev,
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        precio: "",
        categoria: "",
        linkEntradas: "",
      }));
      setDevOk("Evento creado correctamente.");
      await loadDevelopData();
    } catch (e2) {
      setDevError(e2.message || "No se pudo crear el evento");
    }
  };

  const handleAssignProjectsToService = async (e) => {
    e.preventDefault();
    setDevError("");
    setDevOk("");
    const selectedService = servicesCatalog.find(
      (service) => String(service.id) === String(assignServiceForm.serviceId)
    );
    if (!selectedService) {
      setDevError("Selecciona un servicio válido");
      return;
    }
    const resolvedCategoryId = selectedService.categoryId
      || categoriesCatalog.find((category) => category.name === selectedService.category)?.id;

    if (!resolvedCategoryId) {
      setDevError("No se pudo resolver la categoría del servicio seleccionado");
      return;
    }

    try {
      const payload = {
        name: selectedService.name,
        description: selectedService.description || "",
        deliveryDuration: Number(selectedService.deliveryDuration || 1),
        categoryId: Number(resolvedCategoryId),
        price: selectedService.price ?? null,
        coverImageUrl: selectedService.coverImageUrl || null,
        projectIds: assignServiceForm.projectIds.map((id) => Number(id)),
      };

      const res = await fetchWithToken(`/services/${selectedService.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error((await res.text()) || "No se pudo actualizar el servicio");
      }
      setDevOk("Servicio actualizado y proyectos asignados.");
      await loadDevelopData();
    } catch (e2) {
      setDevError(e2.message || "No se pudo asignar proyectos al servicio");
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
    <div>
      {view === "users" && (
        <div className="admin-section-toolbar">
          <h2>Usuarios ({filteredUsers.length})</h2>
          <input
            type="search"
            className="admin-search-input"
            placeholder="Buscar por id, email o username..."
            value={searchUsers}
            onChange={(e) => setSearchUsers(e.target.value)}
          />
        </div>
      )}
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>{view === "users" ? "Email / Usuario" : "Título"}</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {(view === "users" ? filteredUsers : data).map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>
                {view === "users" ? (
                  <button
                    type="button"
                    className="admin-user-link"
                    onClick={() => navigate(`/profile/${item.id}`)}
                  >
                    {item.email} - @{item.username}
                  </button>
                ) : (
                  item.title
                )}
              </td>
              <td>
                <button className="btn-delete" onClick={() => handleDelete(item.id)}>
                  Borrar
                </button>
              </td>
            </tr>
          ))}
          {(view === "users" ? filteredUsers.length === 0 : data.length === 0) && (
            <tr>
              <td colSpan="3">No hay registros.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderContentPanel = () => (
    <div className="admin-content-panel">
      <div className="admin-content-toolbar">
        <h2>Contenido completo</h2>
        <input
          type="search"
          className="admin-search-input"
          placeholder="Buscar por título, descripción o ID..."
          value={searchContent}
          onChange={(e) => setSearchContent(e.target.value)}
        />
        <div className="admin-content-filters" role="tablist" aria-label="Filtrar contenido">
          {[
            { key: "all", label: "Todos" },
            { key: "project", label: "Proyectos" },
            { key: "service", label: "Servicios" },
            { key: "venue", label: "Locales" },
            { key: "event", label: "Eventos" },
          ].map((filter) => (
            <button
              key={filter.key}
              type="button"
              className={`admin-content-filter-btn${contentTypeFilter === filter.key ? " active" : ""}`}
              onClick={() => setContentTypeFilter(filter.key)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-content-list">
        {contentEntries.map((entry) => (
          <article
            key={`${entry.type}-${entry.id}`}
            className="admin-content-item"
            role="button"
            tabIndex={0}
            onClick={() => openContentDetail(entry)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openContentDetail(entry);
              }
            }}
          >
            <div>
              <span className={`admin-type-badge ${entry.type}`}>{entry.typeLabel}</span>
              <h3>{entry.title}</h3>
              <p>{entry.subtitle}</p>
            </div>
            <button
              type="button"
              className="btn-secondary"
              onClick={(e) => {
                e.stopPropagation();
                openContentDetail(entry);
              }}
            >
              Ver detalle
            </button>
          </article>
        ))}
        {contentEntries.length === 0 && (
          <p className="admin-empty">No hay elementos para este filtro.</p>
        )}
      </div>
    </div>
  );

  const renderDisputes = () => {
    if (selectedDispute) {
      return (
        <div>
          <button 
            className="btn-secondary"
            onClick={() => setSelectedDispute(null)}
          >
            ← Volver a disputas
          </button>
          <DisputePanel 
            disputeId={selectedDispute}
            currentUserId={null}
            isAdmin={true}
          />
        </div>
      );
    }

    return (
      <div>
        <div className="disputes-controls">
          <h2>Disputas abiertas ({filteredDisputes.length})</h2>
          <div className="admin-disputes-actions">
            <input
              type="search"
              className="admin-search-input"
              placeholder="Buscar en disputas..."
              value={searchDisputes}
              onChange={(e) => setSearchDisputes(e.target.value)}
            />
            <button className="btn-secondary" onClick={loadDisputes}>
              Refrescar
            </button>
          </div>
        </div>
        
        {filteredDisputes.length === 0 ? (
          <p>No hay disputas.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Orden</th>
                <th>Creada por</th>
                <th>Motivo</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredDisputes.map((dispute) => {
                const creatorId = dispute.createdById ?? dispute.createdByUserId ?? dispute.createdBy ?? null;
                return (
                <tr key={dispute.id}>
                  <td>#{dispute.id}</td>
                  <td>#{dispute.orderId}</td>
                  <td>
                    {creatorId ? (
                      <button
                        type="button"
                        className="admin-user-link"
                        onClick={() => navigate(`/profile/${creatorId}`)}
                      >
                        @{dispute.createdByUsername}
                      </button>
                    ) : (
                      dispute.createdByUsername
                    )}
                  </td>
                  <td>{(dispute.reason || "").substring(0, 50)}...</td>
                  <td>
                    <span className={`status-badge ${dispute.status.toLowerCase()}`}>
                      {dispute.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn-primary"
                      onClick={() => setSelectedDispute(dispute.id)}
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  const renderDevelopPanel = () => (
    <div className="dev-layout">
      <section className="dev-card dev-card-wide">
        <h2>Resumen de Contenido</h2>
        <div className="dev-orders-grid">
          <article className="dev-order-item">
            <h3>Servicios</h3>
            <p>{servicesCatalog.length} registrados</p>
          </article>
          <article className="dev-order-item">
            <h3>Proyectos</h3>
            <p>{projectsCatalog.length} registrados</p>
          </article>
          <article className="dev-order-item">
            <h3>Locales</h3>
            <p>{venuesCatalog.length} registrados</p>
          </article>
          <article className="dev-order-item">
            <h3>Eventos</h3>
            <p>{eventsCatalog.length} registrados</p>
          </article>
        </div>
      </section>

      <section className="dev-card dev-card-wide dev-card-category">
        <h2>Gestión de entidades</h2>
        <p className="admin-empty">Usuarios, contenido y relaciones principales.</p>
      </section>

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
        <h2>Crear Proyecto (seguro)</h2>
        <p className="admin-empty">El creador se toma del usuario autenticado.</p>
        <form className="dev-form" onSubmit={handleCreateProject}>
          <label>
            Título
            <input
              value={createProjectForm.title}
              onChange={(e) => setCreateProjectForm((p) => ({ ...p, title: e.target.value }))}
              minLength={3}
              required
            />
          </label>

          <label>
            Descripción
            <textarea
              rows={2}
              value={createProjectForm.description}
              onChange={(e) => setCreateProjectForm((p) => ({ ...p, description: e.target.value }))}
            />
          </label>

          <label>
            Precio base
            <input
              type="number"
              min="0"
              step="0.01"
              value={createProjectForm.basePrice}
              onChange={(e) => setCreateProjectForm((p) => ({ ...p, basePrice: e.target.value }))}
            />
          </label>

          <label>
            Categoría
            <select
              value={createProjectForm.categoryId}
              onChange={(e) => setCreateProjectForm((p) => ({ ...p, categoryId: e.target.value }))}
              required
            >
              {categoriesCatalog.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.id} · {category.name}
                </option>
              ))}
            </select>
          </label>

          <button className="btn-primary" type="submit">Crear proyecto</button>
        </form>
      </section>

      <section className="dev-card">
        <h2>Crear Servicio</h2>
        <form className="dev-form" onSubmit={handleCreateService}>
          <label>
            Nombre
            <input
              value={createServiceForm.name}
              onChange={(e) => setCreateServiceForm((p) => ({ ...p, name: e.target.value }))}
              required
            />
          </label>

          <label>
            Descripción
            <textarea
              rows={2}
              value={createServiceForm.description}
              onChange={(e) => setCreateServiceForm((p) => ({ ...p, description: e.target.value }))}
            />
          </label>

          <label>
            Categoría
            <select
              value={createServiceForm.categoryId}
              onChange={(e) => setCreateServiceForm((p) => ({ ...p, categoryId: e.target.value }))}
              required
            >
              {categoriesCatalog.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.id} · {category.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Entrega (días)
            <input
              type="number"
              min="1"
              value={createServiceForm.deliveryDuration}
              onChange={(e) => setCreateServiceForm((p) => ({ ...p, deliveryDuration: e.target.value }))}
              required
            />
          </label>

          <label>
            Precio
            <input
              type="number"
              min="0"
              step="0.01"
              value={createServiceForm.price}
              onChange={(e) => setCreateServiceForm((p) => ({ ...p, price: e.target.value }))}
              placeholder="Opcional"
            />
          </label>

          <label>
            URL portada
            <input
              value={createServiceForm.coverImageUrl}
              onChange={(e) => setCreateServiceForm((p) => ({ ...p, coverImageUrl: e.target.value }))}
              placeholder="https://..."
            />
          </label>

          <label>
            Proyectos vinculados
            <select
              multiple
              value={createServiceForm.projectIds.map(String)}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions).map((option) => Number(option.value));
                setCreateServiceForm((p) => ({ ...p, projectIds: selected }));
              }}
            >
              {projectsCatalog.map((project) => (
                <option key={project.id} value={project.id}>
                  #{project.id} · {project.item?.title ?? "Proyecto"}
                </option>
              ))}
            </select>
          </label>

          <button className="btn-primary" type="submit">Crear servicio</button>
        </form>
      </section>

      <section className="dev-card">
        <h2>Crear Local</h2>
        <form className="dev-form" onSubmit={handleCreateVenue}>
          <label>
            Nombre
            <input
              value={createVenueForm.name}
              onChange={(e) => setCreateVenueForm((p) => ({ ...p, name: e.target.value }))}
              required
            />
          </label>

          <label>
            Dirección
            <input
              value={createVenueForm.address}
              onChange={(e) => setCreateVenueForm((p) => ({ ...p, address: e.target.value }))}
              required
            />
          </label>

          <label>
            Aforo
            <input
              type="number"
              min="1"
              value={createVenueForm.capacity}
              onChange={(e) => setCreateVenueForm((p) => ({ ...p, capacity: e.target.value }))}
            />
          </label>

          <label>
            Teléfono
            <input
              value={createVenueForm.telefono}
              onChange={(e) => setCreateVenueForm((p) => ({ ...p, telefono: e.target.value }))}
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={createVenueForm.email}
              onChange={(e) => setCreateVenueForm((p) => ({ ...p, email: e.target.value }))}
            />
          </label>

          <button className="btn-primary" type="submit">Crear local</button>
        </form>
      </section>

      <section className="dev-card">
        <h2>Crear Evento</h2>
        <form className="dev-form" onSubmit={handleCreateEvent}>
          <label>
            Título
            <input
              value={createEventForm.title}
              onChange={(e) => setCreateEventForm((p) => ({ ...p, title: e.target.value }))}
              required
            />
          </label>

          <label>
            Local
            <select
              value={createEventForm.venueId}
              onChange={(e) => setCreateEventForm((p) => ({ ...p, venueId: e.target.value }))}
              required
            >
              {venuesCatalog.map((venue) => (
                <option key={venue.id} value={venue.id}>
                  #{venue.id} · {venue.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Inicio
            <input
              type="datetime-local"
              value={createEventForm.startDate}
              onChange={(e) => setCreateEventForm((p) => ({ ...p, startDate: e.target.value }))}
              required
            />
          </label>

          <label>
            Fin
            <input
              type="datetime-local"
              value={createEventForm.endDate}
              onChange={(e) => setCreateEventForm((p) => ({ ...p, endDate: e.target.value }))}
              required
            />
          </label>

          <label>
            Precio
            <input
              type="number"
              min="0"
              step="0.01"
              value={createEventForm.precio}
              onChange={(e) => setCreateEventForm((p) => ({ ...p, precio: e.target.value }))}
            />
          </label>

          <button className="btn-primary" type="submit">Crear evento</button>
        </form>
      </section>

      <section className="dev-card dev-card-wide">
        <h2>Asignar Proyectos a Servicio</h2>
        <form className="dev-form" onSubmit={handleAssignProjectsToService}>
          <label>
            Servicio
            <select
              value={assignServiceForm.serviceId}
              onChange={(e) => setAssignServiceForm((p) => ({ ...p, serviceId: e.target.value }))}
              required
            >
              {servicesCatalog.map((service) => (
                <option key={service.id} value={service.id}>
                  #{service.id} · {service.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Proyectos
            <select
              multiple
              value={assignServiceForm.projectIds.map(String)}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions).map((option) => Number(option.value));
                setAssignServiceForm((p) => ({ ...p, projectIds: selected }));
              }}
            >
              {projectsCatalog.map((project) => (
                <option key={project.id} value={project.id}>
                  #{project.id} · {project.item?.title ?? "Proyecto"}
                </option>
              ))}
            </select>
          </label>

          <button className="btn-primary" type="submit">Guardar asignación</button>
        </form>
      </section>

      <section className="dev-card dev-card-wide dev-card-category">
        <h2>Gestión de encargos</h2>
        <p className="admin-empty">Órdenes, estado y mensajería entre participantes.</p>
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
          className={view === "disputes" ? "active" : ""} 
          onClick={() => setView("disputes")}
        >
          Disputas
        </button>
        <button
          className={view === "reviews" ? "active" : ""}
          onClick={() => setView("reviews")}
        >
          Reviews
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
      ) : view === "items" ? (
        renderContentPanel()
      ) : view === "develop" ? (
        renderDevelopPanel()
      ) : view === "disputes" ? (
        renderDisputes()
      ) : view === "reviews" ? (
        renderReviews()
      ) : (
        renderBasicTable()
      )}

      {contentModal.open && (
        <DetailModal
          type={contentModal.type}
          data={contentModal.data}
          onClose={closeContentModal}
        />
      )}

      {selectedService && (
        <ServiceDetail
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}

      {selectedProjectId && (
        <ProjectView
          projectId={selectedProjectId}
          onClose={() => setSelectedProjectId(null)}
        />
      )}
    </div>
  );
}