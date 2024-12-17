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

export interface ShortCourseStudent {
  id:                            number;
  email:                         string;
  password:                      string;
  first_name:                    string;
  last_name:                     string;
  phone:                         string;
  address:                       string;
  sex:                           string;
  photo_url:                     string;
  student_id:                    string;
  department:                    string;
  course:                        string;
  dob:                           Date;
  year:                          string;
  quarter:                       string;
  religion:                      string;
  blood_group:                   string;
  genotype:                      string;
  marital_status:                string;
  middle_name:                   string;
  personnel_id_number:           string;
  rank:                          string;
  medical_status:                string;
  next_of_kin:                   CloseAssociateLagos;
  close_associate_lagos:         CloseAssociateLagos;
  close_associate_outside_lagos: CloseAssociateLagos;
  created_at:                    Date;
  updated_at:                    Date;
  created_by:                    string;
}

export interface LongCourseStudent {
  id:                            number;
  email:                         string;
  password:                      string;
  first_name:                    string;
  last_name:                     string;
  phone:                         string;
  address:                       string;
  sex:                           string;
  photo_url:                     string;
  matric_number:                 string;
  jamb_reg_number:               string;
  department:                    string;
  course:                        string;
  dob:                           Date;
  // course_length:                 string;
  religion:                      string;
  blood_group:                   string;
  genotype:                      string;
  marital_status:                string;
  middle_name:                   string;
  personnel_id_number:           string;
  rank:                          string;
  medical_status:                string;
  next_of_kin:                   CloseAssociateLagos;
  close_associate_lagos:         CloseAssociateLagos;
  close_associate_outside_lagos: CloseAssociateLagos;
  created_at:                    Date;
  updated_at:                    Date;
  created_by:                    string;
}

export interface CloseAssociateLagos {
  name:          string;
  phone:         string;
  address:       string;
  relationship?: string;
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
  course_code:       string;
  grade:        string;
  score:        string;
  credit_unit?:       number;
  remarks:      null;
  date_of_exam: null;
  created_at:   Date;
  student__id:  string;
  student_id?:  string;
  department:   string;
  year?:   string;
  quarter?:   string;
  academic_session?:   string;
  semester?:   string;
  photo_url:    string;
  first_name:   string;
  last_name:    string;
  created_by:   string;
}



export type UploadResult = {
  path: string;
};
