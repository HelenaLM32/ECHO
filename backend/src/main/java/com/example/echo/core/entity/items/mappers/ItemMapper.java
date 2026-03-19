package com.example.echo.core.entity.items.mappers;

import com.example.echo.core.entity.items.dto.ItemDTO;
import com.example.echo.core.entity.items.model.Item;
import com.example.echo.core.entity.sharedkernel.exceptions.BuildException;


public class ItemMapper {

    public static Item itemFromDTO(ItemDTO dto) throws BuildException {
        if (dto == null) {
            return null;
        }

        return Item.getInstance(
                dto.getCreatorId(),
                dto.getTitle(),
                dto.getDescription(),
                dto.getBasePrice(),
                dto.getItemType());
    }

    public static ItemDTO dtoFromItem(Item item) {
        if (item == null) {
            return null;
        }

        return new ItemDTO(
                item.getId(),
                item.getCreatorId(),
                item.getTitle(),
                item.getDescription(),
                item.getBasePrice(),
                item.getItemType());
    }
}
