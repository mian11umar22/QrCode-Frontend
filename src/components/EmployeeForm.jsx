import { useReducer } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
  Name: "",
  Department: "",
  Designation: "",
  date_of_joining: "",
  issuedby: "HR Manager",
  image: null,
};

function reducer(state, action) {
  return {
    ...state,
    [action.type]: action.value,
  };
}

export default function EmployeeForm({ filename, onFormSubmitted }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    dispatch({
      type: name,
      value: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (let key in state) {
      formData.append(key, state[key]);
    }
    formData.append("filename", filename);

    const res = await fetch(`${API_URL}/api/form`, {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    if (result.success) {
      onFormSubmitted(result.employeeId);
    }
  };

  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
        📝 No QR Found — Fill Employee Details
      </h3>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-gray-50 p-4 rounded-md shadow"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            name="Name"
            onChange={handleChange}
            placeholder="e.g., John Doe"
            className="w-full p-2 border rounded mt-1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Department
          </label>
          <input
            name="Department"
            onChange={handleChange}
            placeholder="e.g., Marketing"
            className="w-full p-2 border rounded mt-1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Designation
          </label>
          <input
            name="Designation"
            onChange={handleChange}
            placeholder="e.g., Assistant Manager"
            className="w-full p-2 border rounded mt-1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date of Joining
          </label>
          <input
            name="date_of_joining"
            type="date"
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Issued By
          </label>
          <input
            name="issuedby"
            onChange={handleChange}
            value={state.issuedby}
            placeholder="e.g., HR Manager"
            className="w-full p-2 border rounded mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Employee Image
          </label>
          <input
            name="image"
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-1 mt-1"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
        >
          ✅ Submit & Add QR
        </button>
      </form>
    </div>
  );
}
