export type CameraPropertiesKeys =
  | 'digital_cameras'
  | 'cinema_cameras'
  | 'retro_cameras'
  | 'film_types'
  | 'lenses'
  | 'filters_effects';

export type CameraPropertiesOptions = Record<CameraPropertiesKeys, string[]>;

export interface PromptOptions {
  styles: string[];
  subjects: string[];
  poses: string[];
  framing: string[];
  settings: string[];
  lighting: string[];
  camera_angles: string[];
  camera_properties: CameraPropertiesOptions;
  photographers: string[];
}

export type PromptData = {
  style?: string;
  subject?: string;
  details?: string;
  pose?: string;
  framing?: string;
  setting?: string;
  lighting?: string;
  camera_angle?: string;
  camera_properties?: string[];
  photographer?: string;
};
