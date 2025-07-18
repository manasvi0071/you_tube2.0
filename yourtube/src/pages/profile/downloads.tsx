import React, { useEffect, useState } from "react";
import Link from "next/link";

const Downloads = () => {
  const [downloads, setDownloads] = useState<any[]>([]);

  useEffect(() => {
    const downloaded = localStorage.getItem("downloadedVideos");
    if (downloaded) {
      setDownloads(JSON.parse(downloaded));
    }
  }, []);

  if (downloads.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Your Downloads</h1>
        <p>You haven't downloaded any videos yet.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Your Downloads</h1>
      <div className="space-y-4">
        {downloads.map((video, index) => (
          <div key={index} className="p-4 border rounded shadow">
            <h2 className="text-lg font-semibold">{video.videotitle}</h2>
            <video src={video.filepath} controls className="w-full mt-2" />
            <Link href={`/watch/${video._id}`} className="text-blue-500 underline mt-2 inline-block">
              Go to Watch Page
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Downloads;
