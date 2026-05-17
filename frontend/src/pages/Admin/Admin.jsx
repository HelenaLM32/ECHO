import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithToken } from "../../services/config";
import {
  createDevUser,
  createDevOrder,
  updateDevOrderStatus,
  getDevOrderMessages,
  createDevOrderMessage,
  createDevProject,
  createDevService,
  createDevVenue,
  createDevEvent,
  deleteDevContent,
} from "../../services/adminDev";
import { getAllDisputes } from "../../services/disputes";
import { getAllReviews, deleteReview } from "../../services/reviews";
import DetailModal from "../../components/Modals/DetailModal/DetailModal";
import ServiceDetail from "../../components/ItemService/ServiceDetail/ServiceDetail";
import PopupConfirm from "../../components/Modals/PopupConfirm/PopupConfirm";
import PopupSuccess from "../../components/Modals/PopupSuccess/PopupSuccess";
import ProjectView from "../ItemProject/ProjectView";
import {
  AdminTabs,
  AdminBasicTable,
  AdminReviewsPanel,
  AdminContentPanel,
  AdminDisputesPanel,
  AdminDevelopPanel,
} from "../../components/Admin";
import useConfirmPopup from "../../hooks/useConfirmPopup";
import useSuccessPopup from "../../hooks/useSuccessPopup";
import useAdminDevelopForms from "../../hooks/useAdminDevelopForms";
import "./Admin.css";

