/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	ClassLogs = "class_logs",
	MonthlyPackages = "monthly_packages",
	StudentInvoices = "student_invoices",
	Students = "students",
	TeacherInvoices = "teacher_invoices",
	Teachers = "teachers",
	Timezones = "timezones",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type ClassLogsRecord = {
	completed?: boolean
	cp_class_mins?: number
	cp_students_price?: number
	cp_teacher?: RecordIdString
	cp_teachers_price?: number
	finish_at?: IsoDateString
	start_at?: IsoDateString
	started?: boolean
	student: RecordIdString
	topic?: string
}

export type MonthlyPackagesRecord = {
	class_mins: number
	memo?: string
	name: string
	students_price: number
	teachers_price: number
}

export enum StudentInvoicesStatusOptions {
	"SUCCESS" = "SUCCESS",
	"ERROR" = "ERROR",
}
export type StudentInvoicesRecord = {
	due_amount?: number
	month: number
	note?: string
	paid?: boolean
	paid_amount?: number
	status?: StudentInvoicesStatusOptions
	student: RecordIdString
	year: number
}

export type StudentsRecord = {
	class_link?: string
	mobile_no?: string
	monthly_package: RecordIdString
	monthly_package_price?: number
	nickname: string
	teacher: RecordIdString
	user: RecordIdString
}

export enum TeacherInvoicesStatusOptions {
	"SUCCESS" = "SUCCESS",
	"ERROR" = "ERROR",
}
export type TeacherInvoicesRecord = {
	due_amount?: number
	month: number
	note?: string
	paid?: boolean
	paid_amount?: number
	status?: TeacherInvoicesStatusOptions
	teacher: RecordIdString
	year: number
}

export type TeachersRecord = {
	mobile_no: string
	nickname: string
	user: RecordIdString
}

export type TimezonesRecord = {
	name: string
	offset?: number
}

export type UsersRecord = {
	avatar?: string
	location?: string
	timezone?: RecordIdString
}

// Response types include system fields and match responses from the PocketBase API
export type ClassLogsResponse<Texpand = unknown> = Required<ClassLogsRecord> & BaseSystemFields<Texpand>
export type MonthlyPackagesResponse<Texpand = unknown> = Required<MonthlyPackagesRecord> & BaseSystemFields<Texpand>
export type StudentInvoicesResponse<Texpand = unknown> = Required<StudentInvoicesRecord> & BaseSystemFields<Texpand>
export type StudentsResponse<Texpand = unknown> = Required<StudentsRecord> & BaseSystemFields<Texpand>
export type TeacherInvoicesResponse<Texpand = unknown> = Required<TeacherInvoicesRecord> & BaseSystemFields<Texpand>
export type TeachersResponse<Texpand = unknown> = Required<TeachersRecord> & BaseSystemFields<Texpand>
export type TimezonesResponse<Texpand = unknown> = Required<TimezonesRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	class_logs: ClassLogsRecord
	monthly_packages: MonthlyPackagesRecord
	student_invoices: StudentInvoicesRecord
	students: StudentsRecord
	teacher_invoices: TeacherInvoicesRecord
	teachers: TeachersRecord
	timezones: TimezonesRecord
	users: UsersRecord
}

export type CollectionResponses = {
	class_logs: ClassLogsResponse
	monthly_packages: MonthlyPackagesResponse
	student_invoices: StudentInvoicesResponse
	students: StudentsResponse
	teacher_invoices: TeacherInvoicesResponse
	teachers: TeachersResponse
	timezones: TimezonesResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'class_logs'): RecordService<ClassLogsResponse>
	collection(idOrName: 'monthly_packages'): RecordService<MonthlyPackagesResponse>
	collection(idOrName: 'student_invoices'): RecordService<StudentInvoicesResponse>
	collection(idOrName: 'students'): RecordService<StudentsResponse>
	collection(idOrName: 'teacher_invoices'): RecordService<TeacherInvoicesResponse>
	collection(idOrName: 'teachers'): RecordService<TeachersResponse>
	collection(idOrName: 'timezones'): RecordService<TimezonesResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
