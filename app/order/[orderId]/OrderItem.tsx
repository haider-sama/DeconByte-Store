import { formatPrice } from "@/app/utils/formatPrice";
import { truncateText } from "@/app/utils/truncateText";
import { CartProductType, Order } from "@prisma/client";
import Image from "next/image";

interface OrderItemProps {
    item: CartProductType;
}
const OrderItem: React.FC<OrderItemProps> = ({item}) => {
    return(
        <div className="grid grid-cols-5 text-xs md:text-sm gap-4 border-t-[1.5px]
        border-slate-200 py-4 items-center">
            <div className="col-span-2 justify-self-start gap-2 flex md:gap-4">
                <div className="w-[70px] relative aspect-square">
                    <Image src={item.selectedIMG.image} alt={item.name} fill 
                    className="object-contain" />
                </div>
                <div className="flex flex-col gap-1">
                    <div>{truncateText(item.name)}</div>
                    <div>{item.selectedIMG.color}</div>
                </div>
            </div>
            <div className="justify-self-center">{formatPrice(item.price)}</div>
            <div className="justify-self-center">{item.quantity}</div>
            <div className="justify-self-end font-semibold">{(item.price * item.quantity).toFixed(2)}</div>
        </div>
    )
}

export default OrderItem;