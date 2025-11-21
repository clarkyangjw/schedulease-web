import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import AppointmentsPage from "./pages/AppointmentsPage";
import ClientsPage from "./pages/ClientsPage";
import ProvidersPage from "./pages/ProvidersPage";
import ServicesPage from "./pages/ServicesPage";

function App() {
    const [activeTab, setActiveTab] = useState("appointment");

    const tabs = [
        { id: "appointment", label: "Appointments", icon: "fa-calendar-week" },
        { id: "clients", label: "Clients", icon: "fa-users" },
        { id: "providers", label: "Providers", icon: "fa-user-tie" },
        { id: "services", label: "Services", icon: "fa-concierge-bell" },
    ];

    return (
        <div className="bg-neutral-100 min-h-screen font-sans">
            <Header />
            <Navigation
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {/* Content Area */}
            <main className="container mx-auto px-4 py-6">
                {activeTab === "appointment" && <AppointmentsPage />}
                {activeTab === "clients" && <ClientsPage />}
                {activeTab === "providers" && <ProvidersPage />}
                {activeTab === "services" && <ServicesPage />}
            </main>
        </div>
    );
}

export default App;
