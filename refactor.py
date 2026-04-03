import os
import glob
import re
import shutil

BASE_DIR = 'backend/src/main/java/com/uade/tpo/thecollector/backend'
DOMAINS = ['auth', 'usuario', 'producto', 'publicacion', 'orden', 'status']

# Mapping of file names (without .java) to their target layer (package part)
MAPPINGS = {
    # Controllers
    'AuthController': 'controller',
    'ProductoController': 'controller',
    'PublicacionController': 'controller',
    'OrdenController': 'controller',
    'StatusController': 'controller',
    
    # Services
    'AuthService': 'service',
    'ProductoService': 'service',
    'PublicacionService': 'service',
    'OrdenService': 'service',
    
    # Repositories
    'UsuarioRepository': 'repository',
    'ProductoRepository': 'repository',
    'PublicacionRepository': 'repository',
    'OrdenRepository': 'repository',
    
    # Models / Entities / Enums
    'Usuario': 'model',
    'Rol': 'model',
    'Producto': 'model',
    'Publicacion': 'model',
    'EstadoPublicacion': 'model',
    'Orden': 'model',
    'OrdenItem': 'model',
    'EstadoOrden': 'model',
    
    # DTOs
    'RegisterRequestDTO': 'dto.usuario',
    'LoginRequestDTO': 'dto.usuario',
    'AuthResponseDTO': 'dto.usuario',
    'ProductoRequestDTO': 'dto.producto',
    'ProductoResponseDTO': 'dto.producto',
    'PublicacionRequestDTO': 'dto.publicacion',
    'PublicacionResponseDTO': 'dto.publicacion',
    'UpdateEstadoRequestDTO': 'dto.publicacion',
    'OrdenRequestDTO': 'dto.orden',
    'OrdenResponseDTO': 'dto.orden',
}

def get_target_package(file_name):
    base_name = file_name.replace('.java', '')
    layer = MAPPINGS.get(base_name)
    if layer:
        return f"com.uade.tpo.thecollector.backend.{layer}"
    return None

import_replacements = {}
for name, layer in MAPPINGS.items():
    # old packages
    if name in ['AuthController', 'AuthService', 'RegisterRequestDTO', 'LoginRequestDTO', 'AuthResponseDTO']:
        old_pkg = 'com.uade.tpo.thecollector.backend.auth'
    elif name in ['StatusController']:
        old_pkg = 'com.uade.tpo.thecollector.backend.status'
    elif name in ['Usuario', 'Rol', 'UsuarioRepository']:
        old_pkg = 'com.uade.tpo.thecollector.backend.usuario'
    elif 'Producto' in name:
        old_pkg = 'com.uade.tpo.thecollector.backend.producto'
    elif 'Publicacion' in name:
        old_pkg = 'com.uade.tpo.thecollector.backend.publicacion'
    elif 'Orden' in name:
        old_pkg = 'com.uade.tpo.thecollector.backend.orden'
    else:
        old_pkg = None

    if old_pkg:
        import_replacements[f"{old_pkg}.{name}"] = f"com.uade.tpo.thecollector.backend.{layer}.{name}"

# Process all java files
all_java_files = []
for root, _, files in os.walk(BASE_DIR):
    for file in files:
        if file.endswith('.java'):
            all_java_files.append(os.path.join(root, file))

for path in all_java_files:
    file_name = os.path.basename(path)
    
    with open(path, 'r') as f:
        content = f.read()
    
    # Replace imports across ALL files
    for old_import, new_import in import_replacements.items():
        if content.find(old_import) != -1:
            content = content.replace(old_import, new_import)

    # Determine if this file needs to move
    layer = MAPPINGS.get(file_name.replace('.java', ''))
    if layer:
        # Update its package declaration
        target_package = f"com.uade.tpo.thecollector.backend.{layer}"
        content = re.sub(r'^package\s+com\.uade\.tpo\.thecollector\.backend\.[a-z]+;', f'package {target_package};', content, flags=re.MULTILINE)
        
        # Write to target
        target_path = os.path.join(BASE_DIR, layer.replace('.', '/'), file_name)
        os.makedirs(os.path.dirname(target_path), exist_ok=True)
        with open(target_path, 'w') as f:
            f.write(content)
        
        # Remove old if it's different
        if path != target_path:
            os.remove(path)
    else:
        # Just write updated imports
        with open(path, 'w') as f:
            f.write(content)

# Remove old domain directories
for domain in DOMAINS:
    dir_path = os.path.join(BASE_DIR, domain)
    if os.path.exists(dir_path) and os.path.isdir(dir_path):
        import shutil
        shutil.rmtree(dir_path)

print("Refactor completed successfully.")
