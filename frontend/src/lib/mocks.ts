import type { Cell } from '@/types/church'
import type { CellAttendance, CellMeeting } from '@/types/cellMeeting'
import type { ChurchEvent, EventType } from '@/types/event'
import type { Ministry, MinistryActivity } from '@/types/ministry'
import type { RecentActivity, Schedule } from '@/types/schedule'
import type { DashboardStats, MemberFunction, User, UserUnavailability } from '@/types/user'

// ─── Cells ────────────────────────────────────────────────────────────────────

export const mockCells: Cell[] = [
  {
    id: 'cell-1',
    church_id: 'church-1',
    name: 'Célula Esperança',
    leader_id: 'user-1',
    meeting_day: 'Quarta',
    meeting_time: '19:30',
    address: 'Rua das Flores, 123',
    member_count: 8,
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2025-03-01T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 'cell-2',
    church_id: 'church-1',
    name: 'Célula Vitória',
    leader_id: 'user-5',
    meeting_day: 'Quinta',
    meeting_time: '20:00',
    address: 'Av. Principal, 456',
    member_count: 6,
    created_at: '2024-02-15T00:00:00Z',
    updated_at: '2025-03-01T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 'cell-3',
    church_id: 'church-1',
    name: 'Célula Renascer',
    leader_id: 'user-8',
    meeting_day: 'Sexta',
    meeting_time: '19:00',
    address: 'Rua do Bosque, 789',
    member_count: 10,
    created_at: '2024-03-20T00:00:00Z',
    updated_at: '2025-03-01T00:00:00Z',
    deleted_at: null,
  },
]

export const mockCellMeetings: CellMeeting[] = [
  { id: 'meeting-1', cell_id: 'cell-1', date: '2026-04-09', created_at: '2026-04-09T22:00:00Z' },
  { id: 'meeting-2', cell_id: 'cell-1', date: '2026-04-16', created_at: '2026-04-16T22:00:00Z' },
  { id: 'meeting-3', cell_id: 'cell-1', date: '2026-04-23', created_at: '2026-04-23T22:00:00Z' },
  { id: 'meeting-4', cell_id: 'cell-1', date: '2026-05-07', created_at: '2026-05-07T22:00:00Z' },
  { id: 'meeting-5', cell_id: 'cell-2', date: '2026-04-10', created_at: '2026-04-10T22:30:00Z' },
  { id: 'meeting-6', cell_id: 'cell-2', date: '2026-04-17', created_at: '2026-04-17T22:30:00Z' },
  { id: 'meeting-7', cell_id: 'cell-2', date: '2026-04-24', created_at: '2026-04-24T22:30:00Z' },
  { id: 'meeting-8', cell_id: 'cell-2', date: '2026-05-08', created_at: '2026-05-08T22:30:00Z' },
  { id: 'meeting-9', cell_id: 'cell-3', date: '2026-04-11', created_at: '2026-04-11T22:00:00Z' },
  { id: 'meeting-10', cell_id: 'cell-3', date: '2026-04-18', created_at: '2026-04-18T22:00:00Z' },
  { id: 'meeting-11', cell_id: 'cell-3', date: '2026-04-25', created_at: '2026-04-25T22:00:00Z' },
  { id: 'meeting-12', cell_id: 'cell-3', date: '2026-05-09', created_at: '2026-05-09T22:00:00Z' },
]

export const mockCellAttendances: CellAttendance[] = [
  { id: 'attendance-1', meeting_id: 'meeting-1', member_id: 'user-1', present: true },
  { id: 'attendance-2', meeting_id: 'meeting-1', member_id: 'user-2', present: true },
  { id: 'attendance-3', meeting_id: 'meeting-1', member_id: 'user-9', present: true },
  { id: 'attendance-4', meeting_id: 'meeting-1', member_id: 'user-15', present: false },
  { id: 'attendance-5', meeting_id: 'meeting-2', member_id: 'user-1', present: true },
  { id: 'attendance-6', meeting_id: 'meeting-2', member_id: 'user-2', present: false },
  { id: 'attendance-7', meeting_id: 'meeting-2', member_id: 'user-9', present: true },
  { id: 'attendance-8', meeting_id: 'meeting-2', member_id: 'user-15', present: true },
  { id: 'attendance-9', meeting_id: 'meeting-3', member_id: 'user-1', present: true },
  { id: 'attendance-10', meeting_id: 'meeting-3', member_id: 'user-2', present: true },
  { id: 'attendance-11', meeting_id: 'meeting-3', member_id: 'user-9', present: false },
  { id: 'attendance-12', meeting_id: 'meeting-3', member_id: 'user-15', present: true },
  { id: 'attendance-13', meeting_id: 'meeting-4', member_id: 'user-1', present: true },
  { id: 'attendance-14', meeting_id: 'meeting-4', member_id: 'user-2', present: true },
  { id: 'attendance-15', meeting_id: 'meeting-4', member_id: 'user-9', present: true },
  { id: 'attendance-16', meeting_id: 'meeting-4', member_id: 'user-15', present: true },
  { id: 'attendance-17', meeting_id: 'meeting-5', member_id: 'user-3', present: true },
  { id: 'attendance-18', meeting_id: 'meeting-5', member_id: 'user-4', present: true },
  { id: 'attendance-19', meeting_id: 'meeting-5', member_id: 'user-5', present: true },
  { id: 'attendance-20', meeting_id: 'meeting-5', member_id: 'user-14', present: false },
  { id: 'attendance-21', meeting_id: 'meeting-6', member_id: 'user-3', present: false },
  { id: 'attendance-22', meeting_id: 'meeting-6', member_id: 'user-4', present: true },
  { id: 'attendance-23', meeting_id: 'meeting-6', member_id: 'user-5', present: true },
  { id: 'attendance-24', meeting_id: 'meeting-6', member_id: 'user-14', present: true },
  { id: 'attendance-25', meeting_id: 'meeting-7', member_id: 'user-3', present: true },
  { id: 'attendance-26', meeting_id: 'meeting-7', member_id: 'user-4', present: true },
  { id: 'attendance-27', meeting_id: 'meeting-7', member_id: 'user-5', present: false },
  { id: 'attendance-28', meeting_id: 'meeting-7', member_id: 'user-14', present: true },
  { id: 'attendance-29', meeting_id: 'meeting-8', member_id: 'user-3', present: true },
  { id: 'attendance-30', meeting_id: 'meeting-8', member_id: 'user-4', present: true },
  { id: 'attendance-31', meeting_id: 'meeting-8', member_id: 'user-5', present: true },
  { id: 'attendance-32', meeting_id: 'meeting-8', member_id: 'user-14', present: true },
  { id: 'attendance-33', meeting_id: 'meeting-9', member_id: 'user-7', present: true },
  { id: 'attendance-34', meeting_id: 'meeting-9', member_id: 'user-8', present: true },
  { id: 'attendance-35', meeting_id: 'meeting-9', member_id: 'user-12', present: false },
  { id: 'attendance-36', meeting_id: 'meeting-10', member_id: 'user-7', present: false },
  { id: 'attendance-37', meeting_id: 'meeting-10', member_id: 'user-8', present: true },
  { id: 'attendance-38', meeting_id: 'meeting-10', member_id: 'user-12', present: true },
  { id: 'attendance-39', meeting_id: 'meeting-11', member_id: 'user-7', present: true },
  { id: 'attendance-40', meeting_id: 'meeting-11', member_id: 'user-8', present: true },
  { id: 'attendance-41', meeting_id: 'meeting-11', member_id: 'user-12', present: true },
  { id: 'attendance-42', meeting_id: 'meeting-12', member_id: 'user-7', present: true },
  { id: 'attendance-43', meeting_id: 'meeting-12', member_id: 'user-8', present: true },
  { id: 'attendance-44', meeting_id: 'meeting-12', member_id: 'user-12', present: true },
]

