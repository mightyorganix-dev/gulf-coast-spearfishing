import worker from "../../worker/create-checkout-session.js";
export async function onRequest(context) {
  return worker.fetch(context.request, context.env);
}
