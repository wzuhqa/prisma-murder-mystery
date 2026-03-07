import { useCallback } from 'react';
// import axiosInstance from '../api/axiosConfig'; // Backend no longer required for this flow

const EASEBUZZ_SCRIPT_URL_PROD = 'https://pay.easebuzz.in/easecheckout/easebuzz-checkout.js';
const EASEBUZZ_SCRIPT_URL_TEST = 'https://ebz-static.s3.ap-south-1.amazonaws.com/easecheckout/easebuzz-checkout.js';

// ─── Load Easebuzz SDK ─────────────────────────────────────────────────────────
const loadEasebuzzScript = (env) =>
    new Promise((resolve) => {
        const targetUrl = env === 'prod' ? EASEBUZZ_SCRIPT_URL_PROD : EASEBUZZ_SCRIPT_URL_TEST;

        // Return immediately if script already exists
        const existingScript = document.getElementById('easebuzz-sdk');
        if (existingScript) {
            if (existingScript.src === targetUrl) {
                return resolve(true);
            }
            existingScript.remove();
        }

        const script = document.createElement('script');
        script.id = 'easebuzz-sdk';
        script.src = targetUrl;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

/**
 * useEasebuzz - Custom hook for seamless Easebuzz gateway integration (Detached from Backend)
 */
const useEasebuzz = () => {
    const initiatePayment = useCallback(async ({
        event, // Passing full event object for simulation
        quantity = 1,
        user,
        onSuccess,
        onFailure
    }) => {
        try {
            // 1. SIMULATED: Create Easebuzz Order (Front-end only)
            // In a real flow, this access_key comes from backend/initiateLink
            const mockAccessKey = `mock_ak_${Math.random().toString(36).substring(7)}`;
            const mockTxnId = `txn_${Date.now()}`;

            console.log('[Easebuzz Simulation] Initiating payment for:', event?.title);

            // 2. Load the Easebuzz Script dynamically (still useful for UI)
            const env = import.meta.env.VITE_EASEBUZZ_ENV || 'test';
            const sdkLoaded = await loadEasebuzzScript(env);

            // If SDK fails to load, we can still simulate the success screen for demo purposes
            if (!sdkLoaded) {
                console.warn('[Easebuzz Simulation] SDK failed to load. Falling back to immediate simulation.');
                // Simulate a slight delay as if a popup opened and closed
                setTimeout(() => {
                    const mockTicketData = {
                        ticketId: `PMM-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
                        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TICKET-${mockTxnId}`,
                        event: {
                            title: event?.title || 'Murder Mystery Event',
                            date: event?.date || new Date().toISOString()
                        },
                        totalAmount: (event?.price || 0) * quantity * 100
                    };
                    onSuccess?.(mockTicketData);
                }, 1500);
                return;
            }

            // 3. Configure Checkout Options
            const options = {
                access_key: mockAccessKey,
                onResponse: (response) => {
                    // This function is invoked by Easebuzz upon popup close or transaction complete
                    const { status } = response;

                    if (status === 'success' || env === 'test') { 
                        // In test env or simulation, we treat it as success
                        const mockTicketData = {
                            ticketId: `PMM-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
                            qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TICKET-${response.txnid || mockTxnId}`,
                            event: {
                                title: event?.title || 'Murder Mystery Event',
                                date: event?.date || new Date().toISOString()
                            },
                            totalAmount: (event?.price || 0) * quantity * 100
                        };
                        onSuccess?.(mockTicketData);
                    } else if (status === 'userCancelled' || status === 'error') {
                        onFailure?.(response.error_Message || 'Payment cancelled by user.');
                    } else {
                        onFailure?.('Payment transaction was not successful.');
                    }
                },
                theme: import.meta.env.VITE_EASEBUZZ_THEME || '#8b0000'
            };

            // 4. Initialize and Open Checkout
            if (window.EasebuzzCheckout) {
                const easebuzzCheckout = new window.EasebuzzCheckout(
                    import.meta.env.VITE_EASEBUZZ_KEY || 'MOCK_KEY',
                    env
                );
                easebuzzCheckout.initiatePayment(options);
            } else {
                // Fallback simulation if window.EasebuzzCheckout is somehow missing despite sdkLoaded
                setTimeout(() => {
                    onSuccess?.({
                        ticketId: `PMM-MOCK-${Date.now()}`,
                        qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=MOCK',
                        event: { title: event?.title, date: event?.date },
                        totalAmount: event?.price * quantity * 100
                    });
                }, 1000);
            }

        } catch (err) {
            onFailure?.(err.message || 'Payment initiation failed');
        }
    }, []);

    return { initiatePayment };
};

export default useEasebuzz;
