"use client";

import { useState } from "react";

interface FlagModalProps {
  isOpen: boolean;
  onClose: () => void;
  flaggedUserId: string;
  matchId: string;
  onFlagSubmit: (reason: string, category?: string) => Promise<void>;
}

const FLAG_CATEGORIES = [
  { value: "HARASSMENT", label: "Harassment or Bullying" },
  { value: "INAPPROPRIATE", label: "Inappropriate Content" },
  { value: "SPAM", label: "Spam or Solicitation" },
  { value: "SCAM", label: "Scam or Fraud" },
  { value: "HATE_SPEECH", label: "Hate Speech" },
  { value: "VIOLENCE", label: "Threats or Violence" },
  { value: "OTHER", label: "Other" },
];

export default function FlagModal({
  isOpen,
  onClose,
  flaggedUserId,
  matchId,
  onFlagSubmit,
}: FlagModalProps) {
  const [reason, setReason] = useState("");
  const [category, setCategory] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim().length < 10) {
      alert("Please provide a reason with at least 10 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      await onFlagSubmit(reason, category || undefined);
      setReason("");
      setCategory("");
      onClose();
    } catch (error) {
      console.error("Error submitting flag:", error);
      alert("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-[#272f45] bg-[#0b1018] p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-semibold text-[#f8f3e8]">Report User</h2>
        <p className="mb-4 text-sm text-[#9aa2c2]">
          Please provide a reason for reporting this user. This helps us keep our community safe.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#f8f3e8]">
              Category (Optional)
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-[#3b435a] bg-[#050816] px-4 py-2 text-sm text-[#f8f3e8] focus:border-[#ffd447] focus:outline-none"
            >
              <option value="">Select a category</option>
              {FLAG_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#f8f3e8]">
              Reason <span className="text-red-400">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please describe the issue (minimum 10 characters)..."
              required
              minLength={10}
              rows={4}
              className="w-full rounded-lg border border-[#3b435a] bg-[#050816] px-4 py-2 text-sm text-[#f8f3e8] placeholder-[#64748b] focus:border-[#ffd447] focus:outline-none"
            />
            <p className="mt-1 text-xs text-[#64748b]">
              {reason.length}/10 characters minimum
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 rounded-lg border border-[#3b435a] bg-[#0f1729] px-4 py-2 text-sm font-medium text-[#f8f3e8] transition hover:border-[#6471a3] hover:bg-[#151f35] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || reason.trim().length < 10}
              className="flex-1 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

