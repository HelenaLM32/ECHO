import { useState } from "react";

// Hook enorme que gestiona todos los formularios del panel de admin
// Tiene estados para cada form (ordenes, usuarios, proyectos, servicios, venues, eventos)
// Y funciones para actualizar campos, resetear, etc
const INITIAL_CREATE_ORDER_FORM = {
  buyerId: "",
  itemId: "",
  finalPrice: "",
  status: "PENDING",
};

const INITIAL_STATUS_FORM = {
  orderId: "",
  status: "IN_PROGRESS",
};

const INITIAL_MESSAGE_FORM = {
  senderId: "",
  content: "",
};

const INITIAL_CREATE_USER_FORM = {
  email: "",
  username: "",
  password: "",
};

const INITIAL_CREATE_PROJECT_FORM = {
  title: "",
  description: "",
  basePrice: "",
  categoryId: "",
};

const INITIAL_CREATE_SERVICE_FORM = {
  name: "",
  description: "",
  deliveryDuration: "1",
  categoryId: "",
  price: "",
  coverImageUrl: "",
  projectIds: [],
};

const INITIAL_CREATE_VENUE_FORM = {
  name: "",
  address: "",
  capacity: "",
  telefono: "",
  email: "",
  sitioWeb: "",
  horario: "",
};

const INITIAL_CREATE_EVENT_FORM = {
  title: "",
  description: "",
  venueId: "",
  startDate: "",
  endDate: "",
  precio: "",
  categoria: "",
  linkEntradas: "",
};

const INITIAL_ASSIGN_SERVICE_FORM = {
  serviceId: "",
  projectIds: [],
};

export default function useAdminDevelopForms() {
  const [createOrderForm, setCreateOrderForm] = useState(INITIAL_CREATE_ORDER_FORM);
  const [statusForm, setStatusForm] = useState(INITIAL_STATUS_FORM);
  const [messageForm, setMessageForm] = useState(INITIAL_MESSAGE_FORM);
  const [selectedOwnerId, setSelectedOwnerId] = useState("");
  const [createUserForm, setCreateUserForm] = useState(INITIAL_CREATE_USER_FORM);
  const [createProjectForm, setCreateProjectForm] = useState(INITIAL_CREATE_PROJECT_FORM);
  const [createServiceForm, setCreateServiceForm] = useState(INITIAL_CREATE_SERVICE_FORM);
  const [createVenueForm, setCreateVenueForm] = useState(INITIAL_CREATE_VENUE_FORM);
  const [createEventForm, setCreateEventForm] = useState(INITIAL_CREATE_EVENT_FORM);
  const [assignServiceForm, setAssignServiceForm] = useState(INITIAL_ASSIGN_SERVICE_FORM);
  const [selectedOrderId, setSelectedOrderId] = useState("");

  const onCreateUserFieldChange = (field, value) => {
    setCreateUserForm((prev) => ({ ...prev, [field]: value }));
  };

  const onCreateProjectFieldChange = (field, value) => {
    setCreateProjectForm((prev) => ({ ...prev, [field]: value }));
  };

  const onCreateServiceFieldChange = (field, value) => {
    setCreateServiceForm((prev) => ({ ...prev, [field]: value }));
  };

  const onCreateServiceProjectIdsChange = (values) => {
    setCreateServiceForm((prev) => ({ ...prev, projectIds: values }));
  };

  const onCreateVenueFieldChange = (field, value) => {
    setCreateVenueForm((prev) => ({ ...prev, [field]: value }));
  };

  const onCreateEventFieldChange = (field, value) => {
    setCreateEventForm((prev) => ({ ...prev, [field]: value }));
  };

  const onAssignServiceFieldChange = (field, value) => {
    setAssignServiceForm((prev) => ({ ...prev, [field]: value }));
  };

  const onAssignServiceProjectIdsChange = (values) => {
    setAssignServiceForm((prev) => ({ ...prev, projectIds: values }));
  };

  const onCreateOrderFieldChange = (field, value) => {
    setCreateOrderForm((prev) => ({ ...prev, [field]: value }));
  };

  const onStatusFieldChange = (field, value) => {
    setStatusForm((prev) => ({ ...prev, [field]: value }));
  };

  const onMessageFieldChange = (field, value) => {
    setMessageForm((prev) => ({ ...prev, [field]: value }));
  };

  const applyDevelopDefaults = ({
    firstBuyer,
    firstItem,
    firstOrder,
    firstCategory,
    firstVenue,
    firstService,
    firstOwner,
  }) => {
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
    setSelectedOwnerId((prev) => prev || firstOwner);
  };

  const onSelectedOwnerChange = (value) => {
    setSelectedOwnerId(value);
  };

  const syncAssignServiceProjects = (servicesCatalog) => {
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
  };

  const syncMessageSender = (senderOptions) => {
    if (senderOptions.length === 0) {
      setMessageForm((prev) => ({ ...prev, senderId: "" }));
      return;
    }
    const valid = senderOptions.some((u) => String(u.id) === String(messageForm.senderId));
    if (!valid) {
      setMessageForm((prev) => ({ ...prev, senderId: String(senderOptions[0].id) }));
    }
  };

  const resetCreateUserForm = () => setCreateUserForm(INITIAL_CREATE_USER_FORM);
  const resetCreateServiceForm = () => setCreateServiceForm(INITIAL_CREATE_SERVICE_FORM);
  const resetCreateVenueForm = () => setCreateVenueForm(INITIAL_CREATE_VENUE_FORM);

  const resetCreateEventFormAfterSubmit = () => {
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
  };

  const clearProjectDraftFields = () => {
    setCreateProjectForm((prev) => ({
      ...prev,
      title: "",
      description: "",
      basePrice: "",
    }));
  };

  const clearMessageContent = () => {
    setMessageForm((prev) => ({ ...prev, content: "" }));
  };

  return {
    createOrderForm,
    setCreateOrderForm,
    statusForm,
    setStatusForm,
    messageForm,
    setMessageForm,
    selectedOwnerId,
    setSelectedOwnerId,
    createUserForm,
    setCreateUserForm,
    createProjectForm,
    setCreateProjectForm,
    createServiceForm,
    setCreateServiceForm,
    createVenueForm,
    setCreateVenueForm,
    createEventForm,
    setCreateEventForm,
    assignServiceForm,
    setAssignServiceForm,
    selectedOrderId,
    setSelectedOrderId,
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
  };
}
