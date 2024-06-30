import { getCurrentUser } from "@/actions/getCurrentUser";
import Container from "../components/Container";
import CartClient from "./CartClient";

const CartPage = async() => {
        const currentUser = await getCurrentUser();
        return <div className="pt-12">
                <Container>
                        <CartClient currentUser={currentUser}/>
                </Container>
        </div>
}

export default CartPage;