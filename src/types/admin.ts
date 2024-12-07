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

export interface Student {
  id:         string;
  email:      string;
  password:   string;
  first_name: string;
  last_name:  string;
  phone:      string;
  address:    string;
  student_id: string;
  dob:        Date;
  sex:        string;
  photo_url:  string;
  created_at: Date;
  course:     string;
  department: string;
}


export interface Instructor {
  id:            string;
  email:         string;
  password:      string;
  first_name:    string;
  last_name:     string;
  phone:         string;
  address:       string;
  instructor_id: string;
  departments:   string[];
  courses:       string[];
  dob:           Date;
  sex:           string;
  photo_url:     string;
  created_at:    Date;
}

export interface Result {
  id:           string;
  course:       string;
  grade:        string;
  score:        number;
  remarks:      null;
  date_of_exam: null;
  created_at:   Date;
  student__id:  string;
  department:   string;
  photo_url:    string;
  first_name:   string;
  last_name:    string;
}



export type UploadResult = {
  path: string;
};
