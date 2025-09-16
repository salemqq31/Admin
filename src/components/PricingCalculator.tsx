"use client";

import { useState, useEffect, useRef } from 'react';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

// Chart.js'i kaydet
Chart.register(...registerables);

interface PricingTier {
  range: string;
  min: number;
  max: number;
  fee: number;
  cost: number;
  profit: number;
  margin: number;
  costBreakdown: {
    pms: number;
    platform: number;
    email: number;
  };
}

const pricingData: PricingTier[] = [
  { range: "0 - 50", min: 0, max: 50, fee: 1000, cost: 90, profit: 910, margin: 91, costBreakdown: { pms: 30, platform: 30, email: 30 } },
  { range: "51 - 100", min: 51, max: 100, fee: 2000, cost: 180, profit: 1820, margin: 91, costBreakdown: { pms: 60, platform: 60, email: 60 } },
  { range: "101 - 200", min: 101, max: 200, fee: 3000, cost: 315, profit: 2685, margin: 90, costBreakdown: { pms: 120, platform: 90, email: 105 } },
  { range: "201 - 300", min: 201, max: 300, fee: 5000, cost: 480, profit: 4520, margin: 90, costBreakdown: { pms: 180, platform: 150, email: 150 } },
  { range: "301 - 500", min: 301, max: 500, fee: 8000, cost: 750, profit: 7250, margin: 91, costBreakdown: { pms: 300, platform: 240, email: 210 } },
  { range: "501 - 600", min: 501, max: 600, fee: 10000, cost: 960, profit: 9040, margin: 90, costBreakdown: { pms: 360, platform: 330, email: 270 } },
  { range: "601 - 700", min: 601, max: 700, fee: 13000, cost: 1200, profit: 11800, margin: 91, costBreakdown: { pms: 420, platform: 450, email: 330 } },
  { range: "701 - 800", min: 701, max: 800, fee: 15000, cost: 1410, profit: 13590, margin: 91, costBreakdown: { pms: 480, platform: 570, email: 360 } },
  { range: "801 - 900", min: 801, max: 900, fee: 17000, cost: 1650, profit: 15350, margin: 90, costBreakdown: { pms: 540, platform: 720, email: 390 } },
  { range: "901 - 1000", min: 901, max: 1000, fee: 19000, cost: 1860, profit: 17140, margin: 90, costBreakdown: { pms: 600, platform: 840, email: 420 } },
  { range: "1001 - 1300", min: 1001, max: 1300, fee: 21000, cost: 2250, profit: 18750, margin: 89, costBreakdown: { pms: 780, platform: 1020, email: 450 } },
  { range: "1301 - 1500", min: 1301, max: 1500, fee: 23000, cost: 2640, profit: 20360, margin: 89, costBreakdown: { pms: 900, platform: 1260, email: 480 } },
];

