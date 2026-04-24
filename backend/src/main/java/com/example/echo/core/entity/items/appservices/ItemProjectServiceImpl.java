package com.example.echo.core.entity.items.appservices;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.echo.core.entity.items.persistence.ItemProjectRepository;
import com.example.echo.core.entity.items.dto.ItemProjectDTO;
import com.example.echo.core.entity.items.persistence.ItemRepository;
import com.example.echo.core.entity.items.dto.ItemDTO;
import com.example.echo.core.entity.sharedkernel.appservices.serializers.Serializer;
import com.example.echo.core.entity.sharedkernel.appservices.serializers.SerializersCatalog;
import com.example.echo.core.entity.sharedkernel.appservices.serializers.Serializers;
import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;

import java.util.Optional;

@Service
@Transactional
public class ItemProjectServiceImpl implements ItemProjectService {

    private static final Logger log = LoggerFactory.getLogger(ItemProjectServiceImpl.class);

    @Autowired
    private ItemProjectRepository projectRepository;

    @Autowired
    private ItemRepository itemRepository;

    private Serializer<ItemProjectDTO> serializer;

    @SuppressWarnings("unchecked")
    private Serializer<ItemProjectDTO> jsonSerializer() {
        return (Serializer<ItemProjectDTO>) SerializersCatalog.getInstance(Serializers.JSON_ITEM_PROJECT);
    }

    protected ItemProjectDTO getDTO(Integer id) {
        return projectRepository.findById(id).orElse(null);
    }

    protected ItemProjectDTO getById(Integer id) throws ServiceException {
        ItemProjectDTO dto = this.getDTO(id);
        if (dto == null) {
            throw new ServiceException("ItemProject " + id + " not found");
        }
        return dto;
    }

    protected ItemProjectDTO newProject(String projectJson) throws ServiceException {
        try {
            ItemProjectDTO dto = jsonSerializer().deserialize(projectJson, ItemProjectDTO.class);

            if (dto.getItem() == null || dto.getItem().getId() == null) {
                throw new ServiceException("Item reference missing or has no id");
            }

            Integer itemId = dto.getItem().getId();

            // getReferenceById devuelve proxy managed — no hace SELECT, Hibernate lo resuelve en flush
            ItemDTO managed = itemRepository.findById(itemId).orElse(null);

            ItemProjectDTO toSave = new ItemProjectDTO(
                    managed,
                    dto.getBlocks(),
                    dto.getBackground(),
                    dto.getBlockGap(),
                    dto.getBlockBorderRadius(),
                    dto.getPublished(),
                    dto.getSlug()
            );

            return projectRepository.save(toSave);

        } catch (ServiceException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error creating project", e);
            throw new ServiceException("Error creating project: " + e.getMessage(), e);
        }
    }

    protected ItemProjectDTO updateProject(String projectJson) throws ServiceException {
        try {
            ItemProjectDTO dto = jsonSerializer().deserialize(projectJson, ItemProjectDTO.class);
            ItemProjectDTO existing = this.getById(dto.getId());
            if (dto.getItem() != null && dto.getItem().getId() != null) {
                Integer itemId = dto.getItem().getId();
                ItemDTO managed = itemRepository.findById(itemId).orElse(null);
                if (managed == null) throw new ServiceException("Referenced item not found: " + itemId);
                existing.setItem(managed);
            }
            // copy mutable fields
            existing.setBlocks(dto.getBlocks());
            existing.setBackground(dto.getBackground());
            existing.setBlockGap(dto.getBlockGap());
            existing.setBlockBorderRadius(dto.getBlockBorderRadius());
            existing.setPublished(dto.getPublished());
            existing.setSlug(dto.getSlug());
            return projectRepository.save(existing);
        } catch (Exception e) {
            log.error("Error updating project", e);
            throw new ServiceException("Error updating project: " + e.getMessage(), e);
        }
    }

    @Override
    @SuppressWarnings("unchecked")
    public String getAllToJson() throws ServiceException {
        try {
            return jsonSerializer().serializeList(projectRepository.findAll());
        } catch (Exception e) {
            throw new ServiceException("Error getting all projects: " + e.getMessage());
        }
    }

    @Override
    public String getByCreatorIdToJson(Integer creatorId) throws ServiceException {
        try {
            return jsonSerializer().serializeList(projectRepository.findByItemCreatorId(creatorId));
        } catch (Exception e) {
            throw new ServiceException("Error getting projects by creator: " + e.getMessage());
        }
    }

    @Override
    public String getByIdToJson(Integer id) throws ServiceException {
        return jsonSerializer().serialize(this.getById(id));
    }

    @Override
    public String registerFromJson(String projectJson) throws ServiceException {
        this.serializer = jsonSerializer();
        return jsonSerializer().serialize(this.newProject(projectJson));
    }

    @Override
    public String updateFromJson(String projectJson) throws ServiceException {
        this.serializer = jsonSerializer();
        return jsonSerializer().serialize(this.updateProject(projectJson));
    }

    @Override
    public void deleteById(Integer id) throws ServiceException {
        this.getById(id);
        projectRepository.deleteById(id);
    }
}