// ─── Members ──────────────────────────────────────────────────────────────────

export const mockUsers: User[] = [
  {
    id: 'user-1',
    church_id: 'church-1',
    name: 'Carlos Eduardo Silva',
    email: 'carlos.silva@email.com',
    phone: '(11) 99123-4567',
    phone_is_whatsapp: true,
    avatar_url: 'https://randomuser.me/api/portraits/men/32.jpg',
    avatar_color: '#8B5CF6',
    role: 'leader',
    status: 'active',
    baptized: true,
    baptism_date: '2020-06-14',
    birth_date: '1990-04-25',
    address: 'Rua das Palmeiras, 200',
    city: 'São Paulo',
    state: 'SP',
    cell_id: 'cell-1',
    ministry_ids: ['ministry-1', 'ministry-3'],
    joined_at: '2019-03-01T00:00:00Z',
    created_at: '2019-03-01T00:00:00Z',
    updated_at: '2025-01-10T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 'user-2',
    church_id: 'church-1',
    name: 'Ana Beatriz Oliveira',
    email: 'ana.oliveira@email.com',
    phone: '(11) 98765-4321',
    phone_is_whatsapp: true,
    avatar_url: 'https://randomuser.me/api/portraits/women/44.jpg',
    avatar_color: '#0EA5E9',
    role: 'member',
    status: 'active',
    baptized: true,
    baptism_date: '2021-08-22',
    birth_date: '1995-07-20',
    address: 'Av. Paulista, 1500',
    city: 'São Paulo',
    state: 'SP',
    cell_id: 'cell-1',
    ministry_ids: ['ministry-1'],
    joined_at: '2020-05-15T00:00:00Z',
    created_at: '2020-05-15T00:00:00Z',
    updated_at: '2025-02-01T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 'user-3',
    church_id: 'church-1',
    name: 'Pedro Henrique Santos',
    email: 'pedro.santos@email.com',
    phone: '(11) 97654-3210',
    phone_is_whatsapp: false,
    avatar_color: '#10B981',
    role: 'deacon',
    status: 'active',
    baptized: true,
    baptism_date: '2019-12-01',
    birth_date: '1985-11-30',
    address: 'Rua Vergueiro, 800',
    city: 'São Paulo',
    state: 'SP',
    cell_id: 'cell-2',
    ministry_ids: ['ministry-2', 'ministry-4'],
    joined_at: '2018-01-20T00:00:00Z',
    created_at: '2018-01-20T00:00:00Z',
    updated_at: '2025-01-25T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 'user-4',
    church_id: 'church-1',
    name: 'Mariana Costa',
    email: 'mariana.costa@email.com',
    phone: '(11) 96543-2109',
    phone_is_whatsapp: true,
    avatar_url: 'https://randomuser.me/api/portraits/women/65.jpg',
    avatar_color: '#F97316',
    role: 'member',
    status: 'active',
    baptized: false,
    baptism_date: null,
    birth_date: '2000-04-26',
    address: 'Rua Consolação, 300',
    city: 'São Paulo',
    state: 'SP',
    cell_id: 'cell-2',
    ministry_ids: ['ministry-3'],
    joined_at: '2024-01-10T00:00:00Z',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2025-03-10T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 'user-5',
    church_id: 'church-1',
    name: 'Roberto Lima',
    email: 'roberto.lima@email.com',
    phone: '(11) 95432-1098',
    phone_is_whatsapp: true,
    avatar_url: 'https://randomuser.me/api/portraits/men/68.jpg',
    avatar_color: '#F59E0B',
    role: 'leader',
    status: 'active',
    baptized: true,
    baptism_date: '2015-03-15',
    birth_date: '1978-09-05',
    address: 'Rua da Mooca, 500',
    city: 'São Paulo',
    state: 'SP',
    cell_id: 'cell-2',
    ministry_ids: ['ministry-2'],
    joined_at: '2014-06-01T00:00:00Z',
    created_at: '2014-06-01T00:00:00Z',
    updated_at: '2025-01-05T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 'user-6',
    church_id: 'church-1',
    name: 'Fernanda Rocha',
    email: 'fernanda.rocha@email.com',
    phone: '(11) 94321-0987',
    phone_is_whatsapp: false,
    avatar_color: '#EC4899',
    role: 'member',
    status: 'visitor',
    baptized: false,
    baptism_date: null,
    birth_date: '2002-01-18',
    address: 'Av. Ipiranga, 200',
    city: 'São Paulo',
    state: 'SP',
    cell_id: null,
    ministry_ids: [],
    joined_at: '2025-02-01T00:00:00Z',
    created_at: '2025-02-01T00:00:00Z',
    updated_at: '2025-02-01T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 'user-7',
    church_id: 'church-1',
    name: 'Gabriel Mendes',
    email: 'gabriel.mendes@email.com',
    phone: '(11) 93210-9876',
    phone_is_whatsapp: true,
    avatar_url: 'https://randomuser.me/api/portraits/men/75.jpg',
    avatar_color: '#EF4444',
    role: 'member',
    status: 'active',
    baptized: true,
    baptism_date: '2022-04-10',
    birth_date: '1998-12-03',
    address: 'Rua Augusta, 1200',
    city: 'São Paulo',
    state: 'SP',
    cell_id: 'cell-3',
    ministry_ids: ['ministry-5'],
    joined_at: '2021-08-15T00:00:00Z',
    created_at: '2021-08-15T00:00:00Z',
    updated_at: '2025-02-20T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 'user-8',
    church_id: 'church-1',
    name: 'Juliana Ferreira',
    email: 'juliana.ferreira@email.com',
    phone: '(11) 92109-8765',
    phone_is_whatsapp: true,
    avatar_url: 'https://randomuser.me/api/portraits/women/22.jpg',
    avatar_color: '#8B5CF6',
    role: 'elder',
    status: 'active',
    baptized: true,
    baptism_date: '2010-11-20',
    birth_date: '1975-06-08',
    address: 'Rua Bela Vista, 400',
    city: 'São Paulo',
    state: 'SP',
    cell_id: 'cell-3',
    ministry_ids: ['ministry-6'],
    joined_at: '2009-05-01T00:00:00Z',
    created_at: '2009-05-01T00:00:00Z',
    updated_at: '2025-01-15T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 'user-9',
    church_id: 'church-1',
    name: 'Lucas Almeida',
    email: 'lucas.almeida@email.com',
    phone: '(11) 91098-7654',
    phone_is_whatsapp: true,
    avatar_url: 'https://randomuser.me/api/portraits/men/11.jpg',
    avatar_color: '#0EA5E9',
    role: 'member',
    status: 'active',
    baptized: true,
    baptism_date: '2023-07-30',
    birth_date: '2001-03-25',
    address: 'Av. Rebouças, 700',
    city: 'São Paulo',
    state: 'SP',
    cell_id: 'cell-1',
    ministry_ids: ['ministry-7'],
    joined_at: '2022-11-01T00:00:00Z',
    created_at: '2022-11-01T00:00:00Z',
    updated_at: '2025-03-05T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 'user-10',
    church_id: 'church-1',
    name: 'Patrícia Gomes',
    email: 'patricia.gomes@email.com',
    phone: '(11) 90987-6543',
    phone_is_whatsapp: false,
    avatar_color: '#10B981',
    role: 'member',
    status: 'inactive',
    baptized: true,
    baptism_date: '2018-05-12',
    birth_date: '1992-08-14',
    address: 'Rua São Bento, 100',
    city: 'São Paulo',
    state: 'SP',
    cell_id: null,
    ministry_ids: [],
    joined_at: '2016-03-01T00:00:00Z',
    created_at: '2016-03-01T00:00:00Z',
    updated_at: '2024-10-01T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 'user-11',
    church_id: 'church-1',
    name: 'Thiago Barbosa',
    email: 'thiago.barbosa@email.com',
    phone: '(11) 89876-5432',
    phone_is_whatsapp: true,
    avatar_url: 'https://randomuser.me/api/portraits/men/52.jpg',
    avatar_color: '#F97316',
    role: 'member',
    status: 'visitor',
    baptized: false,
    baptism_date: null,
    birth_date: '2005-04-28',
    address: 'Rua Liberdade, 50',
    city: 'São Paulo',
    state: 'SP',
    cell_id: null,
    ministry_ids: [],
    joined_at: '2025-04-01T00:00:00Z',
    created_at: '2025-04-01T00:00:00Z',
    updated_at: '2025-04-01T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 'user-12',
    church_id: 'church-1',
    name: 'Camila Nascimento',
    email: 'camila.nascimento@email.com',
    phone: '(11) 88765-4321',
    phone_is_whatsapp: true,
    avatar_url: 'https://randomuser.me/api/portraits/women/36.jpg',
    avatar_color: '#F59E0B',
    role: 'member',
    status: 'active',
    baptized: true,
    baptism_date: '2024-11-03',
    birth_date: '1996-04-30',
    address: 'Av. Brigadeiro, 900',
    city: 'São Paulo',
    state: 'SP',
    cell_id: 'cell-3',
    ministry_ids: ['ministry-1'],
    joined_at: '2024-05-20T00:00:00Z',
    created_at: '2024-05-20T00:00:00Z',
    updated_at: '2025-03-12T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 'user-13',
    church_id: 'church-1',
    name: 'Diego Souza',
    email: 'diego.souza@email.com',
    phone: '(11) 87654-3210',
    phone_is_whatsapp: true,
    avatar_url: 'https://randomuser.me/api/portraits/men/43.jpg',
    avatar_color: '#EC4899',
    role: 'pastor',
    status: 'active',
    baptized: true,
    baptism_date: '2005-09-18',
    birth_date: '1973-02-28',
    address: 'Rua da Igreja, 1',
    city: 'São Paulo',
    state: 'SP',
    cell_id: null,
    ministry_ids: ['ministry-4'],
    joined_at: '2003-01-01T00:00:00Z',
    created_at: '2003-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 'user-14',
    church_id: 'church-1',
    name: 'Renata Castro',
    email: 'renata.castro@email.com',
    phone: '(11) 86543-2109',
    phone_is_whatsapp: false,
    avatar_url: 'https://randomuser.me/api/portraits/women/51.jpg',
    avatar_color: '#EF4444',
    role: 'member',
    status: 'active',
    baptized: true,
    baptism_date: '2021-03-21',
    birth_date: '1993-07-04',
    address: 'Rua Frei Caneca, 600',
    city: 'São Paulo',
    state: 'SP',
    cell_id: 'cell-2',
    ministry_ids: ['ministry-5', 'ministry-7'],
    joined_at: '2020-09-01T00:00:00Z',
    created_at: '2020-09-01T00:00:00Z',
    updated_at: '2025-02-15T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 'user-15',
    church_id: 'church-1',
    name: 'Felipe Torres',
    email: 'felipe.torres@email.com',
    phone: '(11) 85432-1098',
    phone_is_whatsapp: true,
    avatar_color: '#6B7280',
    role: 'member',
    status: 'active',
    baptized: false,
    baptism_date: null,
    birth_date: '2003-05-03',
    address: 'Rua Oscar Freire, 300',
    city: 'São Paulo',
    state: 'SP',
    cell_id: 'cell-1',
    ministry_ids: ['ministry-2'],
    joined_at: '2025-03-15T00:00:00Z',
    created_at: '2025-03-15T00:00:00Z',
    updated_at: '2025-03-15T00:00:00Z',
    deleted_at: null,
  },
  // Soft-deleted member — filtered from listings
  {
    id: 'user-16',
    church_id: 'church-1',
    name: 'André Peixoto',
    email: 'andre.peixoto@email.com',
    phone: '(11) 84321-0987',
    phone_is_whatsapp: false,
    avatar_url: 'https://randomuser.me/api/portraits/men/29.jpg',
    avatar_color: '#8B5CF6',
    role: 'member',
    status: 'inactive',
    baptized: true,
    baptism_date: '2017-04-30',
    birth_date: '1988-10-15',
    address: 'Rua do Paraíso, 100',
    city: 'São Paulo',
    state: 'SP',
    cell_id: null,
    ministry_ids: [],
    joined_at: '2015-06-01T00:00:00Z',
    created_at: '2015-06-01T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
    deleted_at: '2024-12-01T00:00:00Z',
  },
]

