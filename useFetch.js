import { useState, useEffect } from 'react';

const cache = {};

function useFetch(url, options = {}, retries = 3) {
  const [data, setData] = useState(cache[url] || null);
  const [loading, setLoading] = useState(!cache[url]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;
    
    const fetchData = async (attempt = 1) => {
      setLoading(true);
      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const result = await response.json();
        cache[url] = result;
        setData(result);
        setError(null);
      } catch (err) {
        if (attempt <= retries) fetchData(attempt + 1);
        else setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!cache[url]) fetchData();
  }, [url, options, retries]);

  return { data, loading, error };
}
