import React, { useEffect, useState } from 'react';
import TrainerNavbar from '../../components/TrainerNavbar';
import '../../styles/Trainer/EquipmentsPage.css';
import {
  getCardioEquipments,
  toggleEquipmentMaintenance
} from '../../services/TrainerService';

const CardioEquipments = () => {
  const [equipments, setEquipments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('all');

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const data = await getCardioEquipments();
        setEquipments(data);
      } catch (err) {
        console.log(err);
        alert('Failed to load equipment. Please try again later.');
      }
    };
    fetchEquipments();
  }, []);

  const handleToggleMaintenance = async (eq) => {
    try {
      await toggleEquipmentMaintenance(eq.id, !eq.forMaintenance);
      setEquipments(prev =>
        prev.map(e =>
          e.id === eq.id ? { ...e, forMaintenance: !eq.forMaintenance } : e
        )
      );
    } catch {
      alert("Failed to update maintenance status.");
    }
  };

  let filtered = equipments.filter(eq =>
    eq.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (sortOption === 'maintenance') {
    filtered = filtered.filter(eq => eq.forMaintenance === true);
  } else if (sortOption === 'available') {
    filtered = filtered.filter(eq => eq.forMaintenance === false);
  }

  if (sortOption === 'a-z') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption === 'z-a') {
    filtered.sort((a, b) => b.name.localeCompare(a.name));
  }

  return (
    <>
      <TrainerNavbar />
      <div className="container mt-4">
        <h2 className="mb-4 text-center fw-bold">Cardio Equipments</h2>

        <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4 align-items-center">
          <input
            type="text"
            className="form-control w-100 w-md-50"
            style={{ maxWidth: '300px' }}
            placeholder="Search equipment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="form-select w-auto"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="all">All</option>
            <option value="a-z">Sort: A–Z</option>
            <option value="z-a">Sort: Z–A</option>
            <option value="maintenance">Only Maintenance</option>
            <option value="available">Only Available</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-muted">No equipment found.</p>
        ) : (
          <div className="row">
            {filtered.map(eq => (
              <div className="col-md-4 mb-4" key={eq.id}>
                <div className="card h-100 shadow-sm border-0 rounded-4">
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <h5 className="card-title fw-bold">{eq.name}</h5>
                      <p className="card-text text-muted mb-1"><strong>Category:</strong> {eq.description}</p>
                      <p className={`fw-semibold ${eq.forMaintenance ? 'text-danger' : 'text-success'}`}>
                        <strong>Status:</strong> {eq.forMaintenance ? 'Under Maintenance' : 'Available'}
                      </p>
                    </div>
                    <button
                      className={`btn mt-3 ${eq.forMaintenance ? 'btn-success' : 'btn-warning'}`}
                      onClick={() => handleToggleMaintenance(eq)}
                    >
                      {eq.forMaintenance ? 'Unmark Maintenance' : 'Mark as Maintenance'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CardioEquipments;