// ─── Ministries ───────────────────────────────────────────────────────────────

export const mockMinistries: Ministry[] = [
  {
    id: 'ministry-1',
    church_id: 'church-1',
    name: 'Louvor e Adoração',
    description:
      'Ministério responsável pela condução da adoração nos cultos e eventos da igreja.',
    icon: 'Music',
    color: '#8B5CF6',
    leader_id: 'user-1',
    primary_leader_id: 'user-1',
    status: 'active',
    member_count: 12,
    max_members: 20,
    created_at: '2019-01-01T00:00:00Z',
    updated_at: '2025-03-01T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 'ministry-2',
    church_id: 'church-1',
    name: 'Mídia e Tecnologia',
    description:
      'Cuida de transmissões ao vivo, redes sociais e produção de conteúdo digital.',
    icon: 'Monitor',
    color: '#0EA5E9',
    leader_id: 'user-5',
    primary_leader_id: 'user-5',
    status: 'active',
    member_count: 8,
    max_members: 15,
    created_at: '2020-03-01T00:00:00Z',
    updated_at: '2025-02-15T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 'ministry-3',
    church_id: 'church-1',
    name: 'Recepção e Hospitalidade',
    description:
      'Responsável por receber e acolher visitantes e membros com excelência.',
    icon: 'Heart',
    color: '#F97316',
    leader_id: 'user-1',
    status: 'active',
    member_count: 15,
    max_members: 25,
    created_at: '2019-06-01T00:00:00Z',
    updated_at: '2025-01-20T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 'ministry-4',
    church_id: 'church-1',
    name: 'Pregação e Ensino',
    description:
      'Equipe de pastores e líderes responsáveis por estudos bíblicos e pregações.',
    icon: 'BookOpen',
    color: '#10B981',
    leader_id: 'user-13',
    primary_leader_id: 'user-13',
    status: 'active',
    member_count: 6,
    max_members: 10,
    created_at: '2019-01-01T00:00:00Z',
    updated_at: '2025-03-10T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 'ministry-5',
    church_id: 'church-1',
    name: 'Ministério Infantil',
    description:
      'Cuidado espiritual e recreativo das crianças durante os cultos.',
    icon: 'Baby',
    color: '#F59E0B',
    leader_id: 'user-7',
    status: 'active',
    member_count: 10,
    max_members: 20,
    created_at: '2021-01-01T00:00:00Z',
    updated_at: '2025-02-28T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 'ministry-6',
    church_id: 'church-1',
    name: 'Intercessão',
    description:
      'Grupo de oração que intercede pela igreja e suas necessidades.',
    icon: 'Flame',
    color: '#EF4444',
    leader_id: 'user-8',
    primary_leader_id: 'user-8',
    status: 'active',
    member_count: 9,
    max_members: 15,
    created_at: '2018-05-01T00:00:00Z',
    updated_at: '2025-01-30T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 'ministry-7',
    church_id: 'church-1',
    name: 'Comunicação',
    description:
      'Gestão da identidade visual, materiais impressos e comunicação interna.',
    icon: 'Megaphone',
    color: '#EC4899',
    leader_id: 'user-9',
    status: 'active',
    member_count: 7,
    max_members: 12,
    created_at: '2022-03-01T00:00:00Z',
    updated_at: '2025-03-08T00:00:00Z',
    deleted_at: null,
  },
  // Soft-deleted ministry — filtered from listings
  {
    id: 'ministry-8',
    church_id: 'church-1',
    name: 'Evangelismo (inativo)',
    description: 'Ministério descontinuado.',
    icon: 'Globe',
    color: '#6B7280',
    leader_id: 'user-3',
    status: 'inactive',
    member_count: 0,
    max_members: 10,
    created_at: '2020-01-01T00:00:00Z',
    updated_at: '2024-06-01T00:00:00Z',
    deleted_at: '2024-06-01T00:00:00Z',
  },
]

