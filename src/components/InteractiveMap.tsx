import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

// Extend Leaflet types for heatLayer
declare module 'leaflet' {
  function heatLayer(
    latlngs: [number, number, number][],
    options?: any
  ): L.Layer;
}

interface InteractiveMapProps {
  activeLayers: Set<string>;
}

const InteractiveMap = ({ activeLayers }: InteractiveMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<Record<string, L.Layer>>({});

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Inicializa o mapa com coordenadas de São Paulo
    const saoPauloCoords: [number, number] = [-23.5505, -46.6333];
    const map = L.map(mapContainerRef.current).setView(saoPauloCoords, 12);
    mapRef.current = map;

    // Adiciona o mapa base da CARTO
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 20,
    }).addTo(map);

    // Função para gerar pontos aleatórios para heatmaps
    function generateRandomPoints(
      center: [number, number],
      radius: number,
      count: number
    ): [number, number, number][] {
      const points: [number, number, number][] = [];
      const [y0, x0] = center;
      const rd = radius / 111300;

      for (let i = 0; i < count; i++) {
        const u = Math.random();
        const v = Math.random();
        const w = rd * Math.sqrt(u);
        const t = 2 * Math.PI * v;
        const x = w * Math.cos(t);
        const y = w * Math.sin(t);
        points.push([y + y0, x + x0, Math.random()]);
      }
      return points;
    }

    // Gera dados para cada camada
    const poluicaoPoints = generateRandomPoints(saoPauloCoords, 8000, 200);
    const calorPoints = generateRandomPoints([-23.54, -46.65], 10000, 250);
    const popPoints = generateRandomPoints([-23.56, -46.63], 12000, 300);

    // Cria as camadas do Leaflet
    layersRef.current = {
      poluicao: L.heatLayer(poluicaoPoints, {
        radius: 40,
        blur: 30,
        max: 0.6,           // <-- VALOR BEM BAIXO para forçar o contraste
        minOpacity: 0.2,    // <-- Garante uma opacidade mínima
        gradient: { 0.2: 'cyan', 0.5: 'lime', 0.6: 'yellow', 0.7: 'red' }, // Começa a colorir bem cedo
      }),
      calor: L.heatLayer(calorPoints, {
        radius: 50,         // <-- Raio muito maior
        blur: 40,           // <-- Super desfocado para manchas amplas
        max: 0.5,           // <-- VALOR EXTREMAMENTE BAIXO para um efeito muito forte
        minOpacity: 0.25,   // <-- Opacidade mínima ainda maior
        gradient: { 0.2: 'yellow', 0.6: 'red', 1.0: '#8B0000' }, // Começa no amarelo e rapidamente vai para o vermelho
      }),
      verde: L.rectangle(
        [
          [-23.4, -46.8],
          [-23.7, -46.5],
        ],
        {
          color: '#a52a2a',
          weight: 0,
          fillOpacity: 0.5, // <-- Opacidade em 50%
        }
      ),
      pop: L.heatLayer(popPoints, {
        radius: 40,         // <-- Raio maior
        blur: 25,           // <-- Mais desfoque
        max: 0.7,           // <-- Aumenta o contraste
        minOpacity: 0.2,    // <-- Garante uma opacidade mínima
        gradient: { 0.2: 'pink', 0.6: 'magenta', 1.0: '#FF00FF' }, // Paleta de rosa/magenta bem forte
      }),
    };

    // Cleanup ao desmontar
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Atualiza as camadas visíveis quando activeLayers muda
  useEffect(() => {
    if (!mapRef.current) return;

    Object.entries(layersRef.current).forEach(([layerName, layer]) => {
      if (activeLayers.has(layerName)) {
        if (!mapRef.current!.hasLayer(layer)) {
          layer.addTo(mapRef.current!);
        }
      } else {
        if (mapRef.current!.hasLayer(layer)) {
          mapRef.current!.removeLayer(layer);
        }
      }
    });
  }, [activeLayers]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg"
    />
  );
};

export default InteractiveMap;
