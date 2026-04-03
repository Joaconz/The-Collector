import os
import glob

BASE_DIR = 'backend/src/main/java/com/uade/tpo/thecollector/backend'

imports_to_add = """
import com.uade.tpo.thecollector.backend.model.*;
import com.uade.tpo.thecollector.backend.dto.usuario.*;
import com.uade.tpo.thecollector.backend.dto.producto.*;
import com.uade.tpo.thecollector.backend.dto.publicacion.*;
import com.uade.tpo.thecollector.backend.dto.orden.*;
import com.uade.tpo.thecollector.backend.service.*;
import com.uade.tpo.thecollector.backend.repository.*;
"""

for root, _, files in os.walk(BASE_DIR):
    for file in files:
        if file.endswith('.java'):
            path = os.path.join(root, file)
            with open(path, 'r') as f:
                content = f.read()
            
            # Find the end of package declaration
            pkg_end = content.find(';')
            if pkg_end != -1 and 'package' in content[:pkg_end]:
                # Inject just after package line
                new_content = content[:pkg_end+1] + "\n" + imports_to_add + content[pkg_end+1:]
                with open(path, 'w') as f:
                    f.write(new_content)

print("Imports injected.")
