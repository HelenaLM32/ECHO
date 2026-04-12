package com.example.echo.core.entity.items.appservices;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.example.echo.core.entity.items.persistence.ItemRepository;
import com.example.echo.core.entity.items.dto.ItemDTO;
import com.example.echo.core.entity.items.mappers.ItemMapper;
import com.example.echo.core.entity.sharedkernel.appservices.serializers.Serializer;
import com.example.echo.core.entity.sharedkernel.appservices.serializers.Serializers;
import com.example.echo.core.entity.sharedkernel.appservices.serializers.SerializersCatalog;
import com.example.echo.core.entity.sharedkernel.exceptions.BuildException;
import com.example.echo.core.entity.sharedkernel.exceptions.ServiceException;

@Controller
public class ItemServiceImpl implements ItemService {

    @Autowired
    private ItemRepository itemRepository;

    private Serializer<ItemDTO> serializer;

    @SuppressWarnings("unchecked")
    private Serializer<ItemDTO> jsonSerializer() {
        return (Serializer<ItemDTO>) SerializersCatalog.getInstance(Serializers.JSON_ITEM);
    }

    protected ItemDTO getDTO(Integer id) {
        return itemRepository.findById(id).orElse(null);
    }

    protected ItemDTO getById(Integer id) throws ServiceException {
        ItemDTO dto = this.getDTO(id);
        if (dto == null) {
            throw new ServiceException("Item " + id + " not found");
        }
        return dto;
    }

    protected ItemDTO checkInputData(String itemJson) throws ServiceException {
        try {
            ItemDTO dto = this.serializer.deserialize(itemJson, ItemDTO.class);
            ItemMapper.itemFromDTO(dto); // Valida usando Item.getInstance()
            return dto;
        } catch (BuildException e) {
            throw new ServiceException("Error in item input data: " + e.getMessage());
        }
    }

    protected ItemDTO newItem(String itemJson) throws ServiceException {
        ItemDTO dto = this.checkInputData(itemJson);
        return itemRepository.save(dto);
    }

    protected ItemDTO updateItem(String itemJson) throws ServiceException {
        ItemDTO dto = this.checkInputData(itemJson);
        this.getById(dto.getId());
        return itemRepository.save(dto);
    }

    @Override
    @SuppressWarnings("unchecked")
    public String getAllToJson() throws ServiceException {
        try {
            Serializer<ItemDTO> ser = (Serializer<ItemDTO>) SerializersCatalog.getInstance(Serializers.JSON_ITEM);
            return ser.serializeList(itemRepository.findAll());
        } catch (Exception e) {
            throw new ServiceException("Error getting all items: " + e.getMessage());
        }
    }

    @Override
    public String getByIdToJson(Integer id) throws ServiceException {
        return jsonSerializer().serialize(this.getById(id));
    }

    @Override
    @SuppressWarnings("unchecked")
    public String registerFromJson(String itemJson) throws ServiceException {
        this.serializer = (Serializer<ItemDTO>) SerializersCatalog.getInstance(Serializers.JSON_ITEM);
        return jsonSerializer().serialize(this.newItem(itemJson));
    }

    @Override
    @SuppressWarnings("unchecked")
    public String updateFromJson(String itemJson) throws ServiceException {
        this.serializer = (Serializer<ItemDTO>) SerializersCatalog.getInstance(Serializers.JSON_ITEM);
        return jsonSerializer().serialize(this.updateItem(itemJson));
    }

    @Override
    public void deleteById(Integer id) throws ServiceException {
        this.getById(id);
        itemRepository.deleteById(id);
    }

    @Override
    public String loginFromJson(String loginJson) throws ServiceException {
        throw new UnsupportedOperationException("Unimplemented method 'loginFromJson'");
    }
}
