import { useState, useEffect } from "react";
import AppointmentForm from "../components/appointments/AppointmentForm";
import {
    getAllAppointments,
    createAppointment,
    updateAppointmentStatus,
    deleteAppointment,
} from "../api/appointmentApi";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

// Get status color classes
const getStatusColor = (status) => {
    switch (status) {
        case "CONFIRMED":
            return "bg-blue-50 border-primary hover:bg-blue-100";
        case "COMPLETED":
            return "bg-green-50 border-secondary hover:bg-green-100";
        case "CANCELLED":
            return "bg-red-50 border-red-500 hover:bg-red-100";
        case "NO_SHOW":
            return "bg-yellow-50 border-yellow-500 hover:bg-yellow-100";
        default:
            return "bg-neutral-50 border-neutral-300 hover:bg-neutral-100";
    }
};

// Format time from timestamp with AM/PM
const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${hours}:${minutes} ${ampm}`;
};

// Get week start (Monday) and end (Sunday) dates
const getWeekRange = (date) => {
    const d = new Date(date);
    const day = d.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    // Calculate days to subtract to get to Monday
    // If Sunday (0), subtract 6 days; otherwise subtract (day - 1) days
    const diff = day === 0 ? 6 : day - 1;
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - diff);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    return { weekStart, weekEnd };
};

// Format date for display
const formatDate = (date) => {
    const month = MONTHS[date.getMonth()];
    const day = date.getDate();
    return `${month}/${day}`;
};

// Format date range for header
const formatDateRange = (weekStart, weekEnd) => {
    const startYear = weekStart.getFullYear();
    const startMonth = MONTHS[weekStart.getMonth()];
    const startDay = weekStart.getDate();
    const endMonth = MONTHS[weekEnd.getMonth()];
    const endDay = weekEnd.getDate();

    if (weekStart.getFullYear() === weekEnd.getFullYear()) {
        if (weekStart.getMonth() === weekEnd.getMonth()) {
            return `${startMonth} ${startDay} - ${endDay}, ${startYear}`;
        }
        return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${startYear}`;
    }
    return `${startMonth} ${startDay}, ${startYear} - ${endMonth} ${endDay}, ${weekEnd.getFullYear()}`;
};

