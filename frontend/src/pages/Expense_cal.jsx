import React, { useState } from "react";
import axios from "axios";

function ExpenseCal() {
  const [formData, setFormData] = useState({
    family_members: "",
    members_more_than_15: "",
    members_less_than_15: "",
    members_more_than_60: "",
    members_less_than_5: "",
    meals_per_day: "",
    eating_out_frequency: "",
    dietary_preferences: "",
  });

  const [expenseResult, setExpenseResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userEmail = localStorage.getItem("email"); // Get email from localStorage
    if (!userEmail) {
      setError("User email not found. Please log in.");
      return;
    }

    setLoading(true);  // Set loading to true when starting calculation

    try {
      const response = await axios.post("http://127.0.0.1:8000/calculate_expense/", {
        ...formData,
        user_email: userEmail, // Send email in API request
      });

      setExpenseResult(response.data);
      setError(null); // Clear any previous errors
    } catch (err) {
      setError("Error calculating expense. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);  // Set loading to false after calculation finishes
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg flex flex-row items-center justify-between">
      {/* Form on the Left (2/3 of width) */}
      <div className="w-2/3 pr-6">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-700">
          Food Expense Calculator
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          {/* General Household Information */}
          <div className="col-span-2">
            <h3 className="text-xl font-semibold mb-3 text-blue-600">
              1. General Household Information
            </h3>
          </div>
          <div>
            <label className="block font-medium mb-6">Number of Family Members: </label>
            <input type="number" name="family_members" value={formData.family_members} onChange={handleChange} className="w-full border p-2 rounded" required />
          </div>
          <div>
            <label className="block font-medium mb-6">Members age more than 15: </label>
            <input type="number" name="members_more_than_15" value={formData.members_more_than_15} onChange={handleChange} className="w-full border p-2 rounded" required />
          </div>
          <div>
            <label className="block font-medium mb-6">Members age less than 15: </label>
            <input type="number" name="members_less_than_15" value={formData.members_less_than_15} onChange={handleChange} className="w-full border p-2 rounded" required />
          </div>
          <div>
            <label className="block font-medium mb-6">Members age more than 60: </label>
            <input type="number" name="members_more_than_60" value={formData.members_more_than_60} onChange={handleChange} className="w-full border p-2 rounded" required />
          </div>
          <div>
            <label className="block font-medium mb-6">Members age less than 5: </label>
            <input type="number" name="members_less_than_5" value={formData.members_less_than_5} onChange={handleChange} className="w-full border p-2 rounded" required />
          </div>

          {/* Daily Food Consumption */}
          <div className="col-span-2">
            <h3 className="text-xl font-semibold mb-3 text-blue-600">
              2. Daily Food Consumption
            </h3>
          </div>
          <div>
            <label className="block font-medium mb-6">Meals Per Day: </label>
            <input type="number" name="meals_per_day" value={formData.meals_per_day} onChange={handleChange} className="w-full border p-2 rounded" required />
          </div>
          <div>
            <label className="block font-medium mb-6">Eating Out Frequency: </label>
            <input type="number" name="eating_out_frequency" value={formData.eating_out_frequency} onChange={handleChange} className="w-full border p-2 rounded" required />
          </div>
          <div>
            <label className="block font-medium mb-6">Dietary Preferences: </label>
            <input type="text" name="dietary_preferences" value={formData.dietary_preferences} onChange={handleChange} className="w-full border p-2 rounded" required />
          </div>

          <div className="col-span-2">
            <button type="submit" className="w-full bg-blue-600 text-white py-2 btn btn-primary btn-sm hover:bg-blue-700">
              Calculate Expense
            </button>
          </div>
        </form>
      </div>

     {/* Right Side - Expense Result (1/3 of width) */}
     <div className="w-1/3 pl-6 mt-6">
        {loading ? (
          <div className="text-center">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-t-4 border-blue-600 rounded-full" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Calculating expense...</p>
          </div>
        ) : (
          <>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {expenseResult && (
              <div className="p-4 bg-green-100 border border-green-500 rounded shadow-lg">
                <h3 className="text-lg font-semibold text-green-700">Expense Calculation Result:</h3>
                <p className="text-gray-700">Total Monthly Expense: <strong>${expenseResult.total_monthly_expense}</strong></p>
                <p className="text-gray-700">Meals at Home: <strong>{expenseResult.breakdown_of_expenses.meals_at_home}</strong></p>
                <p className="text-gray-700">Meals Eating Out: <strong>{expenseResult.breakdown_of_expenses.meals_eating_out}</strong></p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ExpenseCal;
