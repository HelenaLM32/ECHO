package com.example.echo.core.entity.role.appservices;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.example.echo.core.entity.role.persistence.RoleRepository;
import com.example.echo.core.entity.role.dto.RoleDTO;
import com.example.echo.core.entity.role.mappers.RoleMapper;
import com.example.echo.core.entity.sharedkernel.appservices.serializers.Serializer;
import com.example.echo.core.entity.sharedkernel.appservices.serializers.Serializers;
import com.example.echo.core.entity.sharedkernel.appservices.serializers.SerializersCatalog;
import com.example.echo.core.entity.sharedkernel.exceptions.BuildException;
import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;

@Controller
public class RoleServiceImpl implements RoleService {

    @Autowired
    private RoleRepository roleRepository;

    private Serializer<RoleDTO> serializer;

    @SuppressWarnings("unchecked")
    private Serializer<RoleDTO> jsonSerializer() {
        return (Serializer<RoleDTO>) SerializersCatalog.getInstance(Serializers.JSON_ROLE);
    }

    protected RoleDTO getDTO(Integer id) {
        return roleRepository.findById(id).orElse(null);
    }

    protected RoleDTO getById(Integer id) throws ServiceException {
        RoleDTO dto = this.getDTO(id);
        if (dto == null) {
            throw new ServiceException("Role " + id + " not found");
        }
        return dto;
    }

    protected RoleDTO checkInputData(String roleJson) throws ServiceException {
        try {
            RoleDTO dto = this.serializer.deserialize(roleJson, RoleDTO.class);
            RoleMapper.roleFromDTO(dto); // Valida usando Role.getInstance()
            return dto;
        } catch (BuildException e) {
            throw new ServiceException("Error in role input data: " + e.getMessage());
        }
    }

    protected RoleDTO newRole(String roleJson) throws ServiceException {
        RoleDTO dto = this.checkInputData(roleJson);

        if (roleRepository.existsByName(dto.getName())) {
            throw new ServiceException("Role already exists: " + dto.getName());
        }

        return roleRepository.save(dto);
    }

    protected RoleDTO updateRole(String roleJson) throws ServiceException {
        RoleDTO dto = this.checkInputData(roleJson);
        this.getById(dto.getId());
        return roleRepository.save(dto);
    }

    @SuppressWarnings("unchecked")
    @Override
    public String getAllToJson() throws ServiceException {
        try {
            Serializer<RoleDTO> ser = (Serializer<RoleDTO>) SerializersCatalog.getInstance(Serializers.JSON_ROLE);
            return ser.serializeList(roleRepository.findAll());
        } catch (Exception e) {
            throw new ServiceException("Error getting all roles: " + e.getMessage());
        }
    }

    @Override
    public String getByIdToJson(Integer id) throws ServiceException {
        return jsonSerializer().serialize(this.getById(id));
    }

    @SuppressWarnings("unchecked")
    @Override
    public String registerFromJson(String roleJson) throws ServiceException {
        this.serializer = (Serializer<RoleDTO>) SerializersCatalog.getInstance(Serializers.JSON_ROLE);
        return jsonSerializer().serialize(this.newRole(roleJson));
    }

    @SuppressWarnings("unchecked")
    @Override
    public String updateFromJson(String roleJson) throws ServiceException {
        this.serializer = (Serializer<RoleDTO>) SerializersCatalog.getInstance(Serializers.JSON_ROLE);
        return jsonSerializer().serialize(this.updateRole(roleJson));
    }

    @Override
    public void deleteById(Integer id) throws ServiceException {
        this.getById(id);
        roleRepository.deleteById(id);
    }
}
