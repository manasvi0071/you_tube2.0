"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Video {
  _id: string;
  videotitle: string;
  filename: string;
  filetype: string;
  filepath: string;
  filesize: string;
  videochanel: string;
  Like: number;
  views: number;
  uploader: string;
  createdAt: string;
}

const SearchResult = ({ query }: { query: string }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query.trim()) return;

    const fetchVideos = async () => {
      setLoading(true);
      const allVideos: Video[] = [
        {
          _id: "1",
          videotitle: "Amazing Nature Documentary",
          filename: "nature-doc.mp4",
          filetype: "video/mp4",
          filepath: "/videos/nature-doc.mp4",
          filesize: "500MB",
          videochanel: "Nature Channel",
          Like: 1250,
          views: 45000,
          uploader: "nature_lover",
          createdAt: new Date().toISOString(),
        },
        {
          _id: "2",
          videotitle: "Cooking Tutorial: Perfect Pasta",
          filename: "pasta-tutorial.mp4",
          filetype: "video/mp4",
          filepath: "/videos/pasta-tutorial.mp4",
          filesize: "300MB",
          videochanel: "Chef's Kitchen",
          Like: 890,
          views: 23000,
          uploader: "chef_master",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ];

      const filtered = allVideos.filter(
        (vid) =>
          vid.videotitle.toLowerCase().includes(query.toLowerCase()) ||
          vid.videochanel.toLowerCase().includes(query.toLowerCase())
      );

      setVideos(filtered);
      setLoading(false);
    };

    fetchVideos();
  }, [query]);

  if (!query.trim()) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">
          Enter a search term to find videos and channels.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading results...</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">No results found</h2>
        <p className="text-gray-600">
          Try different keywords or remove search filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {videos.map((video) => (
          <div key={video._id} className="flex gap-4 group">
            <Link href={`/watch/${video._id}`} className="flex-shrink-0">
              <div className="relative w-80 aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <video
                  src="/video/video-720p.mp4"
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                  muted
                />
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 rounded">
                  10:24
                </div>
              </div>
            </Link>

            <div className="flex-1 min-w-0 py-1">
              <Link href={`/watch/${video._id}`}>
                <h3 className="font-medium text-lg line-clamp-2 group-hover:text-blue-600 mb-2">
                  {video.videotitle}
                </h3>
              </Link>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <span>{video.views.toLocaleString()} views</span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
              </div>

              <Link
                href={`/channel/${video.uploader}`}
                className="flex items-center gap-2 mb-2 hover:text-blue-600"
              >
                <Avatar className="w-6 h-6">
                  <AvatarImage src="/placeholder.svg?height=24&width=24" />
                  <AvatarFallback className="text-xs">
                    {video.videochanel[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-600">{video.videochanel}</span>
              </Link>

              <p className="text-sm text-gray-700 line-clamp-2">
                Sample video description that would show search-relevant content and
                help users understand what the video is about before clicking.
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center py-8">
        <p className="text-gray-600">
          Showing {videos.length} result{videos.length > 1 ? "s" : ""} for "{query}"
        </p>
      </div>
    </div>
  );
};

export default SearchResult;
