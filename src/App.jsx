import { useState } from "react";
import "./App.css";

function App() {
    const [activeTab, setActiveTab] = useState("appointment");

    const tabs = [
        { id: "appointment", label: "Appointments", icon: "fa-calendar-week" },
        { id: "clients", label: "Clients", icon: "fa-users" },
        { id: "providers", label: "Service Providers", icon: "fa-user-tie" },
        { id: "services", label: "Services", icon: "fa-concierge-bell" },
    ];

    return (
        <div className="bg-neutral-100 min-h-screen font-sans">
            {/* System Header */}
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <i className="fas fa-calendar-alt text-primary text-2xl"></i>
                        <h1 className="text-xl font-bold text-neutral-800">
                            Appointment Management System
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="text-neutral-500 hover:text-primary transition-colors">
                            <i className="fas fa-bell"></i>
                        </button>
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                                <i className="fas fa-user text-white text-sm"></i>
                            </div>
                            <span className="text-sm text-neutral-700">
                                Admin
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Tab Navigation */}
            <nav className="bg-white border-b border-neutral-200">
                <div className="container mx-auto px-4">
                    <div className="flex space-x-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 text-sm flex items-center ${
                                    activeTab === tab.id
                                        ? "tab-active"
                                        : "tab-inactive"
                                }`}>
                                <i className={`fas ${tab.icon} mr-2`}></i>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Content Area */}
            <main className="container mx-auto px-4 py-6">
                {/* Appointments Page */}
                {activeTab === "appointment" && (
                    <section id="content-appointment">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
                            <div>
                                <h2 className="text-xl font-bold text-neutral-800">
                                    Appointments
                                </h2>
                                <p className="text-neutral-500 text-sm">
                                    Manage and view all appointment information
                                </p>
                            </div>
                            <div className="flex space-x-3">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search appointments..."
                                        className="pl-10 pr-4 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-64"
                                    />
                                    <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"></i>
                                </div>
                                <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm flex items-center transition-colors">
                                    <i className="fas fa-plus mr-1"></i>
                                    New Appointment
                                </button>
                            </div>
                        </div>
                        {/* Weekly Calendar View Placeholder */}
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <p className="text-neutral-500">
                                Weekly calendar view will be displayed here
                            </p>
                        </div>
                    </section>
                )}

                {/* Clients Page */}
                {activeTab === "clients" && (
                    <section id="content-clients">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
                            <div>
                                <h2 className="text-xl font-bold text-neutral-800">
                                    Clients
                                </h2>
                                <p className="text-neutral-500 text-sm">
                                    Manage and view all client information
                                </p>
                            </div>
                            <div className="flex space-x-3">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search clients..."
                                        className="pl-10 pr-4 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-64"
                                    />
                                    <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"></i>
                                </div>
                                <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm flex items-center transition-colors">
                                    <i className="fas fa-plus mr-1"></i>
                                    New Client
                                </button>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <p className="text-neutral-500">
                                Client list will be displayed here
                            </p>
                        </div>
                    </section>
                )}

                {/* Service Providers Page */}
                {activeTab === "providers" && (
                    <section id="content-providers">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
                            <div>
                                <h2 className="text-xl font-bold text-neutral-800">
                                    Service Providers
                                </h2>
                                <p className="text-neutral-500 text-sm">
                                    Manage and view all service provider
                                    information
                                </p>
                            </div>
                            <div className="flex space-x-3">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search service providers..."
                                        className="pl-10 pr-4 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-64"
                                    />
                                    <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"></i>
                                </div>
                                <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm flex items-center transition-colors">
                                    <i className="fas fa-plus mr-1"></i>
                                    New Service Provider
                                </button>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <p className="text-neutral-500">
                                Service provider list will be displayed here
                            </p>
                        </div>
                    </section>
                )}

                {/* Services Page */}
                {activeTab === "services" && (
                    <section id="content-services">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
                            <div>
                                <h2 className="text-xl font-bold text-neutral-800">
                                    Services
                                </h2>
                                <p className="text-neutral-500 text-sm">
                                    Manage and view all service information
                                </p>
                            </div>
                            <div className="flex space-x-3">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search services..."
                                        className="pl-10 pr-4 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-64"
                                    />
                                    <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"></i>
                                </div>
                                <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm flex items-center transition-colors">
                                    <i className="fas fa-plus mr-1"></i>
                                    New Service
                                </button>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <p className="text-neutral-500">
                                Service list will be displayed here
                            </p>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}

export default App;
