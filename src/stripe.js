import { loadStripe } from "@stripe/stripe-js";

export const stripePromise = loadStripe(
  "pk_test_51TKHnM5ueCdcfjYzp3NyQEm2TigUrxorQZnWFis3KqP5NnqKoV5kiY49TK0DENSxTnkJF1uTdLIa9APsK73W6Q1e00yncqljC8"
);

export const PRICES = {
  monthly: "price_1TKHw75ueCdcfjYzQJuatIR0",
  yearly: "price_1TKHvN5ueCdcfjYzBJ6C9PQb",
};
