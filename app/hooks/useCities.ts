import { useState, useEffect } from 'react';

interface City {
  id: string;
  name: string;
}

export const useCities = (countryCode: string) => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!countryCode) {
      setCities([]);
      return;
    }

    const fetchCities = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://secure.geonames.org/searchJSON?country=${countryCode}&featureClass=P&maxRows=1000&username=meldateksarii`
        );

        if (!response.ok) throw new Error('Şehir verileri alınamadı');

        const data = await response.json();
        const formattedCities = data.geonames
          .map((city: any) => ({
            id: city.geonameId.toString(),
            name: city.name
          }))
          .sort((a: City, b: City) => a.name.localeCompare(b.name));

        setCities(formattedCities);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, [countryCode]);

  return { cities, loading, error };
};
