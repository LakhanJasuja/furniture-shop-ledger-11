import React, { useState } from 'react';
import './Calendar.css';

const Calendar = ({ selectedDate, onDateSelect }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        
        // Add all days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }
        
        return days;
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDateClick = (day) => {
        if (day) {
            // Create date string directly without timezone conversion
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const dayStr = String(day).padStart(2, '0');
            const dateStr = `${year}-${month}-${dayStr}`;
            onDateSelect(dateStr);
        }
    };

    const isToday = (day) => {
        const today = new Date();
        return day === today.getDate() && 
               currentDate.getMonth() === today.getMonth() && 
               currentDate.getFullYear() === today.getFullYear();
    };

    const isSelected = (day) => {
        if (!day) return false;
        // Create date string directly without timezone conversion
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        const dateStr = `${year}-${month}-${dayStr}`;
        return dateStr === selectedDate;
    };

    const days = getDaysInMonth(currentDate);

    return (
        <div className="calendar-picker">
            <div className="calendar-header">
                <button className="nav-button" onClick={handlePrevMonth}>
                    &#8249;
                </button>
                <div className="month-year">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </div>
                <button className="nav-button" onClick={handleNextMonth}>
                    &#8250;
                </button>
            </div>
            
            <div className="calendar-grid">
                <div className="day-headers">
                    {dayNames.map(day => (
                        <div key={day} className="day-header">
                            {day}
                        </div>
                    ))}
                </div>
                
                <div className="calendar-days">
                    {days.map((day, index) => (
                        <div
                            key={index}
                            className={`calendar-day ${day ? 'clickable' : 'empty'} ${
                                isSelected(day) ? 'selected' : ''
                            } ${isToday(day) ? 'today' : ''}`}
                            onClick={() => handleDateClick(day)}
                        >
                            {day}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Calendar;