function AppointmentsPage() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [currentWeek, setCurrentWeek] = useState(new Date());

    useEffect(() => {
        loadAppointments();
    }, [currentWeek]);

    const loadAppointments = async () => {
        try {
            setLoading(true);
            setError(null);
            // Get time range for current week
            const { weekStart, weekEnd } = getWeekRange(currentWeek);
            // Fetch appointments for the current week using time range
            // Convert Date objects to timestamps (milliseconds)
            const startTime = weekStart.getTime();
            const endTime = weekEnd.getTime();
            const weekData = await getAllAppointments(startTime, endTime);
            setAppointments(weekData);
        } catch (err) {
            setError("Failed to load appointments. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleNewAppointment = () => {
        setEditingAppointment(null);
        setShowForm(true);
    };

    const handleEdit = (appointment) => {
        // Transform appointment data to match form expectations
        // API returns nested objects (client, provider, service) but form needs IDs
        const transformedAppointment = {
            ...appointment,
            clientId: appointment.client?.id || appointment.clientId,
            providerId: appointment.provider?.id || appointment.providerId,
            serviceId: appointment.service?.id || appointment.serviceId,
            // Backend returns startTime in seconds, convert to milliseconds for form
            startTime: (() => {
                let aptTime =
                    typeof appointment.startTime === "string"
                        ? parseInt(appointment.startTime, 10)
                        : appointment.startTime;
                // Backend always returns seconds, convert to milliseconds for Date object
                if (aptTime < 10000000000) {
                    aptTime = aptTime * 1000;
                } else {
                    // If somehow in milliseconds, convert to seconds first
                    aptTime = Math.floor(aptTime / 1000) * 1000;
                }
                return aptTime;
            })(),
        };
        setEditingAppointment(transformedAppointment);
        setShowForm(true);
    };

    const handleSave = async (appointmentData) => {
        try {
            if (editingAppointment) {
                // Check if only status changed (and no other fields)
                // Convert to numbers for comparison to handle string/number mismatches
                const clientIdChanged =
                    Number(appointmentData.clientId) !== Number(editingAppointment.clientId);
                const providerIdChanged =
                    Number(appointmentData.providerId) !==
                    Number(editingAppointment.providerId);
                const serviceIdChanged =
                    Number(appointmentData.serviceId) !== Number(editingAppointment.serviceId);
                
                // appointmentData.startTime is in seconds, editingAppointment.startTime is in milliseconds
                // Convert editingAppointment.startTime to seconds for comparison
                const editingStartTimeSeconds = Math.floor(
                    editingAppointment.startTime / 1000
                );
                const startTimeChanged =
                    appointmentData.startTime !== editingStartTimeSeconds;
                
                const statusChanged =
                    appointmentData.status &&
                    appointmentData.status !== editingAppointment.status;
                
                // Normalize notes for comparison: treat null, undefined, and empty string as the same
                const appointmentNotes = appointmentData.notes || "";
                const editingNotes = editingAppointment.notes || "";
                const notesChanged = appointmentNotes !== editingNotes;

                // Debug logging (can be removed later)
                console.log("Change detection:", {
                    statusChanged,
                    clientIdChanged,
                    providerIdChanged,
                    serviceIdChanged,
                    startTimeChanged,
                    notesChanged,
                    appointmentData,
                    editingAppointment,
                });

                // If only status changed, use status update endpoint
                if (
                    statusChanged &&
                    !clientIdChanged &&
                    !providerIdChanged &&
                    !serviceIdChanged &&
                    !startTimeChanged &&
                    !notesChanged
                ) {
                    await updateAppointmentStatus(
                        editingAppointment.id,
                        appointmentData.status,
                        appointmentData.cancellationReason
                    );
                } else {
                    // Delete old appointment and create new one
                    await deleteAppointment(editingAppointment.id);
                    await createAppointment(appointmentData);
                }
            } else {
                await createAppointment(appointmentData);
            }
            setShowForm(false);
            setEditingAppointment(null);

            // Check if the appointment time is in the current week
            // If not, switch to the week containing the appointment
            // appointmentData.startTime is in seconds, convert to milliseconds for Date object
            const appointmentDate = new Date(appointmentData.startTime * 1000);
            const { weekStart, weekEnd } = getWeekRange(currentWeek);

            // Check if the appointment is outside the current week
            if (appointmentDate < weekStart || appointmentDate > weekEnd) {
                // Switch to the week containing the appointment
                // This will trigger useEffect to reload appointments
                setCurrentWeek(appointmentDate);
            } else {
                // Refresh appointments for the current week
                loadAppointments();
            }
        } catch (err) {
            // Extract error message from response
            let errorMessage = `Failed to ${
                editingAppointment ? "update" : "create"
            } appointment.`;
            
            // Try to get more specific error message
            if (err.message) {
                if (err.message.includes("Time slot is not available") || 
                    err.message.includes("not available")) {
                    errorMessage = "This time slot is not available. The provider already has an appointment at this time. Please choose a different time.";
                } else if (err.message.includes("not found")) {
                    errorMessage = "One of the selected items (client, provider, or service) was not found. Please refresh the page and try again.";
                } else {
                    errorMessage = err.message;
                }
            }
            
            alert(errorMessage);
            console.error(err);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingAppointment(null);
    };

    const goToPreviousWeek = () => {
        const newDate = new Date(currentWeek);
        newDate.setDate(newDate.getDate() - 7);
        setCurrentWeek(newDate);
    };

    const goToNextWeek = () => {
        const newDate = new Date(currentWeek);
        newDate.setDate(newDate.getDate() + 7);
        setCurrentWeek(newDate);
    };

    const goToToday = () => {
        setCurrentWeek(new Date());
    };

    // Group appointments by day of week
    const groupAppointmentsByDay = () => {
        const { weekStart } = getWeekRange(currentWeek);
        const grouped = {};

        // Initialize all days
        for (let i = 0; i < 7; i++) {
            const day = new Date(weekStart);
            day.setDate(weekStart.getDate() + i);
            const dayKey = day.toDateString();
            grouped[dayKey] = {
                date: day,
                appointments: [],
            };
        }

        // Group appointments
        appointments.forEach((appointment) => {
            // Ensure startTime is a number
            let aptTime =
                typeof appointment.startTime === "string"
                    ? parseInt(appointment.startTime, 10)
                    : appointment.startTime;

            // Backend returns startTime in seconds, convert to milliseconds for Date object
            if (aptTime < 10000000000) {
                aptTime = aptTime * 1000;
            } else {
                // If somehow in milliseconds, convert to seconds first
                aptTime = Math.floor(aptTime / 1000) * 1000;
            }

            const appointmentDate = new Date(aptTime);
            const dayKey = appointmentDate.toDateString();
            if (grouped[dayKey]) {
                grouped[dayKey].appointments.push(appointment);
            }
        });

        // Sort appointments by time within each day
        Object.keys(grouped).forEach((key) => {
            grouped[key].appointments.sort((a, b) => {
                let aTime =
                    typeof a.startTime === "string"
                        ? parseInt(a.startTime, 10)
                        : a.startTime;
                let bTime =
                    typeof b.startTime === "string"
                        ? parseInt(b.startTime, 10)
                        : b.startTime;

                // Backend returns startTime in seconds, convert to milliseconds for comparison
                if (aTime < 10000000000) {
                    aTime = aTime * 1000;
                } else {
                    aTime = Math.floor(aTime / 1000) * 1000;
                }
                if (bTime < 10000000000) {
                    bTime = bTime * 1000;
                } else {
                    bTime = Math.floor(bTime / 1000) * 1000;
                }

                return aTime - bTime;
            });
        });

        return grouped;
    };

    const { weekStart, weekEnd } = getWeekRange(currentWeek);
    const groupedAppointments = groupAppointmentsByDay();
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
        const day = new Date(weekStart);
        day.setDate(weekStart.getDate() + i);
        weekDays.push(day);
    }

    return (
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
                    <button
                        onClick={handleNewAppointment}
                        className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm flex items-center transition-colors">
                        <i className="fas fa-plus mr-1"></i>
                        New Appointment
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                    {error}
                </div>
            )}

            {/* Weekly Calendar View */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                {/* Date Navigation and Status Legend */}
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-neutral-200">
                    {/* Date Navigation - Left */}
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={goToPreviousWeek}
                            className="p-2 rounded hover:bg-neutral-100 transition-colors">
                            <i className="fas fa-chevron-left text-neutral-600"></i>
                        </button>
                        <h3 className="font-semibold text-neutral-800 text-lg">
                            {formatDateRange(weekStart, weekEnd)}
                        </h3>
                        <button
                            onClick={goToNextWeek}
                            className="p-2 rounded hover:bg-neutral-100 transition-colors">
                            <i className="fas fa-chevron-right text-neutral-600"></i>
                        </button>
                        <button
                            onClick={goToToday}
                            className="ml-2 px-3 py-1 border border-neutral-300 rounded-md text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
                            Today
                        </button>
                    </div>
                    {/* Status Legend - Right */}
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-50 border-l-4 border-primary rounded"></div>
                            <span className="text-sm text-neutral-700">Confirmed</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-50 border-l-4 border-secondary rounded"></div>
                            <span className="text-sm text-neutral-700">Completed</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-red-50 border-l-4 border-red-500 rounded"></div>
                            <span className="text-sm text-neutral-700">Cancelled</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-yellow-50 border-l-4 border-yellow-500 rounded"></div>
                            <span className="text-sm text-neutral-700">No Show</span>
                        </div>
                    </div>
                </div>
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {WEEKDAYS.map((day, index) => (
                        <div
                            key={index}
                            className="text-center text-neutral-500 text-sm py-2 font-medium">
                            {day}
                        </div>
                    ))}
                </div>
                {/* Calendar Body */}
                {loading ? (
                    <div className="grid grid-cols-7 gap-1">
                        {weekDays.map((day, index) => (
                            <div
                                key={index}
                                className="border border-neutral-200 rounded-md p-1 min-h-[400px] flex items-center justify-center">
                                <p className="text-neutral-500">Loading...</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-7 gap-1">
                        {weekDays.map((day, index) => {
                            const dayKey = day.toDateString();
                            const dayData = groupedAppointments[dayKey] || {
                                date: day,
                                appointments: [],
                            };
                            // Check if this day is today
                            const today = new Date();
                            const isToday =
                                day.getDate() === today.getDate() &&
                                day.getMonth() === today.getMonth() &&
                                day.getFullYear() === today.getFullYear();
                            return (
                                <div
                                    key={index}
                                    className={`border border-neutral-200 rounded-md p-1 min-h-[400px] ${
                                        isToday ? "bg-yellow-50" : ""
                                    }`}>
                                    <div className="text-center font-medium mb-2">
                                        {formatDate(day)}
                                    </div>
                                    <div className="space-y-2">
                                        {dayData.appointments.map(
                                            (appointment) => {
                                                // Ensure startTime is a number
                                                let aptTime =
                                                    typeof appointment.startTime ===
                                                    "string"
                                                        ? parseInt(
                                                              appointment.startTime,
                                                              10
                                                          )
                                                        : appointment.startTime;

                                                // Backend returns startTime in seconds, convert to milliseconds for Date object
                                                if (aptTime < 10000000000) {
                                                    aptTime = aptTime * 1000;
                                                } else {
                                                    // If somehow in milliseconds, convert to seconds first
                                                    aptTime =
                                                        Math.floor(
                                                            aptTime / 1000
                                                        ) * 1000;
                                                }

                                                const startTimeStr =
                                                    formatTime(aptTime);
                                                const clientName =
                                                    appointment.client
                                                        ? `${appointment.client.firstName} ${appointment.client.lastName}`
                                                        : "Unknown Client";
                                                const duration =
                                                    appointment.service
                                                        ?.duration || 60;
                                                const serviceName =
                                                    appointment.service?.name ||
                                                    "Unknown Service";
                                                const serviceNameWithDuration = `${serviceName} - ${duration}min`;
                                                const providerName =
                                                    appointment.provider
                                                        ? `${appointment.provider.firstName} ${appointment.provider.lastName}`
                                                        : "Unknown Provider";

                                                return (
                                                    <div
                                                        key={appointment.id}
                                                        onClick={() =>
                                                            handleEdit(
                                                                appointment
                                                            )
                                                        }
                                                        className={`${getStatusColor(
                                                            appointment.status
                                                        )} border-l-4 p-2 rounded text-sm cursor-pointer transition-colors`}>
                                                        <div className="font-medium text-neutral-800">
                                                            {startTimeStr}
                                                        </div>
                                                        <div className="text-neutral-600 text-xs">
                                                            {clientName}
                                                        </div>
                                                        <div className="text-neutral-600 text-xs">
                                                            {
                                                                serviceNameWithDuration
                                                            }
                                                        </div>
                                                        <div className="text-neutral-600 text-xs">
                                                            {providerName}
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {showForm && (
                <AppointmentForm
                    appointment={editingAppointment}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            )}
        </section>
    );
}

export default AppointmentsPage;
