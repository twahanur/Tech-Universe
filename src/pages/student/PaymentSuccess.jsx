import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import Loading from '../../components/student/Loading'; 
import { assets } from '../../assets/assets'; 
import Footer from '../../components/student/Footer'; 

const PaymentSuccess = () => {
    const { courseId } = useParams(); 
    const [searchParams] = useSearchParams(); 
    const paymentStatus = searchParams.get('payment'); 
    console.log(courseId, paymentStatus,searchParams); 
   
    const [loading, setLoading] = useState(true);
    const [paymentVerified, setPaymentVerified] = useState(false); 
    useEffect(() => {
        

        if (paymentStatus === 'success') {
            // Simulate a brief loading time for verification
            const timer = setTimeout(() => {
                setPaymentVerified(true);
                setLoading(false);
            }, 1500); // Simulate 1.5 seconds verification
            return () => clearTimeout(timer);
        } else {
            // Handle cases where 'payment' is not 'success' or missing
            setPaymentVerified(false);
            setLoading(false);
            // Optionally redirect to an error page or homepage if paymentStatus is not success
            // navigate('/payment-failed');
        }
    }, [paymentStatus, courseId]); // Depend on paymentStatus and courseId

    if (loading) {
        return <Loading />; // Show a loading spinner during verification
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
            <div className="flex-grow flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-lg shadow-xl text-center border border-gray-200 animate-fade-in">
                    {paymentVerified ? (
                        <>
                            <img
                                src={assets.check_circle_icon || assets.check_icon} // Use a checkmark icon
                                alt="Success"
                                className="w-20 h-20 mx-auto mb-6 text-green-500"
                            />
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-green-700 mb-4">
                                Congratulations!
                            </h1>
                            <p className="text-lg text-gray-700 mb-6">
                                Your payment was successful.
                                You now have full access to the course content.
                            </p>
                            <div className="space-y-4">
                                <Link
                                    to={`/courses/${courseId}`} // Link back to the specific course page
                                    className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                >
                                    Go to Course
                                </Link>
                                <Link
                                    to="/dashboard" // Link to a general student dashboard
                                    className="inline-block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                                >
                                    View Dashboard
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <img
                                src={assets.error_icon || assets.cross_icon} // Use an error icon
                                alt="Payment Failed"
                                className="w-20 h-20 mx-auto mb-6 text-red-500"
                            />
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-red-700 mb-4">
                                Payment Unsuccessful
                            </h1>
                            <p className="text-lg text-gray-700 mb-6">
                                There was an issue processing your payment. Please try again or contact support.
                            </p>
                            <Link
                                to="/" // Link back to homepage or a specific payment retry page
                                className="inline-block w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-md transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                            >
                                Try Again
                            </Link>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PaymentSuccess;