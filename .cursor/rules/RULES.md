---
alwaysApply: true
---

Este documento descreve a organização do projeto e como usar cada pasta e arquivo.

## 📁 Estrutura de Pastas

### `/src/routes`
**Propósito**: Rotas do TanStack Router usando file-based routing.

**Como usar**:
- Cada arquivo `.tsx` representa uma rota
- Use `createFileRoute` do TanStack Router para definir rotas
- Rotas aninhadas usam pastas com `_layout.tsx` para layouts compartilhados
- Exemplo: `/$store/_layout/products.tsx` → `/store/:store/products`
- Rotas com `_` são layouts (ex: `_layout.tsx`, `_auth-layout.tsx`)
- Rotas com `$` são parâmetros dinâmicos (ex: `$store`)

**Convenções**:
- Use kebab-case para nomes de arquivos de rotas
- Rotas com `_` no final são rotas específicas (ex: `products_.add.tsx`)
- Sempre exporte `Route` usando `createFileRoute`

### `/src/features`
**Propósito**: Organização por features/domínios de negócio. Cada feature é auto-contida.

**Estrutura de cada feature**:
```
features/
  feature-name/
    components/     # Componentes específicos da feature
    hooks/          # Hooks customizados da feature
    layouts/        # Layouts específicos da feature
    types/          # TypeScript types/interfaces da feature
    adapters/       # Adapters para consumo de api, onde é consumido e tratado o retorno dos dados para ser utilizado em um hook
    constants/      # Para aquivos mockados, como por exemplo itens de um menu em formato json, exemplo de arquivo: /contstants/nav-menu.ts
```

**Como usar**:
- Crie uma nova pasta para cada feature/domínio de negócio
- Cada feature deve ser independente e reutilizável
- Exemplos: `categories`, `tags`, `orders`, `coupons`

**Componentes**:
- Componentes específicos da feature que não são reutilizáveis em outras features
- Use kebab-case para nomes de arquivos

**Hooks**:
- Hooks customizados que encapsulam lógica da feature
- Use prefixo `use-` (ex: `use-categories.ts`, `use-category-drag-drop.ts`)

**Layouts**:
- Componentes de layout que compõem a página completa da feature
- Geralmente nomeados como `*-container.tsx` (ex: `categories-container.tsx`)

**Types**:
- Interfaces e tipos TypeScript específicos da feature
- Centralize todos os types em `types/` separando arquivos por contexto necessário, como por exemplo: `get-categories.type.ts`
- Sempre use sufixo `.type.ts` para arquivos do tipo type

**Adapters**:
- Arquivos que adaptam uma request, onde irá fazer a request para um service e tratar o retorno ou só retornar em uma função
- Todas as request devem passar por um adapter
- Todos os adapters devem ter a estrutura do nome como `name-adapter.adapter.ts`

**Constants**:
- Dados estáticos, mock data, e constantes da feature em questão

### `/src/components`
**Propósito**: Componentes React reutilizáveis em todo o projeto.

**Estrutura**:
- `/components/ui/` - Componentes primitivos do shadcn/ui (NÃO modificar diretamente)
- `/components/shared/` - Componentes compartilhados entre features
- Componentes raiz - Componentes específicos da aplicação (ex: `app-sidebar.tsx`)

**Como usar**:
- **UI Components**: Use componentes do shadcn/ui. Não modifique diretamente, use composição
- **Shared Components**: Componentes reutilizáveis entre múltiplas features
  - Exemplos: `list-header.tsx`, `list-actions.tsx`, `list-item-dropdown.tsx`
  - Use quando o componente será usado em 2+ features
  - Se for usado apenas em uma feature, coloque em `/features/feature-name/components/`
- **Componentes raiz**: Componentes de layout global ou específicos da aplicação

**Convenções**:
- Use kebab-case para nomes de arquivos
- Prefixe componentes com tipo quando necessário (ex: `button-account.tsx`)
- Componentes devem ser funcionais e usar TypeScript

### `/src/constants`
**Propósito**: Dados estáticos, mock data, e constantes da aplicação.

**Como usar**:
- Armazene dados mock em arquivos TypeScript (ex: `products-table-data.ts`)
- Dentro do arquivo deve ser exportado uma const com os dados, sendo ele objeto ou array
- Mantenha estrutura consistente com os tipos TypeScript correspondentes

