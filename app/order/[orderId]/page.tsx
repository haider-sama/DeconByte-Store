import Container from "@/app/components/Container";
import OrderDetails from "./OrderDetails";
import getOrdersById from "@/actions/getOrdersById";
import NullData from "@/app/components/NullData";

interface Params {
    orderId?: string;
}

const OrderPage = async({params} : {params: Params}) => {
    const order = await getOrdersById(params);

    if(!order) {
        return <NullData title="No Order"></NullData>
    }

    return <div className="p-12">
        <Container>
            <OrderDetails order={order} />
        </Container>
    </div>
}

export default OrderPage;