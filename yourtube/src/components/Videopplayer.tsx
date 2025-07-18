"use client";

import { useRef, useState } from "react";

interface VideoPlayerProps {
  video: {
    _id: string;
    videotitle: string;
    filepath: string;
  };
}

type Quality = "320p" | "480p" | "720p" | "1080p";

const qualityOptions: Record<Quality, string> = {
  "320p": "/video/video-320p.mp4",
  "480p": "/video/video-480p.mp4",
  "720p": "/video/video-720p.mp4",
  "1080p": "/video/video-1080p.mp4",
};

export default function VideoPlayer({ video }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [quality, setQuality] = useState<Quality>("720p");
  const [tapCount, setTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);

  const handleQualityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedQuality = e.target.value as Quality;
    const currentTime = videoRef.current?.currentTime || 0;
    setQuality(selectedQuality);
    if (videoRef.current) {
      videoRef.current.src = qualityOptions[selectedQuality];
      videoRef.current.currentTime = currentTime;
      videoRef.current.play();
    }
  };

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    const tapZoneWidth = e.currentTarget.clientWidth;
    const x = e.nativeEvent.offsetX;
    const zone = x < tapZoneWidth * 0.33 ? "left" : x > tapZoneWidth * 0.66 ? "right" : "center";

    if (now - lastTapTime < 500) {
      setTapCount((prev) => prev + 1);
    } else {
      setTapCount(1);
    }

    setLastTapTime(now);

    setTimeout(() => {
      if (!videoRef.current) return;

      if (tapCount === 1 && zone === "center") {
        if (videoRef.current.paused) {
          videoRef.current.play();
        } else {
          videoRef.current.pause();
        }
      } else if (tapCount === 2) {
        if (zone === "left") {
          videoRef.current.currentTime -= 10;
        } else if (zone === "right") {
          videoRef.current.currentTime += 10;
        }
      } else if (tapCount >= 3) {
        if (zone === "right") {
          window.close();
        } else if (zone === "left") {
          alert("Opening comment section...");
        } else if (zone === "center") {
          alert("Skipping to next video...");
        }
      }

      setTapCount(0);
    }, 400);
  };

  return (
    <div
      className="aspect-video bg-black rounded-lg overflow-hidden relative"
      onClick={handleTap}
    >
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        poster={`/placeholder.svg?height=480&width=854`}
        src={qualityOptions[quality]}
      >
        Your browser does not support the video tag.
      </video>

      {/* Quality dropdown */}
      <div className="absolute top-2 right-2 bg-white text-black text-sm p-1 rounded z-10">
        <label htmlFor="quality" className="mr-1">Quality:</label>
        <select
          id="quality"
          value={quality}
          onChange={handleQualityChange}
          className="bg-white border border-gray-300 rounded px-1"
        >
          {(Object.keys(qualityOptions) as Quality[]).map((q) => (
            <option key={q} value={q}>{q}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
