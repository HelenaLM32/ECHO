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

    @Autowired
    private com.example.echo.core.entity.profile.persistence.ProfileRepository profileRepository;

    @Autowired
    private com.example.echo.core.entity.user.persistence.UserRepository userRepository;

    @Autowired
    private com.example.echo.infrastructure.persistence.jpa.JpaProjectLikeRepository projectLikeRepo;

    @Autowired
    private com.example.echo.infrastructure.persistence.jpa.JpaProjectCommentRepository projectCommentRepo;

    @Autowired
    private com.fasterxml.jackson.databind.ObjectMapper mapper;

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

            // getReferenceById devuelve proxy managed — no hace SELECT, Hibernate lo
            // resuelve en flush
            ItemDTO managed = itemRepository.findById(itemId).orElse(null);

            ItemProjectDTO toSave = new ItemProjectDTO(
                    managed,
                    dto.getBlocks(),
                    dto.getBackground(),
                    dto.getBlockGap(),
                    dto.getBlockBorderRadius(),
                    dto.getPublished(),
                    dto.getSlug());

            if (dto.getLikes() != null) toSave.setLikes(dto.getLikes());
            if (dto.getViews() != null) toSave.setViews(dto.getViews());
            if (dto.getComments() != null) toSave.setComments(dto.getComments());
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
                if (managed == null)
                    throw new ServiceException("Referenced item not found: " + itemId);
                existing.setItem(managed);
            }
            // copy mutable fields
            existing.setBlocks(dto.getBlocks());
            existing.setBackground(dto.getBackground());
            existing.setBlockGap(dto.getBlockGap());
            existing.setBlockBorderRadius(dto.getBlockBorderRadius());
            existing.setPublished(dto.getPublished());
            existing.setSlug(dto.getSlug());
            if (dto.getLikes() != null) existing.setLikes(dto.getLikes());
            if (dto.getViews() != null) existing.setViews(dto.getViews());
            if (dto.getComments() != null) existing.setComments(dto.getComments());
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
        try {
            ItemProjectDTO dto = this.getById(id);
            com.fasterxml.jackson.databind.node.ObjectNode node = mapper.valueToTree(dto);
            // embed profile
            Integer creatorId = dto.getItem() != null ? dto.getItem().getCreatorId() : null;
            if (creatorId != null) {
                com.example.echo.core.entity.user.dto.UserDTO user = userRepository.findById(creatorId).orElse(null);
                if (user != null) {
                    com.example.echo.core.entity.profile.dto.ProfileDTO profile = profileRepository.findByUserId(creatorId)
                            .orElseGet(() -> com.example.echo.core.entity.profile.mappers.ProfileMapper.newProfileForUser(user));
                    com.fasterxml.jackson.databind.node.ObjectNode profileNode = com.example.echo.core.entity.profile.mappers.ProfileMapper.toResponseNode(profile, user, mapper);
                    node.set("profile", profileNode);
                }
            }
            return mapper.writeValueAsString(node);
        } catch (Exception e) {
            throw new ServiceException(e.getMessage(), e);
        }
    }

    @Override
    public String incrementViewsAndGetByIdToJson(Integer id) throws ServiceException {
        try {
            ItemProjectDTO dto = this.getById(id);
            dto.setViews((dto.getViews() == null ? 0 : dto.getViews()) + 1);
            projectRepository.save(dto);
            return getByIdToJson(id);
        } catch (Exception e) {
            throw new ServiceException(e.getMessage(), e);
        }
    }

    @Override
    public String addCommentAndGetByIdToJson(Integer projectId, Integer userId, String commentText) throws ServiceException {
        try {
            if (commentText == null || commentText.trim().isEmpty()) {
                throw new ServiceException("El comentario no puede estar vacío");
            }
            projectCommentRepo.save(new com.example.echo.core.entity.projectcomments.model.ProjectComment(projectId, userId, commentText.trim()));
            ItemProjectDTO dto = this.getById(projectId);
            dto.setComments((dto.getComments() == null ? 0 : dto.getComments()) + 1);
            projectRepository.save(dto);
            return getByIdToJson(projectId);
        } catch (Exception e) {
            throw new ServiceException(e.getMessage(), e);
        }
    }

    @Override
    public String getCommentsByProjectIdToJson(Integer projectId) throws ServiceException {
        try {
            java.util.List<com.example.echo.core.entity.projectcomments.model.ProjectComment> comments = projectCommentRepo.findByProjectIdOrderByCreatedAtDesc(projectId);
            com.fasterxml.jackson.databind.node.ArrayNode array = mapper.createArrayNode();
            for (com.example.echo.core.entity.projectcomments.model.ProjectComment comment : comments) {
                com.fasterxml.jackson.databind.node.ObjectNode commentNode = mapper.createObjectNode();
                commentNode.put("id", comment.getId());
                commentNode.put("comment", comment.getComment());
                commentNode.put("createdAt", comment.getCreatedAt() != null ? comment.getCreatedAt().toString() : null);
                commentNode.put("projectId", comment.getProjectId());

                com.fasterxml.jackson.databind.node.ObjectNode authorNode = mapper.createObjectNode();
                if (comment.getUserId() != null) {
                    com.example.echo.core.entity.user.dto.UserDTO user = userRepository.findById(comment.getUserId()).orElse(null);
                    if (user != null) {
                        authorNode.put("id", user.getId());
                        authorNode.put("username", user.getUsername());
                        authorNode.put("email", user.getEmail());
                        com.example.echo.core.entity.profile.dto.ProfileDTO profile = profileRepository.findByUserId(user.getId())
                                .orElse(null);
                        if (profile != null) {
                            authorNode.put("publicName", profile.getPublicName());
                            authorNode.put("avatarUrl", profile.getAvatarUrl());
                        }
                    }
                }
                commentNode.set("author", authorNode);
                array.add(commentNode);
            }
            return mapper.writeValueAsString(array);
        } catch (Exception e) {
            throw new ServiceException(e.getMessage(), e);
        }
    }

    @Override
    public String toggleLikeAndGetByIdToJson(Integer projectId, Integer userId) throws ServiceException {
        try {
            boolean exists = projectLikeRepo.existsByUserIdAndProjectId(userId, projectId);
            boolean likedNow;
            if (exists) {
                projectLikeRepo.deleteByUserIdAndProjectId(userId, projectId);
                ItemProjectDTO dto = this.getById(projectId);
                dto.setLikes(Math.max(0, (dto.getLikes() == null ? 0 : dto.getLikes()) - 1));
                projectRepository.save(dto);
                likedNow = false;
            } else {
                projectLikeRepo.save(new com.example.echo.core.entity.projectlikes.model.ProjectLike(userId, projectId));
                ItemProjectDTO dto = this.getById(projectId);
                dto.setLikes((dto.getLikes() == null ? 0 : dto.getLikes()) + 1);
                projectRepository.save(dto);
                likedNow = true;
            }

            // Build response node: project + profile + liked flag
            ItemProjectDTO dto = this.getById(projectId);
            com.fasterxml.jackson.databind.node.ObjectNode node = mapper.valueToTree(dto);
            Integer creatorId = dto.getItem() != null ? dto.getItem().getCreatorId() : null;
            if (creatorId != null) {
                com.example.echo.core.entity.user.dto.UserDTO user = userRepository.findById(creatorId).orElse(null);
                if (user != null) {
                    com.example.echo.core.entity.profile.dto.ProfileDTO profile = profileRepository.findByUserId(creatorId)
                            .orElseGet(() -> com.example.echo.core.entity.profile.mappers.ProfileMapper.newProfileForUser(user));
                    com.fasterxml.jackson.databind.node.ObjectNode profileNode = com.example.echo.core.entity.profile.mappers.ProfileMapper.toResponseNode(profile, user, mapper);
                    node.set("profile", profileNode);
                }
            }
            node.put("liked", likedNow);
            return mapper.writeValueAsString(node);
        } catch (Exception e) {
            throw new ServiceException(e.getMessage(), e);
        }
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
