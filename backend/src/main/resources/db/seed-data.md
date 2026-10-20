# Inicialización de datos de desarrollo

`data.sql` contiene datos de ejemplo y un bloque `DELETE` que reemplaza los datos del dominio. Por seguridad, Docker y Spring Boot ya no lo ejecutan automáticamente: los historiales de Envers deben sobrevivir a los reinicios del backend.

Para crear una base de desarrollo vacía con los datos de ejemplo, arrancá primero PostgreSQL y habilitá el seed en una sola ejecución desde PowerShell:

```powershell
docker compose up -d db
$env:SPRING_SQL_INIT_MODE = "always"
docker compose up --build -d backend
Remove-Item Env:SPRING_SQL_INIT_MODE
docker compose up -d backend
```

El último arranque recrea el backend con el modo de inicialización predeterminado (`never`). No mantengas `SPRING_SQL_INIT_MODE=always` en `.env` ni en el entorno permanente: cada ejecución volvería a borrar y recargar los datos, mientras las tablas de auditoría se conservan.

No uses este seed para reinicializar una base con datos institucionales o historiales que deban preservarse. El bloque `DELETE` es destructivo.
