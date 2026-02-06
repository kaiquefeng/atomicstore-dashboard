---
alwaysApply: true
---

Este documento descreve como organizar e gerenciar dados de formulários

## 📁 Libs

### `react-hook-forms`
Deve ser utilizado para gerenciar fields e default values para os inputs de formulários

**Como usar**:
- Deve ser utilizado o pacote para configurar qualquer formuário com `useForm`
- Para schemas do formulário deve ser utilizado `zod` 
- Crie os schemas dentro de `features/name-feature/schemas/create-categorie.ts` que está o formulário
- Em cada input deve ser utilizado a prop `register("name_input")` e nunca utilizar a opção de ControlerInput para atrelar um input a um name configurado no `useForm`