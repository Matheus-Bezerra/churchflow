import { useMutation, useQueryClient } from '@tanstack/react-query'

import { mockMemberFunctions } from '@/lib/mocks'
import type { MemberFunction } from '@/types/user'

const MAX_MEMBER_FUNCTIONS = 10

type CreateInput = {
  label: string
}

type UpdateInput = {
  id: string
  label: string
}

type DeleteInput = {
  id: string
}

async function createMemberFunction(input: CreateInput): Promise<MemberFunction> {
  await new Promise((r) => setTimeout(r, 200))
  const activeCount = mockMemberFunctions.filter((f) => !f.deleted_at).length
  if (activeCount >= MAX_MEMBER_FUNCTIONS) {
    throw new Error(`Limite de ${MAX_MEMBER_FUNCTIONS} funções atingido`)
  }

  const newFn: MemberFunction = {
    id: `mfunc-${Date.now()}`,
    label: input.label,
    is_default: false,
    created_at: new Date().toISOString(),
    deleted_at: null,
  }
  mockMemberFunctions.push(newFn)
  return newFn
}

async function updateMemberFunction(input: UpdateInput): Promise<MemberFunction> {
  await new Promise((r) => setTimeout(r, 200))
  const fn = mockMemberFunctions.find((f) => f.id === input.id && !f.deleted_at)
  if (!fn) throw new Error('Função não encontrada')
  if (fn.is_default) throw new Error('Função padrão não pode ser editada')
  fn.label = input.label
  return fn
}

async function deleteMemberFunction(input: DeleteInput): Promise<void> {
  await new Promise((r) => setTimeout(r, 200))
  const fn = mockMemberFunctions.find((f) => f.id === input.id && !f.deleted_at)
  if (!fn) return
  if (fn.is_default) throw new Error('Função padrão não pode ser excluída')
  fn.deleted_at = new Date().toISOString()
}

export function useCreateMemberFunction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createMemberFunction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members', 'functions'] })
    },
  })
}

export function useUpdateMemberFunction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateMemberFunction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members', 'functions'] })
    },
  })
}

export function useDeleteMemberFunction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteMemberFunction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members', 'functions'] })
    },
  })
}

