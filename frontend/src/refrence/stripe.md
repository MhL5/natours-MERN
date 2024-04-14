```javascript
import { axiosApi } from "../services/api";

const stripe = Stripe("publishable-key");

export const bookTour = async (tourId) => {
  // 1. get checkout session
  const session = axiosApi.get(
    `{{URL}}/api/v1/bookings/checkout-session/${tourId}`
  );
  // 2. create checkout form + charge
  await stripe.redirectToCheckout({
    sessionId: session.data.session.id,
  });
};
```
