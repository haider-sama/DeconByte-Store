import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { buffer } from "micro";

export const config = {
    api: {
        bodyParser: false
    }
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2024-04-10"
})

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse
){
    const buff = await buffer(request);
    const sig = request.headers["stripe-signature"];

    if (!sig) {
        return response.status(400).send("Missing the stripe signature");
    }

    let event: Stripe.Event;

    try{
        event = stripe.webhooks.constructEvent(
            buff,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch(error) {
        return response.status(400).send("Webhook error" + error);
    }


    switch(event.type) {
        case "charge.succeeded":
            const charge: any = event.data.object as Stripe.Charge;

            if(typeof charge.payment_intent === "string") {
                await prisma?.order.update({
                    where: { paymentIntentId: charge.payment_intent},
                    data: {status: "complete", address: charge.shipping?.address}
                })
            }
            break;
            default:
                console.log("Unhandled event type:" + event.type)
    }

    response.json({received: true});
}