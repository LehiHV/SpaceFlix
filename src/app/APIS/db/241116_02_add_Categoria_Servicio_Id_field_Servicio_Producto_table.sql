ALTER TABLE `Servicio_Producto`
ADD COLUMN `Categoria_Servicio_Id` INT NULL,
ADD CONSTRAINT `fk_Servicio_Producto_Categoria_Servicio_Id` FOREIGN KEY (`Categoria_Servicio_Id`)
REFERENCES `Categoria_Servicio`(`id`);
