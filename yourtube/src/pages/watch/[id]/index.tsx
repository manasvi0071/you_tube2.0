import Comments from "@/components/Comments";
import RelatedVideos from "@/components/RelatedVideos";
import VideoInfo from "@/components/VideoInfo";
import Videopplayer from "@/components/Videopplayer";
import axiosInstance from "@/lib/axiosinstance";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import UpgradePlan from "@/components/UpgradePlan"; // ✅ Added
import { Dialog } from "@headlessui/react"; // ✅ Make sure this is installed

const index = () => {
  const router = useRouter();
  const { id } = router.query;
  const [videos, setvideo] = useState<any>(null);
  const [video, setvide] = useState<any>(null);
  const [loading, setloading] = useState(true);
  const [showPlanModal, setShowPlanModal] = useState(false); // ✅ Plan Modal

  useEffect(() => {
    const fetchvideo = async () => {
      if (!id || typeof id !== "string") return;
      try {
        const res = await axiosInstance.get("/video/getall");
        const video = res.data?.filter((vid: any) => vid._id === id);
        setvideo(video[0]);
        setvide(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setloading(false);
      }
    };
    fetchvideo();
  }, [id]);

  // ✅ Watch Limit Check
  useEffect(() => {
    const plan = JSON.parse(localStorage.getItem("plan") || "{}");
    const videoStart = Date.now();

    const interval = setInterval(() => {
      const currentTime = Math.floor((Date.now() - videoStart) / 60000); // in minutes
      const allowedTime =
        plan.name === "Bronze" ? 7 :
        plan.name === "Silver" ? 10 :
        plan.name === "Gold" ? 1000 : 5;

      if (currentTime >= allowedTime) {
        alert(`⏳ Your ${plan.name || "Free"} plan allows only ${allowedTime} minutes.\nPlease upgrade to continue.`);
        setShowPlanModal(true);
        clearInterval(interval);
      }
    }, 60000); // every 1 min

    return () => clearInterval(interval);
  }, []);

  // ✅ Download Function
  const handleDownload = () => {
    const isPremium = localStorage.getItem("premiumUser") === "true";
    const lastDownload = localStorage.getItem("lastDownload");
    const today = new Date().toDateString();

    if (!isPremium && lastDownload === today) {
      alert("You can only download one video per day. Upgrade to premium!");
      router.push("/premium");
      return;
    }

    if (videos?.filepath && videos?.filename) {
      const link = document.createElement("a");
      link.href = videos.filepath;
      link.download = videos.filename;
      link.click();

      localStorage.setItem("lastDownload", today);
      const prev = JSON.parse(localStorage.getItem("downloadedVideos") || "[]");
      prev.push({
        id: videos._id,
        title: videos.videotitle,
        date: new Date(),
      });
      localStorage.setItem("downloadedVideos", JSON.stringify(prev));
    } else {
      alert("Video file not found.");
    }
  };

  if (loading) return <div>Loading..</div>;
  if (!videos) return <div>Video not found</div>;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Videopplayer video={videos} />

            {/* ✅ Download Button */}
            <div className="flex justify-end">
              <button
                onClick={handleDownload}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Download Video
              </button>
            </div>

            <VideoInfo video={videos} />
            <Comments videoId={id} />
          </div>
          <div className="space-y-4">
            <RelatedVideos videos={video} />
          </div>
        </div>
      </div>

      {/* ✅ Plan Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/60">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <UpgradePlan
              onSelect={(plan) => {
                localStorage.setItem("plan", JSON.stringify(plan));
                setShowPlanModal(false);
                alert(`🟢 You selected ${plan.name} Plan. ₹${plan.price} should be charged here.`);
                // In Task 5, we'll add Razorpay payment here
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default index;
