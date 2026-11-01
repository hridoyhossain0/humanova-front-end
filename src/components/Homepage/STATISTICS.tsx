import {
    CalendarDays,
   
    SlidersHorizontal,
  
    PartyPopper,

} from 'lucide-react';


const STATISTICS = ({events}) => {
    return (
        <div>
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Total Events
                            </p>
                            <h2 className="mt-2 text-3xl font-black text-gray-900">
                                {events.length}
                            </h2>
                        </div>

                        <div className="rounded-xl bg-violet-100 p-3 text-violet-600">
                            <CalendarDays size={24} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Upcoming Events
                            </p>
                            <h2 className="mt-2 text-3xl font-black text-emerald-600">
                                {events.filter(
                                    (event) =>
                                        new Date(event.eventDate) >= new Date()
                                ).length}
                            </h2>
                        </div>

                        <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600">
                            <PartyPopper size={24} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Categories
                            </p>
                            <h2 className="mt-2 text-3xl font-black text-orange-500">
                                {categories.length - 1}
                            </h2>
                        </div>

                        <div className="rounded-xl bg-orange-100 p-3 text-orange-600">
                            <SlidersHorizontal size={24} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default STATISTICS;