#!/bin/bash

ROOT="$PWD"

# Encontra todos os arquivos .json a partir do diretório atual (inclusive em l10n)
find "$ROOT" -type f -name "*.json" | while read -r file; do
  tmp="$(mktemp)"
  if jq -c . "$file" > "$tmp"; then
    mv "$tmp" "$file"
    echo "✅ Compressed: $file"
  else
    echo "❌ Error when compressing: $file"
    rm "$tmp"
  fi
done
