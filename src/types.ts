// Type for Office
export type OfficeObject = {
  id: string;
  name: string;
  map: string;
  columns: number;
  rows: number;
};

// Type for Desk
export type DeskObject = {
  id: string;
  label: string;
  type: "fix" | "flex";
  equipment: string[];
  bookings: string[];
  office: OfficeObject;
  fixdesk?: FixdeskObject;
  isUserFavourite: boolean;
};

// Type for Fixdesk
export type FixdeskObject = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  user: UserObject;
};

// Type for User
export type UserObject = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  isAdmin: boolean;
  department: string;
  createdAt: string;
  updatedAt: string;
};

// Type for Booking
export type BookingObject = {
  id: string;
  bookedAt: string;
  dateStart: string;
  dateEnd: string;
  user: UserObject;
  desk: DeskObject;
};

// Type for Comments
export type CommentObject = {
  comment: string;
  desk: string; // Desk ID
};

// Type for FavoriteDesk
export type FavoriteDeskObject = {
  id: string;
  createdAt: string;
  updatedAt: string;
  user: UserObject;
  desk: DeskObject;
};
