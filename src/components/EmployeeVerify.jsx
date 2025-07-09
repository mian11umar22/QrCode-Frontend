import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function EmployeeVerify() {
  const { employeeId } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/verify/${employeeId}`
        );
        const data = await res.json();

        if (res.ok && data.success) {
          setEmployee(data.employee);
        } else {
          setEmployee(null);
        }
      } catch (error) {
        console.error("Failed to fetch employee", error);
        setEmployee(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  if (loading) {
    return <div className="text-center mt-10 text-lg">⏳ Verifying...</div>;
  }

  if (!employee) {
    return (
      <div className="text-center mt-10 text-red-600 font-semibold text-lg">
        ❌ No employee found with ID: <strong>{employeeId}</strong>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 border-8 border-yellow-500 p-10 rounded-xl shadow-xl bg-gradient-to-br from-white to-yellow-50 font-serif relative">
      <div className="absolute top-4 right-4 text-sm text-gray-500 italic">
        ID: {employee.employeeId}
      </div>

      <h1 className="text-3xl font-bold text-center text-gray-800 mb-2 uppercase">
        Certificate of Verification
      </h1>

      <p className="text-center text-gray-600 mb-6">
        This certifies that the individual listed below is a{" "}
        <span className="font-semibold text-green-700">verified employee</span>{" "}
        currently working at <strong>Dotlabs</strong>.
      </p>

      <div className="flex flex-col items-center">
        <img
          src={`http://localhost:3000/${employee.image}`}
          alt="Employee"
          className="w-32 h-32 object-cover rounded-full border-4 border-yellow-400 mb-4"
        />

        <h2 className="text-2xl font-semibold text-gray-800 mb-1">
          {employee.name}
        </h2>

        <p className="text-lg text-gray-700 mb-1">
          {employee.designation} — {employee.department}
        </p>

        <p className="text-sm text-gray-600">
          Joined on {new Date(employee.dateOfJoining).toLocaleDateString()}
        </p>
      </div>

      <div className="mt-8 flex justify-between items-center px-6 text-sm text-gray-600">
        <div>
          <p>
            📝 Issued By: <strong>{employee.issuedBy}</strong>
          </p>
        </div>
        <div>
          <p>
            🕒 Issued On: {new Date(employee.issuedDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="mt-10 text-center text-gray-700 text-sm">
        ✅ Verified by{" "}
        <a
          href="https://dotlabs.com/verify"
          className="text-blue-600 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          dotlabs.com
        </a>{" "}
        — Scan or visit the link to confirm authenticity.
      </div>

      <div className="mt-4 text-center text-xs text-gray-400 italic">
        This certificate is digitally generated and officially verified by
        Dotlabs.
      </div>
    </div>
  );
}
