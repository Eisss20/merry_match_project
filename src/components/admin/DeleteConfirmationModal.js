import React from "react";
import Link from "next/link";

// deleteDetail Step3: เรียกใข้งาน Modal
export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  cancelLabel,
  confirmClassName = "rounded-full bg-pink-100 px-6 py-2 text-pink-500 hover:bg-pink-200",
  cancelClassName = "rounded-full bg-red-500 px-6 py-2 text-white hover:bg-red-600",
}) {
  if (!isOpen) return null;

  return (
    <div
      className={`[cubic-bezier(0.4, 0.0, 0.2, 1)] fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 transition-opacity duration-500 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* ของเดิม  w-full --- Change to ---> w-auto */}
      <div
        className={`[cubic-bezier(0.4, 0.0, 0.2, 1)] w-auto max-w-lg transform rounded-3xl bg-white shadow-lg transition-transform duration-700 ${
          isOpen ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-semibold text-gray-900"> {title} </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <div className="p-4">
          <p className="text-gray-700">{message}</p>
        </div>

        <div className="flex space-x-4 p-4">
          {/* // deleteDetail Step4: เมื่อกด "Yes, I want to delete".*/}
          <button onClick={onConfirm} className={confirmClassName}>
            {confirmLabel}
          </button>
          {/*// deleteDetail Step3.1: การยกเลิก model: 1*/}
          {/* ปุ่ม Cancel: แสดงเฉพาะเมื่อ cancelLabel มีค่า */}
          {cancelLabel && (
            <button onClick={onClose} className={cancelClassName}>
              {cancelLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// use in Package Duplicate
export function DeleteConfirmationModal2({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  cancelLabel,
}) {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 transition-opacity duration-500 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`w-full max-w-lg transform rounded-3xl bg-white shadow-lg transition-transform duration-700 ${
          isOpen ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b p-5">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 p-4">
          <div className="list-decimal space-y-2 pl-5 text-gray-700">
            <p>You already have a package. Wait for it to end (30 days)</p>
            <p>
              or cancel it here:
              <Link
                href="/payment/membership"
                className="ml-2 text-blue-500 hover:underline"
              >
                [Manage Current Package].
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-4 p-5">
          {confirmLabel && (
            <button
              onClick={onConfirm}
              className="rounded-lg bg-pink-100 px-5 py-2 text-pink-500 hover:bg-pink-200"
            >
              {confirmLabel}
            </button>
          )}
          {cancelLabel && (
            <button
              onClick={onClose}
              className="rounded-full bg-red-500 px-6 py-2 text-white hover:bg-red-600"
            >
              {cancelLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// use in Submit Merrylist-[id]
export function SubmitConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  cancelLabel,
  confirmClassName = "rounded-full bg-pink-100 px-6 py-2 text-pink-500 hover:bg-pink-200",
  cancelClassName = "rounded-full bg-red-500 px-6 py-2 text-white hover:bg-red-600",
}) {
  if (!isOpen) return null;

  return (
    <div
      className={`[cubic-bezier(0.4, 0.0, 0.2, 1)] fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 transition-opacity duration-500 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* ของเดิม  w-full --- Change to ---> w-auto */}
      <div
        className={`[cubic-bezier(0.4, 0.0, 0.2, 1)] w-full max-w-lg transform rounded-3xl bg-white px-3 shadow-lg transition-transform duration-700 ${
          isOpen ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between border-b px-4 pb-3 pt-4">
          <h3 className="text-xl font-bold text-gray-900"> {title} </h3>
          <button
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <div className="px-4 py-6">
          <p className="text-gray-700">{message}</p>
        </div>

        <div className="flex space-x-4 px-4 pb-8">
          {/* // deleteDetail Step4: เมื่อกด "Yes, I want to delete".*/}
          <button
            onClick={onConfirm}
            className="rounded-full bg-primary-100 px-6 py-3 font-bold text-primary-600 hover:bg-pink-200"
          >
            {confirmLabel}
          </button>
          {/*// deleteDetail Step3.1: การยกเลิก model: 1*/}
          {/* ปุ่ม Cancel: แสดงเฉพาะเมื่อ cancelLabel มีค่า */}
          {cancelLabel && (
            <button
              onClick={onClose}
              className="rounded-full bg-primary-500 px-6 py-3 font-bold text-white hover:bg-red-600"
            >
              {cancelLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

//PaymentMembership - Cancel MemberShip
export function SubmitCancelMembershipModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  cancelLabel,
  confirmClassName = "rounded-full bg-pink-100 px-6 py-2 text-pink-500 hover:bg-pink-200",
  cancelClassName = "rounded-full bg-red-500 px-6 py-2 text-white hover:bg-red-600",
}) {
  if (!isOpen) return null;

  return (
    <div
      className={`[cubic-bezier(0.4, 0.0, 0.2, 1)] fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 transition-opacity duration-500 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* ของเดิม  w-full --- Change to ---> w-auto */}
      <div
        className={`[cubic-bezier(0.4, 0.0, 0.2, 1)] w-[550px] transform rounded-3xl bg-white px-6 py-4 shadow-lg transition-transform duration-700 ${
          isOpen ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between border-b px-4 pb-3 pt-4">
          <h3 className="text-xl font-bold text-gray-900"> {title} </h3>
          <button
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <div className="px-4 py-6">
          <p className="text-gray-700">{message}</p>
        </div>

        <div className="flex gap-x-4 px-2 pb-4">
          {/* // deleteDetail Step4: เมื่อกด "Yes, I want to delete".*/}
          <button
            onClick={onConfirm}
            className="rounded-full bg-primary-100 px-6 py-3 font-bold text-primary-600 hover:bg-pink-200"
          >
            {confirmLabel}
          </button>
          {/*// deleteDetail Step3.1: การยกเลิก model: 1*/}
          {/* ปุ่ม Cancel: แสดงเฉพาะเมื่อ cancelLabel มีค่า */}
          {cancelLabel && (
            <button
              onClick={onClose}
              className="rounded-full bg-primary-500 px-6 py-3 font-bold text-white hover:bg-red-600"
            >
              {cancelLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Package Add - Validation null Input
export function ValidationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  cancelLabel,
  confirmClassName = "rounded-full bg-pink-100 px-6 py-2 text-pink-500 hover:bg-pink-200",
  cancelClassName = "rounded-full bg-red-500 px-6 py-2 text-white hover:bg-red-600",
}) {
  if (!isOpen) return null;

  return (
    <div
      className={`[cubic-bezier(0.4, 0.0, 0.2, 1)] fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 transition-opacity duration-500 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* ของเดิม  w-full --- Change to ---> w-auto */}
      <div
        className={`[cubic-bezier(0.4, 0.0, 0.2, 1)] w-1/5 max-w-lg transform rounded-3xl bg-white px-3 shadow-lg transition-transform duration-700 ${
          isOpen ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
      >
        <div className="flex items-center justify-center border-b px-4 pb-3 pt-4">
          <h3 className="text-xl font-bold text-gray-900"> {title} </h3>
        </div>

        <div className="flex justify-center px-4 py-6">
          <p className="text-xl text-gray-700">{message}</p>
        </div>

        <div className="flex justify-center space-x-4 px-4 pb-8">
          {/* // deleteDetail Step4: เมื่อกด "Yes, I want to delete".*/}
          <button
            onClick={onConfirm}
            className="rounded-full bg-primary-500 px-6 py-3 font-bold text-white hover:bg-red-600"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