**Exemplos**:
- `nav-menu.ts` - Dados de itens de menu
- `product-tabs.ts` - Dados de itens de abas de página de produto
- `images-data.json` - Dados mock de imagens

### `/src/helpers`
**Propósito**: Funções utilitárias puras e helpers genéricos.

**Como usar**:
- Funções puras sem dependências de React
- Funções reutilizáveis em múltiplos contextos
- Exemplo: `generateSlug()` para gerar slugs de URLs

**Convenções**:
- Use camelCase para nomes de funções
- Exporte funções nomeadas (não default exports)
- Documente parâmetros e retorno

### `/src/hooks`
**Propósito**: Hooks React reutilizáveis em todo o projeto.

**Como usar**:
- Hooks que podem ser usados em múltiplas features
- Se um hook é específico de uma feature, coloque em `/features/feature-name/hooks/`
- Exemplo: `use-mobile.ts` - hook para detectar mobile

**Convenções**:
- Use prefixo `use-` no nome do arquivo
- Exporte o hook como named export

### `/src/lib`
**Propósito**: Configurações de bibliotecas e utilitários de terceiros.

**Como usar**:
- Configurações de bibliotecas externas
- Utilitários de bibliotecas (ex: `utils.ts` com `cn()` do clsx/tailwind-merge)
- Não coloque lógica de negócio aqui

## 🎯 Princípios de Organização

### Quando criar uma nova feature?
Crie uma nova feature quando:
- A funcionalidade tem seu próprio domínio de negócio
- Precisa de múltiplos componentes, hooks e types relacionados
- Pode ser reutilizada ou isolada
- Exemplos: `categories`, `tags`, `orders`, `coupons`, `products`

### Quando usar `/components/shared`?
Use `/components/shared` quando:
- O componente será usado em 2+ features diferentes
- É um componente genérico que pode ser parametrizado
- Exemplos: `list-header.tsx`, `list-actions.tsx`, `list-item-dropdown.tsx`

### Quando usar `/components` (raiz)?
Use `/components` (raiz) quando:
- É um componente de layout global (ex: `app-sidebar.tsx`)
- É específico da aplicação mas não pertence a uma feature
- É um componente de página/rota específico

### Quando usar `/helpers` vs `/lib`?
- **`/helpers`**: Funções utilitárias puras que você escreveu
- **`/lib`**: Configurações e wrappers de bibliotecas externas

## 📝 Convenções de Nomenclatura

### Arquivos e Pastas
- **Pastas**: kebab-case (ex: `product-variants/`)
- **Componentes**: kebab-case (ex: `category-item.tsx`, `button-account.tsx`)
- **Hooks**: kebab-case com prefixo `use-` (ex: `use-categories.ts`)
- **Types**: kebab-case (ex: `types/get-categories.type.ts`)
- **Rotas**: kebab-case (ex: `products_.add.tsx`)
- **Adapters**: kebab-case (ex: `get-products.adapter.ts`)

### Componentes React
- Use PascalCase para nomes de componentes
- Use camelCase para props e variáveis
- Use kebab-case para nomes de arquivos

### Exports
- Use named exports (não default exports)

## 🔄 Fluxo de Trabalho Recomendado

1. **Nova Feature**:
   - Crie pasta em `/src/features/feature-name/`
   - Crie subpastas: `components/`, `hooks/`, `layouts/`, `types/`

2. **Componente Reutilizável**:
   - Se usado em 2+ features → `/src/components/shared/`
   - Se usado apenas em 1 feature → `/src/features/feature-name/components/`

3. **Nova Rota**:
   - Crie arquivo em `/src/routes/` seguindo convenções do TanStack Router
   - Use layouts existentes quando possível
   - Importe features de `/src/features/`

4. **Helper/Utilidade**:
   - Função pura genérica → `/src/helpers/`
   - Configuração de biblioteca → `/src/lib/`
   - Hook React genérico → `/src/hooks/`

## ⚠️ Regras Importantes

- **NUNCA** modifique componentes em `/src/components/ui/` diretamente
- **SEMPRE** mantenha features isoladas e independentes
- **SEMPRE** use TypeScript para types, interfaces e props
- **NUNCA** coloque lógica de negócio em `/src/lib/`
- **SEMPRE** prefira composição sobre modificação de componentes UI