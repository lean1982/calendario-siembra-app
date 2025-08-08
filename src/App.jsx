import { useEffect, useState } from "react";
import axios from "axios";
import { iconsByName, IconFrutilla } from "./icons.jsx";

const cultivos = [
  {
    nombre: "Frutilla",
    icon: "frutilla",
    siembra: ["Agosto", "Septiembre"],
    cosecha: "Noviembre",
    riego: "Mantener humedad constante, regar día por medio si no llueve",
  },
  {
    nombre: "Brócoli",
    icon: "brócoli",
    siembra: ["Marzo", "Abril", "Agosto"],
    cosecha: "Octubre",
    riego: "Riego regular, 2-3 veces por semana",
  },
  {
    nombre: "Repollo",
    icon: "repollo",
    siembra: ["Febrero", "Marzo", "Agosto"],
    cosecha: "Octubre",
    riego: "Riego abundante semanal, según clima",
  },
];

function App() {
  const [mes, setMes] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [clima, setClima] = useState(null);
  const [errorUbicacion, setErrorUbicacion] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const res = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${
                import.meta.env.VITE_OPENWEATHER_KEY
              }&lang=es`
            );
            setClima(res.data);
          } catch (error) {
            console.error("Error al obtener el clima:", error);
          }
        },
        (err) => {
          setErrorUbicacion(
            "No pudimos obtener tu ubicación. Activá el permiso o buscá por ciudad."
          );
        }
      );
    }
  }, []);

  const cultivosFiltrados = cultivos.filter((cultivo) => {
    const coincideMes =
      mes === "" || cultivo.siembra.includes(capitalizar(mes));
    const coincideNombre =
      cultivo.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return coincideMes && coincideNombre;
  });

  function capitalizar(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center text-green-700 my-6">
        Calendario de Siembra y Cosecha
      </h1>
      <p className="text-center mb-4">
        Consultá qué sembrar y cuándo cosechar según tu ubicación y época del año.
      </p>

      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Mes"
          value={mes}
          onChange={(e) => setMes(e.target.value)}
          className="border px-2 py-1 rounded w-full md:w-1/2"
        />
        <input
          type="text"
          placeholder="Buscar"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border px-2 py-1 rounded w-full md:w-1/2"
        />
      </div>

      {errorUbicacion && (
        <p className="text-center text-red-500 mb-4">{errorUbicacion}</p>
      )}

      {clima && (
        <p className="text-center mb-4">
          Clima actual en <strong>{clima.name}</strong>:{" "}
          {clima.weather[0].description}, {clima.main.temp}°C
        </p>
      )}

      <h2 className="text-xl font-semibold mb-2">Podés sembrar:</h2>
      {cultivosFiltrados.map((cultivo) => {
        const Icono = iconsByName[cultivo.icon] || IconFrutilla;
        return (
          <div
            key={cultivo.nombre}
            className="border rounded p-3 mb-2 shadow hover:shadow-md transition flex items-center gap-4"
          >
            <div className="text-green-500 shrink-0">
              <Icono className="w-16 h-16 md:w-20 md:h-20" />
            </div>
            <div>
              <h3 className="text-lg font-bold">{cultivo.nombre}</h3>
              <p>
                🌱 <strong>Siembra:</strong> {cultivo.siembra.join(", ")}
              </p>
              <p>
                🌾 <strong>Cosecha estimada:</strong> {cultivo.cosecha}
              </p>
              <p>
                💧 <strong>Riego:</strong> {cultivo.riego}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default App;
