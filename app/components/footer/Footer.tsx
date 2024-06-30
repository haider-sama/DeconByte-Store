import { MdFacebook } from "react-icons/md";
import Container from "../Container";
import FooterList from "./FooterList";
import Link from "next/link";
import { AiFillInstagram, AiFillTwitterCircle, AiFillYoutube } from "react-icons/ai";

const Footer = () => {
    return (
        <footer className="bg-slate-800 text-white
        text-sm mt-16">
            <Container>
            <div className="flex flex-col md:flex-row 
            justify-between pt-16 pb-8">
            <FooterList>
                <h3 className="text-xl font-bold mb-2">Categories</h3>
                <Link href="#">PC Games</Link>
                <Link href="#">Gift Cards</Link>
                <Link href="#">Steam Gift Cards</Link>
                <Link href="#">Console Games</Link>
            </FooterList>

            <FooterList>
                <h3 className="text-xl font-bold mb-2">Customer Service</h3>
                <Link href="#">Shipping Policy</Link>
                <Link href="#">Contact Us</Link>
                <Link href="#">FAQs</Link>
                <Link href="#">Blog</Link>
            </FooterList>

            <div className="w-full md:w-1/3 mb-6 md:mb-0">
                <h3 className="font-bold text-xl mb-2">About Us</h3>
                <p className="mb-2">Deconbyte is a premier 
                eCommerce store offering a diverse range of high-quality tech gadgets 
                and accessories. Experience seamless shopping with top-notch customer service 
                and fast shipping at Deconbyte.</p>
                <p>&copy; {new Date().getFullYear()} DeconByte. All rights reserved.</p>
            </div>

            <FooterList>
                <h3 className="text-xl font-bold mb-2">Socials</h3>
                <div className="flex gap-2">
                <Link href="#"><MdFacebook size={24}></MdFacebook></Link>
                <Link href="#"><AiFillTwitterCircle size={24}></AiFillTwitterCircle></Link>
                <Link href="#"><AiFillYoutube size={24}></AiFillYoutube></Link>
                <Link href="#"><AiFillInstagram size={24}></AiFillInstagram></Link>
                </div>
            </FooterList>

            </div>
            </Container>
        </footer>
    );
}

export default Footer;
