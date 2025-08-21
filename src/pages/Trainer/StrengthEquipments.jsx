import React, { useEffect, useState } from 'react';
import TrainerNavbar from '../../components/TrainerNavbar';
import {
  fetchStrengthEquipments,
  toggleEquipmentMaintenance
} from '../../services/TrainerService';

const StrengthEquipments = () => {
  const [equipments, setEquipments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('all');

  useEffect(() => {
    const loadEquipments = async () => {
      try {
        const data = await fetchStrengthEquipments();
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
      alert("Maintenance update failed.");
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
        <div className="d-flex flex-column flex-md-row justify-content-between gap-2 mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name..."
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
          <p>No equipment found.</p>
        ) : (
          <div className="row">
            {filtered.map((eq) => (
              <div className="col-md-4 mb-3" key={eq.id}>
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title">{eq.name}</h5>
                    <p className="card-text">
                      <strong>Category:</strong> {eq.description}
                    </p>
                    <p className={`card-text ${eq.forMaintenance ? 'text-danger' : 'text-success'}`}>
                      <strong>Status:</strong> {eq.forMaintenance ? 'Under Maintenance' : 'Available'}
                    </p>
                    <button
                      className={`btn ${eq.forMaintenance ? 'btn-success' : 'btn-warning'}`}
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

export default StrengthEquipments;
