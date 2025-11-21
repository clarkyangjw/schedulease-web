function Navigation({ tabs, activeTab, onTabChange }) {
    return (
        <nav className="bg-white border-b border-neutral-200">
            <div className="container mx-auto px-4">
                <div className="flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
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
    );
}

export default Navigation;
