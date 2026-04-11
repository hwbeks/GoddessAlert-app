import { loadStripe } from "@stripe/stripe-js";

export const stripePromise = loadStripe(
  "pk_live_51TKHnM5ueCdcfjYzTaJObKJI8vtADeEuuXhbxUUYtTzZwHhYnxbnaKXZzoIFRY8a9dq6OsBD1GzWglaKf0wttEtz00VSNkzgAI"
);

export const PRICES = {
  monthly: "price_1TKHw75ueCdcfjYzQJuatIR0",
  yearly: "price_1TKHvN5ueCdcfjYzBJ6C9PQb",
};
