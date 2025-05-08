from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.hospital import Hospital
from app.models.doctor import Doctor
from app.models.appointment import Appointment
from datetime import date, time, datetime

engine = create_engine("postgresql://postgres:postgres@db:5432/appointment_db")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def seed_data():
    db = SessionLocal()

    # Добавляем больницы
    hospitals = [
        {"name": "Central Hospital", "address": "Main St 1"},
        {"name": "North Clinic", "address": "North Ave 42"},
        {"name": "West Medical", "address": "West St 15"}
    ]

    for hospital_data in hospitals:
        if not db.query(Hospital).filter_by(name=hospital_data["name"]).first():
            hospital = Hospital(**hospital_data)
            db.add(hospital)
            db.commit()
            db.refresh(hospital)

    # Добавляем врачей
    doctors = [
        {
            "name": "Dr. John Smith",
            "hospital_id": 1,
            "work_day": date(2025, 4, 5),
            "shift_start": time(9, 0),
            "shift_end": time(17, 0)
        },
        {
            "name": "Dr. Chris Anderson",
            "hospital_id": 1,
            "work_day": date(2025, 4, 5),
            "shift_start": time(10, 0),
            "shift_end": time(18, 0)
        },
        {
            "name": "Dr. Davis Miller",
            "hospital_id": 2,
            "work_day": date(2025, 4, 5),
            "shift_start": time(9, 0),
            "shift_end": time(22, 0)
        },
                {
            "name": "Dr. Evan Williams",
            "hospital_id": 2,
            "work_day": date(2025, 4, 5),
            "shift_start": time(10, 0),
            "shift_end": time(17, 0)
        },
        {
            "name": "Dr. Sarah Johnson",
            "hospital_id": 3,
            "work_day": date(2025, 4, 6),
            "shift_start": time(9, 0),
            "shift_end": time(17, 0)
        }
    ]

    for doctor_data in doctors:
        if not db.query(Doctor).filter_by(name=doctor_data["name"]).first():
            doctor = Doctor(**doctor_data)
            db.add(doctor)
            db.commit()
            db.refresh(doctor)

    # Добавляем записи
    appointments = [
        {
            "doctor_id": 1,
            "patient_id": 1001,
            "appointment_date": datetime(2025, 4, 5, 10, 0)
        },
        {
            "doctor_id": 2,
            "patient_id": 1002,
            "appointment_date": datetime(2025, 4, 6, 11, 0)
        }
    ]

    for appointment_data in appointments:
        if not db.query(Appointment).filter_by(
            doctor_id=appointment_data["doctor_id"],
            patient_id=appointment_data["patient_id"]
        ).first():
            appointment = Appointment(**appointment_data)
            db.add(appointment)
            db.commit()

    print("✅ Seed data added successfully.")
    db.close()
    
if __name__ == "__main__":
    seed_data()