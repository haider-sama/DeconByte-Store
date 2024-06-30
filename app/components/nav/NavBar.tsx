import Container from "../Container";
import Link from "next/link";
import CartCount from "./CartCount";
import UserMenu from "./UserMenu";
import { getCurrentUser } from "@/actions/getCurrentUser";
import NavCategories from "./NavCategories";
import SearchBar from "./SearchBar";

const NavBar = async() => {
    const currentUser = await getCurrentUser();
    
  
    return (
        <div className="top-0
        w-full">
          
        <div className="py-4 border-b-[1px]">
        <Container>
            <div className="flex items-center
            justify-between
            gap-3
            md-gap-0">
                <Link href={"/"} className="font-bold text-black text-xl">DeconByte</Link>
                <div className="hidden md:block"><SearchBar /></div>
                <div className="flex items-center gap-8 md-gap-12">
                    <CartCount />
                    <UserMenu currentUser={currentUser} />
                    </div>
            </div>
        </Container>
        </div>
        <NavCategories />
        </div>
    );
}

export default NavBar;
