export type FilterOption = "За всё время" | "За неделю" | "За месяц" | "Выбрать период..." | string;

export interface Filter {
  label: FilterOption;
  action: (event: MouseEvent) => void;
  isActive: () => boolean;
}

export interface CustomPeriod {
  start: string;
  end: string;
}

export interface FiltersState {
  selectedFilter: FilterOption;
  customPeriod: CustomPeriod | null;
}

export interface NewsCard {
  title: string;
  subtitle: string;
  photo: string;
  is_pinned?: boolean;
  date: string;
  id: number;
}

export interface TrainingsCard {
  id: number;
  title: string;
  date_start: string;
  date_end: string;
}

export interface NavigationButtons {
  currentSlide: number;
  totalSlides: number;
  inFullScreen?: boolean;
}

export interface Slide {
  title: string;
  description: string;
  link: string;
}

export interface VideoCard {
  id: number;
  video_url: string;
  created_at: string;
  updated_at: string;
  title?: string;
}

export interface Video {
  url: string;
  poster?: string;
  title?: string;
}

export interface Partner {
  id: number;
  photo: string;
  url: string;
}

export interface AboutUs {
  title: string;
  text: string[];
  photo: string;
}

export interface EventCard {
  id: number;
  title: string;
  event_start: string;
  event_end: string | null;
  event_format: string;
  address: string;
  tags: String[];
  commentary: string | null;
  status: "approved" | "pending" | "completed" | "rejected";
}

export interface NewsBlockBase {
  type: "image" | "quote" | "image_gallery" | "file_list" | "text" | "video_file";
}

export interface NewsBlockImageGallery extends NewsBlockBase {
  type: "image_gallery";
  links: string[];
}

export type EventViewMode = "list" | "calendar";
