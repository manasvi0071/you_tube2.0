import { useEffect, useState } from "react";

const PremiumPage = () => {
  const [isRazorpayReady, setIsRazorpayReady] = useState(false);

  const loadRazorpayScript = () => {
    if (document.getElementById("razorpay-script")) return;

    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setIsRazorpayReady(true);
    document.body.appendChild(script);
  };

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  const handlePayment = () => {
    if (!(window as any).Razorpay) {
      alert("Razorpay SDK failed to load. Please try again.");
      return;
    }

    const options = {
      key: "rzp_test_5vTec3yEKpRIpS", // 🔁 Replace with your actual test key
      amount: 5000, // ₹50 in paise
      currency: "INR",
      name: "YourTube Premium",
      description: "Unlimited Downloads Access",
      handler: function (response: any) {
        alert("✅ Payment successful!");

        // Mark user as premium in localStorage
        localStorage.setItem("premiumUser", "true");
      },
      prefill: {
        name: "Manasvi",
        email: "manishkalesg@gmail.com",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <div className="max-w-xl mx-auto mt-12 text-center space-y-6 p-4">
      <h1 className="text-3xl font-bold">Upgrade to Premium</h1>
      <p className="text-gray-600">
        With Premium, you can download unlimited videos and enjoy additional benefits.
      </p>
      <button
        onClick={handlePayment}
        disabled={!isRazorpayReady}
        className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
      >
        Pay ₹50 and Upgrade
      </button>
    </div>
  );
};

export default PremiumPage;
