"use client";

import { Filter } from "lucide-react";
import { useState } from "react";
import { LookupItem } from "@/lib/api/lookup";

interface ListingsFilterProps {
    onSearch: (searchTerm: string) => void;
    onStatusFilter: (statusId: string) => void;
    onCityFilter: (cityId: string) => void;
    onAgentFilter: (agentId: string) => void;
    statuses: LookupItem[];
    cities: LookupItem[];
    initialSearch?: string;
    initialStatusId?: string;
    initialCityId?: string;
    initialAgentId?: string;
}

export default function ListingsFilter({ 
    onSearch, 
    onStatusFilter,
    onCityFilter,
    onAgentFilter,
    statuses,
    cities,
    initialSearch = "", 
    initialStatusId = "all",
    initialCityId = "all",
    initialAgentId = "all"
}: ListingsFilterProps) {
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [selectedStatusId, setSelectedStatusId] = useState(initialStatusId);
    const [selectedCityId, setSelectedCityId] = useState(initialCityId);
    const [selectedAgentId, setSelectedAgentId] = useState(initialAgentId);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value);
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedStatusId(value);
        onStatusFilter(value);
    };

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedCityId(value);
        onCityFilter(value);
    };

    const handleAgentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedAgentId(value);
        onAgentFilter(value);
    };

    return (
        <div className="flex items-center gap-4 bg-white rounded-lg p-4 shadow-sm">
            <div className="flex-1 relative">
                <input
                    type="text"
                    placeholder="Search listings..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Filter className="w-5 h-5" />
            </button>

            <select
                value={selectedStatusId}
                onChange={handleStatusChange}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700 cursor-pointer"
            >
                <option value="all">All Status</option>
                {statuses.map(status => (
                    <option key={status.value} value={status.value}>
                        {status.label}
                    </option>
                ))}
            </select>

            <select
                value={selectedCityId}
                onChange={handleCityChange}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700 cursor-pointer"
            >
                <option value="all">All Cities</option>
                {cities.map(city => (
                    <option key={city.value} value={city.value}>
                        {city.label}
                    </option>
                ))}
            </select>

            <select
                value={selectedAgentId}
                onChange={handleAgentChange}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700 cursor-pointer"
            >
                <option value="all">All Agents</option>
                {/* Add agent options here - you'll need to fetch these from your API */}
                <option value="1">Agent 1</option>
                <option value="2">Agent 2</option>
            </select>


        </div>
    );
}
