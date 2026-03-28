import React, { useState } from "react";
import { TableBlock } from "../components/runtime/TableBlock";

const tabs = [
  {
    key: "klijent",
    label: "Klijenti",
    mobileLabel: "Klijenti",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    key: "sesija",
    label: "Sesije",
    mobileLabel: "Sesije",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    key: "grupa",
    label: "Grupe",
    mobileLabel: "Grupe",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    key: "cena",
    label: "Uplate",
    mobileLabel: "Uplate",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    key: "sesijaklijent",
    label: "Sesija-Klijent",
    mobileLabel: "S-K",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="16 3 21 3 21 8" />
        <line x1="4" y1="20" x2="21" y2="3" />
        <polyline points="21 16 21 21 16 21" />
        <line x1="15" y1="15" x2="21" y2="21" />
        <line x1="4" y1="4" x2="9" y2="9" />
      </svg>
    ),
  },
  {
    key: "sesijagrupa",
    label: "Sesija-Grupa",
    mobileLabel: "S-G",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="16 3 21 3 21 8" />
        <line x1="4" y1="20" x2="21" y2="3" />
        <polyline points="21 16 21 21 16 21" />
        <line x1="15" y1="15" x2="21" y2="21" />
        <line x1="4" y1="4" x2="9" y2="9" />
      </svg>
    ),
  },
];

