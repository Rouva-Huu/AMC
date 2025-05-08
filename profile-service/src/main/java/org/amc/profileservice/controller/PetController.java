package org.amc.profileservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.amc.profileservice.dto.PetRequest;
import org.amc.profileservice.model.MedicalRecord;
import org.amc.profileservice.model.Pet;
import org.amc.profileservice.service.PetService;
import org.amc.profileservice.service.QRService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/pets")
@RequiredArgsConstructor
public class PetController {
    private final QRService qrService;
    private final PetService petService;

    @PostMapping
    public ResponseEntity<?> registerPet(@RequestBody PetRequest pet, Principal principal) {
        String owner = principal.getName();
        return ResponseEntity.ok(petService.createPet(pet, owner));
    }

    @GetMapping("/{id}/qr")
    public ResponseEntity<byte[]> getQRCode(@PathVariable String id) {
        Pet pet = petService.findPetById(id);

        if (pet.getMedicalRecord() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body("Medical record not found".getBytes(StandardCharsets.UTF_8));
        }

        try {
            String info = new ObjectMapper().writeValueAsString(pet.getMedicalRecord());
            byte[] qr = qrService.generateQRCode(info);
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_PNG)
                    .body(qr);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage().getBytes());
        }
    }

    @GetMapping
    public ResponseEntity<List<Pet>> getAllPets(Principal principal) {
        String owner = principal.getName();
        List<Pet> pets = petService.getPetsByOwner(owner);
        return ResponseEntity.ok(pets);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePet(@PathVariable String id, @RequestBody PetRequest petRequest, Principal principal) {
        String owner = principal.getName();
        Pet updatedPet = petService.updatePet(id, petRequest, owner);
        return ResponseEntity.ok(updatedPet);
    }

    @PutMapping("/{id}/medical-record")
    public ResponseEntity<?> updateMedicalRecord(@PathVariable String id, @RequestBody MedicalRecord medicalRecord, Principal principal) {
        String owner = principal.getName();
        Pet updatedPet = petService.updateMedicalRecord(id, medicalRecord, owner);
        return ResponseEntity.ok(updatedPet);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePet(@PathVariable String id, Principal principal) {
        String owner = principal.getName();
        petService.deletePet(id, owner);
        return ResponseEntity.ok("Pet deleted successfully");
    }
}

