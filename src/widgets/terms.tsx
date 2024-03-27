import React from "react";
import {Routes} from "@/constants/routes";
import {Link} from "react-router-dom";

// @ts-ignore
const Terms = ({handleContinue}) => {

    return (
        <div className="pt-[58px] px-6">
            <div className="px-8 py-16 flex justify-center">
                <div className="max-w-xl text-center">
                    <h1 className="text-4xl font-bold">Welcome to Michi</h1>
                    <img className="m-auto my-12 w-full md:w-1/2" src="./assets/logo.svg" alt="Connect Placeholder"/>
                    <p className="text-lg">By continuing to Michi Protocol, you agree to our
                        <a href="https://docs.michiwallet.com/additional-information/terms-of-service" target="_blank"
                           rel="noreferrer noopener" className="text-gradient"> Terms of Service</a>
                        {/*and <a href="https://docs.michiwallet.com/additional-information/privacy-policy" target="_blank"*/}
                        {/*       rel="noreferrer noopener" className="text-gradient"> Privacy Policy</a>*/}
                    </p>
                    <div className="my-12">
                        <a className="btn btn-outline btn-lg mr-6 px-12" href="https://michiwallet.com/">Cancel
                        </a>
                        <button className="btn btn-gradient btn-lg px-12 text-white" onClick={handleContinue}>Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Terms;