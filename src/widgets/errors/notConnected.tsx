import React from "react";
import {ConnectKitButton} from "connectkit";
import "./notConnected.css";

const NotConnected = () => {
    return (
        <div className="px-8 py-16 flex justify-center">
            <div className="max-w-xl text-center">
                <p className="text-xl">Welcome to Michi, the first trustless points trading protocol. We allow users to
                    earn points from
                    their
                    favorite platforms and trade them pre-TGE. Users can create a Michi Wallet and deposit YT from
                    Pendle to
                    start earning points.
                </p>
                <img src="./assets/phone.png" alt="Connect Placeholder"/>
                <p className="my-4">To get started, connect your wallet and create your first Michi Wallet</p>
                <div className="connect-button">
                    <ConnectKitButton/>
                </div>

            </div>
        </div>
    );
};

export default NotConnected;
