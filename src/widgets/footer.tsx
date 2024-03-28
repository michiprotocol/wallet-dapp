import React from "react";
// Import only the icons you need from lucide-react
import {Twitter, MessageCircle} from "lucide-react";

const Footer = () => {
    return (
        <div className="text-white py-4"
             style={{background: "linear-gradient(90deg, rgba(218, 99, 255, 0.2) 0%, rgba(52, 55, 250, 0.2) 100%)"}}>
            <div className="px-8 mx-auto flex justify-between items-center">
                {/* Social Links */}
                <div className="flex gap-4">
                    <a href="https://twitter.com/michiprotocol" target="_blank" rel="noopener noreferrer"
                       className="text-white hover:text-blue-400 transition duration-300">
                        <Twitter size={24}/>
                    </a>
                    <a href="https://discord.gg/apDtPzn4A4" target="_blank" rel="noopener noreferrer"
                       className="text-white hover:text-blue-500 transition duration-300">
                        <MessageCircle size={24}/>
                    </a>
                </div>
                {/* Copyright Notice */}
                <div>
                    © {new Date().getFullYear()} Michi Protocol
                </div>
            </div>
        </div>
    );
};

export default Footer;
