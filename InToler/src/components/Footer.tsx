import { ImYoutube2 } from "react-icons/im";
import { AiFillTwitterSquare } from "react-icons/ai";
import { BsInstagram } from "react-icons/bs";
import { CiLinkedin } from "react-icons/ci";
import { FaFacebookSquare } from "react-icons/fa";
import { IoLogoAmazon } from "react-icons/io5";


const Footer = () => {


    return (
        <footer className="flex justify-around min-h-full p-8 bg-yellow-400  text-white font-semibold">
            <a className="text-4xl hover:bg-yellow-500" href="https://www.linkedin.com/in/miguel-meneses-oliveros" target="_blank" rel="noopener noreferrer"><CiLinkedin /></a>
            <a className="text-4xl hover:bg-yellow-500" href="https://www.x.com" target="_blank" rel="noopener noreferrer"><AiFillTwitterSquare /></a>
            <a className="text-4xl hover:bg-yellow-500" href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><BsInstagram /></a>
            <a className="text-4xl hover:bg-yellow-500" href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"> <FaFacebookSquare /></a>
            <a className="text-4xl hover:bg-yellow-500" href="https://www.amazon.es/s?k=restaurante+estrella+michelin&crid=3KMYEJTMXHFX2&sprefix=restaurante+estrella+michelin%2Caps%2C77&ref=nb_sb_ss_ts-doa-p_1_29" target="_blank" rel="noopener noreferrer"><IoLogoAmazon /></a>
            <a className="text-4xl hover:bg-yellow-500" href="https://www.youtube.com/results?search_query=libros+de+gastronomia+" target="_blank" rel="noopener noreferrer"><ImYoutube2 /></a>
        </footer>
    );
};

export default Footer;