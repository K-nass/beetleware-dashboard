import Image from "next/image";
export default function StatisticsCard() {
    return (
        <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-between hover:shadow-md md:w-1/4 mt-2">
            <div className="flex flex-col gap-4">
                <h2 className="text-gray-400 text-lg font-medium">Total Listings</h2>
                <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-gray-900">1,247</p>
                    <div className="bg-blue-500 rounded-2xl p-5">
                        <Image src="listing.svg" width={20} height={20} alt="listings alt" />
                    </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-500 text-sm font-semibold">+12%</span>
                    <span className="text-gray-400 text-base">from last month</span>
                </div>
            </div>
        </div>
    );
}