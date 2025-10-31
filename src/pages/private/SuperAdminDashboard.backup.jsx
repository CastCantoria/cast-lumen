import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/NewAuthContext";

// Imports exacts selon ton arborescence
import UserManagement from "../admin/UserManagement";
import EventManagement from "../admin/EventManagement";
import RepertoireManagement from "../admin/RepertoireManagement";

const SuperAdminDashboard = () => {
  const { userProfile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  // 🧭 Protection automatique : si pas super-admin → redirection
  useEffect(() => {
    if (!loading) {
      if (!userProfile) {
        navigate("/login");
      } else if (userProfile.role?.toLowerCase() !== "super-admin") {
        navigate("/unauthorized");
      }
    }
  }, [userProfile, loading, navigate]);

  // Détermine la section active depuis l’URL
  useEffect(() => {
    if (location.pathname.includes("/admin/users")) {
      setActiveSection("users");
    } else if (location.pathname.includes("/admin/events")) {
      setActiveSection("events");
    } else if (location.pathname.includes("/admin/repertoire")) {
      setActiveSection("repertoire");
    } else {
      setActiveSection("dashboard");
    }
  }, [location.pathname]);

  const navigationItems = [
    { id: "dashboard", icon: "📊", title: "Tableau de Bord", path: "/dashboard", description: "Vue d'ensemble" },
    { id: "users", icon: "👥", title: "Utilisateurs", path: "/admin/users", description: "Gérer les membres" },
    { id: "events", icon: "🎭", title: "Événements", path: "/admin/events", description: "Concerts & activités" },
    { id: "repertoire", icon: "📜", title: "Répertoire", path: "/admin/repertoire", description: "Chants & partitions" }
  ];

  const handleNavigation = (item) => {
    setActiveSection(item.id);
    navigate(item.path);
    setMobileMenuOpen(false);
  };

  // 🧩 Page d’accueil du dashboard
  const DashboardHome = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-green-600 mb-2">Tableau de Bord Administration</h1>
        <p className="text-gray-600 text-lg">
          Bienvenue, {userProfile?.displayName || "Administrateur"} 👋
        </p>
        <div className="flex items-center mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <span className="bg-green-600 text-white py-1 px-3 rounded-full text-sm font-semibold">
            {userProfile?.role || "admin"} 👑
          </span>
          <span className="ml-3 text-green-700 text-sm">
            Accès complet à toutes les fonctionnalités d'administration
          </span>
        </div>
      </div>
      {/* ... contenu abrégé ... */}
    </div>
  );

  // 🧭 Sidebar
  const Sidebar = () => (
    <>
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-xl lg:shadow-none transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Profil */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {userProfile?.displayName?.charAt(0) || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 truncate">
                  {userProfile?.displayName || "Administrateur"}
                </div>
                <div className="text-sm text-gray-500 capitalize">
                  {userProfile?.role || "admin"} 👑
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`w-full text-left p-3 rounded-lg flex items-center space-x-3 transition-all duration-200 ${
                  activeSection === item.id
                    ? "bg-green-50 text-green-700 border border-green-200 shadow-sm"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <div className="flex-1">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );

  // 📋 Contenu principal selon la section
  const renderContent = () => {
    switch (activeSection) {
      case "users":
        return <UserManagement />;
      case "events":
        return <EventManagement />;
      case "repertoire":
        return <RepertoireManagement />;
      default:
        return <DashboardHome />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header mobile */}
        <header className="lg:hidden bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              ☰
            </button>
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-600">{navigationItems.find((i) => i.id === activeSection)?.title || "Dashboard"}</div>
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">{userProfile?.displayName?.charAt(0) || "A"}</div>
            </div>
          </div>
        </header>

        {/* Contenu */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto w-full">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
