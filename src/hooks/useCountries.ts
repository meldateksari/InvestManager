import { useState, useEffect } from 'react';

interface Country {
  code: string;
  name: string;
}

export const useCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,translations');


       
        if (!response.ok) throw new Error('Ülke verileri alınamadı');

        const data = await response.json();
      
         console.log('API sonucu:', data); 
        const formattedCountries = data
          .map((country: any) => ({
            code: country.cca2, // ISO 2-letter code
            name: country.translations?.tur?.common || country.name.common
          }))
          .sort((a: Country, b: Country) => a.name.localeCompare(b.name));

        setCountries(formattedCountries);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return { countries, loading, error };
};
