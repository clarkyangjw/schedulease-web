function ServicesPage() {
    return (
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
    );
}

export default ServicesPage;

