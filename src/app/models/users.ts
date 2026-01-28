export interface Users {
    userId: string;
    userName: string;
    userPassword: string;
    userFullName: string;
    userEmail: string;
    userMobile: string;
    userProfileImg: string;
    role: Role;
    address: Address;
    accountstatus: string; // or string
}
 
export interface Role {
  roleId: number;
  roleName: string;
}
 
export interface Address {
    addressId: string;
    addressStreet: string;
    addressCity: string;
    addressState: string;
    addressPostalCode: string;
    addressCountry: string;
}
 