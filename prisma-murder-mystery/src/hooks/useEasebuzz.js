import { useCallback, useState } from 'react';
import axiosInstance from '../api/axiosConfig';

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
            // If environment changed, remove old script and load new one
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
 * useEasebuzz - Custom hook for seamless Easebuzz gateway integration
 */
const useEasebuzz = () => {
    const initiatePayment = useCallback(async ({
        eventId,
        quantity = 1,
        user,
        onSuccess,
        onFailure
    }) => {
        try {
            // 1. Create Easebuzz Order on backend
            // Our backend creates an Easebuzz initiated link and returns the access_key
            const { data: createRes } = await axiosInstance.post('/orders/create', {
                eventId,
                quantity
            });

            // Make sure backend returned an access_key
            const { access_key } = createRes.data;
            if (!access_key) {
                throw new Error("Unable to obtain access key for payment gateway.");
            }

            // 2. Load the Easebuzz Script dynamically
            const env = import.meta.env.VITE_EASEBUZZ_ENV || 'test';
            const sdkLoaded = await loadEasebuzzScript(env);

            if (!sdkLoaded) {
                onFailure?.('Failed to load payment gateway script. Please check your internet connection.');
                return;
            }

            // 3. Configure Checkout Options
            const options = {
                access_key: access_key,
                onResponse: async (response) => {
                    // This function is invoked by Easebuzz upon popup close or transaction complete
                    // Never trust frontend status alone; always verify via backend verify-API
                    const { txnid, hash, status } = response;

                    if (status === 'success') {
                        try {
                            // 4. Send payload to backend for hash verification & order fulfillment
                            const { data: verifyRes } = await axiosInstance.post('/orders/verify', response);
                            onSuccess?.(verifyRes.data);
                        } catch (verifyErr) {
                            const msg = verifyErr.response?.data?.error || 'Payment verification failed.';
                            onFailure?.(msg);
                        }
                    } else if (status === 'userCancelled' || status === 'error') {
                        onFailure?.(response.error_Message || 'Payment cancelled by user.');
                    } else {
                        // Other error statuses mapped here
                        try {
                            // Log unexpected states through the verify endpoint as 'failed'
                            await axiosInstance.post('/orders/verify', response);
                        } catch (e) {
                            // ignore validation error propagation on failure syncs
                        }
                        onFailure?.('Payment transaction was not successful.');
                    }
                },
                theme: import.meta.env.VITE_EASEBUZZ_THEME || '#8b0000'
            };

            // 4. Initialize and Open Checkout
            if (!window.EasebuzzCheckout) {
                throw new Error("Easebuzz SDK not found on window object.");
            }

            const easebuzzCheckout = new window.EasebuzzCheckout(
                import.meta.env.VITE_EASEBUZZ_KEY,
                env
            );

            easebuzzCheckout.initiatePayment(options);

        } catch (err) {
            const msg = err.response?.data?.error || err.message || 'Payment initiation failed';
            onFailure?.(msg);
        }
    }, []);

    return { initiatePayment };
};

export default useEasebuzz;
