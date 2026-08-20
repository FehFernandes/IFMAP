import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Sidebar from "./Sidebar";
import DashboardStats from "./DashboardStats";
import LocationsCRUD from "./LocationsCRUD";
import SectorsCRUD from "./SectorsCRUD";
import ServicesCRUD from "./ServicesCRUD";
import PhonesCRUD from "./PhonesCRUD";
import PhotosCRUD from "./PhotosCRUD";
import NewsCRUD from "./NewsCRUD";

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [shouldOpenModal, setShouldOpenModal] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
  };

  const handleNavigateWithModal = (tab: string) => {
    setActiveTab(tab);
    setShouldOpenModal(tab);
  };

  const handleModalOpened = () => {
    setShouldOpenModal(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardStats onNavigate={handleNavigateWithModal} />;
      case "locations":
        return <LocationsCRUD shouldOpenCreate={shouldOpenModal === "locations"} onModalOpened={handleModalOpened} />;
      case "sectors":
        return <SectorsCRUD shouldOpenCreate={shouldOpenModal === "sectors"} onModalOpened={handleModalOpened} />;
      case "services":
        return <ServicesCRUD shouldOpenCreate={shouldOpenModal === "services"} onModalOpened={handleModalOpened} />;
      case "phones":
        return <PhonesCRUD shouldOpenCreate={shouldOpenModal === "phones"} onModalOpened={handleModalOpened} />;
      case "photos":
        return <PhotosCRUD shouldOpenCreate={shouldOpenModal === "photos"} onModalOpened={handleModalOpened} />;
      case "news":
        return <NewsCRUD shouldOpenCreate={shouldOpenModal === "news"} onModalOpened={handleModalOpened} />;
      default:
        return <DashboardStats onNavigate={handleNavigateWithModal} />;
    }
  };

  const getPageTitle = () => {
    const titles: Record<string, string> = {
      dashboard: "Dashboard",
      locations: "Localizações",
      sectors: "Setores",
      services: "Serviços",
      phones: "Telefones",
      photos: "Fotos",
      news: "Notícias",
    };
    return titles[activeTab] || "Dashboard";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={handleLogout} />

      {/* Main Content */}
      <div className="lg:ml-64 transition-all duration-300">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Page Title */}
              <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>

              {/* User Info (Mobile) */}
              <div className="lg:hidden flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
