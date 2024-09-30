import { MonthlyPackagesResponse, StudentsResponse, TeachersResponse, UsersResponse } from "./pocketbase";

export type TexpandUser = {
  user: UsersResponse
}

export type TexpandStudent = {
  student: StudentsResponse
}

export type TexpandTeacher = {
  teacher: TeachersResponse
}

export type TexpandStudentWithPackage = {
  student: StudentsResponse & {
    expand: {
      monthly_package: MonthlyPackagesResponse;
      user: UsersResponse;
    };
  };
};

export type TexpandStudentListWithPackage = StudentsResponse & {
  expand: {
    monthly_package: MonthlyPackagesResponse;
    user: UsersResponse;
  };
};

export interface ErrorResponseType {
  url: string;
  status: number;
  response: {
    code: number;
    message: string;
  };
}

export interface ErrorMessageType {
  message: string;
}

export interface InvoiceListResponseType {
  id: string
  created: string
  total_classes: number
  due_amount: number
  paid_amount: number
}

export interface StudentInvoiceResponseType {
  id: string
  created: string
  due_amount: number
  paid_amount: number
  class_logs: {
    class_mins: number
    total_classes: number
    students_price: number
  }[]
}

export interface TeacherInvoiceResponseType {
  id: string
  created: string
  due_amount: number
  paid_amount: number
  class_logs: {
    class_mins: number
    total_classes: number
    teachers_price: number
  }[]
}

export interface InvoicedListType {
  id: string;
  last_invoiced_at: string;
  mobile_no: string;
  nickname: string;
}