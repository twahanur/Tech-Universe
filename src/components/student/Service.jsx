import { servicesData } from '../../assets/staticData.jsx';


const ServicesSection = () => {
    return (
        <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
            <div className="mx-auto container">
                {/* Section Header */}
                <div className="text-center">
                    <p className="text-sm font-bold uppercase tracking-widest text-gray-500">
                        I can write i
                    </p>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        High-Impactful Services For You
                    </h2>
                </div>

                {/* Services Grid */}
                <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {servicesData.map((service, index) => (
                        <div 
                            key={index} 
                            className={`bg-white shadow-lg rounded-lg overflow-hidden border-b-4 border-${service.color}`}
                        >
                            <div className="p-6">
                                <div className={`w-16 h-16 flex items-center justify-center rounded-full bg-${service.bgColor} mb-6`}>
                                    {service.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {service.title}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                    {service.description}
                                </p>
                                <a href="#" className="font-semibold text-sm text-gray-800 hover:text-gray-600 group">
                                    LEARN MORE <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;