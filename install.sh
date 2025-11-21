#!/bin/bash

echo "🚀 Instalando Sistema de Papelería..."

# Instalar dependencias del backend
echo "📦 Instalando dependencias del backend..."
cd backend
npm install

# Instalar dependencias del frontend
echo "📦 Instalando dependencias del frontend..."
cd ../frontend
npm install

echo "✅ Instalación completada!"
echo ""
echo "📝 Próximos pasos:"
echo "1. Configura la base de datos MySQL"
echo "2. Edita el archivo backend/.env con tus credenciales"
echo "3. Ejecuta el script de inicialización de la BD"
echo "4. Inicia el backend: cd backend && npm run dev"
echo "5. Inicia el frontend: cd frontend && npm run dev"
