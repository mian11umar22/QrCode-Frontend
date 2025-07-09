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
    setFiles([]);
    setQrResult(null);
    setQrAdded(false);
  };

  const handleScanSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      toast.error("❌ Please select a file first");
      return;
    }

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

      if (data.qrdata) {
        toast.success("✅ QR code found!");
      } else {
        toast("⚠️ No QR code found in the file.");
      }
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
      formData.append("employee", JSON.stringify(employee));

      const res = await fetch(`${API_URL}/api/addqrbulk`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      toast.dismiss(toastId);

      if (!res.ok) throw new Error(data.message || "Failed to add QR");

      toast.success("✅ QR added to all files!");
      setQrAdded(true);
      setQrResult(data); // expect: { files: [], zip: "" }
    } catch (err) {
      toast.error(err.message || "❌ Failed to add QR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-20 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-6 text-center">
        📄 Document QR Processor
      </h2>

      {/* Mode Selection Buttons */}
      {!mode && (
        <div className="flex flex-col gap-4 items-center">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md w-full"
            onClick={() => {
              resetState();
              setMode("scan");
            }}
          >
            🔍 Scan QR Code
          </button>
          <button
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md w-full"
            onClick={() => {
              resetState();
              setMode("add");
            }}
          >
            ➕ Add QR Code
          </button>
        </div>
      )}

      {/* File Upload + Actions */}
      {mode && (
        <form
          onSubmit={
            mode === "scan" ? handleScanSubmit : (e) => e.preventDefault()
          }
          className="flex flex-col gap-4 mt-6"
        >
          <input
            type="file"
            name="files"
            accept=".jpg,.jpeg,.png,.pdf,.docx"
            multiple={mode === "add"}
            disabled={loading}
            onChange={(e) => setFiles([...e.target.files])}
            className="border p-2 rounded-md disabled:cursor-not-allowed"
          />

          {files.length > 0 && (
            <p className="text-sm text-gray-600">
              📎 {files.length} file(s) selected
            </p>
          )}

          {mode === "scan" && (
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
            >
              {loading ? "🔍 Scanning..." : "Start Scan"}
            </button>
          )}
        </form>
      )}

      {/* Employee Form (Add QR) */}
      {mode === "add" && files.length > 0 && !qrAdded && (
        <EmployeeForm onFormSubmitted={(employee) => handleAddQR(employee)} />
      )}

      {/* QR Result - SCAN */}
      {qrResult?.qrdata && mode === "scan" && (
        <div className="mt-4 p-3 border border-green-300 rounded bg-green-50">
          ✅ QR Found:
          <pre className="text-sm mt-1 break-words">{qrResult.qrdata}</pre>
        </div>
      )}

      {/* QR Result - ADD */}
      {qrAdded && (
        <div className="mt-4 text-center text-green-700 font-medium">
          🎉 QR successfully embedded in all documents!
        </div>
      )}

      {/* Download or Preview */}
      {qrResult?.files && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold mb-1">📦 Files:</h4>
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

      {qrResult?.zip && (
        <div className="mt-4 text-center">
          <a
            href={`${API_URL}/downloads/${qrResult.zip}`}
            className="text-blue-700 underline font-medium"
          >
            ⬇️ Download All as Zip
          </a>
        </div>
      )}

      {/* Reset / Back Button */}
      {mode && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setMode(null)}
            className="text-sm text-gray-500 hover:underline"
          >
            🔙 Back to mode selection
          </button>
        </div>
      )}
    </div>
  );
}
