const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

// Sample data
let rooms = [];
let bookings = [];

// API to create a room
app.post('/create-room', (req, res) => {
    const { roomName, setsAvailable, amenities, pricePerHour } = req.body;
    const roomId = rooms.length + 1;
    const room = {
        roomId,
        roomName,
        setsAvailable,
        amenities,
        pricePerHour
    };
    rooms.push(room);
    res.status(201).json(room);
});

// API to book a room
app.post('/book-room', (req, res) => {
    const { customerName, date, startTime, endTime, roomId } = req.body;
    const bookingId = bookings.length + 1;
    const booking = {
        bookingId,
        customerName,
        date,
        startTime,
        endTime,
        roomId
    };
    bookings.push(booking);
    res.status(201).json(booking);
});

// API to list all rooms with booked data
app.get('/rooms', (req, res) => {
    const roomsWithBookings = rooms.map(room => {
        const bookedData = bookings.find(booking => booking.roomId === room.roomId);
        const bookedStatus = bookedData ? 'Booked' : 'Available';
        return {
            roomName: room.roomName,
            bookedStatus,
            customerName: bookedData ? bookedData.customerName : null,
            date: bookedData ? bookedData.date : null,
            startTime: bookedData ? bookedData.startTime : null,
            endTime: bookedData ? bookedData.endTime : null
        };
    });
    res.json(roomsWithBookings);
});

// API to list all customers with booked data
app.get('/customers', (req, res) => {
    const customersWithBookings = bookings.map(booking => {
        const room = rooms.find(room => room.roomId === booking.roomId);
        return {
            customerName: booking.customerName,
            roomName: room.roomName,
            date: booking.date,
            startTime: booking.startTime,
            endTime: booking.endTime
        };
    });
    res.json(customersWithBookings);
});

// API to list how many times a customer has booked a room
app.get('/customer-bookings/:customerName', (req, res) => {
    const customerName = req.params.customerName;
    const customerBookings = bookings.filter(booking => booking.customerName === customerName);
    res.json(customerBookings);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
