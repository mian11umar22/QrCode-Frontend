import { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch(`${API_URL}/api/employees`);
        const data = await res.json();
        setEmployees(data);
      } catch (err) {
        console.error("❌ Failed to fetch employees:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-600 font-medium">
        ⏳ Loading employee data...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        🧾 Employee QR Document Records
      </h2>

      {employees.length === 0 ? (
        <p className="text-center text-gray-500">No employees found.</p>
      ) : (
        <div className="space-y-6">
          {employees.map((emp, idx) => (
            <div
              key={idx}
              className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition"
            >
              <div className="flex justify-between flex-wrap gap-2 mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {emp.name} ({emp.employeeId})
                  </h3>
                  <p className="text-sm text-gray-600">
                    {emp.designation} - {emp.department}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  Joined: {new Date(emp.dateOfJoining).toLocaleDateString()}
                </div>
              </div>

              <div className="mt-2">
                <p className="font-medium text-gray-700 mb-1">📎 Documents:</p>
                {emp.documents.length > 0 ? (
                  <ul className="list-disc ml-5 text-sm">
                    {emp.documents.map((doc, i) => (
                      <li key={i}>
                        <a
                          href={`${API_URL}/uploads/${doc}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          {doc}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No QR-embedded documents found.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