const tableConfigs: Record<string, any> = {
  klijent: {
    title: "Lista Klijenata",
    entity: "Klijent",
    endpoint: "/klijent/",
    options: {
      showHeader: true,
      stripedRows: false,
      showPagination: true,
      rowsPerPage: 10,
      actionButtons: true,
      columns: [
        {
          label: "ID",
          column_type: "field",
          field: "id",
          type: "int",
          required: true,
        },
        {
          label: "Ime",
          column_type: "field",
          field: "ime",
          type: "str",
          required: true,
        },
        {
          label: "Prezime",
          column_type: "field",
          field: "prezime",
          type: "str",
          required: true,
        },
        {
          label: "Broj Telefona",
          column_type: "field",
          field: "broj_telefona",
          type: "str",
          required: true,
        },
        {
          label: "Email",
          column_type: "field",
          field: "email",
          type: "str",
          required: true,
        },
      ],
      formColumns: [
        {
          column_type: "field",
          field: "id",
          label: "ID",
          type: "int",
          required: true,
        },
        {
          column_type: "field",
          field: "ime",
          label: "Ime",
          type: "str",
          required: true,
        },
        {
          column_type: "field",
          field: "prezime",
          label: "Prezime",
          type: "str",
          required: true,
        },
        {
          column_type: "field",
          field: "broj_telefona",
          label: "Broj Telefona",
          type: "str",
          required: true,
        },
        {
          column_type: "field",
          field: "email",
          label: "Email",
          type: "str",
          required: true,
        },
        {
          column_type: "lookup",
          path: "sesijaklijent",
          field: "sesijaklijent",
          lookup_field: "id",
          entity: "SesijaKlijent",
          type: "list",
          required: false,
        },
        {
          column_type: "lookup",
          path: "cena_1",
          field: "cena_1",
          lookup_field: "id",
          entity: "Cena",
          type: "list",
          required: false,
        },
      ],
    },
  },
  sesija: {
    title: "Lista Sesija",
    entity: "Sesija",
    endpoint: "/sesija/",
    options: {
      showHeader: true,
      stripedRows: false,
      showPagination: true,
      rowsPerPage: 10,
      actionButtons: true,
      columns: [
        {
          label: "ID",
          column_type: "field",
          field: "id",
          type: "int",
          required: true,
        },
        {
          label: "Početak",
          column_type: "field",
          field: "pocetak",
          type: "datetime",
          required: true,
        },
        {
          label: "Kraj",
          column_type: "field",
          field: "kraj",
          type: "datetime",
          required: true,
        },
        {
          label: "Cena",
          column_type: "field",
          field: "cena",
          type: "float",
          required: true,
        },
        {
          label: "Status",
          column_type: "field",
          field: "status",
          type: "str",
          required: true,
        },
      ],
      formColumns: [
        {
          column_type: "field",
          field: "id",
          label: "ID",
          type: "int",
          required: true,
        },
        {
          column_type: "field",
          field: "pocetak",
          label: "Početak",
          type: "datetime",
          required: true,
        },
        {
          column_type: "field",
          field: "kraj",
          label: "Kraj",
          type: "datetime",
          required: true,
        },
        {
          column_type: "field",
          field: "cena",
          label: "Cena (RSD)",
          type: "float",
          required: true,
        },
        {
          column_type: "field",
          field: "status",
          label: "Status",
          type: "str",
          required: true,
        },
        {
          column_type: "lookup",
          path: "sesijaklijent",
          field: "sesijaklijent",
          lookup_field: "id",
          entity: "SesijaKlijent",
          type: "list",
          required: false,
        },
        {
          column_type: "lookup",
          path: "sesijagrupa",
          field: "sesijagrupa",
          lookup_field: "id",
          entity: "SesijaGrupa",
          type: "list",
          required: false,
        },
        {
          column_type: "lookup",
          path: "cena_1",
          field: "cena_1",
          lookup_field: "id",
          entity: "Cena",
          type: "list",
          required: false,
        },
      ],
    },
  },
  grupa: {
    title: "Lista Grupa",
    entity: "Grupa",
    endpoint: "/grupa/",
    options: {
      showHeader: true,
      stripedRows: false,
      showPagination: true,
      rowsPerPage: 10,
      actionButtons: true,
      columns: [
        {
          label: "ID",
          column_type: "field",
          field: "id",
          type: "int",
          required: true,
        },
        {
          label: "Naziv",
          column_type: "field",
          field: "naziv",
          type: "str",
          required: true,
        },
        {
          label: "Opis",
          column_type: "field",
          field: "opis",
          type: "str",
          required: true,
        },
        {
          label: "Cena",
          column_type: "field",
          field: "cena",
          type: "float",
          required: true,
        },
      ],
      formColumns: [
        {
          column_type: "field",
          field: "id",
          label: "ID",
          type: "int",
          required: true,
        },
        {
          column_type: "field",
          field: "naziv",
          label: "Naziv",
          type: "str",
          required: true,
        },
        {
          column_type: "field",
          field: "opis",
          label: "Opis",
          type: "str",
          required: true,
        },
        {
          column_type: "field",
          field: "cena",
          label: "Cena (RSD)",
          type: "float",
          required: true,
        },
        {
          column_type: "lookup",
          path: "sesijagrupa",
          field: "sesijagrupa",
          lookup_field: "id",
          entity: "SesijaGrupa",
          type: "list",
          required: false,
        },
      ],
    },
  },
  cena: {
    title: "Lista Uplata",
    entity: "Cena",
    endpoint: "/cena/",
    options: {
      showHeader: true,
      stripedRows: false,
      showPagination: true,
      rowsPerPage: 10,
      actionButtons: true,
      columns: [
        {
          label: "ID",
          column_type: "field",
          field: "id",
          type: "int",
          required: true,
        },
        {
          label: "Cena",
          column_type: "field",
          field: "cena",
          type: "float",
          required: true,
        },
        {
          label: "Datum Uplate",
          column_type: "field",
          field: "datum_uplate",
          type: "date",
          required: true,
        },
        {
          label: "Način Plaćanja",
          column_type: "field",
          field: "nacin_placanja",
          type: "str",
          required: true,
        },
        {
          label: "Status",
          column_type: "field",
          field: "status",
          type: "str",
          required: true,
        },
      ],
      formColumns: [
        {
          column_type: "field",
          field: "id",
          label: "ID",
          type: "int",
          required: true,
        },
        {
          column_type: "field",
          field: "cena",
          label: "Cena (RSD)",
          type: "float",
          required: true,
        },
        {
          column_type: "field",
          field: "datum_uplate",
          label: "Datum Uplate",
          type: "date",
          required: true,
        },
        {
          column_type: "field",
          field: "nacin_placanja",
          label: "Način Plaćanja",
          type: "str",
          required: true,
        },
        {
          column_type: "field",
          field: "status",
          label: "Status",
          type: "str",
          required: true,
        },
      ],
    },
  },
  sesijaklijent: {
    title: "Sesija-Klijent Veze",
    entity: "SesijaKlijent",
    endpoint: "/sesijaklijent/",
    options: {
      showHeader: true,
      stripedRows: false,
      showPagination: true,
      rowsPerPage: 10,
      actionButtons: true,
      columns: [
        {
          label: "ID",
          column_type: "field",
          field: "id",
          type: "int",
          required: true,
        },
      ],
      formColumns: [
        {
          column_type: "field",
          field: "id",
          label: "ID",
          type: "int",
          required: true,
        },
        {
          column_type: "lookup",
          path: "klijent",
          field: "klijent",
          lookup_field: "id",
          entity: "Klijent",
          type: "int",
          required: false,
        },
        {
          column_type: "lookup",
          path: "sesija",
          field: "sesija",
          lookup_field: "id",
          entity: "Sesija",
          type: "int",
          required: false,
        },
      ],
    },
  },
  sesijagrupa: {
    title: "Sesija-Grupa Veze",
    entity: "SesijaGrupa",
    endpoint: "/sesijagrupa/",
    options: {
      showHeader: true,
      stripedRows: false,
      showPagination: true,
      rowsPerPage: 10,
      actionButtons: true,
      columns: [
        {
          label: "ID",
          column_type: "field",
          field: "id",
          type: "int",
          required: true,
        },
      ],
      formColumns: [
        {
          column_type: "field",
          field: "id",
          label: "ID",
          type: "int",
          required: true,
        },
        {
          column_type: "lookup",
          path: "sesija",
          field: "sesija",
          lookup_field: "id",
          entity: "Sesija",
          type: "int",
          required: false,
        },
        {
          column_type: "lookup",
          path: "grupa",
          field: "grupa",
          lookup_field: "id",
          entity: "Grupa",
          type: "int",
          required: false,
        },
      ],
    },
  },
};

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState("klijent");
  const [animating, setAnimating] = useState(false);
  const config = tableConfigs[activeTab];

  const handleTabChange = (key: string) => {
    if (key === activeTab) return;
    setAnimating(true);
    setTimeout(() => {
      setActiveTab(key);
      setTimeout(() => setAnimating(false), 50);
    }, 150);
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <div className="admin-header-text">
          <h1 className="admin-title">Admin Panel</h1>
          <p className="admin-subtitle">
            Upravljajte klijentima, sesijama, grupama i uplatama
          </p>
        </div>
        <div className="admin-header-badge">
          <span className="admin-badge">
            {tabs.find((t) => t.key === activeTab)?.label}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`admin-tab ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => handleTabChange(tab.key)}
          >
            <span className="admin-tab-icon">{tab.icon}</span>
            <span className="admin-tab-label">{tab.label}</span>
            <span className="admin-tab-label-mobile">{tab.mobileLabel}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div
        className={`admin-table-container ${animating ? "admin-table-exit" : "admin-table-enter"}`}
      >
        <TableBlock
          key={activeTab}
          id={`table-${activeTab}`}
          styles={{ width: "100%", minHeight: "400px" }}
          title={config.title}
          options={config.options}
          dataBinding={{ entity: config.entity, endpoint: config.endpoint }}
        />
      </div>
    </div>
  );
};

export default AdminPanel;
