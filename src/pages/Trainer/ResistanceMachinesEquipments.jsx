import React, { useEffect, useState } from 'react';
import TrainerNavbar from '../../components/TrainerNavbar';
import {
  fetchResistanceMachines,
  toggleEquipmentMaintenance
} from '../../services/TrainerService';

const ResistanceMachinesEquipments = () => {
  const [equipments, setEquipments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('all');

  useEffect(() => {
    const loadEquipments = async () => {
      try {
        const data = await fetchResistanceMachines();
        if (Array.isArray(data)) {
          setEquipments(data);
        } else {
          console.error('Unexpected response format:', data);
          setEquipments([]);
        }
      } catch {
        setEquipments([]);
      }
    };

    loadEquipments();
  }, []);

  const toggleMaintenance = async (id, currentStatus) => {
    try {
      await toggleEquipmentMaintenance(id, currentStatus);
      setEquipments(prev =>
        prev.map(eq =>
          eq.id === id ? { ...eq, forMaintenance: !currentStatus } : eq
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
    filtered = filtered.filter(eq => eq.forMaintenance);
  } else if (sortOption === 'available') {
    filtered = filtered.filter(eq => !eq.forMaintenance);
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
        <h2 className="mb-4 text-center fw-bold">Resistance Machines</h2>

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
            <option value="a-z">Sort: A-Z</option>
            <option value="z-a">Sort: Z-A</option>
            <option value="maintenance">Only Maintenance</option>
            <option value="available">Only Available</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-muted">No equipment found.</p>
        ) : (
          <div className="row">
            {filtered.map((eq) => (
              <div className="col-md-4 mb-4" key={eq.id}>
                <div className="card h-100 shadow-sm border-0 rounded-4">
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <h5 className="card-title fw-bold">{eq.name}</h5>
                      <p className="card-text text-muted mb-1">
                        <strong>Category:</strong> {eq.description}
                      </p>
                      <p className={`fw-semibold ${eq.forMaintenance ? 'text-danger' : 'text-success'}`}>
                        <strong>Status:</strong> {eq.forMaintenance ? 'Under Maintenance' : 'Available'}
                      </p>
                    </div>
                    <button
                      className={`btn mt-3 ${eq.forMaintenance ? 'btn-success' : 'btn-warning'}`}
                      onClick={() => toggleMaintenance(eq.id, eq.forMaintenance)}
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

export default ResistanceMachinesEquipments;
