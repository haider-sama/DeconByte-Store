import Container from "@/app/components/Container";
import ProductDetails from "./ProductDetails";
import ListRating from "./ListRating";
import getProductsById from "@/actions/getProductsById";
import NullData from "@/app/components/NullData";
import AddRating from "./AddRating";
import { getCurrentUser } from "@/actions/getCurrentUser";

interface Params {
    productId?: string;
}

const ProductPage = async({params} : {params: Params}) => {
    const product = await getProductsById(params);
    const user = await getCurrentUser();
    if(!product) {
        return <NullData title="Oops! The given product doesn't exist" />
    }

    return <div className="p-12">
        <Container>
            <ProductDetails product={product} />
            <div className="flex flex-col mt-18 gap-4">
                <AddRating product={product} user={null}/>
                <ListRating product={product} />
            </div>
        </Container>
    </div>
}

export default ProductPage;