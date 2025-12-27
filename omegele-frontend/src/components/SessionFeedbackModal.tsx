"use client";

import { useState } from "react";

interface SessionFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: {
    sessionRating: number;
    callRating: number;
    improvements: string;
  }) => Promise<void>;
}

export default function SessionFeedbackModal({
  isOpen,
  onClose,
  onSubmit,
}: SessionFeedbackModalProps) {
  const [sessionRating, setSessionRating] = useState(0);
  const [callRating, setCallRating] = useState(0);
  const [improvements, setImprovements] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (sessionRating === 0 || callRating === 0) {
      alert("Please rate both the session and the call");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        sessionRating,
        callRating,
        improvements: improvements.trim(),
      });
      // Reset form
      setSessionRating(0);
      setCallRating(0);
      setImprovements("");
      onClose();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({
    rating,
    onRatingChange,
    label,
  }: {
    rating: number;
    onRatingChange: (rating: number) => void;
    label: string;
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className={`transition-transform hover:scale-110 active:scale-95 ${
              star <= rating ? "text-[#ffd447]" : "text-gray-300"
            }`}
            disabled={isSubmitting}
          >
            <svg
              className="w-8 h-8"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
        {rating > 0 && (
          <span className="ml-2 text-sm text-slate-600">
            {rating === 1 && "Poor"}
            {rating === 2 && "Fair"}
            {rating === 3 && "Good"}
            {rating === 4 && "Very Good"}
            {rating === 5 && "Excellent"}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">
              How was your session?
            </h2>
            <p className="text-sm text-slate-600">
              Your feedback helps us improve the platform
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <StarRating
              rating={sessionRating}
              onRatingChange={setSessionRating}
              label="How was the session?"
            />

            <StarRating
              rating={callRating}
              onRatingChange={setCallRating}
              label="How was the call?"
            />

            <div className="space-y-2">
              <label
                htmlFor="improvements"
                className="text-sm font-medium text-slate-700"
              >
                What improvement would you suggest? (Optional)
              </label>
              <textarea
                id="improvements"
                value={improvements}
                onChange={(e) => setImprovements(e.target.value)}
                placeholder="Share your thoughts on how we can improve..."
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd447] focus:border-transparent resize-none text-sm"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Skip
              </button>
              <button
                type="submit"
                disabled={isSubmitting || sessionRating === 0 || callRating === 0}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-[#ffd447] rounded-lg hover:bg-[#facc15] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

