"use client";

import { JSX } from "react";

export const AdminLogsHeaderSection = (): JSX.Element => {
    return (
        <header className="flex w-full items-center justify-between gap-4 max-[767px]:flex-col max-[767px]:items-start">
            <div className="flex flex-col">
                <h1 className="text-2xl font-bold leading-8 text-[#003366]">
                    Admin Logs
                </h1>
            </div>
        </header>
    );
}