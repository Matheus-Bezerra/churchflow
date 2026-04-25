#!/bin/sh

echo "🔍 Validando mensagem de commit..."
commit_msg_file=$1
commit_msg=$(cat "$commit_msg_file")

# se for um merge, dá skip
if echo "$commit_msg" | grep -q "Merge"; then
  echo "✅ Merge commit - skipping validation"
  exit 0
fi

echo "📝 Mensagem: $commit_msg"

# Regex: tipo:(DEV-1234) mensagem
if ! echo "$commit_msg" | grep -Eq '^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)\(DEV-[0-9]+\): .+'; then
  echo "❌ Mensagem de commit inválida!"
  echo "O padrão deve ser: tipo(DEV-1234): mensagem"
  exit 1
fi

echo "✅ Mensagem válida!" 