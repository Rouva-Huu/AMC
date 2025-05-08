package org.amc.profileservice.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MedicalRecord {
    private List<String> vaccinations;
    private List<String> allergies;
    private List<String> chronicDiseases;
}