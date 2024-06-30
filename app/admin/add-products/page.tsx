import Container from "@/app/components/Container";
import AddProductForm from "./AddProductForm";
import FormWrapper from "@/app/components/FormWrapper";
import { getCurrentUser } from "@/actions/getCurrentUser";
import NullData from "@/app/components/NullData";

const AddProducts = async() => {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role != "ADMIN") {
        return <NullData title="Oops! Access Denied"/>;
    }
    return(
        <div>
            <Container>
                <FormWrapper>
                <AddProductForm />
                </FormWrapper>
            </Container>
        </div>
    )
}

export default AddProducts;