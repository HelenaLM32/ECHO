package com.example.echo;

import org.springframework.context.ApplicationContext;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.example.echo.core.entity.items.dto.ItemDTO;
import com.example.echo.core.entity.user.dto.UserDTO;
import com.example.echo.core.entity.role.dto.RoleDTO;

import com.example.echo.infrastructure.persistence.jpa.JpaItemRepository;
import com.example.echo.infrastructure.persistence.jpa.JpaUserRepository;
import com.example.echo.infrastructure.persistence.jpa.JpaRoleRepository;

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

        JpaRoleRepository roleRepo = context.getBean(JpaRoleRepository.class);

        System.out.println("\n *****   Java Roles list  ***** \n");
        roleRepo.findAll().forEach(System.out::println);

        System.out.println("\n *****   Add a new Java Role  ***** \n");
        roleRepo.save(new RoleDTO(null, "ROLE_TEST"));

        System.out.println("\n *****   Find role by name  ***** \n");
        roleRepo.findByName("ROLE_TEST").ifPresent(System.out::println);

        System.out.println("\n *****   Find role by id  ***** \n");
        roleRepo.findById(1).ifPresent(System.out::println);

        JpaItemRepository itemRepo = context.getBean(JpaItemRepository.class);

        System.out.println("\n *****   Java Items by creator id  ***** \n");
        itemRepo.findByCreatorId(1).forEach(System.out::println);

        System.out.println("\n *****   Add a new Java Item  ***** \n");
        // categoryId is not set here (null)
        itemRepo.save(new ItemDTO(null, 1, "producto ejemplo", "descripcion ejemplo", 29.99, "PRODUCTO", null));

        System.out.println("\n *****   List all items  ***** \n");
        itemRepo.findAll().forEach(System.out::println);

        System.out.println("\n *****   Find item by id  ***** \n");
        itemRepo.findById(1).ifPresent(System.out::println);

        JpaUserRepository userRepo = context.getBean(JpaUserRepository.class);

        System.out.println("\n *****   Java Users list  ***** \n");
        userRepo.findAll().forEach(System.out::println);

        System.out.println("\n *****   Add a new Java User  ***** \n");
        userRepo.save(new UserDTO(null, "jane.doe@example.com", "Jane Doe", "pass", true, null));

        System.out.println("\n *****   Find user by email  ***** \n");
        userRepo.findByEmail("jane.doe@example.com").ifPresent(System.out::println);

        System.out.println("\n *****   Find user by id  ***** \n");
        userRepo.findById(1).ifPresent(System.out::println);

        System.out.println("\n *****   Delete user by email  ***** \n");
        userRepo.deleteByEmail("jane.doe@example.com");

    }
}