export default function Admin() {
  const navigate = useNavigate();
  const { confirmState, showConfirm, handleConfirm, handleCancel } = useConfirmPopup();
  const { successState, showSuccess, hideSuccess } = useSuccessPopup();
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

  const {
    createOrderForm,
    statusForm,
    messageForm,
    createUserForm,
    createProjectForm,
    createServiceForm,
    createVenueForm,
    createEventForm,
    assignServiceForm,
    selectedOrderId,
    setSelectedOrderId,
    selectedOwnerId,
    onCreateUserFieldChange,
    onCreateProjectFieldChange,
    onCreateServiceFieldChange,
    onCreateServiceProjectIdsChange,
    onCreateVenueFieldChange,
    onCreateEventFieldChange,
    onAssignServiceFieldChange,
    onAssignServiceProjectIdsChange,
    onCreateOrderFieldChange,
    onStatusFieldChange,
    onMessageFieldChange,
    onSelectedOwnerChange,
    applyDevelopDefaults,
    syncAssignServiceProjects,
    syncMessageSender,
    resetCreateUserForm,
    resetCreateServiceForm,
    resetCreateVenueForm,
    resetCreateEventFormAfterSubmit,
    clearProjectDraftFields,
    clearMessageContent,
  } = useAdminDevelopForms();

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
    showConfirm(
      "¿Eliminar esta review?",
      "Confirmar eliminación",
      async () => {
        try {
          await deleteReview(id);
          setReviews((prev) => prev.filter((r) => r.id !== id));
        } catch {
          showSuccess("Error al eliminar la review.", "Error");
        }
      }
    );
  };

  const renderReviews = () => (
    <AdminReviewsPanel
      filteredReviews={filteredReviews}
      searchReviews={searchReviews}
      onSearchReviewsChange={setSearchReviews}
      onDeleteReview={handleDeleteReview}
      onAuthorClick={(authorId) => navigate(`/profile/${authorId}`)}
    />
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
      const firstOwner = users[0]?.id ? String(users[0].id) : "";

      applyDevelopDefaults({
        firstBuyer,
        firstItem,
        firstOrder,
        firstCategory,
        firstVenue,
        firstService,
        firstOwner,
      });
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
    syncAssignServiceProjects(servicesCatalog);
  }, [assignServiceForm.serviceId, servicesCatalog]);

  const handleDelete = async (id) => {
    showConfirm(
      "¿Seguro que quieres borrar este registro?",
      "Confirmar eliminación",
      async () => {
        try {
          const endpoint = view === "users" ? `/users/${id}` : `/items/${id}`;
          await fetchWithToken(endpoint, { method: "DELETE" });
          setData(data.filter((item) => item.id !== id));
        } catch {
          showSuccess("Fallo al ejecutar el borrado.", "Error");
        }
      }
    );
  };

  const handleDeleteContent = (entry) => {
    if (!entry?.id || !entry?.type) return;
    showConfirm(
      `¿Seguro que quieres eliminar este ${entry.typeLabel?.toLowerCase() || "contenido"}?`,
      "Confirmar eliminacion",
      async () => {
        try {
          await deleteDevContent(entry.type, entry.id);
          if (entry.type === "project") {
            setSelectedProjectId((prev) => (String(prev) === String(entry.id) ? null : prev));
          }
          if (entry.type === "service") {
            setSelectedService((prev) => (prev?.id === entry.id ? null : prev));
          }
          if (entry.type === "venue" || entry.type === "event") {
            setContentModal((prev) => {
              if (!prev.open || !prev.data) return prev;
              return String(prev.data.id) === String(entry.id)
                ? { open: false, type: null, data: null }
                : prev;
            });
          }
          await loadDevelopData();
        } catch (e) {
          showSuccess(e.message || "No se pudo eliminar el contenido.", "Error");
        }
      }
    );
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
    syncMessageSender(senderOptions);
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
      resetCreateUserForm();
      setDevOk("Usuario creado correctamente.");
      await loadDevelopData();
    } catch (e2) {
      setDevError(e2.message || "No se pudo crear el usuario");
    }
  };

  const createProjectForOwner = async ({ openEditor }) => {
    setDevError("");
    setDevOk("");
    const ownerUserId = Number(selectedOwnerId);
    if (!ownerUserId) {
      setDevError("Selecciona el usuario propietario del proyecto");
      return;
    }
    if (!createProjectForm.categoryId) {
      setDevError("Selecciona una categoría para el proyecto");
      return;
    }
    try {
      const basePriceValue =
        createProjectForm.basePrice === "" ? null : Number(createProjectForm.basePrice);
      const slugBase = createProjectForm.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const createdProject = await createDevProject({
        ownerUserId,
        title: createProjectForm.title.trim(),
        description: createProjectForm.description.trim() || null,
        basePrice: basePriceValue,
        categoryId: Number(createProjectForm.categoryId),
        blocks: "[]",
        background: JSON.stringify({ mode: "color", value: "#ffffff" }),
        blockGap: 0,
        published: false,
        slug: slugBase || undefined,
      });

      const projectId = Number(createdProject?.id ?? createdProject?.item?.id);
      if (!projectId) throw new Error("No se pudo obtener el ID del proyecto");

      clearProjectDraftFields();
      setDevOk("Proyecto creado correctamente.");
      await loadDevelopData();
      if (openEditor) {
        navigate(`/projects/${projectId}/edit`);
      }
    } catch (e2) {
      setDevError(e2.message || "No se pudo crear el proyecto");
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    await createProjectForOwner({ openEditor: false });
  };

  const handleCreateProjectAndOpenEditor = async () => {
    await createProjectForOwner({ openEditor: true });
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    setDevError("");
    setDevOk("");
    if (!createServiceForm.categoryId) {
      setDevError("Selecciona una categoría para el servicio");
      return;
    }
    const ownerUserId = Number(selectedOwnerId);
    if (!ownerUserId) {
      setDevError("Selecciona el usuario propietario del servicio");
      return;
    }
    try {
      await createDevService({
        ownerUserId,
        name: createServiceForm.name.trim(),
        description: createServiceForm.description.trim(),
        deliveryDuration: Number(createServiceForm.deliveryDuration || 1),
        categoryId: Number(createServiceForm.categoryId),
        price: createServiceForm.price === "" ? null : Number(createServiceForm.price),
        coverImageUrl: createServiceForm.coverImageUrl.trim() || null,
        projectIds: createServiceForm.projectIds.map((id) => Number(id)),
      });
      resetCreateServiceForm();
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
    const ownerUserId = Number(selectedOwnerId);
    if (!ownerUserId) {
      setDevError("Selecciona el usuario propietario del local");
      return;
    }
    try {
      await createDevVenue({
        ownerUserId,
        name: createVenueForm.name.trim(),
        address: createVenueForm.address.trim(),
        capacity: createVenueForm.capacity === "" ? null : Number(createVenueForm.capacity),
        telefono: createVenueForm.telefono.trim() || null,
        email: createVenueForm.email.trim() || null,
        sitioWeb: createVenueForm.sitioWeb.trim() || null,
        horario: createVenueForm.horario.trim() || null,
      });
      resetCreateVenueForm();
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
    const ownerUserId = Number(selectedOwnerId);
    if (!ownerUserId) {
      setDevError("Selecciona el usuario propietario del evento");
      return;
    }
    if (new Date(createEventForm.startDate) >= new Date(createEventForm.endDate)) {
      setDevError("La fecha de inicio debe ser anterior a la fecha de fin");
      return;
    }
    try {
      await createDevEvent({
        ownerUserId,
        venueId: Number(createEventForm.venueId),
        startDate: createEventForm.startDate,
        endDate: createEventForm.endDate,
        title: createEventForm.title.trim() || null,
        description: createEventForm.description.trim() || null,
        precio: createEventForm.precio === "" ? null : Number(createEventForm.precio),
        categoria: createEventForm.categoria.trim() || null,
        linkEntradas: createEventForm.linkEntradas.trim() || null,
      });
      resetCreateEventFormAfterSubmit();
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
      clearMessageContent();
      setDevOk("Mensaje enviado.");
      await handleLoadMessages();
    } catch (e2) {
      setDevError(e2.message || "No se pudo enviar el mensaje");
    }
  };

  const renderBasicTable = () => (
    <AdminBasicTable
      view={view}
      data={data}
      filteredUsers={filteredUsers}
      searchUsers={searchUsers}
      onSearchUsersChange={setSearchUsers}
      onDelete={handleDelete}
      onUserClick={(userId) => navigate(`/profile/${userId}`)}
    />
  );

  const renderContentPanel = () => (
    <AdminContentPanel
      searchContent={searchContent}
      onSearchContentChange={setSearchContent}
      contentTypeFilter={contentTypeFilter}
      onContentTypeChange={setContentTypeFilter}
      contentEntries={contentEntries}
      onOpenContentDetail={openContentDetail}
      onDeleteContent={handleDeleteContent}
    />
  );

  const renderDisputes = () => (
    <AdminDisputesPanel
      selectedDispute={selectedDispute}
      onBackToDisputes={() => setSelectedDispute(null)}
      filteredDisputes={filteredDisputes}
      searchDisputes={searchDisputes}
      onSearchDisputesChange={setSearchDisputes}
      onRefreshDisputes={loadDisputes}
      onOpenDispute={setSelectedDispute}
      onCreatorClick={(creatorId) => navigate(`/profile/${creatorId}`)}
    />
  );

  const renderDevelopPanel = () => (
    <AdminDevelopPanel
      servicesCatalog={servicesCatalog}
      projectsCatalog={projectsCatalog}
      venuesCatalog={venuesCatalog}
      eventsCatalog={eventsCatalog}
      categoriesCatalog={categoriesCatalog}
      usersCatalog={usersCatalog}
      itemsCatalog={itemsCatalog}
      ordersCatalog={ordersCatalog}
      createUserForm={createUserForm}
      createProjectForm={createProjectForm}
      createServiceForm={createServiceForm}
      createVenueForm={createVenueForm}
      createEventForm={createEventForm}
      assignServiceForm={assignServiceForm}
      createOrderForm={createOrderForm}
      statusForm={statusForm}
      selectedOrderId={selectedOrderId}
      selectedOwnerId={selectedOwnerId}
      messageForm={messageForm}
      senderOptions={senderOptions}
      messages={messages}
      onCreateUserFieldChange={onCreateUserFieldChange}
      onCreateProjectFieldChange={onCreateProjectFieldChange}
      onCreateServiceFieldChange={onCreateServiceFieldChange}
      onCreateServiceProjectIdsChange={onCreateServiceProjectIdsChange}
      onCreateVenueFieldChange={onCreateVenueFieldChange}
      onCreateEventFieldChange={onCreateEventFieldChange}
      onAssignServiceFieldChange={onAssignServiceFieldChange}
      onAssignServiceProjectIdsChange={onAssignServiceProjectIdsChange}
      onCreateOrderFieldChange={onCreateOrderFieldChange}
      onStatusFieldChange={onStatusFieldChange}
      onSelectedOwnerChange={onSelectedOwnerChange}
      onSelectedOrderChange={setSelectedOrderId}
      onMessageFieldChange={onMessageFieldChange}
      onCreateUser={handleCreateUser}
      onCreateProject={handleCreateProject}
      onCreateProjectAndOpenEditor={handleCreateProjectAndOpenEditor}
      onCreateService={handleCreateService}
      onCreateVenue={handleCreateVenue}
      onCreateEvent={handleCreateEvent}
      onAssignProjectsToService={handleAssignProjectsToService}
      onCreateOrder={handleCreateOrder}
      onStatusUpdate={handleStatusUpdate}
      onLoadMessages={handleLoadMessages}
      onCreateMessage={handleCreateMessage}
      onRefreshDevelopData={loadDevelopData}
    />
  );

  return (
    <div className="admin-container">
      <h1>Panel de Administración</h1>
      
      <AdminTabs view={view} onChangeView={setView} />

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

      <PopupConfirm
        isOpen={confirmState.isOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        message={confirmState.message}
        title={confirmState.title}
      />

      <PopupSuccess
        isOpen={successState.isOpen}
        onClose={hideSuccess}
        message={successState.message}
        title={successState.title}
      />
    </div>
  );
}
