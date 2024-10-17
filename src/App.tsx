import React, { useEffect, useState } from "react";
import WebMap from "@arcgis/core/WebMap";
import MapView from "@arcgis/core/views/MapView";
import "@arcgis/core/assets/esri/themes/light/main.css";

interface WeatherData {
  current: {
    temp_c: number;
    feelslike_c: number;
    wind_kph: number;
    humidity: number;
    pressure_mb: number;
    vis_km: number;
    condition: {
      text: string;
      icon: string;
    };
  };
}

const fetchWeather = async (
  latitude: number,
  longitude: number
): Promise<WeatherData | null> => {
  const apiKey = "ace5b86a3ba24bcf902102614241610";
  try {
    const response = await fetch(
      `/weatherapi/current.json?key=${apiKey}&q=${latitude},${longitude}`
    );

    if (!response.ok) {
      const textResponse = await response.text();
      console.error(
        "Failed to fetch weather data. Response text:",
        textResponse
      );
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
};

const App: React.FC = () => {
  const [basemap, setBasemap] = useState<string>("hybrid");
  const [language, setLanguage] = useState<string>("en");

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === "en" ? "ar" : "en"));
  };

  useEffect(() => {
    const webmap = new WebMap({
      basemap: basemap,
    });

    const view = new MapView({
      container: "viewDiv",
      map: webmap,
      center: [46.6753, 24.7136],
      zoom: 10,
    });

    view.on("click", async (event) => {
      const latitude = event.mapPoint.latitude;
      const longitude = event.mapPoint.longitude;

      view.popup.open({
        title: language === "ar" ? "جاري جلب البيانات" : "Fetching data...",
        content: language === "ar" ? "الرجاء الانتظار..." : "Please wait...",
        location: event.mapPoint,
      });

      console.log("Start fetching weather data...");
      const weatherData = await fetchWeather(latitude, longitude);

      if (!weatherData) {
        view.popup.open({
          title: language === "ar" ? "خطأ" : "Error",
          content:
            language === "ar"
              ? "تعذر جلب بيانات الطقس"
              : "Unable to fetch weather data",
          location: event.mapPoint,
        });
        return;
      }

      const popupTitle = language === "ar" ? "معلومات الطقس" : "Weather Info";
      const popupContent =
        language === "ar"
          ? `
            <p>درجة الحرارة: ${weatherData.current.temp_c}°C</p>
            <p>الرياح: ${weatherData.current.wind_kph} كلم/س</p>
            <p>الرطوبة: ${weatherData.current.humidity}%</p>
            <p>الضغط الجوي: ${weatherData.current.pressure_mb} مليبار</p>
            <p>الرؤية: ${weatherData.current.vis_km} كلم</p>
            <p>إحساس الحرارة: ${weatherData.current.feelslike_c}°C</p>
            <p>الظروف: ${weatherData.current.condition.text}</p>`
          : `
            <p>Temperature: ${weatherData.current.temp_c}°C</p>
            <p>Wind: ${weatherData.current.wind_kph} kph</p>
            <p>Humidity: ${weatherData.current.humidity}%</p>
            <p>Pressure: ${weatherData.current.pressure_mb} mb</p>
            <p>Visibility: ${weatherData.current.vis_km} km</p>
            <p>Feels Like: ${weatherData.current.feelslike_c}°C</p>
            <p>Condition: ${weatherData.current.condition.text}</p>`;

      view.popup.open({
        title: popupTitle,
        content: popupContent,
        location: event.mapPoint,
      });

      console.log("Popup updated with weather data");
    });
  }, [basemap, language]);
  return (
    <div className="w-full h-full flex flex-col">
      <header className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md">
        <button
          onClick={toggleLanguage}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {language === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية"}
        </button>

        <div className="flex items-center">
          <span className="text-lg font-semibold mr-4">
            {language === "en" ? "Select BaseMap" : "اختر خريطة"}
          </span>
          <select
            value={basemap}
            onChange={(e) => setBasemap(e.target.value)}
            className="bg-gray-700 text-white text-lg font-medium py-2 px-4 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="hybrid">
              {language === "en" ? "Hybrid" : "هجين"}
            </option>
            <option value="dark-gray">
              {language === "en" ? "Dark Gray" : "رمادي داكن"}
            </option>
            <option value="streets">
              {language === "en" ? "Streets" : "الشوارع"}
            </option>
            <option value="topo">
              {language === "en" ? "Topo" : "طبوغرافية"}
            </option>
          </select>
        </div>
      </header>
      <div id="viewDiv" className="w-full h-full"></div>{" "}
    </div>
  );
};

export default App;
