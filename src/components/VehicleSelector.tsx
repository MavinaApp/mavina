"use client";

import { useState } from 'react';
import { FaCar, FaPlus, FaTrash, FaCalendarAlt, FaTag, FaPalette, FaCog } from 'react-icons/fa';
import { TbCarSuv, TbTruckDelivery, TbMicrowave, TbBus, TbTruckLoading } from 'react-icons/tb';
import { IoCarSportOutline } from 'react-icons/io5';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  licensePlate: string;
  type: 'sedan' | 'hatchback' | 'suv' | 'pickup' | 'minivan' | 'panelvan';
  color: string;
  year: string;
}

interface VehicleSelectorProps {
  userId: string;
  onSelect: (vehicle: Vehicle) => void;
  selectedVehicle?: Vehicle;
}

export default function VehicleSelector({ userId, onSelect, selectedVehicle }: VehicleSelectorProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    // Örnek veri - gerçek uygulamada API'den gelecek
    { 
      id: '1', 
      brand: 'BMW',
      model: '320i', 
      licensePlate: '34ABC123',
      type: 'sedan',
      color: 'Siyah',
      year: '2020'
    },
    { 
      id: '2', 
      brand: 'Mercedes',
      model: 'C200', 
      licensePlate: '34XYZ789',
      type: 'sedan',
      color: 'Beyaz',
      year: '2021'
    }
  ]);
  
  const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({ 
    brand: '', 
    model: '', 
    licensePlate: '', 
    type: 'sedan', 
    color: '', 
    year: ''
  });

  const vehicleTypes = [
    { value: 'sedan', label: 'Sedan', icon: <IoCarSportOutline className="w-6 h-6" /> },
    { value: 'hatchback', label: 'Hatchback', icon: <FaCar className="w-5 h-5" /> },
    { value: 'suv', label: 'SUV', icon: <TbCarSuv className="w-6 h-6" /> },
    { value: 'pickup', label: 'Pickup', icon: <TbTruckLoading className="w-6 h-6" /> },
    { value: 'minivan', label: 'Minivan', icon: <TbBus className="w-6 h-6" /> },
    { value: 'panelvan', label: 'Panelvan', icon: <TbTruckDelivery className="w-6 h-6" /> }
  ];

  const popularColors = [
    'Siyah', 'Beyaz', 'Gri', 'Kırmızı', 'Mavi', 'Yeşil', 'Sarı', 'Turuncu', 'Kahverengi', 'Bordo'
  ];

  const getVehicleTypeIcon = (type: string) => {
    const vehicleType = vehicleTypes.find(t => t.value === type);
    return vehicleType ? vehicleType.icon : <FaCar />;
  };

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= currentYear - 30; year--) {
      years.push(year.toString());
    }
    return years;
  };

  const handleAddVehicle = () => {
    if (!newVehicle.brand || !newVehicle.model || !newVehicle.licensePlate || !newVehicle.type || !newVehicle.color || !newVehicle.year) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    const vehicle: Vehicle = {
      id: Date.now().toString(),
      brand: newVehicle.brand,
      model: newVehicle.model,
      licensePlate: newVehicle.licensePlate,
      type: newVehicle.type as 'sedan' | 'hatchback' | 'suv' | 'pickup' | 'minivan' | 'panelvan',
      color: newVehicle.color,
      year: newVehicle.year
    };

    setVehicles([...vehicles, vehicle]);
    setNewVehicle({ brand: '', model: '', licensePlate: '', type: 'sedan', color: '', year: '' });
    setShowAddModal(false);
  };

  const handleDeleteVehicle = (id: string) => {
    setVehicles(vehicles.filter(v => v.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-gray-700">Araç Seçin</h4>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
        >
          <FaPlus className="mr-1.5" />
          Yeni Araç Ekle
        </button>
      </div>

      <div className="space-y-2">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
              selectedVehicle?.id === vehicle.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => onSelect(vehicle)}
          >
            <div className="flex items-center">
              <div className="text-blue-600 mr-3 p-2 bg-blue-50 rounded-full">
                {getVehicleTypeIcon(vehicle.type)}
              </div>
              <div>
                <p className="font-medium text-gray-800">{vehicle.brand} {vehicle.model}</p>
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <span className="flex items-center text-xs text-gray-600">
                    <FaTag className="mr-1 text-gray-400" />
                    {vehicle.licensePlate}
                  </span>
                  <span className="flex items-center text-xs text-gray-600">
                    <FaCalendarAlt className="mr-1 text-gray-400" />
                    {vehicle.year}
                  </span>
                  <span className="flex items-center text-xs text-gray-600">
                    <FaPalette className="mr-1 text-gray-400" />
                    {vehicle.color}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteVehicle(vehicle.id);
              }}
              className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>

      {/* Yeni Araç Ekleme Modalı */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Yeni Araç Ekle</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Marka
                  </label>
                  <input
                    type="text"
                    value={newVehicle.brand}
                    onChange={(e) => setNewVehicle({ ...newVehicle, brand: e.target.value })}
                    placeholder="Örn: BMW"
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Model
                  </label>
                  <input
                    type="text"
                    value={newVehicle.model}
                    onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                    placeholder="Örn: 320i"
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Araç Tipi
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                  {vehicleTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setNewVehicle({ ...newVehicle, type: type.value as any })}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-colors ${
                        newVehicle.type === type.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-blue-300 text-gray-700'
                      }`}
                    >
                      <div className="text-2xl mb-1">
                        {type.icon}
                      </div>
                      <span className="text-sm">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaCalendarAlt className="inline mr-1" /> Yıl
                  </label>
                  <select
                    value={newVehicle.year}
                    onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Yıl Seçin</option>
                    {getYearOptions().map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaPalette className="inline mr-1" /> Renk
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={newVehicle.color}
                      onChange={(e) => setNewVehicle({ ...newVehicle, color: e.target.value })}
                      placeholder="Örn: Siyah"
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      list="colorOptions"
                    />
                    <datalist id="colorOptions">
                      {popularColors.map(color => (
                        <option key={color} value={color} />
                      ))}
                    </datalist>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaTag className="inline mr-1" /> Plaka
                  </label>
                  <input
                    type="text"
                    value={newVehicle.licensePlate}
                    onChange={(e) => setNewVehicle({ ...newVehicle, licensePlate: e.target.value })}
                    placeholder="Örn: 34ABC123"
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleAddVehicle}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
                >
                  <FaPlus className="mr-1.5" />
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 