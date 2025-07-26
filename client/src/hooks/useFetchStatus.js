import { useState, useEffect } from "react"; // Added React imports
import { getStatuses } from "../api/statusAPI";

export default function useFetchStatus() {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const data = await getStatuses();
        setStatuses(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStatuses();
  }, []);

  const refetch = async () => {
    setLoading(true);
    try {
      const data = await getStatuses();
      setStatuses(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return { statuses, loading, error, refetch };
}
