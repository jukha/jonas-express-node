/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';
const stripe = Stripe(
  'pk_test_51NXKE5EL3qs5hVekpBwTWPmcuOchKLnfjznYnSsPtowZGb4TMpwhoOnGvLZxVcX6StX0Qjm7dgUhzI02Z29PCaCd000eAu3bRM'
);

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourId}`
    );
    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (error) {
    showAlert('error', error);
  }
};
