export default function AdminTabs({ view, onChangeView }) {
  const tabs = [
    { key: "users", label: "Usuarios" },
    { key: "items", label: "Contenido" },
    { key: "disputes", label: "Disputas" },
    { key: "reviews", label: "Reviews" },
    { key: "develop", label: "Develop" },
  ];

  return (
    <div className="admin-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={view === tab.key ? "active" : ""}
          onClick={() => onChangeView(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