// ─── Ministry Activities ───────────────────────────────────────────────────────

export const mockMinistryActivities: MinistryActivity[] = [
  {
    id: 'act-1',
    ministry_id: 'ministry-1',
    description: 'Novo membro adicionado ao ministério',
    user_name: 'Carlos Eduardo Silva',
    created_at: '2025-04-20T10:00:00Z',
  },
  {
    id: 'act-2',
    ministry_id: 'ministry-1',
    description: 'Escala do domingo confirmada',
    user_name: 'Ana Beatriz Oliveira',
    created_at: '2025-04-18T15:30:00Z',
  },
  {
    id: 'act-3',
    ministry_id: 'ministry-1',
    description: 'Ensaio realizado com 8 membros',
    user_name: 'Carlos Eduardo Silva',
    created_at: '2025-04-15T09:00:00Z',
  },
  {
    id: 'act-4',
    ministry_id: 'ministry-2',
    description: 'Equipamento de transmissão atualizado',
    user_name: 'Roberto Lima',
    created_at: '2025-04-22T11:00:00Z',
  },
  {
    id: 'act-5',
    ministry_id: 'ministry-2',
    description: 'Felipe Torres entrou para o ministério',
    user_name: 'Roberto Lima',
    created_at: '2025-03-16T14:00:00Z',
  },
  {
    id: 'act-6',
    ministry_id: 'ministry-3',
    description: '15 visitantes recebidos no último domingo',
    user_name: 'Mariana Costa',
    created_at: '2025-04-20T12:00:00Z',
  },
  {
    id: 'act-7',
    ministry_id: 'ministry-4',
    description: 'Estudo bíblico de Romanos iniciado',
    user_name: 'Diego Souza',
    created_at: '2025-04-08T20:00:00Z',
  },
  {
    id: 'act-8',
    ministry_id: 'ministry-5',
    description: 'Nova atividade lúdica adicionada',
    user_name: 'Renata Castro',
    created_at: '2025-04-19T09:30:00Z',
  },
  {
    id: 'act-9',
    ministry_id: 'ministry-6',
    description: 'Vigília de oração realizada com 20 pessoas',
    user_name: 'Juliana Ferreira',
    created_at: '2025-04-12T07:00:00Z',
  },
  {
    id: 'act-10',
    ministry_id: 'ministry-7',
    description: 'Nova arte para o domingo publicada',
    user_name: 'Lucas Almeida',
    created_at: '2025-04-23T16:00:00Z',
  },
]

