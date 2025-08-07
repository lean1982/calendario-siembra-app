import { useEffect, useState } from "react";

const plantingData = {
  "Buenos Aires": {
    agosto: [
      {
        name: "Frutilla",
        cosecha: "Noviembre",
        riego: "Mantener humedad constante, regar día por medio si no llueve"
      },
      {
        name: "Brócoli",
        cosecha: "Octubre",
        riego: "Riego regular, 2-3 veces por semana"
      },
      {
        name: "Repollo",
        cosecha: "Octubre",
        riego: "Riego abundante semanal, según clima"
      }
    ]
  }
};

export default function PlantingCalendarApp() {
  const [location, setLocation] = useState("");
  const [month, setMonth] = useState("");
  const [results, setResults] = useState([]);
  const [weather, setWeather] = useState(null);
  const [autoLocated, setAutoLocated] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        // Para simplificar, usamos ciudad fija, podés mejorar con reverse geocoding
        const ciudad = "Buenos Aires";
        setLocation(ciudad);
        setAutoLocated(true);
        fetchWeather(ciudad);
      });
    }
  }, []);

  const fetchWeather = async (city) => {
  try {
    const apiKey = "b4b3582ab5dabfc13d1e93f160ab1d3a";
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&lang=es&appid=${apiKey}`
    );

    if (!response.ok) {
      setWeather("No se pudo obtener el clima");
      return;
    }

    const data = await response.json();

    if (data.weather && data.weather.length > 0 && data.main) {
      const clima = `${data.weather[0].description}, ${data.main.temp.toFixed(1)}°C`;
      setWeather(clima);
    } else {
      setWeather("No se pudo obtener el clima");
    }
  } catch (error) {
    setWeather("Error al obtener el clima");
    console.error(error);
  }
};

  const handleSearch = () => {
    const cityData = plantingData[location];
    if (cityData && cityData[month]) {
      setResults(cityData[month]);
    } else {
      setResults([]);
    }
    fetchWeather(location);
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold text-center">Calendario de Siembra y Cosecha</h1>

      {!autoLocated && (
        <div className="space-y-2">
          <label htmlFor="location" className="block font-medium">Ubicación</label>
          <input
            id="location"
            type="text"
            className="w-full border rounded px-3 py-2"
            placeholder="Ciudad o provincia"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="month" className="block font-medium">Mes</label>
        <input
          id="month"
          type="text"
          className="w-full border rounded px-3 py-2"
          placeholder="Ej: agosto"
          value={month}
          onChange={(e) => setMonth(e.target.value.toLowerCase())}
        />

        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Buscar
        </button>
      </div>

      {weather && (
        <div className="border p-4 rounded-lg shadow">
          <div className="p-4">
            <p><strong>Clima actual en {location}:</strong> {weather}</p>
          </div>
        </div>
      )}

      {results.length > 0 ? (
        <div className="border p-4 rounded-lg shadow">
          <div className="p-4 space-y-2">
            <h2 className="text-lg font-semibold">Podés sembrar:</h2>
            <ul className="space-y-2">
              {results.map((item, index) => (
                <li key={index}>
                  <strong>{item.name}</strong><br />
                  🌱 Cosecha estimada: {item.cosecha}<br />
                  💧 Riego: {item.riego}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No hay datos disponibles para esa combinación.</p>
      )}
    </div>
  );
}
