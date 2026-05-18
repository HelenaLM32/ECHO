const ORDER_STATUS_OPTIONS = ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

export default function AdminDevelopPanel({
  servicesCatalog,
  projectsCatalog,
  venuesCatalog,
  eventsCatalog,
  categoriesCatalog,
  usersCatalog,
  itemsCatalog,
  ordersCatalog,
  createUserForm,
  createProjectForm,
  createServiceForm,
  createVenueForm,
  createEventForm,
  assignServiceForm,
  createOrderForm,
  statusForm,
  selectedOrderId,
  selectedOwnerId,
  messageForm,
  senderOptions,
  messages,
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
  onSelectedOwnerChange,
  onSelectedOrderChange,
  onMessageFieldChange,
  onCreateUser,
  onCreateProject,
  onCreateProjectAndOpenEditor,
  onCreateService,
  onCreateVenue,
  onCreateEvent,
  onAssignProjectsToService,
  onCreateOrder,
  onStatusUpdate,
  onLoadMessages,
  onCreateMessage,
  onRefreshDevelopData,
}) {
  return (
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
        <form className="dev-form" onSubmit={onCreateUser}>
          <label>
            Email
            <input
              type="email"
              value={createUserForm.email}
              onChange={(e) => onCreateUserFieldChange("email", e.target.value)}
              required
            />
          </label>

          <label>
            Username
            <input
              value={createUserForm.username}
              onChange={(e) => onCreateUserFieldChange("username", e.target.value)}
              minLength={3}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={createUserForm.password}
              onChange={(e) => onCreateUserFieldChange("password", e.target.value)}
              minLength={6}
              required
            />
          </label>

          <button className="btn-primary" type="submit">
            Crear usuario
          </button>
        </form>
      </section>

      <section className="dev-card">
        <h2>Crear Proyecto</h2>
        <form className="dev-form" onSubmit={onCreateProject}>
          <label>
            Asignar a usuario
            <select
              value={selectedOwnerId}
              onChange={(e) => onSelectedOwnerChange(e.target.value)}
              required
            >
              {usersCatalog.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.id} · {user.username} · {user.email}
                </option>
              ))}
            </select>
          </label>

          <label>
            Título
            <input
              value={createProjectForm.title}
              onChange={(e) => onCreateProjectFieldChange("title", e.target.value)}
              minLength={3}
              required
            />
          </label>

          <label>
            Descripción
            <textarea
              rows={2}
              value={createProjectForm.description}
              onChange={(e) => onCreateProjectFieldChange("description", e.target.value)}
            />
          </label>

          <label>
            Precio base
            <input
              type="number"
              min="0"
              step="0.01"
              value={createProjectForm.basePrice}
              onChange={(e) => onCreateProjectFieldChange("basePrice", e.target.value)}
            />
          </label>

          <label>
            Categoría
            <select
              value={createProjectForm.categoryId}
              onChange={(e) => onCreateProjectFieldChange("categoryId", e.target.value)}
              required
            >
              {categoriesCatalog.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.id} · {category.name}
                </option>
              ))}
            </select>
          </label>

          <button className="btn-primary" type="submit">
            Crear proyecto
          </button>
          <button className="btn-secondary" type="button" onClick={onCreateProjectAndOpenEditor}>
            Crear y abrir editor
          </button>
        </form>
      </section>

      <section className="dev-card">
        <h2>Crear Servicio</h2>
        <form className="dev-form" onSubmit={onCreateService}>
          <label>
            Asignar a usuario
            <select
              value={selectedOwnerId}
              onChange={(e) => onSelectedOwnerChange(e.target.value)}
              required
            >
              {usersCatalog.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.id} · {user.username} · {user.email}
                </option>
              ))}
            </select>
          </label>

          <label>
            Nombre
            <input
              value={createServiceForm.name}
              onChange={(e) => onCreateServiceFieldChange("name", e.target.value)}
              required
            />
          </label>

          <label>
            Descripción
            <textarea
              rows={2}
              value={createServiceForm.description}
              onChange={(e) => onCreateServiceFieldChange("description", e.target.value)}
            />
          </label>

          <label>
            Categoría
            <select
              value={createServiceForm.categoryId}
              onChange={(e) => onCreateServiceFieldChange("categoryId", e.target.value)}
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
              onChange={(e) => onCreateServiceFieldChange("deliveryDuration", e.target.value)}
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
              onChange={(e) => onCreateServiceFieldChange("price", e.target.value)}
              placeholder="Opcional"
            />
          </label>

          <label>
            URL portada
            <input
              value={createServiceForm.coverImageUrl}
              onChange={(e) => onCreateServiceFieldChange("coverImageUrl", e.target.value)}
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
                onCreateServiceProjectIdsChange(selected);
              }}
            >
              {projectsCatalog.map((project) => (
                <option key={project.id} value={project.id}>
                  #{project.id} · {project.item?.title ?? "Proyecto"}
                </option>
              ))}
            </select>
          </label>

          <button className="btn-primary" type="submit">
            Crear servicio
          </button>
        </form>
      </section>

      <section className="dev-card">
        <h2>Crear Local</h2>
        <form className="dev-form" onSubmit={onCreateVenue}>
          <label>
            Asignar a usuario
            <select
              value={selectedOwnerId}
              onChange={(e) => onSelectedOwnerChange(e.target.value)}
              required
            >
              {usersCatalog.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.id} · {user.username} · {user.email}
                </option>
              ))}
            </select>
          </label>

          <label>
            Nombre
            <input
              value={createVenueForm.name}
              onChange={(e) => onCreateVenueFieldChange("name", e.target.value)}
              required
            />
          </label>

          <label>
            Dirección
            <input
              value={createVenueForm.address}
              onChange={(e) => onCreateVenueFieldChange("address", e.target.value)}
              required
            />
          </label>

          <label>
            Aforo
            <input
              type="number"
              min="1"
              value={createVenueForm.capacity}
              onChange={(e) => onCreateVenueFieldChange("capacity", e.target.value)}
            />
          </label>

          <label>
            Teléfono
            <input
              value={createVenueForm.telefono}
              onChange={(e) => onCreateVenueFieldChange("telefono", e.target.value)}
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={createVenueForm.email}
              onChange={(e) => onCreateVenueFieldChange("email", e.target.value)}
            />
          </label>

          <button className="btn-primary" type="submit">
            Crear local
          </button>
        </form>
      </section>

      <section className="dev-card">
        <h2>Crear Evento</h2>
        <form className="dev-form" onSubmit={onCreateEvent}>
          <label>
            Asignar a usuario
            <select
              value={selectedOwnerId}
              onChange={(e) => onSelectedOwnerChange(e.target.value)}
              required
            >
              {usersCatalog.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.id} · {user.username} · {user.email}
                </option>
              ))}
            </select>
          </label>

          <label>
            Título
            <input
              value={createEventForm.title}
              onChange={(e) => onCreateEventFieldChange("title", e.target.value)}
              required
            />
          </label>

          <label>
            Local
            <select
              value={createEventForm.venueId}
              onChange={(e) => onCreateEventFieldChange("venueId", e.target.value)}
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
              onChange={(e) => onCreateEventFieldChange("startDate", e.target.value)}
              required
            />
          </label>

          <label>
            Fin
            <input
              type="datetime-local"
              value={createEventForm.endDate}
              onChange={(e) => onCreateEventFieldChange("endDate", e.target.value)}
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
              onChange={(e) => onCreateEventFieldChange("precio", e.target.value)}
            />
          </label>

          <button className="btn-primary" type="submit">
            Crear evento
          </button>
        </form>
      </section>

      <section className="dev-card dev-card-wide">
        <h2>Asignar Proyectos a Servicio</h2>
        <form className="dev-form" onSubmit={onAssignProjectsToService}>
          <label>
            Servicio
            <select
              value={assignServiceForm.serviceId}
              onChange={(e) => onAssignServiceFieldChange("serviceId", e.target.value)}
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
                onAssignServiceProjectIdsChange(selected);
              }}
            >
              {projectsCatalog.map((project) => (
                <option key={project.id} value={project.id}>
                  #{project.id} · {project.item?.title ?? "Proyecto"}
                </option>
              ))}
            </select>
          </label>

          <button className="btn-primary" type="submit">
            Guardar asignación
          </button>
        </form>
      </section>

      <section className="dev-card dev-card-wide dev-card-category">
        <h2>Gestión de encargos</h2>
        <p className="admin-empty">Órdenes, estado y mensajería entre participantes.</p>
      </section>

      <section className="dev-card">
        <h2>Crear Order</h2>
        <form className="dev-form" onSubmit={onCreateOrder}>
          <label>
            Buyer
            <select
              value={createOrderForm.buyerId}
              onChange={(e) => onCreateOrderFieldChange("buyerId", e.target.value)}
              required
            >
              {usersCatalog.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.id} · {user.username} · {user.email}
                </option>
              ))}
            </select>
          </label>

          <label>
            Item
            <select
              value={createOrderForm.itemId}
              onChange={(e) => onCreateOrderFieldChange("itemId", e.target.value)}
              required
            >
              {itemsCatalog.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.id} · {item.title} · {item.basePrice}€
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
              onChange={(e) => onCreateOrderFieldChange("finalPrice", e.target.value)}
              placeholder="Vacío = base price"
            />
          </label>

          <label>
            Status
            <select
              value={createOrderForm.status}
              onChange={(e) => onCreateOrderFieldChange("status", e.target.value)}
            >
              {ORDER_STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <button className="btn-primary" type="submit">
            Crear
          </button>
        </form>
      </section>

      <section className="dev-card">
        <h2>Actualizar Status</h2>
        <form className="dev-form" onSubmit={onStatusUpdate}>
          <label>
            Order
            <select
              value={statusForm.orderId}
              onChange={(e) => onStatusFieldChange("orderId", e.target.value)}
              required
            >
              {ordersCatalog.map((order) => (
                <option key={order.id} value={order.id}>
                  #{order.id} · {order.itemTitle ?? "Item"} · {order.status}
                </option>
              ))}
            </select>
          </label>

          <label>
            Status
            <select
              value={statusForm.status}
              onChange={(e) => onStatusFieldChange("status", e.target.value)}
            >
              {ORDER_STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <button className="btn-primary" type="submit">
            Actualizar
          </button>
        </form>
      </section>

      <section className="dev-card dev-card-wide">
        <h2>Mensajes del Encargo</h2>
        <div className="dev-inline-actions">
          <label>
            Order
            <select value={selectedOrderId} onChange={(e) => onSelectedOrderChange(e.target.value)}>
              {ordersCatalog.map((order) => (
                <option key={order.id} value={order.id}>
                  #{order.id} · buyer {order.buyerId} · creator {order.creatorId}
                </option>
              ))}
            </select>
          </label>
          <button className="btn-secondary" type="button" onClick={onLoadMessages}>
            Cargar mensajes
          </button>
        </div>

        <form className="dev-form" onSubmit={onCreateMessage}>
          <label>
            Sender
            <select
              value={messageForm.senderId}
              onChange={(e) => onMessageFieldChange("senderId", e.target.value)}
              required
            >
              {senderOptions.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.id} · {user.username}
                </option>
              ))}
            </select>
          </label>

          <label>
            Content
            <textarea
              rows={3}
              value={messageForm.content}
              onChange={(e) => onMessageFieldChange("content", e.target.value)}
              required
            />
          </label>

          <button className="btn-primary" type="submit">
            Enviar mensaje
          </button>
        </form>

        <div className="dev-messages">
          {messages.length === 0 ? (
            <p>No hay mensajes cargados.</p>
          ) : (
            messages.map((message) => (
              <article key={message.id} className="dev-message-item">
                <header>
                  <strong>{message.senderUsername ?? `User ${message.senderId}`}</strong>
                  <span>{message.sentAt ? new Date(message.sentAt).toLocaleString() : ""}</span>
                </header>
                <p>{message.content}</p>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="dev-card dev-card-wide">
        <div className="dev-inline-actions">
          <h2>Orders existentes</h2>
          <button className="btn-secondary" type="button" onClick={onRefreshDevelopData}>
            Refrescar
          </button>
        </div>
        <div className="dev-orders-grid">
          {ordersCatalog.map((order) => (
            <article key={order.id} className="dev-order-item">
              <h3>
                #{order.id} · {order.itemTitle ?? "Item"}
              </h3>
              <p>Buyer: {order.buyerId} · {order.buyerUsername ?? "-"}</p>
              <p>Creator: {order.creatorId} · {order.creatorUsername ?? "-"}</p>
              <p>Estado: {order.status}</p>
              <p>Precio: {order.finalPrice} €</p>
            </article>
          ))}
          {ordersCatalog.length === 0 && <p>No hay orders.</p>}
        </div>
      </section>
    </div>
  );
}
