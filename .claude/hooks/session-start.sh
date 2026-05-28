#!/bin/bash
set -euo pipefail

# Solo ejecutar en entornos remotos de Claude Code
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

echo "==> Instalando dependencias del backend (Maven)..."
cd "$CLAUDE_PROJECT_DIR/backend"
./mvnw dependency:go-offline -q

if [ -d "$CLAUDE_PROJECT_DIR/frontend" ]; then
  echo "==> Instalando dependencias del frontend (npm)..."
  cd "$CLAUDE_PROJECT_DIR/frontend"
  npm install --prefer-offline
fi

echo "==> Dependencias instaladas correctamente."
