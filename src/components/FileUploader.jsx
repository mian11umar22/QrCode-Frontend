import { useState } from "react";
import toast from "react-hot-toast";
import EmployeeForm from "./EmployeeForm";

const API_URL = process.env.REACT_APP_API_URL;

export default function FileUploader() {
  const [file, setFile] = useState(null);
  const [qrResult, setQrResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [qrAdded, setQrAdded] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("❌ Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setQrResult(null);
      setQrAdded(false);
      setShowForm(false);

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
        setFile(null);
      } else {
        toast("⚠️ No QR code found in the file.");
        setShowForm(true);
      }
    } catch (err) {
      toast.dismiss();
      console.error("Upload failed:", err);
      toast.error(err.message || "❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleAddQR = async (employeeId) => {
    if (!qrResult?.file || !employeeId) return;

    try {
      setLoading(true);
      const toastId = toast.loading("➕ Adding QR Code...");

      const res = await fetch(`${API_URL}/api/addqr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: qrResult.file, employeeId }),
      });

      const data = await res.json();
      toast.dismiss(toastId);

      if (!res.ok) throw new Error(data.message || "Failed to add QR");

      toast.success("✅ QR Code added to file");
      setQrAdded(true);
      setQrResult((prev) => ({
        ...prev,
        ...data,
        qrdata: employeeId,
      }));
    } catch (err) {
      console.error("Add QR failed:", err);
      toast.error(err.message || "❌ Failed to add QR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-center">
        📄 Upload File to Scan QR
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          key={file ? file.name : "file-input"}
          type="file"
          name="file"
          accept=".jpg,.jpeg,.png,.pdf,.docx"
          disabled={loading}
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-2 rounded-md disabled:cursor-not-allowed"
        />

        {file && (
          <p className="text-sm text-gray-500 mt-1 truncate">
            📎 Selected: {file.name}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "🔍 Scanning..." : "Scan for QR"}
        </button>

        {loading && (
          <div className="mt-2 flex justify-center">
            <div className="w-6 h-6 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
          </div>
        )}
      </form>

      {qrResult?.qrdata && (
        <div className="mt-4 p-4 border border-green-300 rounded-md bg-green-50 text-sm">
          ✅ QR Data Found:
          <div className="mt-2 font-mono break-words">{qrResult.qrdata}</div>
        </div>
      )}

      {qrResult && !qrResult.qrdata && !qrAdded && !showForm && (
        <div className="mt-4 text-center">
          <p className="text-yellow-600 font-medium mb-2">
            ⚠️ No QR code found in the file.
          </p>
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded"
            onClick={() => setShowForm(true)}
            disabled={loading}
          >
            ➕ Fill Form to Add QR
          </button>
        </div>
      )}

      {showForm && qrResult?.file && (
        <EmployeeForm
          filename={qrResult.file}
          onFormSubmitted={(empId) => {
            setShowForm(false);
            handleAddQR(empId);
          }}
        />
      )}

      {qrAdded && (
        <div className="mt-4 text-center text-green-700 font-medium">
          🎉 QR code successfully added to the file!
        </div>
      )}

      {qrResult?.file && (
        <div className="mt-6 border-2 border-blue-200 rounded-md p-4">
          <h3 className="text-sm font-semibold mb-2">
            📎 {qrAdded ? "Updated File with QR" : "Uploaded File Preview"}:
          </h3>

          {/\.(jpg|jpeg|png)$/i.test(qrResult.file) && (
            <img
              src={`${API_URL}/uploads/${qrResult.file}`}
              alt="Uploaded"
              className="max-w-full h-auto border rounded-md"
            />
          )}

          {/\.pdf$/i.test(qrResult.file) && (
            <iframe
              src={`${API_URL}/uploads/${qrResult.file}`}
              className="w-full h-64 border rounded-md"
              title="Uploaded PDF"
            ></iframe>
          )}

          {/\.docx$/i.test(qrResult.file) && (
            <a
              href={`${API_URL}/uploads/${qrResult.file}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              📄 View .docx File
            </a>
          )}

          <a
            href={`${API_URL}/uploads/${qrResult.file}`}
            download
            className="mt-3 inline-block text-blue-700 underline font-semibold"
          >
            ⬇️ Download {qrAdded ? "Updated" : "Uploaded"} File
          </a>
        </div>
      )}
    </div>
  );
}
