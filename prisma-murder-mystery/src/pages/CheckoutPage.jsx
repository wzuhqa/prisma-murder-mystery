import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import useEasebuzz from '../hooks/useEasebuzz';

/**
 * CheckoutPage — Full end-to-end purchase flow example.
 *
 * Route:  /checkout  or  /checkout/:eventId
 *
 * This page:
 *  1. Fetches all available events (or a specific one via query param)
 *  2. Lets the user select an event + quantity
 *  3. Triggers Razorpay checkout via useRazorpay hook
 *  4. Shows confirmation (ticketId + QR code) on success
 */
const CheckoutPage = () => {
    const { user, isAuthenticated } = useAuth();
    const { initiatePayment } = useEasebuzz();
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [paying, setPaying] = useState(false);
    const [ticket, setTicket] = useState(null); // success state
    const [errorMsg, setErrorMsg] = useState('');

    // ── Redirect if not logged in ──────────────────────────────────────────────
    useEffect(() => {
        if (!isAuthenticated) navigate('/login', { state: { from: '/checkout' } });
    }, [isAuthenticated, navigate]);

    // ── Fetch events ───────────────────────────────────────────────────────────
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await axiosInstance.get('/events?upcoming=true');
                setEvents(data.data);
                if (data.data.length > 0) setSelectedEvent(data.data[0]);
            } catch (err) {
                setErrorMsg('Failed to load events. Please try again.');
            } finally {
                setLoadingEvents(false);
            }
        };
        fetchEvents();
    }, []);

    // ── Buy handler ────────────────────────────────────────────────────────────
    const handleBuy = async () => {
        if (!selectedEvent) return;
        setErrorMsg('');
        setPaying(true);

        await initiatePayment({
            eventId: selectedEvent._id,
            quantity,
            user,
            onSuccess: (data) => {
                setTicket(data);
                setPaying(false);
            },
            onFailure: (msg) => {
                setErrorMsg(msg);
                setPaying(false);
            }
        });
    };

    // ── Styles (inline for self-contained example) ─────────────────────────────
    const s = {
        page: {
            minHeight: '100vh',
            background: '#0d0208',
            color: '#d4c5a9',
            fontFamily: 'Georgia, serif',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px'
        },
        card: {
            background: '#1a0a0a',
            border: '1px solid #5c1a1a',
            borderRadius: '8px',
            padding: '40px',
            maxWidth: '520px',
            width: '100%'
        },
        title: { color: '#c9a96e', fontSize: '22px', letterSpacing: '3px', marginBottom: '28px', textTransform: 'uppercase' },
        label: { display: 'block', color: '#8b6914', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' },
        select: {
            width: '100%', padding: '12px', background: '#0d0208',
            color: '#d4c5a9', border: '1px solid #3d1a0a',
            borderRadius: '4px', fontSize: '14px', marginBottom: '20px'
        },
        input: {
            width: '60px', padding: '10px', background: '#0d0208',
            color: '#d4c5a9', border: '1px solid #3d1a0a',
            borderRadius: '4px', fontSize: '16px', textAlign: 'center', marginBottom: '20px'
        },
        priceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' },
        price: { color: '#c9a96e', fontSize: '24px', fontWeight: 'bold' },
        btn: {
            width: '100%', padding: '14px',
            background: paying ? '#3d0000' : 'linear-gradient(135deg, #8b0000, #5c1a1a)',
            color: '#c9a96e', border: '1px solid #8b4513',
            borderRadius: '4px', fontSize: '15px', letterSpacing: '2px',
            cursor: paying ? 'not-allowed' : 'pointer',
            textTransform: 'uppercase', fontFamily: 'Georgia, serif'
        },
        error: { color: '#ff4d4d', fontSize: '13px', marginBottom: '16px', textAlign: 'center' },
        qr: { display: 'block', margin: '20px auto', border: '3px solid #5c1a1a', borderRadius: '6px' },
        ticketId: {
            background: '#0d0208', border: '1px dashed #5c1a1a',
            borderRadius: '4px', padding: '12px 16px',
            fontFamily: 'monospace', color: '#c9a96e',
            wordBreak: 'break-all', fontSize: '13px', marginTop: '16px'
        }
    };

    // ── Success Screen ─────────────────────────────────────────────────────────
    if (ticket) {
        return (
            <div style={s.page}>
                <div style={s.card}>
                    <h2 style={{ ...s.title, color: '#5cb85c' }}>✓ PASS CONFIRMED</h2>
                    <p style={{ color: '#a89070', marginBottom: '8px' }}>
                        <strong style={{ color: '#d4c5a9' }}>{ticket.event?.title}</strong>
                    </p>
                    <p style={{ color: '#a89070', fontSize: '13px', marginBottom: '20px' }}>
                        {ticket.event?.date ? new Date(ticket.event.date).toLocaleDateString('en-IN', {
                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                        }) : ''}
                    </p>

                    {ticket.qrCodeUrl && (
                        <img src={ticket.qrCodeUrl} alt="QR Code" width={200} height={200} style={s.qr} />
                    )}

                    <p style={{ ...s.label, textAlign: 'center', marginTop: '16px' }}>Ticket ID</p>
                    <div style={s.ticketId}>{ticket.ticketId}</div>

                    <p style={{ color: '#6b5030', fontSize: '12px', textAlign: 'center', marginTop: '16px' }}>
                        A confirmation email has been sent to <strong>{user?.email}</strong>
                    </p>

                    <button style={{ ...s.btn, marginTop: '24px' }} onClick={() => navigate('/my-tickets')}>
                        View My Tickets
                    </button>
                </div>
            </div>
        );
    }

    // ── Checkout Form ──────────────────────────────────────────────────────────
    const totalPaise = selectedEvent ? selectedEvent.price * quantity * 100 : 0;

    return (
        <div style={s.page}>
            <div style={s.card}>
                <h2 style={s.title}>Buy Your Pass</h2>

                {loadingEvents ? (
                    <p style={{ color: '#8b6914' }}>Loading events...</p>
                ) : events.length === 0 ? (
                    <p style={{ color: '#a89070' }}>No upcoming events available.</p>
                ) : (
                    <>
                        {/* Event selector */}
                        <label style={s.label}>Select Event</label>
                        <select
                            style={s.select}
                            value={selectedEvent?._id || ''}
                            onChange={(e) => {
                                const ev = events.find(ev => ev._id === e.target.value);
                                setSelectedEvent(ev || null);
                                setQuantity(1);
                            }}
                        >
                            {events.map((ev) => (
                                <option key={ev._id} value={ev._id}>
                                    {ev.title} — ₹{(ev.price).toFixed(0)} — {ev.availableTickets} left
                                </option>
                            ))}
                        </select>

                        {/* Quantity */}
                        <label style={s.label}>Quantity</label>
                        <input
                            type="number"
                            min={1}
                            max={selectedEvent?.availableTickets || 1}
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            style={s.input}
                        />

                        {/* Price summary */}
                        <div style={s.priceRow}>
                            <span style={{ color: '#a89070', fontSize: '14px' }}>
                                {quantity} × ₹{selectedEvent?.price?.toFixed(0)}
                            </span>
                            <span style={s.price}>
                                ₹{(totalPaise / 100).toFixed(2)}
                            </span>
                        </div>

                        {/* Availability warning */}
                        {selectedEvent?.availableTickets === 0 && (
                            <p style={s.error}>This event is sold out.</p>
                        )}

                        {errorMsg && <p style={s.error}>{errorMsg}</p>}

                        {/* Buy button */}
                        <button
                            style={s.btn}
                            onClick={handleBuy}
                            disabled={paying || selectedEvent?.availableTickets === 0}
                            id="checkout-buy-btn"
                        >
                            {paying ? 'Processing...' : 'Proceed to Pay'}
                        </button>

                        <p style={{ color: '#4a3020', fontSize: '11px', textAlign: 'center', marginTop: '16px' }}>
                            Secured by Easebuzz · All transactions are encrypted
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default CheckoutPage;
