import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TrainerNavbar from '../../components/TrainerNavbar';
import '../../styles/Trainer/EquipmentsPage.css';
import { fetchEquipmentCategories } from '../../services/TrainerService';

const categoryImages = {
  CARDIO: '/images/Cardio.png',
  STRENGTH: '/images/Strength.png',
  FLEXIBILITY: '/images/Flexibility.png',
  FREE_WEIGHTS: '/images/FreeWeights.png',
  RESISTANCE_MACHINES: '/images/ResistanceMachines.png',
};

const EquipmentsPage = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchEquipmentCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to load equipment categories:', error);
      }
    };
    loadCategories();
  }, []);

  return (
    <>
      <TrainerNavbar />
      <div className="container mt-4 equipment-page">
        <h2 className="text-center mb-5 section-title"> Gym Equipment Categories</h2>
        <div className="row justify-content-center">
          {categories.map((cat, idx) => (
            <div className="col-sm-6 col-md-4 col-lg-3 mb-4" key={idx}>
              <div className="equipment-card text-center shadow-sm">
                <img
                  src={categoryImages[cat.category] || '/images/default.png'}
                  alt={cat.category}
                  className="equipment-image"
                />
                <div className="card-body px-3">
                  <h5 className="equipment-title">{cat.category.replace('_', ' ')} Equipment</h5>
                  <p className="mb-1"><strong>Active:</strong> {cat.activeCount}</p>
                  <p className="text-warning mb-2"><strong>Maintenance:</strong> {cat.maintenanceCount}</p>
                  <button
                    className="btn btn-outline-primary rounded-pill"
                    onClick={() => navigate(`/trainer/equipments/${cat.category.toLowerCase()}`)}
                  >
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default EquipmentsPage;
