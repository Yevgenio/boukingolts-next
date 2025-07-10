export interface Image {
  url: string;
  thumbnail: string; 
  width?: number;
  height?: number;
  _id?: string; // Optional if not assigned in all cases
}