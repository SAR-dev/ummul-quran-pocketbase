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
  total_price: number
  paid: boolean
}

export interface InvoiceResponseType {
  id: string
  year: number
  month: number
  total_price: number
  paid: boolean
  class_logs: {
    class_mins: number
    total_classes: number
    students_price: number
  }[]
}