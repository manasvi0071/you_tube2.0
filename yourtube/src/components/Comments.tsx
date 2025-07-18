import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosinstance";

interface Comment {
  _id: string;
  videoid: string;
  userid: string;
  commentbody: string;
  usercommented: string;
  commentedon: string;
  city?: string;
  likes?: number;
  dislikes?: number;
  translated?: string;
}

const Comments = ({ videoId }: any) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [userCity, setUserCity] = useState("Unknown");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => setUserCity(data.city || "Unknown"));
  }, []);

  useEffect(() => {
    loadComments();
  }, [videoId]);

  const loadComments = async () => {
    try {
      const res = await axiosInstance.get(`/comment/${videoId}`);
      setComments(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!user || !newComment.trim()) return;

    const specialCharRegex = /[^a-zA-Z0-9\s.,!?'"()]/;
    if (specialCharRegex.test(newComment)) {
      alert("Comments with special characters are not allowed!");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axiosInstance.post("/comment/postcomment", {
        videoid: videoId,
        userid: user._id,
        commentbody: newComment,
        usercommented: user.name,
        city: userCity,
      });

      if (res.data.comment) {
        const newCommentObj: Comment = {
          _id: Date.now().toString(),
          videoid: videoId,
          userid: user._id,
          commentbody: newComment,
          usercommented: user.name || "Anonymous",
          commentedon: new Date().toISOString(),
          city: userCity,
          likes: 0,
          dislikes: 0,
        };
        setComments([newCommentObj, ...comments]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (comment: Comment) => {
    setEditingCommentId(comment._id);
    setEditText(comment.commentbody);
  };

  const handleUpdateComment = async () => {
    if (!editText.trim()) return;
    try {
      const res = await axiosInstance.post(`/comment/editcomment/${editingCommentId}`, {
        commentbody: editText,
      });
      if (res.data) {
        setComments((prev) =>
          prev.map((c) =>
            c._id === editingCommentId ? { ...c, commentbody: editText } : c
          )
        );
        setEditingCommentId(null);
        setEditText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await axiosInstance.delete(`/comment/deletecomment/${id}`);
      if (res.data.comment) {
        setComments((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = (id: string) => {
    setComments((prev) =>
      prev.map((c) => (c._id === id ? { ...c, likes: (c.likes || 0) + 1 } : c))
    );
  };

  const handleDislike = (id: string) => {
    const updated = comments.map((c) =>
      c._id === id ? { ...c, dislikes: (c.dislikes || 0) + 1 } : c
    );
    const filtered = updated.filter((c) => (c.dislikes || 0) < 2);
    setComments(filtered);
  };

  const handleTranslate = async (id: string, text: string, lang: string) => {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${lang}`
    );
    const data = await res.json();
    const translatedText = data.responseData.translatedText;

    setComments((prev) =>
      prev.map((c) => (c._id === id ? { ...c, translated: translatedText } : c))
    );
  };

  if (loading) {
    return <div>Loading comments...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{comments.length} Comments</h2>

      {user && (
        <div className="flex gap-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user.image || ""} />
            <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px] resize-none border-0 border-b-2 rounded-none focus-visible:ring-0"
            />
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={() => setNewComment("")} disabled={!newComment.trim()}>
                Cancel
              </Button>
              <Button onClick={handleSubmitComment} disabled={!newComment.trim() || isSubmitting}>
                Comment
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-4">
              <Avatar className="w-10 h-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>{comment.usercommented[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{comment.usercommented}</span>
                  <span className="text-xs text-gray-600">
                    {formatDistanceToNow(new Date(comment.commentedon))} ago
                  </span>
                  <span className="text-xs text-gray-500">from {comment.city || "Unknown"}</span>
                </div>

                {editingCommentId === comment._id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <div className="flex gap-2 justify-end">
                      <Button onClick={handleUpdateComment} disabled={!editText.trim()}>
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setEditingCommentId(null);
                          setEditText("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm">{comment.commentbody}</p>

                    {/* Translate Dropdown */}
                    <select
                      className="mt-2 text-sm border rounded p-1"
                      onChange={(e) =>
                        handleTranslate(comment._id, comment.commentbody, e.target.value)
                      }
                    >
                      <option value="">Translate</option>
                      <option value="hi">Hindi</option>
                      <option value="fr">French</option>
                      <option value="mr">Marathi</option>
                      <option value="ta">Tamil</option>
                    </select>
                    {comment.translated && (
                      <p className="text-green-600 text-sm mt-1">
                        Translated: {comment.translated}
                      </p>
                    )}

                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                      <button onClick={() => handleLike(comment._id)}>👍 {comment.likes || 0}</button>
                      <button onClick={() => handleDislike(comment._id)}>👎 {comment.dislikes || 0}</button>
                      {comment.userid === user?._id && (
                        <>
                          <button onClick={() => handleEdit(comment)}>Edit</button>
                          <button onClick={() => handleDelete(comment._id)}>Delete</button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;
