import React from "react";
import Link from "next/link";

const Navbar = () => {
    return (
        <>
            <div className="flex items-center h-[50px] px-4 border-gray-850 md:px-6 sticky top-0 bg-blue-600">
                <svg
                    className="h-6 w-6 text-blue-500 bg-yellow-500"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"/>
                </svg>
                <h1 className="ml-3 text-xl text-yellow-500 font-bold tracking-tighter md:text-2xl">Postee Bot v1.1</h1>
            </div>
        </>
    );
};

export default Navbar;