import React, { useState } from 'react';

const MedicalEntryForm = ({ medicalData, onAdd, onReset }) => {
  const [entry, setEntry] = useState({ 
    type: 'vaccinations', 
    value: '' 
  });

  const handleAdd = () => {
    if (entry.value.trim()) {
      onAdd(entry.type, entry.value);
      setEntry(prev => ({ ...prev, value: '' }));
    }
  };
  
  React.useEffect(() => {
    onReset(); // Вызываем сброс при открытии формы
  }, []);

  return (
    <div className="medical-entry-form">
      <select
        value={entry.type}
        onChange={(e) => setEntry(prev => ({ ...prev, type: e.target.value }))}
      >
        <option value="vaccinations">Vaccination</option>
        <option value="allergies">Allergy</option>
        <option value="chronicDiseases">Chronic Disease</option>
      </select>

      <button onClick={handleAdd}>Add</button>

      <input
        type="text" 
        value={entry.value}
        onChange={(e) => setEntry(prev => ({ ...prev, value: e.target.value }))}
        placeholder="Enter new medical record"
      />

      <div className="entries-preview">
        {Object.entries(medicalData).map(([type, items]) => (
          <div key={type} className="entry-list">
            <h4>{type.replace(/([A-Z])/g, ' $1').toLowerCase()}:</h4>
            <ul>
              {items.map((item, index) => (
                <li key={`${type}-${index}`}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicalEntryForm;