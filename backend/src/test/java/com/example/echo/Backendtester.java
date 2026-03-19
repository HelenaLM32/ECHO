package com.example.echo;

import org.springframework.context.ApplicationContext;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.example.echo.core.entity.items.dto.ItemDTO;
import com.example.echo.core.entity.user.dto.UserDTO;

import com.example.echo.infrastructure.persistence.jpa.JpaItemRepository;
import com.example.echo.infrastructure.persistence.jpa.JpaUserRepository;

@SpringBootApplication
public class Backendtester {

    public static void main(String[] args) {

        ApplicationContext context = SpringApplication.run(Backendtester.class, args);

        /*
         * ============================================================
         * BLOQUE 1: REPOSITORIOS JPA
         * ============================================================
         */

        System.out.println("\n\n==========  REPOSITORY TESTS (JPA)  ==========\n");

        /*
         * -------------------------
         * USER REPOSITORY
         * -------------------------
         */

        // JpaUserRepository userRepo = context.getBean(JpaUserRepository.class);

        // System.out.println("\n *****   Java users by email  ***** \n");
        // userRepo.findByEmail("john.doe@example.com").ifPresent(System.out::println);

        // System.out.println("\n *****   Add a new Java Item  ***** \n");
        // userRepo.save(new UserDTO(null, "john.doe@example.com", "John Doe", "1234", true, null));

        // System.out.println("\n *****   List all users  ***** \n");
        // userRepo.findAll().forEach(System.out::println);

        // System.out.println("\n *****   Find user by id  ***** \n");
        // userRepo.deleteById(135);

        /*
         * -------------------------
         * ITEM REPOSITORY
         * -------------------------
         */

        JpaItemRepository itemRepo = context.getBean(JpaItemRepository.class);

        System.out.println("\n *****   Java Items by creator id  ***** \n");
        itemRepo.findByCreatorId(1).forEach(System.out::println);

        System.out.println("\n *****   Add a new Java Item  ***** \n");
        itemRepo.save(new ItemDTO(null, 1, "producto ejemplo", "descripcion ejemplo", 29.99, "PRODUCTO"));

        System.out.println("\n *****   List all items  ***** \n");
        itemRepo.findAll().forEach(System.out::println);

        System.out.println("\n *****   Find item by id  ***** \n");
        itemRepo.findById(1).ifPresent(System.out::println);

    }
}
