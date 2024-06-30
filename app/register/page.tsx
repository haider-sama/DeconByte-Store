import Container from "../components/Container";
import FormWrapper from "../components/FormWrapper";
import RegisterForm from "./RegisterForm";
import { getCurrentUser } from "@/actions/getCurrentUser";

const Register = async () => {
    const currentUser = await getCurrentUser();

    return (
        <Container>
            <FormWrapper>
                <RegisterForm currentUser={currentUser}/>
            </FormWrapper>
        </Container>
    );
}

export default Register;