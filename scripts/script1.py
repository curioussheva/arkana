import os

# Perbaikan: Menggunakan penyimpanan lokal Termux yang aman dari Permission Error
project_root = "/data/data/com.termux/files/home/arkana/numerology-engine"

# Create directory structure
dirs = [
    # Root config
    f"{project_root}/",
    
    # Source code
    f"{project_root}/src/core/numerology",
    f"{project_root}/src/core/utils",
    f"{project_root}/src/db",
    f"{project_root}/src/db/migrations",
    f"{project_root}/src/ai",
    f"{project_root}/src/ai/models",
    f"{project_root}/src/components/charts",
    f"{project_root}/src/components/ui",
    f"{project_root}/src/components/export",
    f"{project_root}/src/screens",
    f"{project_root}/src/navigation",
    f"{project_root}/src/hooks",
    f"{project_root}/src/store",
    f"{project_root}/src/types",
    f"{project_root}/src/constants",
    
    # Assets
    f"{project_root}/assets/models",
    f"{project_root}/assets/fonts",
    f"{project_root}/assets/images",
    
    # Tests
    f"{project_root}/__tests__/core",
    f"{project_root}/__tests__/components",
    
    # Scripts
    f"{project_root}/scripts",
]

for d in dirs:
    os.makedirs(d, exist_ok=True)
    
print("✅ Directory structure created successfully!")
print(f"📁 Project root: {project_root}")
 