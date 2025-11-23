function WorkDays({ days, workDays, editable = false, onChange }) {
    // Parse workDays string (comma-separated day numbers) or use days array
    const parseDays = (workDaysStr) => {
        if (!workDaysStr) return [];
        return workDaysStr
            .split(',')
            .map(s => parseInt(s.trim(), 10))
            .filter(n => !Number.isNaN(n) && n >= 1 && n <= 7);
    };

    const d = Array.isArray(days) ? days : parseDays(workDays);

    const handleDayClick = (day) => {
        if (!editable || !onChange) return;
        
        const newDays = d.includes(day)
            ? d.filter(d => d !== day)
            : [...d, day].sort((a, b) => a - b);
        
        // Convert to comma-separated string format
        const workDaysStr = newDays.join(',');
        onChange(workDaysStr);
    };

    const items = [
        { d: 1, label: 'Mon' },
        { d: 2, label: 'Tue' },
        { d: 3, label: 'Wed' },
        { d: 4, label: 'Thu' },
        { d: 5, label: 'Fri' },
        { d: 6, label: 'Sat' },
        { d: 7, label: 'Sun' },
    ];

    return (
        <div className="flex gap-1.5 flex-wrap">
            {items.map(({ d: day, label }) => {
                const active = d.includes(day);
                return (
                    <span
                        key={day}
                        onClick={() => handleDayClick(day)}
                        className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors ${
                            editable
                                ? 'cursor-pointer hover:opacity-80'
                                : ''
                        } ${
                            active
                                ? 'bg-primary text-white'
                                : 'bg-neutral-200 text-neutral-600'
                        }`}
                    >
                        {label}
                    </span>
                );
            })}
        </div>
    );
}

export default WorkDays;

