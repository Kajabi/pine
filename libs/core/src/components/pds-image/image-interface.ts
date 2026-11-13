export interface ImageLoadEventDetail {
  /** The URL the browser loaded, which can be a `srcset` candidate rather than `src`. */
  currentSrc: string;
  /** The loaded image's intrinsic height in pixels. */
  naturalHeight: number;
  /** The loaded image's intrinsic width in pixels. */
  naturalWidth: number;
}

export interface ImageErrorEventDetail {
  /** The URL that failed to load, which can be a `srcset` candidate rather than `src`. */
  currentSrc: string;
}
