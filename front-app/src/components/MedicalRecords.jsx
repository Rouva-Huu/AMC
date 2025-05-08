import React from 'react';

const MedicalRecords = ({ record }) => {
  if (!record) return null;

  return (
    <div className="medical-records">
      <hr/>
      <h4>Medical Records:</h4>
      {record.vaccinations?.length > 0 && (
        <div>
          <h5>Vaccinations:</h5>
          <ul>
            {record.vaccinations.map((v, i) => (
              <li key={i}>{v}</li>
            ))}
          </ul>
        </div>
      )}
        {record.allergies?.length > 0 && (
        <div>
          <h5>Allergies:</h5>
          <ul>
            {record.allergies.map((v, i) => (
              <li key={i}>{v}</li>
            ))}
          </ul>
        </div>
      )}
      {record.chronicDiseases?.length > 0 && (
        <div>
          <h5>Chronic Diseases:</h5>
          <ul>
            {record.chronicDiseases.map((v, i) => (
              <li key={i}>{v}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;