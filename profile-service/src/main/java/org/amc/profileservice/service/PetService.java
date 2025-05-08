package org.amc.profileservice.service;

import lombok.RequiredArgsConstructor;
import org.amc.profileservice.dto.PetRequest;
import org.amc.profileservice.exception.PetNotFoundException;
import org.amc.profileservice.exception.UnauthorizedAccessException;
import org.amc.profileservice.model.MedicalRecord;
import org.amc.profileservice.model.Pet;
import org.amc.profileservice.repository.PetRepository;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@RequiredArgsConstructor
@Service
public class PetService {
    private final PetRepository petRepository;

    public Pet createPet(PetRequest petRequest, String owner) {
        Pet pet = new Pet();
        pet.setId(ObjectId.get());
        pet.setOwnerUsername(owner);
        pet.setName(petRequest.name());
        pet.setBreed(petRequest.breed());
        pet.setAge(petRequest.age());
        return petRepository.save(pet);
    }

    public Pet findPetById(String id) {
        return petRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Pet not found"));
    }

    public List<Pet> getPetsByOwner(String ownerUsername) {
        return petRepository.findByOwnerUsername(ownerUsername);
    }

    public Pet updatePet(String id, PetRequest petRequest, String ownerUsername) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new PetNotFoundException("Pet not found"));

        if (!pet.getOwnerUsername().equals(ownerUsername)) {
            throw new UnauthorizedAccessException("You are not the owner of this pet");
        }

        pet.setName(petRequest.name());
        pet.setBreed(petRequest.breed());
        pet.setAge(petRequest.age());

        return petRepository.save(pet);
    }

    public Pet updateMedicalRecord(String id, MedicalRecord medicalRecord, String ownerUsername) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new PetNotFoundException("Pet not found"));

        // Проверяем, что питомец принадлежит текущему владельцу
        if (!pet.getOwnerUsername().equals(ownerUsername)) {
            throw new UnauthorizedAccessException("You are not the owner of this pet");
        }

        pet.setMedicalRecord(medicalRecord);

        return petRepository.save(pet);
    }

    public void deletePet(String id, String ownerUsername) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new PetNotFoundException("Pet not found"));

        // Проверяем, что питомец принадлежит текущему владельцу
        if (!pet.getOwnerUsername().equals(ownerUsername)) {
            throw new UnauthorizedAccessException("You are not the owner of this pet");
        }

        petRepository.delete(pet);
    }
}
