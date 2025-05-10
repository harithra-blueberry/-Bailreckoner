import { MapContainer, TileLayer, GeoJSON, Tooltip } from "react-leaflet";
import { useEffect, useState } from "react";
import "./CrimeMap.css";

const CrimeMap = () => {
  const [geoData, setGeoData] = useState(null);
  const [areaCounts, setAreaCounts] = useState({});

  const normalize = (name) =>
    name?.trim().toLowerCase().replace(/\s+/g, "");

  // 🔥 Mock data covering districts across Tamil Nadu
  useEffect(() => {
    const mockCounts = [
      // Chennai
      { area: "Chennai Central", count: 20 },
      { area: "Chennai North", count: 12 },
      { area: "Chennai South", count: 8 },

      // Coimbatore
      { area: "Coimbatore North", count: 7 },
      { area: "Coimbatore South", count: 5 },

      // Madurai
      { area: "Madurai Central", count: 9 },
      { area: "Madurai North", count: 3 },
      { area: "Madurai South", count: 6 },

      // Dindigul
      { area: "Chennai", count: 120 },
      { area: "T. Nagar", count: 40 },
      { area: "Velachery", count: 35 },
      { area: "Anna Nagar", count: 45 },
    
      { area: "Coimbatore", count: 85 },
      { area: "RS Puram", count: 25 },
      { area: "Gandhipuram", count: 30 },
      { area: "Saibaba Colony", count: 30 },
    
      { area: "Madurai", count: 70 },
      { area: "Anna Nagar (Madurai)", count: 20 },
      { area: "KK Nagar", count: 25 },
      { area: "Thirunagar", count: 25 },
    
      { area: "Tiruchirappalli", count: 65 },
      { area: "Srirangam", count: 25 },
      { area: "Thillai Nagar", count: 20 },
      { area: "Cantonment", count: 20 },
    
      { area: "Salem", count: 55 },
      { area: "Fairlands", count: 15 },
      { area: "Gugai", count: 20 },
      { area: "Hasthampatti", count: 20 },
    
      { area: "Dindigul", count: 50 },
      { area: "Palani", count: 20 },
      { area: "Oddanchatram", count: 15 },
      { area: "Vedasandur", count: 15 },
    
      { area: "Erode", count: 40 },
      { area: "Perundurai", count: 15 },
      { area: "Chithode", count: 15 },
      { area: "Modakurichi", count: 10 },
    
      { area: "Thanjavur", count: 45 },
      { area: "Kumbakonam", count: 20 },
      { area: "Papanasam", count: 15 },
      { area: "Orathanadu", count: 10 },
    
      { area: "Kanchipuram", count: 30 },
      { area: "Sriperumbudur", count: 10 },
      { area: "Uthiramerur", count: 10 },
      { area: "Walajabad", count: 10 },
    
      { area: "Tirunelveli", count: 30 },
      { area: "Palayamkottai", count: 10 },
      { area: "Cheranmahadevi", count: 10 },
      { area: "Sankarankovil", count: 10 },
    
      { area: "Thoothukudi", count: 28 },
      { area: "Kayalpattinam", count: 10 },
      { area: "Kovilpatti", count: 10 },
      { area: "Tiruchendur", count: 8 },
    
      { area: "Vellore", count: 35 },
      { area: "Katpadi", count: 15 },
      { area: "Gudiyatham", count: 10 },
      { area: "Anaicut", count: 10 },
    
      { area: "Theni", count: 30 },
      { area: "Periyakulam", count: 10 },
      { area: "Bodinayakanur", count: 10 },
      { area: "Andipatti", count: 10 },
    
      { area: "Tiruppur", count: 40 },
      { area: "Avinashi", count: 15 },
      { area: "Palladam", count: 15 },
      { area: "Dharapuram", count: 10 },
    
      { area: "Ramanathapuram", count: 25 },
      { area: "Paramakudi", count: 10 },
      { area: "Rameswaram", count: 10 },
      { area: "Tiruvadanai", count: 5 },
    
      { area: "Nagapattinam", count: 22 },
      { area: "Vedaranyam", count: 10 },
      { area: "Kilvelur", count: 7 },
      { area: "Thirukkuvalai", count: 5 },
    
      { area: "Nilgiris", count: 18 },
      { area: "Ooty", count: 8 },
      { area: "Coonoor", count: 5 },
      { area: "Gudalur", count: 5 }
    ];

    const counts = {};
    mockCounts.forEach(({ area, count }) => {
      counts[normalize(area)] = count;
    });

    setAreaCounts(counts);
  }, []);

  // 🌍 Load Tamil Nadu GeoJSON with area names
  useEffect(() => {
    fetch("/mock_jurisdictions.geojson")
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error("❌ Error loading GeoJSON:", err));
  }, []);

  // 🌈 Color logic based on FIR count
  const getColor = (areaName) => {
    const count = areaCounts[normalize(areaName)] || 0;
    if (count >= 15) return "#a30000"; // dark red
    if (count >= 10) return "red";
    if (count >= 5) return "orange";
    if (count >= 1) return "yellow";
    return "green";
  };

  // 🧩 Style and tooltip for each area
  const onEachFeature = (feature, layer) => {
    const areaName = feature.properties.name;
    const firCount = areaCounts[normalize(areaName)] || 0;

    layer.setStyle({
      fillColor: getColor(areaName),
      weight: 1,
      opacity: 1,
      color: "#333",
      fillOpacity: 0.6,
    });

    layer.bindTooltip(`${areaName}: ${firCount} FIRs`, {
      permanent: false,
      direction: "center",
      className: "leaflet-tooltip",
    });
  };

  return (
    <div className="crime-map-container">
      <h2>📍 <span className="map-title">Tamil Nadu Crime Heatmap</span></h2>
      <MapContainer center={[10.91, 78.69]} zoom={7} style={{ height: "600px", borderRadius: "12px" }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geoData && <GeoJSON data={geoData} onEachFeature={onEachFeature} />}
      </MapContainer>
    </div>
  );
};

export default CrimeMap;