// ─── User Unavailabilities ────────────────────────────────────────────────────

export const mockUnavailabilities: UserUnavailability[] = [
  {
    id: 'unavail-1',
    user_id: 'user-2',
    type: 'period',
    start_date: '2026-05-03',
    end_date: '2026-05-03',
    reason: 'Viagem de trabalho',
    created_at: '2025-04-10T00:00:00Z',
  },
  {
    id: 'unavail-2',
    user_id: 'user-3',
    type: 'period',
    start_date: '2026-05-10',
    end_date: '2026-05-14',
    reason: 'Férias',
    created_at: '2025-04-01T00:00:00Z',
  },
  {
    id: 'unavail-3',
    user_id: 'user-7',
    type: 'period',
    start_date: '2026-05-24',
    end_date: '2026-05-24',
    reason: 'Compromisso familiar',
    created_at: '2025-04-20T00:00:00Z',
  },
]

// ─── Schedules ────────────────────────────────────────────────────────────────

export const mockSchedules: Schedule[] = [
  {
    id: 'sched-1',
    church_id: 'church-1',
    event_id: 'event-1',
    event_occurrence_date: '2026-05-03',
    ministry_id: 'ministry-1',
    name: 'Culto Dominical — Louvor',
    volunteers: [
      { user_id: 'user-2', role: 'Vocal', confirmation_status: 'confirmed' },
      { user_id: 'user-1', role: 'Guitarra', confirmation_status: 'confirmed' },
    ],
    status: 'confirmed',
    decline_reason: null,
    description: 'Preparar o repertório de abertura com músicas contemporâneas. Ensaio obrigatório sábado às 18h.',
    material_links: [
      'https://docs.google.com/spreadsheets/d/1abc-repertorio-maio',
      'https://www.youtube.com/watch?v=example-musica1',
      'https://drive.google.com/file/d/cifras-maio-2026',
    ],
    notes: 'Confirmar com o pastor o hino de encerramento até sexta.',
    created_at: '2025-04-15T00:00:00Z',
    updated_at: '2025-04-18T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 'sched-2',
    church_id: 'church-1',
    event_id: 'event-1',
    event_occurrence_date: '2026-05-10',
    ministry_id: 'ministry-2',
    name: 'Transmissão ao Vivo — Domingo',
    volunteers: [
      {
        user_id: 'user-3',
        role: 'Operador de câmera',
        confirmation_status: 'pending',
      },
      { user_id: 'user-5', role: 'Técnico de som', confirmation_status: 'pending' },
    ],
    status: 'pending',
    decline_reason: null,
    notes: 'Verificar câmeras antes do culto',
    created_at: '2025-04-20T00:00:00Z',
    updated_at: '2025-04-20T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 'sched-3',
    church_id: 'church-1',
    event_id: 'event-1',
    event_occurrence_date: '2026-05-17',
    ministry_id: 'ministry-3',
    name: 'Recepção — Culto de Celebração',
    volunteers: [
      {
        user_id: 'user-4',
        role: 'Recepcionista',
        confirmation_status: 'confirmed',
      },
      {
        user_id: 'user-12',
        role: 'Recepcionista',
        confirmation_status: 'confirmed',
      },
    ],
    status: 'confirmed',
    decline_reason: null,
    notes: null,
    created_at: '2025-04-15T00:00:00Z',
    updated_at: '2025-04-19T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 'sched-4',
    church_id: 'church-1',
    event_id: 'event-1',
    event_occurrence_date: '2026-05-24',
    ministry_id: 'ministry-5',
    name: 'Ministério Infantil — Domingo',
    volunteers: [
      { user_id: 'user-7', role: 'Professor', confirmation_status: 'pending' },
      { user_id: 'user-14', role: 'Auxiliar', confirmation_status: 'pending' },
    ],
    status: 'pending',
    decline_reason: null,
    notes: null,
    created_at: '2025-04-22T00:00:00Z',
    updated_at: '2025-04-22T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 'sched-5',
    church_id: 'church-1',
    event_id: 'event-2',
    event_occurrence_date: '2026-04-25',
    ministry_id: 'ministry-1',
    name: 'Culto de Jovens — Louvor',
    volunteers: [
      {
        user_id: 'user-12',
        role: 'Vocal',
        confirmation_status: 'declined',
        decline_reason: 'Não posso comparecer por motivos de saúde',
      },
      { user_id: 'user-9', role: 'Baixo', confirmation_status: 'confirmed' },
    ],
    status: 'declined',
    decline_reason: 'Não posso comparecer por motivos de saúde',
    notes: null,
    created_at: '2025-04-10T00:00:00Z',
    updated_at: '2025-04-22T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 'sched-6',
    church_id: 'church-1',
    event_id: 'event-3',
    event_occurrence_date: '2026-04-29',
    ministry_id: 'ministry-6',
    name: 'Vigília de Oração',
    volunteers: [
      { user_id: 'user-8', role: 'Intercessor', confirmation_status: 'confirmed' },
      { user_id: 'user-3', role: 'Intercessor', confirmation_status: 'confirmed' },
    ],
    status: 'confirmed',
    decline_reason: null,
    description: 'Vigília de intercession com louvor suave e oração em grupos. Separar pautas de oração por área da igreja.',
    material_links: [
      'https://notion.so/vigilia-abril-pauta',
      'https://drive.google.com/file/d/roteiro-vigilias',
    ],
    notes: 'Evento especial de abril',
    created_at: '2025-04-18T00:00:00Z',
    updated_at: '2025-04-20T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 'sched-7',
    church_id: 'church-1',
    event_id: 'event-3',
    event_occurrence_date: '2026-05-06',
    ministry_id: 'ministry-4',
    name: 'Estudo Bíblico — Romanos',
    volunteers: [
      { user_id: 'user-13', role: 'Pregador', confirmation_status: 'confirmed' },
    ],
    status: 'confirmed',
    decline_reason: null,
    notes: null,
    created_at: '2025-04-15T00:00:00Z',
    updated_at: '2025-04-17T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 'sched-8',
    church_id: 'church-1',
    event_id: 'event-4',
    event_occurrence_date: '2026-05-10',
    ministry_id: 'ministry-7',
    name: 'Produção de Arte — Conferência',
    volunteers: [
      {
        user_id: 'user-14',
        role: 'Designer',
        confirmation_status: 'declined',
        decline_reason: 'Prazo muito curto para produção',
      },
      { user_id: 'user-9', role: 'Fotógrafo', confirmation_status: 'pending' },
    ],
    status: 'declined',
    decline_reason: 'Prazo muito curto para produção',
    notes: null,
    created_at: '2025-04-20T00:00:00Z',
    updated_at: '2025-04-23T00:00:00Z',
    deleted_at: null,
  },
  // Soft-deleted schedule — filtered from listings
  {
    id: 'sched-9',
    church_id: 'church-1',
    event_id: 'event-1',
    event_occurrence_date: '2025-04-20',
    ministry_id: 'ministry-2',
    name: 'Transmissão Cancelada',
    volunteers: [
      { user_id: 'user-5', role: 'Técnico', confirmation_status: 'pending' },
    ],
    status: 'pending',
    decline_reason: null,
    notes: null,
    created_at: '2025-04-10T00:00:00Z',
    updated_at: '2025-04-15T00:00:00Z',
    deleted_at: '2025-04-15T00:00:00Z',
  },
]

