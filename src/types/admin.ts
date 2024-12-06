export type StudentArgs = {
  phone: string;
  address: string;
  img: File;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  blood_type: string;
  birthday: Date;
  sex: "male" | "female";
};

export type UploadResult = {
  path: string;
};
