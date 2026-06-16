package com.example.gestion_docentes_Unla;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class GestionDocentesUnlaApplication {

	public static void main(String[] args) {
		SpringApplication.run(GestionDocentesUnlaApplication.class, args);
	}

}