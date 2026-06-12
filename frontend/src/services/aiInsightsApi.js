import axios from "axios";

const BASE_URL = import.meta.env.VITE_URL;

export const getAIInsights = async (studentId) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/api/ai-insights/${studentId}`
    );

    return res.data;
  } catch (error) {
    console.error(
      "AI Insights Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};