// ─── Recent Activity ───────────────────────────────────────────────────────────

export const mockRecentActivities: RecentActivity[] = [
  {
    id: 'ra-1',
    type: 'member_added',
    description: 'Felipe Torres foi adicionado como novo membro',
    user_name: 'Felipe Torres',
    avatar_color: '#6B7280',
    created_at: '2025-04-23T16:00:00Z',
  },
  {
    id: 'ra-2',
    type: 'schedule_declined',
    description: 'Camila Nascimento recusou escala de Louvor',
    user_name: 'Camila Nascimento',
    avatar_url: 'https://randomuser.me/api/portraits/women/36.jpg',
    avatar_color: '#F59E0B',
    created_at: '2025-04-23T10:30:00Z',
  },
  {
    id: 'ra-3',
    type: 'schedule_confirmed',
    description: 'Juliana Ferreira confirmou presença na Vigília',
    user_name: 'Juliana Ferreira',
    avatar_url: 'https://randomuser.me/api/portraits/women/22.jpg',
    avatar_color: '#8B5CF6',
    created_at: '2025-04-22T14:00:00Z',
  },
  {
    id: 'ra-4',
    type: 'member_baptized',
    description: 'Lucas Almeida foi batizado',
    user_name: 'Lucas Almeida',
    avatar_url: 'https://randomuser.me/api/portraits/men/11.jpg',
    avatar_color: '#0EA5E9',
    created_at: '2025-04-20T11:00:00Z',
  },
  {
    id: 'ra-5',
    type: 'ministry_created',
    description: 'Ministério de Comunicação foi atualizado',
    user_name: 'Lucas Almeida',
    avatar_url: 'https://randomuser.me/api/portraits/men/11.jpg',
    avatar_color: '#0EA5E9',
    created_at: '2025-04-19T09:00:00Z',
  },
  {
    id: 'ra-6',
    type: 'member_added',
    description: 'Thiago Barbosa realizou primeira visita',
    user_name: 'Thiago Barbosa',
    avatar_url: 'https://randomuser.me/api/portraits/men/52.jpg',
    avatar_color: '#F97316',
    created_at: '2025-04-13T09:30:00Z',
  },
]

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export const mockDashboardStats: DashboardStats = {
  total_members: 15,
  active_members: 11,
  visitors: 2,
  baptized: 11,
  ministries_count: 7,
  events_this_month: 12,
  schedules_this_month: 8,
  birthdays_this_month: 4,
  new_members_this_month: 2,
}

