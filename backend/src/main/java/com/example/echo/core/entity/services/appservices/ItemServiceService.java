package com.example.echo.core.entity.services.appservices;

import com.example.echo.core.entity.categories.dto.CategoryDTO;
import com.example.echo.core.entity.categories.persistence.CategoryRepository;
import com.example.echo.core.entity.items.dto.ItemDTO;
import com.example.echo.core.entity.items.dto.ItemProjectDTO;
import com.example.echo.core.entity.items.persistence.ItemRepository;
import com.example.echo.core.entity.services.model.ItemService;
import com.example.echo.core.entity.services.persistence.ItemServiceRepository;
import com.example.echo.core.entity.user.dto.UserDTO;
import com.example.echo.core.entity.services.dto.ItemServiceRequest;
import com.example.echo.core.entity.services.dto.ItemServiceResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ItemServiceService {

    private final ItemServiceRepository itemServiceRepository;
    private final ItemRepository itemRepository;
    private final com.example.echo.core.entity.items.persistence.ItemProjectRepository projectRepository;
    private final CategoryRepository categoryRepository;

    public ItemServiceService(ItemServiceRepository itemServiceRepository,
                              ItemRepository itemRepository,
                              com.example.echo.core.entity.items.persistence.ItemProjectRepository projectRepository,
                              CategoryRepository categoryRepository) {
        this.itemServiceRepository = itemServiceRepository;
        this.itemRepository = itemRepository;
        this.projectRepository = projectRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    public ItemServiceResponse create(ItemServiceRequest request, UserDTO creator) {
        if (request.getProjectIds() != null && request.getProjectIds().size() > 6) {
            throw new IllegalArgumentException("Maximum 6 projects allowed");
        }

        // Verify projects belong to creator
        if (request.getProjectIds() != null) {
            List<ItemProjectDTO> projects = projectRepository.findAllById(request.getProjectIds());
            if (projects.size() != request.getProjectIds().size()) {
                throw new IllegalArgumentException("Some projects not found");
            }
            for (ItemProjectDTO p : projects) {
                if (!p.getItem().getCreatorId().equals(creator.getId())) {
                    throw new SecurityException("Projects must belong to the creator");
                }
            }
        }

        // Create Item first
        ItemDTO item = new ItemDTO();
        item.setCreatorId(creator.getId());
        item.setTitle(request.getName());
        item.setDescription(request.getDescription());
        item.setBasePrice(request.getPrice());
        item.setItemType("SERVICE");
        item.setCategoryId(request.getCategoryId());
        item = itemRepository.save(item);

        // Get category name for ItemService
        CategoryDTO category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        // Create ItemService
        ItemService itemService = new ItemService();
        itemService.setItem(item);
        itemService.setName(request.getName());
        itemService.setDescription(request.getDescription());
        itemService.setDeliveryDuration(request.getDeliveryDuration());
        itemService.setCategory(category.getName());
        itemService.setPrice(request.getPrice());
        itemService.setCoverImageUrl(request.getCoverImageUrl());
        itemService.setCreator(creator);

        if (request.getProjectIds() != null) {
            Set<ItemProjectDTO> projects = request.getProjectIds().stream()
                    .map(id -> projectRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Project not found")))
                    .collect(Collectors.toSet());
            itemService.setProjects(projects);
        }

        itemService = itemServiceRepository.save(itemService);

        return mapToResponse(itemService);
    }

    @Transactional
    public ItemServiceResponse update(Long id, ItemServiceRequest request, UserDTO creator) {
        ItemService itemService = itemServiceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Service not found"));

        if (!itemService.getCreator().getId().equals(creator.getId())) {
            throw new SecurityException("Not authorized");
        }

        if (request.getProjectIds() != null && request.getProjectIds().size() > 6) {
            throw new IllegalArgumentException("Maximum 6 projects allowed");
        }

        // Verify projects
        if (request.getProjectIds() != null) {
            List<ItemProjectDTO> projects = projectRepository.findAllById(request.getProjectIds());
            if (projects.size() != request.getProjectIds().size()) {
                throw new IllegalArgumentException("Some projects not found");
            }
            for (ItemProjectDTO p : projects) {
                if (!p.getItem().getCreatorId().equals(creator.getId())) {
                    throw new SecurityException("Projects must belong to the creator");
                }
            }
        }

        // Get category name for ItemService
        CategoryDTO category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        // Update ItemService fields
        itemService.setName(request.getName());
        itemService.setDescription(request.getDescription());
        itemService.setDeliveryDuration(request.getDeliveryDuration());
        itemService.setCategory(category.getName());
        itemService.setPrice(request.getPrice());
        itemService.setCoverImageUrl(request.getCoverImageUrl());

        // Update associated Item in cascade (shared fields)
        ItemDTO item = itemService.getItem();
        item.setTitle(request.getName());
        item.setDescription(request.getDescription());
        item.setBasePrice(request.getPrice());
        item.setCategoryId(request.getCategoryId());
        itemRepository.save(item);

        if (request.getProjectIds() != null) {
            Set<ItemProjectDTO> projects = request.getProjectIds().stream()
                    .map(pid -> projectRepository.findById(pid).orElseThrow(() -> new IllegalArgumentException("Project not found")))
                    .collect(Collectors.toSet());
            itemService.setProjects(projects);
        }

        itemService = itemServiceRepository.save(itemService);

        return mapToResponse(itemService);
    }

    @Transactional
    public void delete(Long id, UserDTO creator) {
        ItemService itemService = itemServiceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Service not found"));

        if (!itemService.getCreator().getId().equals(creator.getId())) {
            throw new SecurityException("Not authorized");
        }

        // Get the associated item before deleting the service
        Integer itemId = itemService.getItem().getId();
        
        // Delete the service first
        itemServiceRepository.delete(itemService);
        
        // Delete the associated item in cascade
        itemRepository.deleteById(itemId);
    }

    public ItemServiceResponse getById(Long id) {
        ItemService itemService = itemServiceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Service not found"));

        return mapToResponse(itemService);
    }

    public List<ItemServiceResponse> getMyServices(UserDTO creator) {
        List<ItemService> services = itemServiceRepository.findByCreatorId(creator.getId());
        return services.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<ItemServiceResponse> getByCreatorId(Integer creatorId) {
        List<ItemService> services = itemServiceRepository.findByCreatorId(creatorId);
        return services.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private ItemServiceResponse mapToResponse(ItemService itemService) {
        ItemServiceResponse response = new ItemServiceResponse();
        response.setId(itemService.getId());
        response.setItemId(itemService.getItem().getId().longValue());
        response.setName(itemService.getName());
        response.setDescription(itemService.getDescription());
        response.setDeliveryDuration(itemService.getDeliveryDuration());
        response.setCategory(itemService.getCategory());
        response.setCategoryId(itemService.getItem().getCategoryId());
        response.setPrice(itemService.getPrice());
        response.setCoverImageUrl(itemService.getCoverImageUrl());
        response.setCreatorId(itemService.getCreator().getId().longValue());

        if (itemService.getProjects() != null) {
            List<ItemServiceResponse.ProjectSummary> projects = itemService.getProjects().stream()
                    .map(p -> new ItemServiceResponse.ProjectSummary(p.getId().longValue(), p.getItem().getTitle()))
                    .collect(Collectors.toList());
            response.setProjects(projects);
        }

        return response;
    }
}