function Header() {
    return (
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <i className="fas fa-calendar-alt text-primary text-2xl"></i>
                    <h1 className="text-xl font-bold text-neutral-800">
                        Appointment Management System
                    </h1>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                            <i className="fas fa-user text-white text-sm"></i>
                        </div>
                        <span className="text-sm text-neutral-700">Admin</span>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
