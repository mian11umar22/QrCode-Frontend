import { useState } from "react";
import toast from "react-hot-toast";
import EmployeeForm from "./EmployeeForm";

const API_URL = import.meta.env.VITE_API_URL;

export default function FileUploader() {
  const [mode, setMode] = useState(null); // "scan" or "add"
  const [files, setFiles] = useState([]);
  const [qrResult, setQrResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [qrAdded, setQrAdded] = useState(false);

  const resetState = () => {
    setQrResult(null);
    setQrAdded(false);
  };

  const handleScanSubmit = async () => {
    if (!files.length) return toast.error("❌ Please select a file first");

    const formData = new FormData();
    formData.append("file", files[0]);

    try {
      setLoading(true);
      const toastId = toast.loading("🔍 Scanning for QR code...");

      const res = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      toast.dismiss(toastId);

      if (!res.ok) throw new Error(data.message || "❌ Server Error");

      setQrResult(data);

      data.qrdata
        ? toast.success("✅ QR code found!")
        : toast("⚠️ No QR code found in the file.");
    } catch (err) {
      toast.dismiss();
      toast.error(err.message || "❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleAddQR = async (employee) => {
    if (!files.length || !employee) return;

    try {
      setLoading(true);
      const toastId = toast.loading("➕ Adding QR Code to all files...");

      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      formData.append("employee", JSON.stringify({ employeeId: employee }));

      const res = await fetch(`${API_URL}/api/addqr`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      toast.dismiss(toastId);

      if (!res.ok) throw new Error(data.message || "Failed to add QR");

      toast.success("✅ QR added to all files!");
      setQrAdded(true);
      setQrResult(data);
    } catch (err) {
      toast.error(err.message || "❌ Failed to add QR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-20 p-6 bg-white rounded-xl shadow-md relative">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        📄 QR Code Document Processor
      </h2>

      {/* File Upload (always shown) */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          📁 Upload Document(s)
        </label>
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf,.docx"
          multiple
          disabled={loading}
          onChange={(e) => {
            setFiles([...e.target.files]);
            resetState();
          }}
          className="border p-2 rounded-md w-full disabled:cursor-not-allowed"
        />
        <p className="text-xs text-gray-500 mt-1">
          You can upload <strong>multiple files</strong> when using{" "}
          <span className="font-semibold text-green-600">"Add QR Code"</span>.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-2">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md w-full disabled:opacity-50"
          disabled={!files.length || loading}
          onClick={() => {
            setMode("scan");
            handleScanSubmit();
          }}
        >
          🔍 Scan QR Code
        </button>

        <button
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md w-full disabled:opacity-50"
          disabled={!files.length || loading}
          onClick={() => setMode("add")}
        >
          ➕ Add QR Code
        </button>
      </div>

      {/* File Summary */}
      {files.length > 0 && (
        <div className="mt-3 text-sm text-gray-600">
          📎 {files.length} file(s) selected:
          <ul className="list-disc pl-5 mt-1 text-xs text-gray-500">
            {files.map((file, idx) => (
              <li key={idx}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Employee Form */}
      {mode === "add" && files.length > 0 && !qrAdded && (
        <div className="mt-6">
          <EmployeeForm onFormSubmitted={(employee) => handleAddQR(employee)} />
        </div>
      )}

      {qrResult?.qrdata && mode === "scan" && (
        <div className="mt-4 p-3 border border-green-300 rounded bg-green-50">
          ✅ QR Found:
          <a
            href={qrResult.qrdata}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-1 text-sm text-blue-600 underline break-words"
          >
            {qrResult.qrdata}
          </a>
        </div>
      )}

      {/* Add QR Success */}
      {qrAdded && (
        <div className="mt-4 text-center text-green-700 font-medium">
          🎉 QR code successfully embedded in all documents!
        </div>
      )}

      {/* QR Files Result */}
      {qrResult?.files && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold mb-1">📦 Files with QR:</h4>
          <ul className="text-sm list-disc pl-5">
            {qrResult.files.map((f, i) => (
              <li key={i}>
                <a
                  href={`${API_URL}/uploads/${f}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {f}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ✅ Loading Spinner Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="w-12 h-12 border-4 border-white border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
