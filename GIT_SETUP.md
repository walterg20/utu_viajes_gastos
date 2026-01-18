# Instrucciones para Subir a GitHub

## Pasos Completados ✅
- ✅ Repositorio git inicializado
- ✅ Rama `master` creada con primer commit
- ✅ Rama `develop` creada
- ✅ `.gitignore` configurado para excluir archivos sensibles (`.env`, `env`)

## Pasos Pendientes

### 1. Crear repositorio en GitHub
1. Ve a https://github.com/new
2. Crea un repositorio llamado `utu_viajes_gastos` (o el nombre que prefieras)
3. **NO** inicialices con README, .gitignore ni licencia (ya los tenemos)
4. Copia la URL del repositorio (ej: `https://github.com/tu-usuario/utu_viajes_gastos.git`)

### 2. Conectar y subir código

**Opción A: Usando HTTPS**
```bash
# Agregar remoto (reemplaza TU_URL con tu URL de GitHub)
git remote add origin https://github.com/TU_USUARIO/utu_viajes_gastos.git

# Renombrar rama principal a main (si GitHub usa main)
git branch -M main

# Subir rama master
git push -u origin master

# Cambiar a develop y subirla
git checkout develop
git push -u origin develop

# Volver a master
git checkout master
```

**Opción B: Usando SSH**
```bash
# Agregar remoto (reemplaza TU_URL con tu URL de GitHub)
git remote add origin git@github.com:TU_USUARIO/utu_viajes_gastos.git

# Renombrar rama principal a main (si GitHub usa main)
git branch -M main

# Subir rama master
git push -u origin master

# Cambiar a develop y subirla
git checkout develop
git push -u origin develop

# Volver a master
git checkout master
```

### 3. Verificar configuración
```bash
# Ver remotos configurados
git remote -v

# Ver ramas locales y remotas
git branch -a
```

## Estructura de Ramas

- **master/main**: Código estable y producción
- **develop**: Código en desarrollo y features

## Flujo de Trabajo Recomendado

1. **Desarrollar nuevas features**:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/nombre-feature
   # ... hacer cambios ...
   git add .
   git commit -m "feat: descripción de la feature"
   git push origin feature/nombre-feature
   ```

2. **Mergear a develop** (desde GitHub o localmente):
   ```bash
   git checkout develop
   git merge feature/nombre-feature
   git push origin develop
   ```

3. **Deploy a producción**:
   ```bash
   git checkout master
   git merge develop
   git push origin master
   ```
