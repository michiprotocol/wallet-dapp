import React, { useState } from 'react';

// @ts-ignore
const Modal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <>
            {/* Modal Background */}
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={onClose}></div>

            {/* Modal */}
            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="bg-white rounded shadow-lg m-4 sm:m-8" style={{ maxWidth: '500px' }}>
                        <div className="border-b px-4 py-2 flex justify-between items-center">
                            <h3 className="font-semibold text-lg">Terms & Conditions</h3>
                            <button className="text-black" onClick={onClose}>
                                &times;
                            </button>
                        </div>
                        <div className="p-4">
                            <p>This is a simple modal. You can place any content here, like forms or additional information.</p>
                        </div>
                        <div className="flex justify-end items-center w-100 border-t p-4">
                            <button className="px-4 py-2 bg-gray-500 text-white hover:bg-gray-700 rounded mr-2" onClick={onClose}>Close</button>
                            <button className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-700 rounded">Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Modal;
