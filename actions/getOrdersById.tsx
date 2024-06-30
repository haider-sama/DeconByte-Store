import prisma from "@/libs/prismadb";

interface Params {
    orderId?: string;
}

export default async function getOrdersById(params: Params) {
    try{
        const {orderId} = params;
        const order = await prisma.order.findUnique({
            where: {
                id: orderId
            }
        })

        if(!order) {
            return null;
        }

        return order;

    } catch(error: any) {
        throw new Error(error);
    }
}