export default function PricingCalculator() {
  const [roomCount, setRoomCount] = useState(250);
  const [currentTier, setCurrentTier] = useState<PricingTier>(pricingData[3]);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const formatCurrency = (value: number) => `$${value.toLocaleString('en-US')}`;

  // Room count değiştiğinde tier'ı güncelle
  useEffect(() => {
    const tier = pricingData.find(t => roomCount >= t.min && roomCount <= t.max) || pricingData[0];
    setCurrentTier(tier);
  }, [roomCount]);

  // Chart'ı oluştur ve güncelle
  useEffect(() => {
    if (!chartRef.current) return;

    // Önceki chart'ı temizle
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: ['Finansal Döküm'],
        datasets: [
          {
            label: 'Yıllık Lisans Ücreti',
            data: [currentTier.fee],
            backgroundColor: '#38bdf8',
            borderRadius: 6,
          },
          {
            label: 'Yıllık Brüt Kâr',
            data: [currentTier.profit],
            backgroundColor: '#16a34a',
            borderRadius: 6,
          },
          {
            label: 'Tahmini Yıllık Maliyet',
            data: [currentTier.cost],
            backgroundColor: '#dc2626',
            borderRadius: 6,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${formatCurrency(context.raw as number)}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return formatCurrency(value as number);
              }
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    };

    chartInstance.current = new Chart(ctx, config);

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [currentTier]);

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Digiroom Fiyatlandırma Analizcisi
        </h2>
        <p className="text-lg text-slate-600 mt-3 max-w-3xl mx-auto">
          Otelinizin oda sayısına göre yıllık lisans ücretinizi, tahmini maliyetlerinizi ve brüt kâr marjınızı anında görün.
        </p>
      </div>

      {/* Interactive Calculator Section */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
        <div className="mb-8">
          <label htmlFor="roomCountSlider" className="block text-xl font-bold text-slate-900 mb-2 text-center">
            Otelinizin Oda Sayısını Seçin
          </label>
          <input 
            id="roomCountSlider" 
            type="range" 
            min="1" 
            max="1500" 
            value={roomCount}
            onChange={(e) => setRoomCount(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <p className="text-center text-3xl font-bold text-sky-600 mt-4">
            {roomCount} Oda
          </p>
        </div>
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="bg-slate-50 p-5 rounded-xl">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Yıllık Lisans Ücreti
            </h3>
            <p className="text-4xl font-extrabold text-slate-800 mt-2">
              {formatCurrency(currentTier.fee)}
            </p>
          </div>
          <div className="bg-slate-50 p-5 rounded-xl">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Tahmini Yıllık Maliyet
            </h3>
            <p className="text-4xl font-extrabold text-slate-800 mt-2">
              {formatCurrency(currentTier.cost)}
            </p>
          </div>
          <div className="bg-slate-50 p-5 rounded-xl">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Yıllık Brüt Kâr
            </h3>
            <p className="text-4xl font-extrabold text-slate-800 mt-2">
              {formatCurrency(currentTier.profit)}
            </p>
          </div>
          <div className="bg-sky-500 text-white p-5 rounded-xl">
            <h3 className="text-sm font-semibold text-sky-100 uppercase tracking-wider">
              Brüt Kâr Marjı
            </h3>
            <p className="text-4xl font-extrabold mt-2">
              {currentTier.margin}%
            </p>
          </div>
        </div>

        {/* Cost Breakdown and Chart */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="bg-slate-50 p-6 rounded-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Tahmini Yıllık Maliyet Dökümü
            </h3>
            <p className="text-slate-600 mb-4">
              Her bir otel için hizmeti sunmamızı sağlayan üç temel değişken maliyet bulunmaktadır. 
              Bu maliyetler, seçtiğiniz oda sayısına göre anlık olarak hesaplanmaktadır.
            </p>
            <ul className="space-y-3">
              <li className="flex justify-between items-center">
                <span className="font-medium text-slate-700">PMS Entegrasyon Maliyeti</span>
                <span className="font-bold text-lg text-slate-900">
                  {formatCurrency(currentTier.costBreakdown.pms)}
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span className="font-medium text-slate-700">Platform ve Altyapı Maliyeti</span>
                <span className="font-bold text-lg text-slate-900">
                  {formatCurrency(currentTier.costBreakdown.platform)}
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span className="font-medium text-slate-700">E-posta Pazarlama Maliyeti</span>
                <span className="font-bold text-lg text-slate-900">
                  {formatCurrency(currentTier.costBreakdown.email)}
                </span>
              </li>
            </ul>
          </div>
          <div>
            <div className="relative w-full max-w-2xl mx-auto h-80">
              <canvas ref={chartRef}></canvas>
            </div>
          </div>
        </div>
      </div>

      {/* Full Pricing Table Section */}
      <div>
        <div className="text-center mb-6">
          <h3 className="text-3xl font-bold text-slate-900">Tüm Fiyatlandırma Katmanları</h3>
          <p className="text-slate-600 mt-2">
            Aşağıdaki tabloda tüm fiyat katmanlarımızı ve kârlılık analizini inceleyebilirsiniz. 
            (Fiyatlar KDV hariçtir)
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-4 font-bold text-slate-700">Oda Sayısı Aralığı</th>
                  <th className="p-4 font-bold text-slate-700 text-right">Yıllık Lisans Ücreti</th>
                  <th className="p-4 font-bold text-slate-700 text-right">Tahmini Yıllık Maliyet</th>
                  <th className="p-4 font-bold text-slate-700 text-right">Yıllık Brüt Kâr</th>
                  <th className="p-4 font-bold text-slate-700 text-right">Brüt Kâr Marjı</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {pricingData.map((tier, index) => (
                  <tr 
                    key={index}
                    className={`transition-all duration-300 ${
                      tier.range === currentTier.range 
                        ? 'bg-sky-50 transform scale-[1.01] shadow-md' 
                        : ''
                    }`}
                  >
                    <td className="p-4 font-medium text-slate-900">{tier.range}</td>
                    <td className="p-4 text-right font-semibold text-slate-900">
                      {formatCurrency(tier.fee)}
                    </td>
                    <td className="p-4 text-right text-red-600">
                      ({formatCurrency(tier.cost)})
                    </td>
                    <td className="p-4 text-right font-bold text-green-600">
                      {formatCurrency(tier.profit)}
                    </td>
                    <td className="p-4 text-right font-bold text-sky-600">
                      {tier.margin}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          background: #0ea5e9;
          cursor: pointer;
          border-radius: 50%;
          margin-top: -8px;
        }
        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: #0ea5e9;
          cursor: pointer;
          border-radius: 50%;
          border: none;
        }
      `}</style>
    </div>
  );
}
