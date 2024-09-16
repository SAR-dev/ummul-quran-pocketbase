import { MonthlyPackagesResponse, StudentsResponse, UsersResponse } from "./pocketbase"

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
    };
  };
};
