import { MonthlyPackagesResponse, StudentsResponse, UsersResponse } from "./pocketbase";

export type TexpandUser = {
  user: UsersResponse
}

export type TexpandStudent = {
  student: StudentsResponse
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

export interface InvoiceListResponseType {
  id: string
  year: number
  month: number
  total_classes: number
  due_amount: number
  paid: boolean
}

export interface StudentInvoiceResponseType {
  id: string
  year: number
  month: number
  due_amount: number
  paid: boolean
  class_logs: {
    class_mins: number
    total_classes: number
    students_price: number
  }[]
}

export interface TeacherInvoiceResponseType {
  id: string
  year: number
  month: number
  due_amount: number
  paid: boolean
  class_logs: {
    class_mins: number
    total_classes: number
    teachers_price: number
  }[]
}