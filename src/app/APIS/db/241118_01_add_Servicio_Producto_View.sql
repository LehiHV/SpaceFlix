CREATE VIEW `Servicio_Producto_View` AS
SELECT
	sp.*,
	cs.Nombre as `Categoria_Servicio_Nombre`
FROM Servicio_Producto sp
LEFT JOIN Categoria_Servicio cs ON
(sp.Categoria_Servicio_Id = cs.Id);
