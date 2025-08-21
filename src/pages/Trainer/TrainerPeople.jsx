import React from "react";

const trainers = [
  {
    id: 1,
    name: "Alex Turner",
    expertise: "Strength Training, HIIT",
    certifications: ["ACE Certified", "CPR & AED"],
    photo: "../../../public/images/Trainer1.png",
  },
  {
    id: 2,
    name: "Sophia Lee",
    expertise: "Yoga, Pilates",
    certifications: ["RYT 500", "Nutrition Specialist"],
    photo: "../../../public/images/Trainer2.png",
  },
  {
    id: 3,
    name: "Michael Chen",
    expertise: "Bodybuilding, Powerlifting",
    certifications: ["NSCA-CPT", "ISSA"],
    photo: "../../../public/images/Trainer3.png",
  },
  {
    id: 4,
    name: "Priya Sharma",
    expertise: "Zumba, Functional Training",
    certifications: ["ZIN License", "Functional Movement Certified"],
    photo: "../../../public/images/Trainer4.png",
  }
];

const TrainerPeople = () => {
  return (
    <div className="container mt-5">
      <h2 className="text-center fw-bold mb-4">Meet Our Trainers</h2>
      <div className="row">
        {trainers.map((trainer) => (
          <div key={trainer.id} className="col-md-3 mb-4">
            <div className="card shadow-sm h-100 text-center">
              <img
                src={trainer.photo}
                className="card-img-top"
                alt={trainer.name}
              />
              <div className="card-body">
                <h5 className="card-title fw-bold">{trainer.name}</h5>
                <p className="card-text text-muted">
                  <strong>Expertise:</strong> {trainer.expertise}
                </p>
                <p className="card-text">
                  <strong>Certifications:</strong>
                  <ul className="list-unstyled mb-0">
                    {trainer.certifications.map((cert, index) => (
                      <li key={index}>✅ {cert}</li>
                    ))}
                  </ul>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainerPeople;