// ─── Member Functions (Roles) ──────────────────────────────────────────────────

export const mockMemberFunctions: MemberFunction[] = [
  {
    id: 'member',
    label: 'Membro',
    is_default: true,
    created_at: '2024-01-01T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 'leader',
    label: 'Líder',
    is_default: true,
    created_at: '2024-01-01T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 'pastor',
    label: 'Pastor',
    is_default: true,
    created_at: '2024-01-01T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 'deacon',
    label: 'Diácono',
    is_default: true,
    created_at: '2024-01-01T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 'elder',
    label: 'Ancião',
    is_default: true,
    created_at: '2024-01-01T00:00:00Z',
    deleted_at: null,
  },
]

// ─── Event Types ──────────────────────────────────────────────────────────────

export const mockEventTypes: EventType[] = [
  {
    id: 'etype-1',
    church_id: 'church-1',
    label: 'Culto',
    is_default: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'etype-2',
    church_id: 'church-1',
    label: 'Culto de Jovens',
    is_default: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'etype-3',
    church_id: 'church-1',
    label: 'Culto de Oração',
    is_default: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'etype-4',
    church_id: 'church-1',
    label: 'Culto de Célula',
    is_default: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'etype-5',
    church_id: 'church-1',
    label: 'Conferência',
    is_default: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'etype-6',
    church_id: 'church-1',
    label: 'Evento Especial',
    is_default: true,
    created_at: '2024-01-01T00:00:00Z',
  },
]

// ─── Events ───────────────────────────────────────────────────────────────────

export const mockEvents: ChurchEvent[] = [
  {
    id: 'event-1',
    church_id: 'church-1',
    name: 'Culto Dominical',
    type_id: 'etype-1',
    icon: 'Church',
    color: '#8B5CF6',
    recurring: true,
    recurrence_slots: [
      { day: 'Domingo', time: '09:00' },
      { day: 'Domingo', time: '18:00' },
    ],
    ministry_ids: ['ministry-1', 'ministry-2', 'ministry-5'],
    ministry_requirements: [
      { ministry_id: 'ministry-1', required_count: 8 },
      { ministry_id: 'ministry-2', required_count: 4 },
      { ministry_id: 'ministry-5', required_count: 3 },
    ],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2025-04-01T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 'event-2',
    church_id: 'church-1',
    name: 'Culto de Jovens',
    type_id: 'etype-2',
    icon: 'Star',
    color: '#0EA5E9',
    recurring: true,
    recurrence_slots: [{ day: 'Sexta', time: '20:00' }],
    ministry_ids: ['ministry-1', 'ministry-4'],
    ministry_requirements: [
      { ministry_id: 'ministry-1', required_count: 6 },
      { ministry_id: 'ministry-4', required_count: 2 },
    ],
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2025-04-01T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 'event-3',
    church_id: 'church-1',
    name: 'Oração',
    type_id: 'etype-3',
    icon: 'Flame',
    color: '#F97316',
    recurring: true,
    recurrence_slots: [{ day: 'Quarta', time: '19:30' }],
    ministry_ids: ['ministry-3'],
    ministry_requirements: [
      { ministry_id: 'ministry-3', required_count: 5 },
    ],
    created_at: '2024-02-10T00:00:00Z',
    updated_at: '2025-04-01T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 'event-4',
    church_id: 'church-1',
    name: 'Conferência de Mulheres',
    type_id: 'etype-5',
    icon: 'Calendar',
    color: '#EC4899',
    recurring: false,
    date: '2026-05-10',
    time: '09:00',
    recurrence_slots: [],
    ministry_ids: ['ministry-2', 'ministry-5'],
    ministry_requirements: [
      { ministry_id: 'ministry-2', required_count: 4 },
      { ministry_id: 'ministry-5', required_count: 6 },
    ],
    created_at: '2026-04-01T00:00:00Z',
    updated_at: '2026-04-01T00:00:00Z',
    deleted_at: null,
  },
  {
    id: 'event-5',
    church_id: 'church-1',
    name: 'Retiro de Casais',
    type_id: 'etype-6',
    icon: 'Heart',
    color: '#10B981',
    recurring: false,
    date: '2026-06-20',
    time: '08:00',
    recurrence_slots: [],
    ministry_ids: ['ministry-1', 'ministry-3', 'ministry-6'],
    ministry_requirements: [
      { ministry_id: 'ministry-1', required_count: 10 },
      { ministry_id: 'ministry-3', required_count: 8 },
      { ministry_id: 'ministry-6', required_count: 5 },
    ],
    created_at: '2026-04-10T00:00:00Z',
    updated_at: '2026-04-10T00:00:00Z',
    deleted_at: null,
  },
]

// ─── Helper: Check Conflict ───────────────────────────────────────────────────

export function checkConflict(
  schedule: Schedule,
  unavailabilities: UserUnavailability[],
  scheduleTime?: string,
): boolean {
  const schedDate = new Date(schedule.event_occurrence_date + 'T00:00:00')
  const scheduleDay = schedDate.getDay() // 0=Sun
  const scheduleMinutes =
    scheduleTime && /^\d{2}:\d{2}$/.test(scheduleTime)
      ? parseInt(scheduleTime.slice(0, 2), 10) * 60 +
        parseInt(scheduleTime.slice(3, 5), 10)
      : null

  return schedule.volunteers.some((v) =>
    unavailabilities.some((u) => {
      if (u.user_id !== v.user_id) return false
      if (u.type === 'period') {
        if (!u.start_date || !u.end_date) return false
        const start = new Date(u.start_date + 'T00:00:00')
        const end = new Date(u.end_date + 'T23:59:59')
        return schedDate >= start && schedDate <= end
      }

      if (u.type === 'recurring') {
        if (!u.day_of_week) return false
        const dayIndexMap: Record<string, number> = {
          Domingo: 0,
          Segunda: 1,
          Terça: 2,
          Quarta: 3,
          Quinta: 4,
          Sexta: 5,
          Sábado: 6,
        }
        const unavailDay = dayIndexMap[u.day_of_week] ?? -1
        if (unavailDay !== scheduleDay) return false

        // If no time info, treat as all-day recurring unavailability
        if (!u.start_time || !u.end_time || scheduleMinutes == null) return true

        const startMin =
          parseInt(u.start_time.slice(0, 2), 10) * 60 +
          parseInt(u.start_time.slice(3, 5), 10)
        const endMin =
          parseInt(u.end_time.slice(0, 2), 10) * 60 +
          parseInt(u.end_time.slice(3, 5), 10)
        return scheduleMinutes >= startMin && scheduleMinutes <= endMin
      }

      return false
    }),
  )
}

export function checkVolunteerConflict(
  userId: string,
  date: string,
  unavailabilities: UserUnavailability[],
  scheduleTime?: string,
): boolean {
  const d = new Date(date + 'T00:00:00')
  const scheduleDay = d.getDay()
  const scheduleMinutes =
    scheduleTime && /^\d{2}:\d{2}$/.test(scheduleTime)
      ? parseInt(scheduleTime.slice(0, 2), 10) * 60 +
        parseInt(scheduleTime.slice(3, 5), 10)
      : null

  return unavailabilities.some((u) => {
    if (u.user_id !== userId) return false

    if (u.type === 'period') {
      if (!u.start_date || !u.end_date) return false
      return (
        d >= new Date(u.start_date + 'T00:00:00') &&
        d <= new Date(u.end_date + 'T23:59:59')
      )
    }

    if (u.type === 'recurring') {
      if (!u.day_of_week) return false
      const dayIndexMap: Record<string, number> = {
        Domingo: 0,
        Segunda: 1,
        Terça: 2,
        Quarta: 3,
        Quinta: 4,
        Sexta: 5,
        Sábado: 6,
      }
      const unavailDay = dayIndexMap[u.day_of_week] ?? -1
      if (unavailDay !== scheduleDay) return false

      if (!u.start_time || !u.end_time || scheduleMinutes == null) return true

      const startMin =
        parseInt(u.start_time.slice(0, 2), 10) * 60 +
        parseInt(u.start_time.slice(3, 5), 10)
      const endMin =
        parseInt(u.end_time.slice(0, 2), 10) * 60 +
        parseInt(u.end_time.slice(3, 5), 10)
      return scheduleMinutes >= startMin && scheduleMinutes <= endMin
    }

    return false
  })
}

// ─── Lookup Helpers ───────────────────────────────────────────────────────────

export function getUserById(id: string) {
  return mockUsers.find((u) => u.id === id) ?? null
}

export function getMinistryById(id: string) {
  return mockMinistries.find((m) => m.id === id) ?? null
}

export function getBirthdaysThisMonth(): User[] {
  const now = new Date()
  const month = now.getMonth() + 1

  return mockUsers
    .filter((u) => !u.deleted_at && u.birth_date)
    .filter((u) => {
      const [, birthMonth] = u.birth_date!.split('-')
      return Number(birthMonth) === month
    })
    .sort((a, b) => {
      const dayA = Number(a.birth_date!.split('-')[2])
      const dayB = Number(b.birth_date!.split('-')[2])
      return dayA - dayB
    })
}
